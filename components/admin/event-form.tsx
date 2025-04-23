"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createEvent, updateEvent } from "@/lib/actions/admin-actions"
import { useToast } from "@/components/ui/use-toast"
import type { Event } from "@prisma/client"

interface EventFormProps {
  event?: Event
}

export default function EventForm({ event }: EventFormProps) {
  const isEditing = !!event
  const router = useRouter()
  const { toast } = useToast()

  const [title, setTitle] = useState(event?.title || "")
  const [date, setDate] = useState(event ? new Date(event.date).toISOString().slice(0, 16) : "")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      if (isEditing) {
        await updateEvent({
          id: event.id,
          title,
          date: new Date(date),
        })
        toast({
          title: "Event updated",
          description: "The event has been updated successfully.",
        })
      } else {
        await createEvent({
          title,
          date: new Date(date),
        })
        toast({
          title: "Event created",
          description: "The new event has been created successfully.",
        })
      }
      router.push("/admin/events")
      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save event",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Event Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter event title"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="date">Event Date and Time</Label>
        <Input id="date" type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} required />
      </div>

      <div className="flex gap-4">
        <Button type="button" variant="outline" onClick={() => router.push("/admin/events")}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : isEditing ? "Update Event" : "Create Event"}
        </Button>
      </div>
    </form>
  )
}
