// app/leaderboard/page.tsx
import { getAllUserStats } from "@/lib/data/users";
import {
  Table, TableHeader, TableHead, TableBody,
  TableRow, TableCell
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function LeaderboardPage() {
  const stats = await getAllUserStats();
  const byAccuracy = [...stats].sort((a, b) => b.accuracy - a.accuracy);
  const byCorrect  = [...stats].sort((a, b) => b.correctPredictions - a.correctPredictions);
  const byScore    = [...stats].sort((a, b) => (b.score || 0) - (a.score || 0));

  const renderTable = (data: typeof stats) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Rank</TableHead>
          <TableHead>User</TableHead>
          <TableHead>Total</TableHead>
          <TableHead>Correct</TableHead>
          <TableHead>Accuracy</TableHead>
          <TableHead>Score</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((u, i) => (
          <TableRow key={u.id}>
            <TableCell>{i + 1}</TableCell>
            <TableCell>
              <Link href={`/profile/${u.id}`} className="font-medium hover:underline">
                {u.name}
              </Link>
            </TableCell>
            <TableCell>{u.totalPredictions}</TableCell>
            <TableCell>{u.correctPredictions}</TableCell>
            <TableCell>{u.accuracy}%</TableCell>
            <TableCell>{u.score ?? 0}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Leaderboard</h1>
      <Tabs defaultValue="accuracy">
        <TabsList>
          <TabsTrigger value="accuracy">By Accuracy</TabsTrigger>
          <TabsTrigger value="correct">By Correct</TabsTrigger>
          <TabsTrigger value="score">By Score</TabsTrigger>
        </TabsList>
        <TabsContent value="accuracy">{renderTable(byAccuracy)}</TabsContent>
        <TabsContent value="correct">{renderTable(byCorrect)}</TabsContent>
        <TabsContent value="score">{renderTable(byScore)}</TabsContent>
      </Tabs>
    </div>
  );
}
