// app/api/offers/interaction/route.ts
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
    
  const url = new URL(req.url)
  const eventId = url.searchParams.get('eventId')!


  // 1. Статический оффер — пока у вас один
  const offer = {
    id: '1',
    title: 'Супер-скидка 20% на билеты!',
    description: 'Специальное предложение по билету на следующий матч',
    link: 'https://xametyst.com/hWSJCtH6',
    amount: 100,          // например, средняя цена
    currency: 'USD',
    partnerId: 'partner1' // для будущей идентификации, если захочется
  }

  // 2. Фиксированный кешбэк, например 5%
  // const CASHBACK_RATE = parseFloat(process.env.CASHBACK_RATE ?? '0.05')
  // const cashback = Math.round(offer.amount * CASHBACK_RATE * 100) / 100

  
  // 3. Возвращаем клиенту
  return NextResponse.json({
    ...offer,
    // cashback,
    // cashbackCurrency: offer.currency,
  })
}

