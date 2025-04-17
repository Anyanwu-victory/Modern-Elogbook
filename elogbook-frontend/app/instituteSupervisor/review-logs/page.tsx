"use client"

import { useState, useEffect } from "react"
import { CheckCircle2, Clock, FileText, Loader2, Search, XCircle } from "lucide-react"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { useToast } from "@/hooks/use-toast"

// Mock data similar to industry supervisor page
const mockWeeklyLogs = [
  {
    weekNumber: 1,
    startDate: "2025-03-24",
    endDate: "2025-03-30",
    studentName: "John Doe",
    studentId: "MIU/2023/001",
    logs: [
      {
        id: 1,
        day: "Monday",
        date: "2025-03-24",
        activity:
          "Attended orientation and was introduced to the team. Learned about the company's products and services.",
        status: "approved",
      },
      {
        id: 2,
        day: "Wednesday",
        date: "2025-03-26",
        activity:
          "Worked on database design for the new customer management system. Created ER diagrams and discussed with the senior developer.",
        status: "approved",
      },
      {
        id: 3,
        day: "Friday",
        date: "2025-03-28",
        activity:
          "Implemented basic CRUD operations for the user management module. Wrote unit tests for the implemented functionality.",
        status: "approved",
      },
    ],
    supervisorComment:
      "Good progress for the first week. Keep up the good work and make sure to focus on more challenging tasks.",
    supervisorSignature: "/placeholder.svg?height=80&width=200",
    status: "approved",
    institutionComment: "",
    isReviewed: false,
  },
  {
    weekNumber: 2,
    startDate: "2025-03-31",
    endDate: "2025-04-06",
    studentName: "John Doe",
    studentId: "MIU/2023/001",
    logs: [
      {
        id: 4,
        day: "Monday",
        date: "2025-03-31",
        activity:
          "Fixed the authentication issues by implementing JWT tokens. Successfully completed the login functionality.",
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
        activity:
          "Implemented the user profile page with form validation. Added functionality to update user information.",
        status: "pending",
      },
    ],
    status: "pending",
    institutionComment: "",
    isReviewed: false,
  },
]

