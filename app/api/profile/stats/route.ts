// app/api/profile/stats/route.ts
import { NextResponse } from "next/server"
import { getUserFromCookies } from "@/lib/auth"
import { getUserPredictionStats } from "@/lib/data/predictions"
import { cookies } from "next/headers"

export async function GET() {
  const cookieStore = cookies()
  const user = await getUserFromCookies(cookieStore)
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const stats = await getUserPredictionStats(user.id)
  return NextResponse.json(stats)
}
