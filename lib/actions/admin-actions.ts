"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"

// User management actions
export async function updateUserAdmin(userId: string, isAdmin: boolean) {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: { isAdmin },
    })

    revalidatePath("/admin/users")
    return { success: true }
  } catch (error) {
    console.error("Error updating user admin status:", error)
    throw new Error("Failed to update user admin status")
  }
}

export async function deleteUser(userId: string) {
  try {
    // Delete all predictions made by the user
    await prisma.prediction.deleteMany({
      where: { userId },
    })

    // Delete the user
    await prisma.user.delete({
      where: { id: userId },
    })

    revalidatePath("/admin/users")
    return { success: true }
  } catch (error) {
    console.error("Error deleting user:", error)
    throw new Error("Failed to delete user")
  }
}

// Event management actions
interface EventData {
  title: string
  date: Date
}

interface EventUpdateData extends EventData {
  id: string
}

export async function createEvent(data: EventData) {
  try {
    await prisma.event.create({
      data: {
        title: data.title,
        date: data.date,
        predictionCount: 0,
      },
    })

    revalidatePath("/admin/events")
    revalidatePath("/events")
    return { success: true }
  } catch (error) {
    console.error("Error creating event:", error)
    throw new Error("Failed to create event")
  }
}

export async function updateEvent(data: EventUpdateData) {
  try {
    await prisma.event.update({
      where: { id: data.id },
      data: {
        title: data.title,
        date: data.date,
      },
    })

    revalidatePath("/admin/events")
    revalidatePath(`/events/${data.id}`)
    revalidatePath("/events")
    return { success: true }
  } catch (error) {
    console.error("Error updating event:", error)
    throw new Error("Failed to update event")
  }
}

export async function deleteEvent(eventId: string) {
  try {
    // Delete all predictions for this event
    await prisma.prediction.deleteMany({
      where: { eventId },
    })

    // Delete the event
    await prisma.event.delete({
      where: { id: eventId },
    })

    revalidatePath("/admin/events")
    revalidatePath("/events")
    return { success: true }
  } catch (error) {
    console.error("Error deleting event:", error)
    throw new Error("Failed to delete event")
  }
}