export default function InstitutionSupervisorReviewPage() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [weeklyLogs, setWeeklyLogs] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [expandedWeeks, setExpandedWeeks] = useState<number[]>([])
  const [comments, setComments] = useState<{ [key: number]: string }>({})

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      setWeeklyLogs(mockWeeklyLogs)

      // Initialize comments state
      const initialComments = mockWeeklyLogs.reduce(
        (acc, log) => {
          acc[log.weekNumber] = log.institutionComment || ""
          return acc
        },
        {} as { [key: number]: string },
      )

      setComments(initialComments)
      setLoading(false)
    }, 1000)
  }, [])

  // Filter logs based on search term and status
  const filteredLogs = weeklyLogs.filter((weekLog) => {
    const matchesSearch =
      weekLog.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      weekLog.studentId.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || weekLog.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const handleToggleExpand = (weekNumber: number) => {
    setExpandedWeeks((prev) =>
      prev.includes(weekNumber) ? prev.filter((w) => w !== weekNumber) : [...prev, weekNumber],
    )
  }

  const handleCommentChange = (weekNumber: number, value: string) => {
    setComments((prev) => ({
      ...prev,
      [weekNumber]: value,
    }))
  }

  const handleSubmitReview = (weekNumber: number) => {
    // In a real app, this would call an API to update the logs
    setWeeklyLogs((prevLogs) =>
      prevLogs.map((weekLog) => {
        if (weekLog.weekNumber === weekNumber) {
          return {
            ...weekLog,
            institutionComment: comments[weekNumber],
            isReviewed: true,
          }
        }
        return weekLog
      }),
    )

    toast({
      title: "Review submitted",
      description: `Your review for Week ${weekNumber} has been submitted.`,
    })
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <DashboardLayout userRole="institution_supervisor">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Review Student Logs</h1>
          <p className="text-muted-foreground">
            Review logs that have been approved by industry supervisors and add your comments.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by student name or ID..."
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

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredLogs.length > 0 ? (
          <div className="space-y-4">
            {filteredLogs.map((weeklyLog) => (
              <Card key={weeklyLog.weekNumber}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        Week {weeklyLog.weekNumber}
                        <Badge
                          variant={
                            weeklyLog.status === "approved"
                              ? "success"
                              : weeklyLog.status === "rejected"
                                ? "destructive"
                                : "outline"
                          }
                        >
                          {weeklyLog.status === "pending" ? (
                            <>
                              <Clock className="mr-1 h-3 w-3" /> Pending
                            </>
                          ) : weeklyLog.status === "approved" ? (
                            <>
                              <CheckCircle2 className="mr-1 h-3 w-3" /> Approved
                            </>
                          ) : (
                            <>
                              <XCircle className="mr-1 h-3 w-3" /> Rejected
                            </>
                          )}
                        </Badge>
                      </CardTitle>
                      <CardDescription>
                        {formatDate(weeklyLog.startDate)} - {formatDate(weeklyLog.endDate)}
                      </CardDescription>
                    </div>
                    <div>
                      <p className="text-sm font-medium">{weeklyLog.studentName}</p>
                      <p className="text-xs text-muted-foreground">{weeklyLog.studentId}</p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pb-2">
                  <Collapsible open={expandedWeeks.includes(weeklyLog.weekNumber)}>
                    <CollapsibleTrigger asChild>
                      <Button
                        variant="ghost"
                        className="w-full justify-between items-center rounded-none border-t border-b my-2"
                        onClick={() => handleToggleExpand(weeklyLog.weekNumber)}
                      >
                        <span>View Daily Logs</span>
                        {expandedWeeks.includes(weeklyLog.weekNumber) ? "Hide" : "Show"}
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="space-y-3 mt-2 mb-4">
                        {weeklyLog.logs.map((log) => (
                          <div key={log.id} className="border rounded-md p-3">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h4 className="font-medium">{log.day}</h4>
                                <p className="text-xs text-muted-foreground">{formatDate(log.date)}</p>
                              </div>
                              <Badge
                                variant={
                                  log.status === "approved"
                                    ? "success"
                                    : log.status === "rejected"
                                      ? "destructive"
                                      : "outline"
                                }
                              >
                                {log.status}
                              </Badge>
                            </div>
                            <p className="text-sm whitespace-pre-line">{log.activity}</p>
                            {log.imageUrl && (
                              <div className="mt-2">
                                <p className="text-xs text-muted-foreground mb-1">Attached Image:</p>
                                <img
                                  src={log.imageUrl || "/placeholder.svg"}
                                  alt="Log attachment"
                                  className="max-h-[150px] rounded border"
                                />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>

                  {weeklyLog.status === "approved" && (
                    <div className="space-y-4 pt-2">
                      <div className="border rounded-md p-3 bg-muted/20">
                        <h4 className="font-medium mb-1">Industry Supervisor Comments</h4>
                        <p className="text-sm">{weeklyLog.supervisorComment || "No comments provided."}</p>
                      </div>

                      {weeklyLog.supervisorSignature && (
                        <div className="border rounded-md p-3 bg-muted/20">
                          <h4 className="font-medium mb-1">Industry Supervisor Signature</h4>
                          <img
                            src={weeklyLog.supervisorSignature || "/placeholder.svg"}
                            alt="Supervisor Signature"
                            className="h-16 max-w-[200px] object-contain"
                          />
                        </div>
                      )}

                      <div>
                        <h4 className="font-medium mb-1">Institution Supervisor Comments</h4>
                        <Textarea
                          placeholder="Add your comments about this week's logs..."
                          value={comments[weeklyLog.weekNumber] || ""}
                          onChange={(e) => handleCommentChange(weeklyLog.weekNumber, e.target.value)}
                          className="min-h-[100px]"
                          disabled={weeklyLog.isReviewed}
                        />
                      </div>
                    </div>
                  )}
                </CardContent>

                {weeklyLog.status === "approved" && !weeklyLog.isReviewed && (
                  <CardFooter className="pt-2">
                    <Button
                      onClick={() => handleSubmitReview(weeklyLog.weekNumber)}
                      disabled={!comments[weeklyLog.weekNumber]}
                      className="ml-auto"
                    >
                      Submit Review
                    </Button>
                  </CardFooter>
                )}
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
            <FileText className="h-12 w-12 mb-4 opacity-20" />
            <p>No logs found matching your filters.</p>
            <Button
              variant="link"
              onClick={() => {
                setSearchTerm("")
                setStatusFilter("all")
              }}
            >
              Clear filters
            </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
