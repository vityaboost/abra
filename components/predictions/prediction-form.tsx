"use client"

import type React from "react"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { createPrediction } from "@/lib/actions/prediction-actions"
import { useToast } from "@/components/ui/use-toast"

interface PredictionFormProps {
  eventId: string
  userId: string
}

export default function PredictionForm({ eventId, userId }: PredictionFormProps) {
  const [outcome, setOutcome] = useState<string>("win")
  const [homeScore, setHomeScore] = useState<string>("0")
  const [awayScore, setAwayScore] = useState<string>("0")
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    startTransition(async () => {
      try {
        await createPrediction({
          userId,
          eventId,
          outcome,
          homeScore: Number.parseInt(homeScore),
          awayScore: Number.parseInt(awayScore),
        })

        toast({
          title: "Prediction submitted",
          description: "Your prediction has been recorded successfully.",
        })

        router.refresh()
      } catch (error) {
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to submit prediction",
          variant: "destructive",
        })
      }
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Make Your Prediction</CardTitle>
        <CardDescription>
          Submit your prediction for this event. You can only make one prediction per event.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <Label>Predicted Outcome</Label>
            <RadioGroup value={outcome} onValueChange={setOutcome} className="flex flex-col space-y-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="win" id="win" />
                <Label htmlFor="win" className="cursor-pointer">
                  Home Team Win
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="draw" id="draw" />
                <Label htmlFor="draw" className="cursor-pointer">
                  Draw
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="loss" id="loss" />
                <Label htmlFor="loss" className="cursor-pointer">
                  Away Team Win
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-4">
            <Label>Predicted Score</Label>
            <div className="flex items-center gap-4">
              <div className="space-y-2 flex-1">
                <Label htmlFor="home-score">Home</Label>
                <Input
                  id="home-score"
                  type="number"
                  min="0"
                  value={homeScore}
                  onChange={(e) => setHomeScore(e.target.value)}
                  required
                />
              </div>
              <div className="text-xl font-bold pt-6">-</div>
              <div className="space-y-2 flex-1">
                <Label htmlFor="away-score">Away</Label>
                <Input
                  id="away-score"
                  type="number"
                  min="0"
                  value={awayScore}
                  onChange={(e) => setAwayScore(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? "Submitting..." : "Submit Prediction"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
