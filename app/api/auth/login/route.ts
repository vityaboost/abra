import { type NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { setAuthCookie } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const { identifier, password } = await request.json();

  if (!identifier || !password) {
    return NextResponse.json(
      { error: "Identifier and password are required" },
      { status: 400 }
    );
  }

  // Ищем либо по email, либо по username
  const user = await prisma.user.findFirst({
    where: {
      OR: [{ email: identifier }, { name: identifier }],
    },
  });
  if (!user) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const response = NextResponse.json(
    {
      id: user.id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    },
    { status: 200 }
  );
  setAuthCookie(response, user.id);
  return response;
}
