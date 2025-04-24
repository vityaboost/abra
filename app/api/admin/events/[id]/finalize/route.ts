import { NextResponse } from "next/server";
import { finalizeEvent } from "@/lib/actions/admin-actions";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { result } = (await request.json()) as { result: string };
  await finalizeEvent(params.id, result);
  return NextResponse.json({ success: true });
}
