import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-8 text-center">
      <div className="space-y-4 max-w-3xl">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Sports Prediction Platform</h1>
        <p className="text-xl text-muted-foreground">
          Make predictions on sports events and compare your accuracy with other analysts.
        </p>
      </div>

      <div className="flex flex-wrap gap-4 justify-center">
        <Button asChild size="lg">
          <Link href="/events">Browse Events</Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/register">Get Started</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 w-full max-w-5xl">
        <div className="flex flex-col items-center p-6 bg-card rounded-lg border shadow-sm">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-primary"
            >
              <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path>
              <line x1="4" x2="4" y1="22" y2="15"></line>
            </svg>
          </div>
          <h3 className="text-xl font-bold mb-2">Make Predictions</h3>
          <p className="text-muted-foreground text-center">
            Predict outcomes for upcoming sports events with your analysis.
          </p>
        </div>

        <div className="flex flex-col items-center p-6 bg-card rounded-lg border shadow-sm">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-primary"
            >
              <path d="M12 20v-6M6 20V10M18 20V4"></path>
            </svg>
          </div>
          <h3 className="text-xl font-bold mb-2">Track Performance</h3>
          <p className="text-muted-foreground text-center">View your prediction history and accuracy statistics.</p>
        </div>

        <div className="flex flex-col items-center p-6 bg-card rounded-lg border shadow-sm">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-primary"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          </div>
          <h3 className="text-xl font-bold mb-2">Compare Analysts</h3>
          <p className="text-muted-foreground text-center">See how your predictions stack up against other analysts.</p>
        </div>
      </div>
    </div>
  )
}
