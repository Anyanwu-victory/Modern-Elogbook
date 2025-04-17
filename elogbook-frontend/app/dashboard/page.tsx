"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Activity, AlertCircle, Calendar, CheckCircle2, Clock, FileText, Info, Loader2, XCircle } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useUser } from "@clerk/nextjs"

// Mock user data
const mockUser = {
  firstName: "Demo",
  fullName: "Demo User",
  primaryEmailAddress: { emailAddress: "demo@example.com" },
}

export default function StudentDashboard() {
  const router = useRouter()
  const { user,isLoaded, isSignedIn } = useUser()
  const [isProfileComplete, setIsProfileComplete] = useState(false)
  const [loading, setLoading] = useState(true)

  // Replace
  // // With
  // const isLoaded = true
  // const isSignedIn = true
  // const user = mockUser

  // Mock data - in a real app, this would come from your backend
  const currentWeek = 3
  const totalWeeks = 24
  const progressPercentage = (currentWeek / totalWeeks) * 100

  const recentLogs = [
    { id: 1, day: "Monday", date: "2025-03-24", status: "approved" },
    { id: 2, day: "Wednesday", date: "2025-03-26", status: "pending" },
    { id: 3, day: "Friday", date: "2025-03-28", status: "rejected" },
  ]

  const notifications = [
    {
      id: 1,
      type: "info",
      message: "Your supervisor has scheduled a visit for next week",
      date: "2025-03-29",
    },
    {
      id: 2,
      type: "success",
      message: "Your log for Monday has been approved",
      date: "2025-03-25",
    },
    {
      id: 3,
      type: "error",
      message: "Your log for Friday needs revision",
      date: "2025-03-28",
    },
  ]

  useEffect(() => {
    if (isLoaded) {
      // Check if profile is complete - this would be a real API call
      // For demo purposes, we'll just set it to false
      setIsProfileComplete(false)
      setLoading(false)
    }
  }, [isLoaded])

  if (loading) {
    return (
      <DashboardLayout userRole="student">
        <div className="flex items-center justify-center h-[calc(100vh-10rem)]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout userRole="student">
      <div className="space-y-6 px-5 lg:px-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Student Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {user?.username || "Student"}!</p>
          </div>
          <Button onClick={() => router.push("/dashboard/submit-log")}>
            <FileText className="mr-2 h-4 w-4" />
            Submit New Log
          </Button>
        </div>

        {!isProfileComplete && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Admin action</AlertTitle>
            <AlertDescription>
              Wait for Admin approval to be able to access your dashboard.
              {/* <Button
                variant="link"
                className="p-0 h-auto font-semibold ml-2"
                onClick={() => router.push("/dashboard/profile")}
              >
                Complete Now
              </Button> */}
            </AlertDescription>
          </Alert>
        )}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Progress Tracker</CardTitle>
              <CardDescription>
                Week {currentWeek} of {totalWeeks}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Progress value={progressPercentage} className="h-2" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0%</span>
                  <span>{progressPercentage.toFixed(0)}%</span>
                  <span>100%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Upcoming Deadlines</CardTitle>
              <CardDescription>Your next log submissions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Monday, April 1, 2025</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Wednesday, April 3, 2025</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Friday, April 5, 2025</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Weekly Summary</CardTitle>
              <CardDescription>Current week statistics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Approved</span>
                  </div>
                  <Badge>1</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm">Pending</span>
                  </div>
                  <Badge variant="outline">1</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-red-500" />
                    <span className="text-sm">Rejected</span>
                  </div>
                  <Badge variant="destructive">1</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Logs</CardTitle>
              <CardDescription>Your recently submitted logs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentLogs.map((log) => (
                  <div key={log.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">{log.day}</p>
                        <p className="text-xs text-muted-foreground">{log.date}</p>
                      </div>
                    </div>
                    <Badge
                      variant={
                        log.status === "approved" ? "success" : log.status === "pending" ? "outline" : "destructive"
                      }
                      className={
                        log.status === "approved"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                          : log.status === "pending"
                            ? ""
                            : ""
                      }
                    >
                      {log.status.charAt(0).toUpperCase() + log.status.slice(1)}
                    </Badge>
                  </div>
                ))}
                <Button variant="outline" className="w-full" onClick={() => router.push("/dashboard/my-logs")}>
                  View All Logs
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>Recent updates and messages</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <Alert
                    key={notification.id}
                    variant={
                      notification.type === "info"
                        ? "default"
                        : notification.type === "success"
                          ? "default" // Changed to a valid value
                          : "destructive"
                    }
                    className="py-2"
                  >
                    {notification.type === "info" ? (
                      <Info className="h-4 w-4" />
                    ) : notification.type === "success" ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      <AlertCircle className="h-4 w-4" />
                    )}
                    <AlertTitle className="text-sm font-medium">{notification.message}</AlertTitle>
                    <AlertDescription className="text-xs">{notification.date}</AlertDescription>
                  </Alert>
                ))}
                <Button variant="outline" className="w-full">
                  View All Notifications
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Activity Overview</CardTitle>
            <CardDescription>Your log submission activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] flex items-center justify-center">
              <Activity className="h-16 w-16 text-muted-foreground/50" />
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

