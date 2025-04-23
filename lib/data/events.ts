import { prisma } from "@/lib/prisma"

export async function getAllEvents() {
  return prisma.event.findMany({
    orderBy: {
      date: "asc",
    },
  })
}

export async function getEventById(id: string) {
  return prisma.event.findUnique({
    where: { id },
  })
}
