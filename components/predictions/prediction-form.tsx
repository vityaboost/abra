"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import * as Dialog from "@radix-ui/react-dialog"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/components/ui/use-toast"

interface Offer {
  id: string
  title: string
  link: string
  amount: number
  currency: string
  cashback: number
  cashbackCurrency: string
}

interface PredictionFormProps {
  eventId: string
  userId: string
}

export default function PredictionForm({
  eventId,
  userId,
}: PredictionFormProps) {
  const [outcome, setOutcome] = useState<"win" | "draw" | "loss">("win")
  const [homeScore, setHomeScore] = useState<string>("0")
  const [awayScore, setAwayScore] = useState<string>("0")
  const [isPending, setIsPending] = useState(false)

  const [offer, setOffer] = useState<Offer | null>(null)
  const [isOfferOpen, setIsOfferOpen] = useState(false)
  const [hasPredicted, setHasPredicted] = useState(false)

  const router = useRouter()
  const { toast } = useToast()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsPending(true)

    try {
      const res = await fetch(`/api/events/${eventId}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          outcome,
          homeScore: Number(homeScore),
          awayScore: Number(awayScore),
        }),
      })
      if (!res.ok) throw new Error(`Error ${res.status}`)

      const { success, offer } = await res.json()
      if (!success) throw new Error("Server error")

      // 1) сразу переключаем UI на "предсказано"
      setHasPredicted(true)

      // 2) показываем оффер
      setOffer(offer)
      setIsOfferOpen(true)

      toast({
        title: "Prediction submitted",
        description: "Your prediction has been recorded.",
      })
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to submit prediction",
        variant: "destructive",
      })
    } finally {
      setIsPending(false)
    }
  }

  // Закрытие модалки — обновляем SSR-данные
  function handleCloseOffer() {
    setIsOfferOpen(false)
    router.refresh()
  }

  return (
    <>
      {!hasPredicted ? (
        <Card>
          <CardHeader>
            <CardTitle>Make Your Prediction</CardTitle>
            <CardDescription>
              Submit your prediction for this event. You can only make one prediction.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <Label>Predicted Outcome</Label>
              <RadioGroup
                value={outcome}
                onValueChange={setOutcome}
                className="flex flex-col space-y-2"
              >
                {["win", "draw", "loss"].map((val) => (
                  <div key={val} className="flex items-center space-x-2">
                    <RadioGroupItem value={val as any} id={val} />
                    <Label htmlFor={val}>
                      {val === "win"
                        ? "Home Team Win"
                        : val === "draw"
                        ? "Draw"
                        : "Away Team Win"}
                    </Label>
                  </div>
                ))}
              </RadioGroup>

              <Label>Predicted Score</Label>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <Label htmlFor="home-score">Home</Label>
                  <Input
                    id="home-score"
                    type="number"
                    min={0}
                    value={homeScore}
                    onChange={(e) => setHomeScore(e.target.value)}
                    required
                  />
                </div>
                <span className="text-xl font-bold">-</span>
                <div className="flex-1">
                  <Label htmlFor="away-score">Away</Label>
                  <Input
                    id="away-score"
                    type="number"
                    min={0}
                    value={awayScore}
                    onChange={(e) => setAwayScore(e.target.value)}
                    required
                  />
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
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Your Prediction</CardTitle>
            <CardDescription>You have already made a prediction.</CardDescription>
          </CardHeader>
        </Card>
      )}

      {/* Модалка с оффером */}
      <Dialog.Root open={isOfferOpen} onOpenChange={(o) => o && setIsOfferOpen(o)}>
  <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm data-[state=open]:animate-overlayShow" />
  <Dialog.Content className="fixed inset-0 m-auto max-w-sm p-6 bg-white rounded-xl shadow-xl data-[state=open]:animate-contentShow focus:outline-none">
    <div className="flex flex-col space-y-4">
      <Dialog.Title className="text-xl font-semibold text-gray-900 flex items-center gap-2">
        <span className="text-2xl">🎯</span>
        <span>Специальное предложение!</span>
      </Dialog.Title>
      
      {offer && (
        <div className="space-y-4">
          <p className="text-gray-600 text-sm leading-snug">
            {offer.title}
          </p>
          <a
            href={offer.link}
            target="_blank"
            rel="noopener noreferrer"
            className="block px-4 py-2 bg-blue-500 text-white rounded-lg text-center 
                     font-medium hover:bg-blue-600 transition-colors"
          >
            Получить кешбэк {offer.cashback}
            {offer.cashbackCurrency}
          </a>
        </div>
      )}
      
      <div className="pt-3 flex justify-end">
        <Button 
          variant="ghost"
          onClick={handleCloseOffer}
          className="px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700"
        >
          Закрыть
        </Button>
      </div>
    </div>
  </Dialog.Content>
</Dialog.Root>
    </>
  )
}
