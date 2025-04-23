import { prisma } from "@/lib/prisma"

export async function getAdminStats() {
  const [totalUsers, totalEvents, totalPredictions, recentUsers, upcomingEvents] = await Promise.all([
    prisma.user.count(),
    prisma.event.count(),
    prisma.prediction.count(),
    prisma.user.findMany({
      take: 5,
      orderBy: { id: "desc" },
      select: {
        id: true,
        name: true,
        createdAt: true,
        _count: {
          select: { predictions: true },
        },
      },
    }),
    prisma.event.findMany({
      where: {
        date: {
          gte: new Date(),
        },
      },
      orderBy: { date: "asc" },
      take: 5,
    }),
  ])

  // Count active events (events with future dates)
  const activeEvents = await prisma.event.count({
    where: {
      date: {
        gte: new Date(),
      },
    },
  })

  // Format the recent users to include prediction count
  const formattedRecentUsers = recentUsers.map((user) => ({
    id: user.id,
    name: user.name,
    predictionCount: user._count.predictions,
    createdAt: user.createdAt,
  }))

  return {
    totalUsers,
    totalEvents,
    totalPredictions,
    activeEvents,
    recentUsers: formattedRecentUsers,
    upcomingEvents,
  }
}

export async function getAllUsers(searchQuery = "") {
  const users = await prisma.user.findMany({
    where: {
      name: {
        contains: searchQuery,
      },
    },
    select: {
      id: true,
      name: true,
      isAdmin: true,
      createdAt: true,
      _count: {
        select: { predictions: true },
      },
    },
    orderBy: {
      name: "asc",
    },
  })

  return users.map((user) => ({
    id: user.id,
    name: user.name,
    isAdmin: user.isAdmin,
    predictionCount: user._count.predictions,
    createdAt: user.createdAt,
  }))
}

export async function getAllEvents(searchQuery = "") {
  return prisma.event.findMany({
    where: {
      title: {
        contains: searchQuery,
      },
    },
    orderBy: {
      date: "desc",
    },
  })
}
