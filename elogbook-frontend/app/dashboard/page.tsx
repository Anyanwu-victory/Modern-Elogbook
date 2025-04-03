"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Activity, AlertCircle, Calendar, CheckCircle2, Clock, FileText, Info, Loader2, XCircle 
} from "lucide-react";

import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockUser } from "@/pages/api/mock-data";

interface LogEntry {
  id: number;
  day: string;
  date: string;
  status: "approved" | "pending" | "rejected";
}

interface Notification {
  id: number;
  type: "info" | "success" | "error";
  message: string;
  date: string;
}

export default function StudentDashboard() {
  const router = useRouter();
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [loading, setLoading] = useState(true);

  // Mock data
  const isLoaded = true;
  const user = mockUser;
  const currentWeek = 3;
  const totalWeeks = 24;
  const progressPercentage = (currentWeek / totalWeeks) * 100;

  const recentLogs: LogEntry[] = [
    { id: 1, day: "Monday", date: "2025-03-24", status: "approved" },
    { id: 2, day: "Wednesday", date: "2025-03-26", status: "pending" },
    { id: 3, day: "Friday", date: "2025-03-28", status: "rejected" },
  ];

  const notifications: Notification[] = [
    { id: 1, type: "info", message: "Your supervisor has scheduled a visit for next week", date: "2025-03-29" },
    { id: 2, type: "success", message: "Your log for Monday has been approved", date: "2025-03-25" },
    { id: 3, type: "error", message: "Your log for Friday needs revision", date: "2025-03-28" },
  ];

  useEffect(() => {
    if (isLoaded) {
      setIsProfileComplete(false);
      setLoading(false);
    }
  }, [isLoaded]);

  if (loading) {
    return (
      <DashboardLayout userRole="student">
        <div className="flex items-center justify-center h-[calc(100vh-10rem)]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userRole="student">
      <Header user={user} router={router} />
      {!isProfileComplete && <ProfileAlert router={router} />}
      <DashboardContent 
        progressPercentage={progressPercentage} 
        currentWeek={currentWeek} 
        totalWeeks={totalWeeks} 
        recentLogs={recentLogs} 
        notifications={notifications} 
        router={router} 
      />
    </DashboardLayout>
  );
}

function Header({ user, router }: { user: any; router: any }) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Student Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {user?.firstName || "Student"}!</p>
      </div>
      <Button onClick={() => router.push("/dashboard/submit-log")}>Submit New Log</Button>
    </div>
  );
}

function ProfileAlert({ router }: { router: any }) {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Complete Your Profile</AlertTitle>
      <AlertDescription>
        Please complete your profile to start submitting logs.
        <Button variant="link" className="p-0 h-auto font-semibold ml-2" onClick={() => router.push("/dashboard/profile")}>
          Complete Now
        </Button>
      </AlertDescription>
    </Alert>
  );
}

function DashboardContent({ progressPercentage, currentWeek, totalWeeks, recentLogs, notifications, router }: any) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Progress Tracker</CardTitle>
          <CardDescription>Week {currentWeek} of {totalWeeks}</CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={progressPercentage} className="h-2" />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Recent Logs</CardTitle>
        </CardHeader>
        <CardContent>
          {recentLogs.map((log: LogEntry) => (
            <div key={log.id} className="flex justify-between">
              <span>{log.day}, {log.date}</span>
              <Badge variant={log.status === "approved" ? "success" : log.status === "pending" ? "outline" : "destructive"}>{log.status}</Badge>
            </div>
          ))}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          {notifications.map((notification: Notification) => (
            <Alert key={notification.id} variant={notification.type === "error" ? "destructive" : "default"}>
              {notification.message}
            </Alert>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
