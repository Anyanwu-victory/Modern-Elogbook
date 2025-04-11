"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { BarChart3, CheckCircle2, Clock, Download, FileText, Loader2, Users, XCircle, DollarSign } from "lucide-react"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function ITFDashboard() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalStudents: 0,
    pendingApprovals: 0,
    approvedStudents: 0,
    rejectedStudents: 0,
  })
  const [pendingApprovals, setPendingApprovals] = useState<any[]>([])

  // Mock data for preview
  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setStats({
        totalStudents: 120,
        pendingApprovals: 25,
        approvedStudents: 85,
        rejectedStudents: 10,
      })

      setPendingApprovals([
        {
          _id: "1",
          name: "John Doe",
          matricNumber: "MIU/2023/001",
          department: "Computer Science",
          company: "Tech Solutions Inc.",
          startDate: "2025-01-15",
          endDate: "2025-07-15",
        },
        {
          _id: "2",
          name: "Jane Smith",
          matricNumber: "MIU/2023/002",
          department: "Electrical Engineering",
          company: "Power Systems Ltd.",
          startDate: "2025-01-15",
          endDate: "2025-07-15",
        },
      ])

      setLoading(false)
    }, 1000)
  }, [])

  // Mock user data
  const user = { firstName: "ITF", username: "Representative" }

  if (!loading) {
    console.log("Stats:", stats)
    console.log("Pending Approvals:", pendingApprovals)
  }

  if (loading) {
    return (
      <DashboardLayout userRole="itfPersonnel">
        <div className="flex items-center justify-center h-[calc(100vh-10rem)]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout userRole="itfPersonnel">
      <div className="space-y-6 px-5 lg:px-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">ITF Representative Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {user?.firstName || user?.username || "Representative"}!
            </p>
          </div>
          <Button onClick={() => router.push("/itf/reports")}>
            <FileText className="mr-2 h-4 w-4" />
            Generate Reports
          </Button>
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
              <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{stats.pendingApprovals}</div>
                <Clock className="h-5 w-5 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Approved Students</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{stats.approvedStudents}</div>
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Rejected Students</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{stats.rejectedStudents}</div>
                <XCircle className="h-5 w-5 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Stipend Approval Status</CardTitle>
            <CardDescription>Overall stipend approval progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Approval Progress</span>
                  <span className="text-muted-foreground">
                    {stats.approvedStudents + stats.rejectedStudents} of {stats.totalStudents} processed
                  </span>
                </div>
                <Progress
                  value={((stats.approvedStudents + stats.rejectedStudents) / stats.totalStudents) * 100}
                  className="h-2"
                />
              </div>

              <div className="grid gap-6 md:grid-cols-3 mt-6">
                <div className="flex flex-col items-center justify-center p-4 border rounded-lg">
                  <CheckCircle2 className="h-8 w-8 text-green-500 mb-2" />
                  <div className="text-2xl font-bold">{stats.approvedStudents}</div>
                  <div className="text-sm text-muted-foreground">Approved for Stipend</div>
                </div>
                <div className="flex flex-col items-center justify-center p-4 border rounded-lg">
                  <Clock className="h-8 w-8 text-yellow-500 mb-2" />
                  <div className="text-2xl font-bold">{stats.pendingApprovals}</div>
                  <div className="text-sm text-muted-foreground">Pending Review</div>
                </div>
                <div className="flex flex-col items-center justify-center p-4 border rounded-lg">
                  <XCircle className="h-8 w-8 text-red-500 mb-2" />
                  <div className="text-2xl font-bold">{stats.rejectedStudents}</div>
                  <div className="text-sm text-muted-foreground">Not Eligible</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pending Stipend Approvals</CardTitle>
            <CardDescription>Students awaiting stipend eligibility approval</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead className="hidden md:table-cell">Department</TableHead>
                  <TableHead className="hidden md:table-cell">Duration</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingApprovals.length > 0 ? (
                  pendingApprovals.map((student) => (
                    <TableRow key={student._id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{student.name}</div>
                          <div className="text-xs text-muted-foreground">{student.matricNumber}</div>
                        </div>
                      </TableCell>
                      <TableCell>{student.company || "Not assigned"}</TableCell>
                      <TableCell className="hidden md:table-cell">{student.department}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        {student.startDate && student.endDate
                          ? `${new Date(student.startDate).toLocaleDateString()} - ${new Date(student.endDate).toLocaleDateString()}`
                          : "Not specified"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="success"
                            size="sm"
                            onClick={() => router.push(`/itf/approvals/${student._id}`)}
                          >
                            <CheckCircle2 className="h-4 w-4" />
                            <span className="sr-only md:not-sr-only md:ml-2">Approve</span>
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => router.push(`/itf/approvals/${student._id}`)}
                          >
                            <XCircle className="h-4 w-4" />
                            <span className="sr-only md:not-sr-only md:ml-2">Reject</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      No pending approvals
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <div className="mt-4 flex justify-end">
              <Button variant="outline" onClick={() => router.push("/itf/approvals")} className="gap-2">
                <DollarSign className="h-4 w-4" />
                View All Approvals
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance Summary</CardTitle>
            <CardDescription>Overall student performance metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center">
              <BarChart3 className="h-16 w-16 text-muted-foreground/50" />
            </div>
            <div className="mt-4 flex justify-end">
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export Report
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

