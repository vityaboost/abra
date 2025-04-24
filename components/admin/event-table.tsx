// components/admin/event-table.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { MoreHorizontal } from "lucide-react";
import { deleteEvent } from "@/lib/actions/admin-actions";
import { useToast } from "@/components/ui/use-toast";
import { formatDate } from "@/lib/utils";
import type { Event } from "@prisma/client";

export default function EventTable({ events }: { events: Event[] }) {
  // Delete dialogs state
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<Event | null>(null);

  // Finalize dialogs state
  const [isFinalizeDialogOpen, setIsFinalizeDialogOpen] = useState(false);
  const [eventToFinalize, setEventToFinalize] = useState<Event | null>(null);
  const [finalResult, setFinalResult] = useState<string>("");

  const { toast } = useToast();

  // Delete handlers
  const handleDeleteClick = (event: Event) => {
    setEventToDelete(event);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!eventToDelete) return;
    try {
      await deleteEvent(eventToDelete.id);
      toast({
        title: "Event deleted",
        description: `Event "${eventToDelete.title}" has been deleted successfully.`,
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to delete event. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setEventToDelete(null);
    }
  };

  // Finalize handlers
  const handleFinalizeClick = (event: Event) => {
    setEventToFinalize(event);
    setFinalResult(""); // reset any previous selection
    setIsFinalizeDialogOpen(true);
  };

  const handleFinalizeConfirm = async () => {
    if (!eventToFinalize || !finalResult) return;
    try {
      const res = await fetch(
        `/api/admin/events/${eventToFinalize.id}/finalize`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ result: finalResult }),
        }
      );
      if (!res.ok) throw new Error();
      toast({
        title: "Event finalized",
        description: `Result "${finalResult}" saved and points awarded.`,
      });
    } catch {
      toast({
        title: "Error finalizing event",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsFinalizeDialogOpen(false);
      setEventToFinalize(null);
      setFinalResult("");
    }
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Predictions</TableHead>
              <TableHead className="w-[160px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {events.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center h-24">
                  No events found.
                </TableCell>
              </TableRow>
            ) : (
              events.map((event) => (
                <TableRow key={event.id}>
                  <TableCell className="font-medium">{event.title}</TableCell>
                  <TableCell>{formatDate(event.date)}</TableCell>
                  <TableCell>{event.predictionCount}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/events/${event.id}`}>Edit</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => handleFinalizeClick(event)}>
                          Finalize
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600"
                          onSelect={() => handleDeleteClick(event)}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Event</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the event "{eventToDelete?.title}"? This action cannot
              be undone and will also delete all associated predictions.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Finalize Confirmation Dialog */}
      <Dialog open={isFinalizeDialogOpen} onOpenChange={setIsFinalizeDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Finalize Event</DialogTitle>
            <DialogDescription>
              Choose the actual outcome for "{eventToFinalize?.title}"
            </DialogDescription>
          </DialogHeader>
          <Select value={finalResult} onValueChange={setFinalResult}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select outcome" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="home">Home Win</SelectItem>
              <SelectItem value="away">Away Win</SelectItem>
              <SelectItem value="draw">Draw</SelectItem>
            </SelectContent>
          </Select>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsFinalizeDialogOpen(false)}>
              Cancel
            </Button>
            <Button disabled={!finalResult} onClick={handleFinalizeConfirm}>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
