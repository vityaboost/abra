import type { cookies } from "next/headers"
import type { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function getUserFromCookies(cookieStore: ReturnType<typeof cookies>) {
  const userCookie = cookieStore.get("user")

  if (!userCookie) {
    return null
  }

  try {
    const userId = userCookie.value

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
      },
    })

    return user
  } catch (error) {
    console.error("Error getting user from cookie:", error)
    return null
  }
}

export function setAuthCookie(response: NextResponse, userId: string) {
  // Set HTTP-only cookie
  response.cookies.set({
    name: "user",
    value: userId,
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 1 week
  })

  return response
}
