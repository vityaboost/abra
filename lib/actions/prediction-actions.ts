'use server'

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import type { Prediction } from "@prisma/client"

interface CreatePredictionParams {
  userId: string
  eventId: string
  outcome: string
  homeScore: number
  awayScore: number
}

export type Offer = {
  id: string
  title: string
  link: string
  amount: number
  currency: string
  cashback: number
  cashbackCurrency: string
}

export async function createPrediction({
  userId,
  eventId,
  outcome,
  homeScore,
  awayScore
}: CreatePredictionParams): Promise<{
  success: true
  prediction: Prediction
  offer: Offer
}> {
  try {
    // 1) сохранить или обновить прогноз
    const prediction = await prisma.prediction.upsert({
      where: {
        userId_eventId: {
          userId,
          eventId,
        },
      },
      update: {
        outcome,
        homeScore,
        awayScore,
      },
      create: {
        userId,
        eventId,
        outcome,
        homeScore,
        awayScore,
      },
    })

    // 2) увеличить счётчик на event
    await prisma.event.update({
      where: { id: eventId },
      data: {
        predictionCount: {
          increment: 1,
        },
      },
    })

    // 3) инвалидировать кэш страниц
    revalidatePath(`/events/${eventId}`)
    revalidatePath("/profile")
    revalidatePath("/events")

    // 4) жёстко прописанный оффер
    const offerData = {
      id: '1',
      title: 'tralalelo tralala',
      link: 'https://pm.by/ru/',
      amount: 100,
      currency: 'USD',
    }

    // 5) считаем кешбэк (например, 5% из ENV или по умолчанию)
    const RATE = parseFloat(process.env.CASHBACK_RATE ?? '0.05')
    const cashback = Math.round(offerData.amount * RATE * 100) / 100

    const offer: Offer = {
      ...offerData,
      cashback,
      cashbackCurrency: offerData.currency,
    }

    // 6) возвращаем и prediction, и offer
    console.log("▶️ [createPrediction] returning offer:", offer)
    return {
      success: true,
      prediction,
      offer,
    }
  } catch (error: any) {
    console.error("Error creating prediction:", error)

    if (error.code === "P2002") {
      throw new Error("You have already made a prediction for this event")
    }

    throw new Error("Failed to create prediction")
  }
}
