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
    where: { userId },
    include: { event: true },
  });

  const totalPredictions = predictions.length;
  const correctPredictions = predictions.filter(
    (p) => p.event.result !== null && p.outcome === p.event.result
  ).length;

  const accuracy =
    totalPredictions > 0
      ? Math.round((correctPredictions / totalPredictions) * 100)
      : 0;

  return {
    totalPredictions,
    correctPredictions,
    accuracy,
  };
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

  const winCount = predictions.filter((p) => p.outcome === "home").length
  const drawCount = predictions.filter((p) => p.outcome === "draw").length
  const lossCount = predictions.filter((p) => p.outcome === "away").length

  return {
    winCount,
    drawCount,
    lossCount,
    totalPredictions: predictions.length,
  }
}
