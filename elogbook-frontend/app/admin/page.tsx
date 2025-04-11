"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { BarChart3, CheckCircle2, Clock, Download, FileText, Loader2, Settings, Users, XCircle } from "lucide-react"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { mockAdminUser, recentUsers } from "@/pages/api/mock-data"

export default function AdminDashboard() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  // Mock statistics
  const stats = {
    totalStudents: 120,
    totalSupervisors: 15,
    totalLogs: 842,
    pendingLogs: 28,
  }

  const isLoaded = true
  const isSignedIn = true
  const user = mockAdminUser

  useEffect(() => {
    if (isLoaded) {
      // In a real app, you would fetch data from your backend here
      setTimeout(() => {
        setLoading(false)
      }, 1000)
    }
  }, [isLoaded])

  if (loading) {
    return (
      <DashboardLayout userRole="admin">
        <div className="flex items-center justify-center h-[calc(100vh-10rem)]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout userRole="admin">
      <div className="space-y-6 px-5 lg:px-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {user?.firstName || "Admin"}!</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.push("/admin/settings")}>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
            <Button onClick={() => router.push("/admin/users")}>
              <Users className="mr-2 h-4 w-4" />
              Manage Users
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{stats.totalStudents}</div>
                <Users className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Supervisors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{stats.totalSupervisors}</div>
                <Users className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Logs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{stats.totalLogs}</div>
                <FileText className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Pending Logs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{stats.pendingLogs}</div>
                <Clock className="h-5 w-5 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="users">
          <TabsList className="grid w-full md:w-[400px] grid-cols-2">
            <TabsTrigger value="users">Recent Users</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          <TabsContent value="users" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Recently Added Users</CardTitle>
                <CardDescription>New users added to the system</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead className="hidden md:table-cell">Email</TableHead>
                      <TableHead className="hidden md:table-cell">Date Added</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.role}</TableCell>
                        <TableCell className="hidden md:table-cell">{user.email}</TableCell>
                        <TableCell className="hidden md:table-cell">{user.date}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm" onClick={() => router.push("/admin/users")}>
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="mt-4 flex justify-end">
                  <Button variant="outline" size="sm" onClick={() => router.push("/admin/users")}>
                    View All Users
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="analytics" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>System Analytics</CardTitle>
                <CardDescription>Overview of system usage and performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center">
                  <BarChart3 className="h-16 w-16 text-muted-foreground/50" />
                </div>
                <div className="mt-4 flex justify-end">
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Export Data
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card>
          <CardHeader>
            <CardTitle>Log Status Overview</CardTitle>
            <CardDescription>Summary of all log submissions in the system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="flex flex-col items-center justify-center p-4 border rounded-lg">
                <CheckCircle2 className="h-8 w-8 text-green-500 mb-2" />
                <div className="text-2xl font-bold">756</div>
                <div className="text-sm text-muted-foreground">Approved Logs</div>
              </div>
              <div className="flex flex-col items-center justify-center p-4 border rounded-lg">
                <Clock className="h-8 w-8 text-yellow-500 mb-2" />
                <div className="text-2xl font-bold">28</div>
                <div className="text-sm text-muted-foreground">Pending Logs</div>
              </div>
              <div className="flex flex-col items-center justify-center p-4 border rounded-lg">
                <XCircle className="h-8 w-8 text-red-500 mb-2" />
                <div className="text-2xl font-bold">58</div>
                <div className="text-sm text-muted-foreground">Rejected Logs</div>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <Button variant="outline" onClick={() => router.push("/admin/logs")}>
                <FileText className="mr-2 h-4 w-4" />
                View All Logs
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

