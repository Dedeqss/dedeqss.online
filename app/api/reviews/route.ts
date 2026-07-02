import { createClient } from "@/lib/supabase/server"
import { createHash } from "crypto"
import { NextResponse } from "next/server"

// Owner code for managing (deleting) reviews. Set ADMIN_REVIEW_CODE in the
// project env to override; falls back to the default the owner was given.
const ADMIN_CODE = process.env.ADMIN_REVIEW_CODE || "3567"

const MAX_PER_IP = 2

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
    .select("id, user_name, review_text, rating, role, created_at, ip_hash")
    .order("created_at", { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const reviews = (data ?? []).map((r) => {
    const owned = r.ip_hash === ipHash
    const { ip_hash, ...rest } = r
    return { ...rest, owned }
  })

  const myCount = reviews.filter((r) => r.owned).length

  return NextResponse.json({ reviews, remaining: Math.max(0, MAX_PER_IP - myCount) })
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

  const { count, error: countError } = await supabase
    .from("reviews")
    .select("id", { count: "exact", head: true })
    .eq("ip_hash", ipHash)

  if (countError) {
    return NextResponse.json({ error: countError.message }, { status: 500 })
  }
  if ((count ?? 0) >= MAX_PER_IP) {
    return NextResponse.json(
      { error: `You've reached the limit of ${MAX_PER_IP} reviews.` },
      { status: 429 }
    )
  }

  const { data, error } = await supabase
    .from("reviews")
    .insert({ user_name, review_text, rating, role: role || null, ip_hash: ipHash })
    .select("id, user_name, review_text, rating, role, created_at")
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ review: { ...data, owned: true } }, { status: 201 })
}

export async function PATCH(request: Request) {
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
    .update({
      user_name,
      review_text,
      rating,
      role: role || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", body.id)
    .eq("ip_hash", ipHash)
    .select("id, user_name, review_text, rating, role, created_at")
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ review: { ...data, owned: true } })
}

// Owner-only deletion. Requires the admin code sent in the x-admin-code header.
export async function DELETE(request: Request) {
  const code = request.headers.get("x-admin-code")?.trim()
  if (!code || code !== ADMIN_CODE) {
    return NextResponse.json({ error: "Invalid owner code." }, { status: 401 })
  }

  const body = await request.json().catch(() => null)
  const id = body?.id
  if (!id) {
    return NextResponse.json({ error: "Missing review id." }, { status: 400 })
  }

  const supabase = await createClient()
  const { error } = await supabase.from("reviews").delete().eq("id", id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
