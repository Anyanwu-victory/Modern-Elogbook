"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { BarChart3, CheckCircle2, Clock, FileText, Loader2, Users, XCircle } from "lucide-react"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { mockSupervisorUser, recentSubmissions } from "@/pages/api/mock-data"

export default function SupervisorDashboard() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  // Mock statistics
  const stats = {
    totalStudents: 15,
    pendingLogs: 8,
    approvedLogs: 42,
    rejectedLogs: 3,
  }

  const isLoaded = true
  const isSignedIn = true
  const user = mockSupervisorUser

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
      <DashboardLayout userRole="industrySupervisor">
        <div className="flex items-center justify-center h-[calc(100vh-10rem)]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout userRole="industrySupervisor">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Supervisor Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user?.firstName || "Supervisor"}!</p>
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
              <CardTitle className="text-sm font-medium">Pending Logs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{stats.pendingLogs}</div>
                <Clock className="h-5 w-5 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Approved Logs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{stats.approvedLogs}</div>
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Rejected Logs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{stats.rejectedLogs}</div>
                <XCircle className="h-5 w-5 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Submissions</CardTitle>
              <CardDescription>Latest log submissions from your students</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentSubmissions.map((submission) => (
                    <TableRow key={submission.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{submission.student}</div>
                          <div className="text-xs text-muted-foreground">{submission.matricNo}</div>
                        </div>
                      </TableCell>
                      <TableCell>{submission.date}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            submission.status === "approved"
                              ? "success"
                              : submission.status === "pending"
                                ? "outline"
                                : "destructive"
                          }
                          className={
                            submission.status === "approved"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                              : submission.status === "pending"
                                ? ""
                                : ""
                          }
                        >
                          {submission.status === "approved" ? (
                            <CheckCircle2 className="mr-1 h-3 w-3" />
                          ) : submission.status === "pending" ? (
                            <Clock className="mr-1 h-3 w-3" />
                          ) : (
                            <XCircle className="mr-1 h-3 w-3" />
                          )}
                          {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" onClick={() => router.push("/supervisor/review-logs")}>
                          Review
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="mt-4 flex justify-end">
                <Button variant="outline" size="sm" onClick={() => router.push("/supervisor/review-logs")}>
                  View All
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Student Progress</CardTitle>
              <CardDescription>Overall progress of your assigned students</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center">
                <BarChart3 className="h-16 w-16 text-muted-foreground/50" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Student Visits</CardTitle>
            <CardDescription>Schedule of upcoming visits to students' internship locations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b pb-4">
                <div>
                  <div className="font-medium">John Doe - Acme Inc.</div>
                  <div className="text-sm text-muted-foreground">April 5, 2025 at 10:00 AM</div>
                </div>
                <Button variant="outline" size="sm">
                  <FileText className="mr-2 h-4 w-4" />
                  View Details
                </Button>
              </div>
              <div className="flex items-center justify-between border-b pb-4">
                <div>
                  <div className="font-medium">Jane Smith - Tech Solutions</div>
                  <div className="text-sm text-muted-foreground">April 12, 2025 at 2:00 PM</div>
                </div>
                <Button variant="outline" size="sm">
                  <FileText className="mr-2 h-4 w-4" />
                  View Details
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Michael Johnson - Global Systems</div>
                  <div className="text-sm text-muted-foreground">April 19, 2025 at 11:30 AM</div>
                </div>
                <Button variant="outline" size="sm">
                  <FileText className="mr-2 h-4 w-4" />
                  View Details
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

