import { Suspense } from "react"
import { cookies } from "next/headers"
import { getEventById } from "@/lib/data/events"
import { getEventPredictionStats, getUserPredictionForEvent } from "@/lib/data/predictions"
import { getUserFromCookies } from "@/lib/auth"
import EventDetails from "@/components/events/event-details"
import PredictionForm from "@/components/predictions/prediction-form"
import ClientPredictionStats from "@/components/predictions/client-prediction-stats"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export const dynamic = "force-dynamic"

export default async function EventPage({ params }: { params: { id: string } }) {
  const eventId = params.id
  const event = await getEventById(eventId)

  if (!event) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <h1 className="text-2xl font-bold">Event Not Found</h1>
        <p className="text-muted-foreground">The event you're looking for doesn't exist or has been removed.</p>
        <Button asChild>
          <Link href="/events">Back to Events</Link>
        </Button>
      </div>
    )
  }

  const eventStats = await getEventPredictionStats(eventId)
  const cookieStore = cookies()
  const user = await getUserFromCookies(cookieStore)

  let userPrediction = null
  let hasPredicted = false

  if (user) {
    userPrediction = await getUserPredictionForEvent(user.id, eventId)
    hasPredicted = !!userPrediction
  }

  return (
    <div className="space-y-8">
      <EventDetails event={event} />

      {!user && (
        <Card>
          <CardHeader>
            <CardTitle>Make a Prediction</CardTitle>
            <CardDescription>You need to be logged in to make predictions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Button asChild>
                <Link href="/login">Log in</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/register">Register</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {user && !hasPredicted && <PredictionForm eventId={eventId} userId={user.id} />}

      {user && hasPredicted && (
        <Card>
          <CardHeader>
            <CardTitle>Your Prediction</CardTitle>
            <CardDescription>You've already made a prediction for this event</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">Outcome:</span>
                <span>{userPrediction?.outcome}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Score Prediction:</span>
                <span>
                  {userPrediction?.homeScore} - {userPrediction?.awayScore}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Made on:</span>
                <span>{userPrediction?.createdAt.toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Suspense fallback={<div>Loading prediction stats...</div>}>
        <ClientPredictionStats eventStats={eventStats} />
      </Suspense>
    </div>
  )
}
