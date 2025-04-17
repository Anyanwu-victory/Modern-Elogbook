"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Calendar, CheckCircle2, ChevronLeft, ChevronRight, Clock, Download, FileText, Loader2, Save, Search, XCircle } from 'lucide-react'

import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"

// Mock data for student logs grouped by week
const mockWeeklyLogs = [
  {
    id: "week-1",
    weekNumber: 1,
    startDate: "2025-03-24",
    endDate: "2025-03-30",
    student: {
      id: "student-1",
      name: "John Doe",
      matricNumber: "MIU/2023/001",
    },
    logs: [
      {
        id: 1,
        day: "Monday",
        date: "2025-03-24",
        activity: "Attended orientation and was introduced to the team. Learned about the company's products and services.",
        status: "pending",
      },
      {
        id: 2,
        day: "Wednesday",
        date: "2025-03-26",
        activity: "Worked on database design for the new customer management system. Created ER diagrams and discussed with the senior developer.",
        status: "pending",
      },
      {
        id: 3,
        day: "Friday",
        date: "2025-03-28",
        activity: "Implemented the login functionality for the customer management system. Tested the authentication flow.",
        status: "pending",
      },
    ],
    status: "pending",
    supervisorComment: "",
    supervisorSignature: null,
  },
  {
    id: "week-2",
    weekNumber: 2,
    startDate: "2025-03-31",
    endDate: "2025-04-06",
    student: {
      id: "student-1",
      name: "John Doe",
      matricNumber: "MIU/2023/001",
    },
    logs: [
      {
        id: 4,
        day: "Monday",
        date: "2025-03-31",
        activity: "Fixed the authentication issues by implementing JWT tokens. Successfully completed the login functionality.",
        status: "pending",
      },
      {
        id: 5,
        day: "Wednesday",
        date: "2025-04-02",
        activity: "Started working on the user profile page. Created wireframes and discussed with the UI/UX team.",
        status: "pending",
      },
      {
        id: 6,
        day: "Friday",
        date: "2025-04-04",
        activity: "Implemented the user profile page with edit functionality. Added form validation and error handling.",
        status: "pending",
      },
    ],
    status: "pending",
    supervisorComment: "",
    supervisorSignature: null,
  },
]

// Form schema for weekly review
const weeklyReviewSchema = z.object({
  supervisorComment: z.string().min(10, { message: "Comment must be at least 10 characters." }),
  supervisorSignature: z.any().optional(),
})

type WeeklyReviewFormValues = z.infer<typeof weeklyReviewSchema>

