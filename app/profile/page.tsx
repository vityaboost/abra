import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { getUserFromCookies } from "@/lib/auth"
import { getUserPredictions, getUserPredictionStats } from "@/lib/data/predictions"
import UserStats from "@/components/profile/UserStats"
import ClientProfileTabs from "@/components/profile/client-profile-tabs"
import { Suspense } from "react"

export const dynamic = "force-dynamic"

export default async function ProfilePage() {
  const cookieStore = cookies()
  const user = await getUserFromCookies(cookieStore)

  if (!user) {
    redirect("/login")
  }

  const userPredictions = await getUserPredictions(user.id)

  console.log(UserStats)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Your Profile</h1>
        <p className="text-muted-foreground mt-2">View your prediction history and statistics</p>
      </div>

      <UserStats  />

      <Suspense fallback={<div>Loading prediction history...</div>}>
        <ClientProfileTabs predictions={userPredictions} />
      </Suspense>
    </div>
  )
}
