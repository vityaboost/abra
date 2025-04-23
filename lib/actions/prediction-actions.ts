"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"

interface CreatePredictionParams {
  userId: string
  eventId: string
  outcome: string
  homeScore: number
  awayScore: number
}

export async function createPrediction({ userId, eventId, outcome, homeScore, awayScore }: CreatePredictionParams) {
  try {
    // Create or update prediction
    await prisma.prediction.upsert({
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

    // Update prediction count on event
    await prisma.event.update({
      where: { id: eventId },
      data: {
        predictionCount: {
          increment: 1,
        },
      },
    })

    // Revalidate paths
    revalidatePath(`/events/${eventId}`)
    revalidatePath("/profile")
    revalidatePath("/events")

    return { success: true }
  } catch (error) {
    console.error("Error creating prediction:", error)

    if (error.code === "P2002") {
      throw new Error("You have already made a prediction for this event")
    }

    throw new Error("Failed to create prediction")
  }
}
