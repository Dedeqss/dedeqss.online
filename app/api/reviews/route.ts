import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await createClient()
    
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching reviews:", error)
      return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { user_name, review_text, rating } = body

    // Validation
    if (!user_name || !review_text || !rating) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (typeof user_name !== "string" || user_name.length > 50) {
      return NextResponse.json({ error: "Invalid name" }, { status: 400 })
    }

    if (typeof review_text !== "string" || review_text.length > 500) {
      return NextResponse.json({ error: "Review text too long" }, { status: 400 })
    }

    if (typeof rating !== "number" || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Invalid rating" }, { status: 400 })
    }

    const supabase = await createClient()

    const { data, error } = await supabase
      .from("reviews")
      .insert([{ user_name, review_text, rating }])
      .select()
      .single()

    if (error) {
      console.error("Error inserting review:", error)
      return NextResponse.json({ error: "Failed to submit review" }, { status: 500 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
