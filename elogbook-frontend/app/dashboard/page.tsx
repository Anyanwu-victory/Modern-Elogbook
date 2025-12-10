"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Activity,
  AlertCircle,
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
  Info,
  Loader2,
  XCircle,
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useUser } from "@clerk/nextjs";
import { useToast } from "@/components/ui/use-toast";
import { getStudentLogsQuery } from "@/sanity/lib/sanity.queries";
import { getClient } from "@/sanity/lib/sanity.client";

// Mock user data

interface Log {
  _id: string;
  title: string;
  date: string;
  day: string;
  activities: string;
  status: string;
}

/**
 * Returns the ISO-like week number for a given date.
 * 
 * The calculation works by:
 * 1. Getting the first day of the year.
 * 2. Calculating how many full days have passed since the start of the year.
 * 3. Adjusting for the weekday of the first day of the year.
 * 4. Dividing the total days by 7 and rounding up to get the week number.
 * 
 * @param date - The date for which to calculate the week number.
 * @returns The week number (starting from 1).
 */
export function getWeekNumber(date: Date): number {
  const startOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date.getTime() - startOfYear.getTime()) / 86400000;
  return Math.ceil((pastDaysOfYear + startOfYear.getDay() + 1) / 7);
}


export default function StudentDashboard() {
  const router = useRouter();
  const { user, isLoaded, isSignedIn } = useUser();
  const [logs, setLogs] = useState<Log[]>([]);
  const [isProfileComplete, setIsProfileComplete] = useState(true);
  const { toast } = useToast();
  const [currentWeekLogs, setCurrentWeekLogs] = useState<Log[]>([])
  const [weekNumber, setWeekNumber] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [progressPercentage, setProgressPercentage] = useState<number>(0)

  //console.log(user?.firstName)
  console.log(user); // Instead of user.firstName

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
  ];

  useEffect(() => {
    const fetchLogs = async () => {
      if (!user?.id) return;

      if (!isSignedIn || !user) {
        toast({
          title: "Error",
          description: "Please sign in to submit logs",
          variant: "destructive",
        });
        return;
      }

      try {
        const client = getClient(); // no token needed for read
        const query = getStudentLogsQuery(user.id);
        const result = await client.fetch(query);
        const currentDate = new Date();
        const currentWeek = getWeekNumber(currentDate);
        const totalWeeks = getTotalWeeksInYear(currentDate.getFullYear()); // Assuming 52 weeks in a year
        const progress = (result.length / totalWeeks) * 100; // Calculate progress based on logs submitted
        setProgressPercentage(progress);
        setWeekNumber(currentWeek)


        
          // Filter logs for the current week
        const filteredLogs = result.filter((log: Log) => {
          const logDate = new Date(log.date);
          return getWeekNumber(logDate) === currentWeek;
        });
        setCurrentWeekLogs(filteredLogs);

        setLogs(result);
      } catch (error) {
        console.error("Failed to fetch logs:", error);
      } finally {
        setLoading(false);
      }
    };
    if (isLoaded) {
      setIsProfileComplete(false);
      fetchLogs();
    }
  }, [isLoaded, user]);

  if (loading) {
    return (
      //  <DashboardLayout userRole="student">
      <div className="flex items-center justify-center h-[calc(100vh-10rem)]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
      //</DashboardLayout>
    );
  }

  return (
    //<DashboardLayout userRole="student">
    <div className="space-y-6 px-5 lg:px-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Student Dashboard
          </h1>
          <p className="text-muted-foreground">
            Welcome back, {String(user?.unsafeMetadata.firstName) || "Student"}!
          </p>
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
              Week {weekNumber} of {getTotalWeeksInYear(new Date().getFullYear())}
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

{/* Displays the week work and week number */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Week's Work </CardTitle>
            <CardDescription>Week Number: {weekNumber || "Loading..."}  </CardDescription>
          </CardHeader>
          {/* Shows how many logs you have submitted for the week  */}
          <CardContent>
            {currentWeekLogs.length > 0 ? (
          <div className="space-y-3">
            {currentWeekLogs.map((log) => (
              <div key={log._id} className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">
                {log.day}, {new Date(log.date).toLocaleDateString()} 
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No logs submitted this week.</p>
        )}
          </CardContent>
        </Card>


        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Weekly Summary</CardTitle>
            <CardDescription>Current week statistics</CardDescription>
          </CardHeader>
          <CardContent>
            {logs.length > 0 ? (
              <div>
                {(() => {
                  // Count the number of logs for each status
                  const statusCounts = logs.reduce(
                    (acc, log) => {
                      if (log.status === "approved") acc.approved += 1;
                      if (log.status === "pending") acc.pending += 1;
                      if (log.status === "reviewed") acc.reviewed += 1;
                      return acc;
                    },
                    { approved: 0, pending: 0, reviewed: 0 } // Initial counts
                  );

                  return (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          <span className="text-sm">Approved</span>
                        </div>
                        <Badge>{statusCounts.approved}</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-yellow-500" />
                          <span className="text-sm">Pending</span>
                        </div>
                        <Badge variant="outline">{statusCounts.pending}</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <XCircle className="h-4 w-4 text-red-500" />
                          <span className="text-sm">Reviewed</span>
                        </div>
                        <Badge variant="destructive">
                          {statusCounts.reviewed}
                        </Badge>
                      </div>
                    </div>
                  );
                })()}
              </div>
            ) : (
              <div className="flex items-center justify-center h-32">
                <p className="text-sm text-muted-foreground">
                  No logs submitted this week
                </p>
              </div>
            )}
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
              {logs.length > 0 ? (
                <div>
                  {logs.map((log) => (
                    <div
                      key={log._id}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">{log.day}</p>
                          <p className="text-xs text-muted-foreground">
                            {log.date}
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant={
                          log.status === "approved"
                            ? "success"
                            : log.status === "pending"
                              ? "outline"
                              : "destructive"
                        }
                        className={
                          log.status === "approved"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                            : log.status === "pending"
                              ? ""
                              : ""
                        }
                      >
                        {/* {log.status.charAt(0).toUpperCase() + log.status.slice(1)} */}
                        {log.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-32">
                  <p className="text-sm text-muted-foreground">
                    No recent logs submitted
                  </p>
                </div>
              )}

              <Button
                variant="outline"
                className="w-full"
                onClick={() => router.push("/dashboard/my-logs")}
              >
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
                  <AlertTitle className="text-sm font-medium">
                    {notification.message}
                  </AlertTitle>
                  <AlertDescription className="text-xs">
                    {notification.date}
                  </AlertDescription>
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
    //    </DashboardLayout>
  );
}

function getStatusClass(status: string) {
  switch (status) {
    case "approved":
      return "text-green-600";
    case "pending":
      return "text-yellow-600";
    case "reviewed":
      return "text-red-600";
    default:
      return "text-gray-600";
  }
}


// Utility function to calculate the total number of weeks in a year
function getTotalWeeksInYear(year: number): number {
  const lastDayOfYear = new Date(year, 11, 31);
  return getWeekNumber(lastDayOfYear);
}