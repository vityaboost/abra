// lib/data/events.ts
import { prisma } from "@/lib/prisma";

/**
 * События, ещё не финализированные (users могут делать предсказания).
 */
export async function getAllEvents() {
  return prisma.event.findMany({
    where: { result: null },
    orderBy: { date: "asc" },
  });
}

/**
 * Уже завершённые (финализированные) события.
 */
export async function getPastEvents() {
  return prisma.event.findMany({
    where: { result: { not: null } },
    orderBy: { date: "desc" },
  });
}

/**
 * Полное событие по id (для деталей).
 */
export async function getEventById(id: string) {
  return prisma.event.findUnique({ where: { id } });
}
