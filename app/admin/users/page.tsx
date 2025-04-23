import { getAllUsers } from "@/lib/data/admin"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import UserTable from "@/components/admin/user-table"

export const dynamic = "force-dynamic"

export default async function AdminUsersPage({ searchParams }: { searchParams: { q?: string } }) {
  const query = searchParams.q || ""
  const users = await getAllUsers(query)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
        <p className="text-muted-foreground mt-2">View and manage user accounts</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription>Manage registered users on the platform</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <form className="flex-1">
                <Input name="q" placeholder="Search users..." defaultValue={query} className="max-w-sm" />
              </form>
              <Button variant="outline" type="submit" form="user-search">
                Search
              </Button>
            </div>

            <UserTable users={users} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
