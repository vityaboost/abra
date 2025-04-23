import { prisma } from "@/lib/prisma"
import type { Prediction, Event } from "@prisma/client"

export type PredictionWithEvent = Prediction & {
  event: Event
}

export async function getUserPredictions(userId: string): Promise<PredictionWithEvent[]> {
  return prisma.prediction.findMany({
    where: {
      userId,
    },
    include: {
      event: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  })
}

export async function getUserPredictionStats(userId: string) {
  const predictions = await prisma.prediction.findMany({
    where: {
      userId,
    },
  })

  // In a real app, you would compare predictions with actual results
  // For this example, we'll simulate some stats
  const totalPredictions = predictions.length
  const correctPredictions = Math.floor(totalPredictions * 0.7) // Simulate 70% accuracy
  const accuracy = totalPredictions > 0 ? (correctPredictions / totalPredictions) * 100 : 0

  return {
    totalPredictions,
    correctPredictions,
    accuracy,
  }
}

export async function getUserPredictionForEvent(userId: string, eventId: string) {
  return prisma.prediction.findUnique({
    where: {
      userId_eventId: {
        userId,
        eventId,
      },
    },
  })
}

export async function getEventPredictionStats(eventId: string) {
  const predictions = await prisma.prediction.findMany({
    where: {
      eventId,
    },
  })

  const winCount = predictions.filter((p) => p.outcome === "win").length
  const drawCount = predictions.filter((p) => p.outcome === "draw").length
  const lossCount = predictions.filter((p) => p.outcome === "loss").length

  return {
    winCount,
    drawCount,
    lossCount,
    totalPredictions: predictions.length,
  }
}
