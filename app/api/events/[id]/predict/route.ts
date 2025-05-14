// app/api/events/[id]/predict/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const eventId = params.id
  const { userId, outcome, homeScore, awayScore } = await req.json()

  // 1) Сохраняем или обновляем прогноз в БД:
  const prediction = await prisma.prediction.upsert({
    where: { userId_eventId: { userId, eventId } },
    update: { outcome, homeScore, awayScore },
    create: { userId, eventId, outcome, homeScore, awayScore },
  })

  // 2) Обновляем счётчик прогнозов для события (если нужно):
  await prisma.event.update({
    where: { id: eventId },
    data: { predictionCount: { increment: 1 } },
  })

  // 3) Инвалидируем кэш страниц, чтобы при последующем заходе
  //    (или router.refresh()) они отрендерились заново:
  revalidatePath(`/events/${eventId}`)
  revalidatePath('/events')
  revalidatePath('/profile')

  // 4) Жёстко прописанный оффер:
  const offer = {
    id: '1',
    title: 'Супер-скидка 20% на билеты!',
    link: 'https://partner.example.com/special-offer',
    amount: 100,
    currency: 'USD',
    cashback: Math.round(100 * 0.05 * 100) / 100,
    cashbackCurrency: 'USD',
  }

  return NextResponse.json({ success: true, prediction, offer })
}
