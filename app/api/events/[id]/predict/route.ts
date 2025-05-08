// app/api/events/[id]/predict/route.ts

import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const eventId = params.id
  const { userId, outcome, homeScore, awayScore } = await req.json()

  // 1) Создаём или обновляем прогноз
  const prediction = await prisma.prediction.upsert({
    where: { userId_eventId: { userId, eventId } },
    update: { outcome, homeScore, awayScore },
    create: { userId, eventId, outcome, homeScore, awayScore },
  })

  // 2) Увеличиваем счётчик на событии
  await prisma.event.update({
    where: { id: eventId },
    data: { predictionCount: { increment: 1 } },
  })

  // 3) Жёстко прописанный оффер
  const offer = {
    id: "1",
    title: "Супер-скидка 20% на билеты!",
    link: "https://pm.by/",
    amount: 100,
    currency: "USD",
    cashback: Math.round(
      100 * (parseFloat(process.env.CASHBACK_RATE ?? "0.05")) * 100
    ) / 100,
    cashbackCurrency: "USD",
  }

  return NextResponse.json({ success: true, prediction, offer })
}
