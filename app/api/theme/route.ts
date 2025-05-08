import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const { theme } = await request.json() as { theme: "light" | "dark" | "system" };

  const res = NextResponse.json({ success: true });
  // Устанавливаем cookie, доступное по всему сайту
  res.cookies.set("theme", theme, {
    path: "/", 
    sameSite: "strict",
    // по желанию: maxAge: 60 * 60 * 24 * 365
  });

  return res;
}
