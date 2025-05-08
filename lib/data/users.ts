// lib/data/users.ts
import { prisma } from "@/lib/prisma";

export async function getAllUserStats() {
  const stats = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      score: true,
      _count: { select: { predictions: true } },
      predictions: {
        select: { event: { select: { result: true } }, outcome: true },
      },
    },
  });

  return stats.map((u) => {
    const total = u._count.predictions;
    const correct = u.predictions.filter(
      (p) => p.event.result !== null && p.outcome === p.event.result
    ).length;
    const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
    return {
      id: u.id,
      name: u.name,
      totalPredictions: total,
      correctPredictions: correct,
      accuracy,
      score: u.score,
    };
  });
}
