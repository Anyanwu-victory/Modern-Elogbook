"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle2, Clock, Loader2, Users, XCircle, Building } from "lucide-react"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {CompanyQuery} from "@/sanity/lib/sanity.queries";
import { SubmissionsQuery } from "@/sanity/lib/sanity.queries";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useUser } from "@clerk/nextjs";
import { useToast } from "@/components/ui/use-toast";
import { getStudentLogsQuery } from "@/sanity/lib/sanity.queries";
import { AssignedStudentsQuery } from "@/sanity/lib/sanity.queries";
import { getClient } from "@/sanity/lib/sanity.client";

interface CompanyInfo{
name: string;
address: string;
industry: string;
}

export default function IndustrySupervisorDashboard() {
  const router = useRouter()
  const {user, isSignedIn, isLoaded } = useUser()
  const [loading, setLoading] = useState(true)
  const { toast } = useToast();
  const [assignedStudents, setAssignedStudents] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalStudents: 0,
    pendingLogs: 0,
    approvedLogs: 0,
    rejectedLogs: 0,
    reviewedLogs: 0,
  })
  const [recentSubmissions, setRecentSubmissions] = useState<any[]>([])
  const [companyInfo, setCompanyInfo] = useState<any>(null)

  
useEffect(() => {
  const fetchData = async () => {
    if (!user?.id) return;

      if (!isLoaded || !user) {
        toast({
          title: "Error",
          description: "Please sign in to assigned students",
          variant: "destructive",
        });
        setLoading(false)
        return;
      }

    try {
      const client = getClient();
      const userId = user?.id // You should get this dynamically
      const [submissions, company, students] = await Promise.all([
        client.fetch(SubmissionsQuery, { userId }),
        client.fetch(CompanyQuery, { userId }),
        client.fetch(AssignedStudentsQuery, { userId }),
      ])

      setRecentSubmissions(
        submissions.map((s: { status: string; student?: { name?: string; matricNumber?: string } }) => ({
          ...s,
          student: {
            name: s.student?.name || "Unknown",
            matricNumber: s.student?.matricNumber || "N/A",
          },
        }))
      )

      setCompanyInfo(company);
      setAssignedStudents(students);

      

      setLoading(false)
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Error",
        description: "Failed to fetch data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  fetchData()
}, [user, isLoaded])

  

  if (loading) {
    return (
      //<DashboardLayout userRole="industrySupervisor"> 
        <div className="flex items-center justify-center h-[calc(100vh-10rem)]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      //</DashboardLayout>
    )
  }

  return (
    //<DashboardLayout userRole="industrySupervisor">
      <div className="space-y-6 px-5  lg:px-10 ">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Industry Supervisor Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user?.firstName || user?.username || "Supervisor"}!</p>
        </div>

        {companyInfo && (
          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
              <CardDescription>Your registered company details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 items-start">
                <div className="flex-shrink-0 w-16 h-16 rounded-md bg-muted flex items-center justify-center">
                  <Building className="h-8 w-8 text-muted-foreground" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">{companyInfo.name}</h3>
                  <p className="text-sm text-muted-foreground">{companyInfo.address}</p>
                  <div className="flex gap-2">
                    <Badge variant="outline">{companyInfo.industry || "Industry"}</Badge>
                    <Badge variant="outline">{companyInfo.size || "Size"}</Badge>
                  </div>
                </div>
                <div className="ml-auto">
                  <Button variant="outline" size="sm" onClick={() => router.push("/industry/company")}>
                    Edit Company Profile
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* total number of assigned students */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Assigned Students</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{assignedStudents.length}</div>
                <Users className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
         {/* total number of asigned students */}

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
                  {recentSubmissions.length > 0 ? (
                    recentSubmissions.map((submission) => (
                      <TableRow key={submission._id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{submission.student?.name || "Unknown Student"}</div>
                            <div className="text-xs text-muted-foreground">
                              {submission.student?.matricNumber || "N/A"}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{new Date(submission.date).toLocaleDateString()}</TableCell>
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
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.push(`/industry/review-logs/${submission._id}`)}
                          >
                            Review
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="h-24 text-center">
                        No submissions found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              <div className="mt-4 flex justify-end">
                <Button variant="outline" size="sm" onClick={() => router.push("/industry/review-logs")}>
                  View All
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Student Evaluations</CardTitle>
              <CardDescription>Performance evaluations for your students</CardDescription>
            </CardHeader>
            <CardContent>
              {stats.totalStudents > 0 ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b pb-4">
                    <div>
                      <div className="font-medium">John Doe</div>
                      <div className="text-xs text-muted-foreground">Mid-term evaluation due in 5 days</div>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => router.push("/industry/evaluations/create")}>
                      Evaluate
                    </Button>
                  </div>
                  <div className="flex items-center justify-between border-b pb-4">
                    <div>
                      <div className="font-medium">Jane Smith</div>
                      <div className="text-xs text-muted-foreground">Final evaluation due in 15 days</div>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => router.push("/industry/evaluations/create")}>
                      Evaluate
                    </Button>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <Button variant="outline" size="sm" onClick={() => router.push("/industry/evaluations")}>
                      View All Evaluations
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">No students assigned for evaluation</div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
   // </DashboardLayout>
  )
}