export default function ReviewLogsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [weeklyLogs, setWeeklyLogs] = useState<any[]>([])
  const [selectedWeek, setSelectedWeek] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [signaturePreview, setSignaturePreview] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const itemsPerPage = 5

  // Initialize form
  const form = useForm<WeeklyReviewFormValues>({
    resolver: zodResolver(weeklyReviewSchema),
    defaultValues: {
      supervisorComment: "",
      supervisorSignature: undefined,
    },
  })

  // Load mock data
  useEffect(() => {
    setTimeout(() => {
      setWeeklyLogs(mockWeeklyLogs)
      setLoading(false)
    }, 1000)
  }, [])

  // Filter logs based on search term and status
  const filteredWeeks = weeklyLogs.filter((week) => {
    const matchesSearch =
      week.student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      week.student.matricNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `Week ${week.weekNumber}`.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || week.status === statusFilter

    return matchesSearch && matchesStatus
  })

  // Paginate logs
  const totalPages = Math.ceil(filteredWeeks.length / itemsPerPage)
  const paginatedWeeks = filteredWeeks.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleSelectWeek = (week: any) => {
    setSelectedWeek(week)
    form.reset({
      supervisorComment: week.supervisorComment || "",
      supervisorSignature: undefined,
    })
  }

  const handleSignatureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        setSignaturePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
      form.setValue("supervisorSignature", file)
    }
  }

  const onSubmit = (data: WeeklyReviewFormValues) => {
    if (!selectedWeek) return

    setIsSubmitting(true)

    // In a real application, you would send this data to your backend
    setTimeout(() => {
      // Update the selected week with the review data
      const updatedWeeks = weeklyLogs.map((week) => {
        if (week.id === selectedWeek.id) {
          return {
            ...week,
            supervisorComment: data.supervisorComment,
            supervisorSignature: signaturePreview,
            status: "approved",
            logs: week.logs.map((log: any) => ({ ...log, status: "approved" })),
          }
        }
        return week
      })

      setWeeklyLogs(updatedWeeks)
      setSelectedWeek(null)
      setSignaturePreview(null)
      form.reset()
      setIsSubmitting(false)

      toast({
        title: "Weekly review submitted",
        description: "Your review has been successfully submitted.",
      })
    }, 1500)
  }

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
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Review Student Logs</h1>
            <p className="text-muted-foreground">Review and approve weekly logs submitted by your students.</p>
          </div>
        </div>

        <Tabs defaultValue="weekly" className="space-y-4">
          <TabsList>
            <TabsTrigger value="weekly">Weekly Review</TabsTrigger>
            <TabsTrigger value="all">All Logs</TabsTrigger>
          </TabsList>

          <TabsContent value="weekly" className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by student name or week..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="w-full md:w-[200px]">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {paginatedWeeks.length > 0 ? (
                paginatedWeeks.map((week) => (
                  <Card key={week.id} className={week.status === "approved" ? "border-green-500" : ""}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>Week {week.weekNumber}</CardTitle>
                          <CardDescription>
                            {new Date(week.startDate).toLocaleDateString()} - {new Date(week.endDate).toLocaleDateString()}
                          </CardDescription>
                        </div>
                        <Badge
                          variant={
                            week.status === "approved" ? "success" : week.status === "pending" ? "outline" : "destructive"
                          }
                          className={
                            week.status === "approved"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                              : ""
                          }
                        >
                          {week.status === "approved" ? (
                            <CheckCircle2 className="mr-1 h-3 w-3" />
                          ) : week.status === "pending" ? (
                            <Clock className="mr-1 h-3 w-3" />
                          ) : (
                            <XCircle className="mr-1 h-3 w-3" />
                          )}
                          {week.status.charAt(0).toUpperCase() + week.status.slice(1)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">{week.student.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{week.student.matricNumber}</span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {week.logs.length} log entries
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        variant={week.status === "approved" ? "outline" : "default"} 
                        className="w-full"
                        onClick={() => handleSelectWeek(week)}
                      >
                        {week.status === "approved" ? "View Review" : "Review Week"}
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <div className="md:col-span-3 text-center py-8 text-muted-foreground">
                  No weekly logs found matching your filters.
                </div>
              )}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="sr-only">Previous page</span>
                </Button>
                <div className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                  <span className="sr-only">Next page</span>
                </Button>
              </div>
            )}

            {selectedWeek && (
              <Card>
                <CardHeader>
                  <CardTitle>Weekly Review - Week {selectedWeek.weekNumber}</CardTitle>
                  <CardDescription>
                    {new Date(selectedWeek.startDate).toLocaleDateString()} - {new Date(selectedWeek.endDate).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Student Information</h3>
                    <div className="grid gap-2 md:grid-cols-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Name:</span>
                        <span>{selectedWeek.student.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Matric Number:</span>
                        <span>{selectedWeek.student.matricNumber}</span>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-lg font-medium mb-4">Daily Logs</h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Day</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Activity</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedWeek.logs.map((log: any) => (
                          <TableRow key={log.id}>
                            <TableCell>{log.day}</TableCell>
                            <TableCell>{new Date(log.date).toLocaleDateString()}</TableCell>
                            <TableCell className="max-w-[400px]">{log.activity}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-lg font-medium mb-4">Supervisor Review</h3>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                          control={form.control}
                          name="supervisorComment"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Weekly Comment</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Provide your feedback on the student's performance for this week..."
                                  className="min-h-[100px]"
                                  {...field}
                                  disabled={selectedWeek.status === "approved"}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {selectedWeek.status !== "approved" && (
                          <FormField
                            control={form.control}
                            name="supervisorSignature"
                            render={({ field: { value, onChange, ...field } }) => (
                              <FormItem>
                                <FormLabel>Signature</FormLabel>
                                <FormControl>
                                  <Input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleSignatureChange}
                                    className="cursor-pointer"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                                {signaturePreview && (
                                  <div className="mt-2">
                                    <p className="text-sm text-muted-foreground mb-1">Signature Preview:</p>
                                    <img
                                      src={signaturePreview || "/placeholder.svg"}
                                      alt="Signature Preview"
                                      className="max-h-[100px] border rounded-md"
                                    />
                                  </div>
                                )}
                              </FormItem>
                            )}
                          />
                        )}

                        {selectedWeek.status === "approved" && selectedWeek.supervisorSignature && (
                          <div>
                            <h4 className="text-sm font-medium mb-2">Your Signature</h4>
                            <div className="border rounded-md p-3 max-w-[300px]">
                              <img
                                src={selectedWeek.supervisorSignature || "/placeholder.svg"}
                                alt="Supervisor Signature"
                                className="max-h-[100px]"
                              />
                            </div>
                          </div>
                        )}

                        <div className="flex justify-end gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              setSelectedWeek(null)
                              setSignaturePreview(null)
                              form.reset()
                            }}
                          >
                            Cancel
                          </Button>
                          {selectedWeek.status !== "approved" && (
                            <Button type="submit" disabled={isSubmitting}>
                              {isSubmitting ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Submitting...
                                </>
                              ) : (
                                <>
                                  <Save className="mr-2 h-4 w-4" />
                                  Submit Review
                                </>
                              )}
                            </Button>
                          )}
                        </div>
                      </form>
                    </Form>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="all">
            <Card>
              <CardHeader>
                <CardTitle>All Daily Logs</CardTitle>
                <CardDescription>View all individual log entries from your students.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search logs..."
                      className="pl-8"
                    />
                  </div>
                  <div className="w-full md:w-[200px]">
                    <Select defaultValue="all">
                      <SelectTrigger>
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Activity</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockWeeklyLogs.flatMap(week => 
                      week.logs.map((log: any) => (
                        <TableRow key={log.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{week.student.name}</div>
                              <div className="text-xs text-muted-foreground">{week.student.matricNumber}</div>
                            </div>
                          </TableCell>
                          <TableCell>{new Date(log.date).toLocaleDateString()}</TableCell>
                          <TableCell className="max-w-[300px] truncate">{log.activity}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                log.status === "approved" ? "success" : log.status === "pending" ? "outline" : "destructive"
                              }
                              className={
                                log.status === "approved"
                                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                  : ""
                              }
                            >
                              {log.status === "approved" ? (
                                <CheckCircle2 className="mr-1 h-3 w-3" />
                              ) : log.status === "pending" ? (
                                <Clock className="mr-1 h-3 w-3" />
                              ) : (
                                <XCircle className="mr-1 h-3 w-3" />
                              )}
                              {log.status.charAt(0).toUpperCase() + log.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="outline" size="sm">
                              View Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
