import { type NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { setAuthCookie } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const { email, username, password } = await request.json();

  if (!email || !username || !password) {
    return NextResponse.json(
      { error: "Email, username and password are required" },
      { status: 400 }
    );
  }

  // Проверяем уникальность email и username
  const existsEmail = await prisma.user.findUnique({ where: { email } });
  if (existsEmail) {
    return NextResponse.json(
      { error: "Email already registered" },
      { status: 409 }
    );
  }
  const existsUser = await prisma.user.findUnique({ where: { name: username } });
  if (existsUser) {
    return NextResponse.json(
      { error: "Username already exists" },
      { status: 409 }
    );
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { email, name: username, password: hashed },
  });

  const response = NextResponse.json(
    {
      id: user.id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    },
    { status: 201 }
  );
  setAuthCookie(response, user.id);
  return response;
}
