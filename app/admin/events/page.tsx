import Link from "next/link"
import { getAllEvents } from "@/lib/data/admin"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import EventTable from "@/components/admin/event-table"

export const dynamic = "force-dynamic"

export default async function AdminEventsPage({ searchParams }: { searchParams: { q?: string } }) {
  const query = searchParams.q || ""
  const events = await getAllEvents(query)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Event Management</h1>
          <p className="text-muted-foreground mt-2">Create and manage sports events</p>
        </div>
        <Button asChild>
          <Link href="/admin/events/new">Create New Event</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Events</CardTitle>
          <CardDescription>Manage sports events on the platform</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <form className="flex-1">
                <Input name="q" placeholder="Search events..." defaultValue={query} className="max-w-sm" />
              </form>
              <Button variant="outline" type="submit">
                Search
              </Button>
            </div>

            <EventTable events={events} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
