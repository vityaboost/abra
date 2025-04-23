"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Users, Calendar, LogOut } from "lucide-react"
import { useUser } from "@/context/user-context"

export default function AdminSidebar() {
  const pathname = usePathname()
  const { logout } = useUser()

  const navigation = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Users", href: "/admin/users", icon: Users },
    { name: "Events", href: "/admin/events", icon: Calendar },
  ]

  const isActive = (path: string) => {
    if (path === "/admin" && pathname !== "/admin") return false
    return pathname.startsWith(path)
  }

  return (
    <div className="flex flex-col w-64 border-r bg-muted/40 min-h-screen">
      <div className="p-6">
        <Link href="/admin" className="flex items-center gap-2 mb-6">
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
            <path d="M2 18h1.4c1.3 0 2.5-.7 3.2-1.8l7.2-10.3c.7-1.1 1.9-1.8 3.2-1.8H22"></path>
            <path d="M22 6h-1.4c-1.3 0-2.5.7-3.2 1.8L10.2 18c-.7 1.1-1.9 1.8-3.2 1.8H2"></path>
          </svg>
          <span className="font-bold">Admin Panel</span>
        </Link>

        <nav className="space-y-1">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md",
                isActive(item.href)
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-4 border-t">
        <div className="flex flex-col gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href="/">View Site</Link>
          </Button>
          <Button variant="ghost" size="sm" className="justify-start text-red-600" onClick={() => logout()}>
            <LogOut className="mr-2 h-4 w-4" />
            Log out
          </Button>
        </div>
      </div>
    </div>
  )
}
