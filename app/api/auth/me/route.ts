import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { getUserFromCookies } from "@/lib/auth"

export async function GET() {
  try {
    const cookieStore = cookies()
    const user = await getUserFromCookies(cookieStore)

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    return NextResponse.json({
      id: user.id,
      name: user.name,
      isAdmin: user.isAdmin,
    })
  } catch (error) {
    console.error("Auth check error:", error)
    return NextResponse.json({ error: "Authentication error" }, { status: 500 })
  }
}
