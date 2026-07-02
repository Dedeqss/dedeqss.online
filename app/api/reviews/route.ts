import { createClient } from "@/lib/supabase/server"
import { createHash } from "crypto"
import { NextResponse } from "next/server"

// Derive a stable, non-reversible identifier for the requester's IP.
function getIpHash(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for")
  const realIp = request.headers.get("x-real-ip")
  const ip = forwarded?.split(",")[0]?.trim() || realIp || "unknown"
  const salt = process.env.REVIEW_IP_SALT || "dede-portfolio-salt"
  return createHash("sha256").update(`${ip}:${salt}`).digest("hex").slice(0, 32)
}

function sanitize(input: unknown, max: number): string {
  if (typeof input !== "string") return ""
  return input.trim().slice(0, max)
}

export async function GET(request: Request) {
  const supabase = await createClient()
  const ipHash = getIpHash(request)

  const { data, error } = await supabase
    .from("reviews")
    .select("id, user_name, review_text, rating, role, created_at, updated_at, ip_hash")
    .order("created_at", { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Strip ip_hash from the payload but flag which reviews the requester owns.
  const reviews = (data ?? []).map((r) => {
    const mine = r.ip_hash === ipHash
    const { ip_hash, ...rest } = r
    return { ...rest, mine }
  })

  const myCount = reviews.filter((r) => r.mine).length

  return NextResponse.json({ reviews, myCount, canReview: myCount < 2 })
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const ipHash = getIpHash(request)

  const body = await request.json().catch(() => null)
  if (!body) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 })
  }

  const user_name = sanitize(body.user_name, 40)
  const review_text = sanitize(body.review_text, 400)
  const role = sanitize(body.role, 40)
  const rating = Number(body.rating)

  if (!user_name || !review_text) {
    return NextResponse.json({ error: "Name and review are required." }, { status: 400 })
  }
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return NextResponse.json({ error: "Rating must be between 1 and 5." }, { status: 400 })
  }

  // Enforce max 2 reviews per IP.
  const { count, error: countError } = await supabase
    .from("reviews")
    .select("id", { count: "exact", head: true })
    .eq("ip_hash", ipHash)

  if (countError) {
    return NextResponse.json({ error: countError.message }, { status: 500 })
  }
  if ((count ?? 0) >= 2) {
    return NextResponse.json(
      { error: "You've reached the limit of 2 reviews." },
      { status: 429 }
    )
  }

  const { data, error } = await supabase
    .from("reviews")
    .insert({ user_name, review_text, rating, role: role || null, ip_hash: ipHash })
    .select("id, user_name, review_text, rating, role, created_at, updated_at")
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ review: { ...data, mine: true } }, { status: 201 })
}

export async function PUT(request: Request) {
  const supabase = await createClient()
  const ipHash = getIpHash(request)

  const body = await request.json().catch(() => null)
  if (!body || !body.id) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 })
  }

  const user_name = sanitize(body.user_name, 40)
  const review_text = sanitize(body.review_text, 400)
  const role = sanitize(body.role, 40)
  const rating = Number(body.rating)

  if (!user_name || !review_text) {
    return NextResponse.json({ error: "Name and review are required." }, { status: 400 })
  }
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return NextResponse.json({ error: "Rating must be between 1 and 5." }, { status: 400 })
  }

  // Verify ownership: only rows matching this IP hash can be edited.
  const { data: existing, error: fetchError } = await supabase
    .from("reviews")
    .select("id, ip_hash")
    .eq("id", body.id)
    .single()

  if (fetchError || !existing) {
    return NextResponse.json({ error: "Review not found." }, { status: 404 })
  }
  if (existing.ip_hash !== ipHash) {
    return NextResponse.json({ error: "You can only edit your own reviews." }, { status: 403 })
  }

  const { data, error } = await supabase
    .from("reviews")
    .update({ user_name, review_text, rating, role: role || null, updated_at: new Date().toISOString() })
    .eq("id", body.id)
    .eq("ip_hash", ipHash)
    .select("id, user_name, review_text, rating, role, created_at, updated_at")
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ review: { ...data, mine: true } })
}
