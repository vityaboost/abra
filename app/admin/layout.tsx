import type React from "react"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { getUserFromCookies } from "@/lib/auth"
import AdminSidebar from "@/components/admin/admin-sidebar"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = cookies()
  const user = await getUserFromCookies(cookieStore)

  // Check if user is admin, if not redirect to home
  if (!user?.isAdmin) {
    redirect("/")
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1 p-8">{children}</div>
    </div>
  )
}
