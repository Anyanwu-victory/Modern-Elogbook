// components/dashboard/DashboardLayout.tsx
"use client"

import React, { useState, useEffect } from "react"
import { useUser } from "@clerk/nextjs";
import { ModeToggle } from "../mood-toggle";
import { Sidebar } from "./Sidebar";
import {Header} from "./Header";
import { useRouter } from "next/navigation";
import { MobileMenu } from "./MobileMenu";
import SubmitLogPage from "@/app/dashboard/submit-logs/page"
import StudentDashboard from "@/app/dashboard/page"
import MyLogsPage from "@/app/dashboard/my-logs/page"
import AdminUserDashboard from "@/app/admin/users/page"
import { TABS } from "../tabs"


interface DashboardLayoutProps {
  children: React.ReactNode
  userRole:
    | "student"
    | "industrySupervisor"
    | "instituteSupervisor"
    | "itfPersonnel"
    | "admin"
}

export type TabValue =
  | "dashboard"
  | "admin"
  | "industrySupervisor"
  | "instituteSupervisor"
  | "itfPersonnel"
  | "submit-logs"
  | "my-logs"
  | "profile"
  | "students"
  | "review-logs"
  | "calendar"
  | "users"
  | "analytics"
  | "settings"

export default function DashboardLayout({ children, userRole }: DashboardLayoutProps) {
  const [isMounted, setIsMounted] = useState(false)
  const router = useRouter() 
  const [activeTab, setActiveTab] = useState<TabValue>("dashboard")
  const { user } = useUser()


  useEffect(() => setIsMounted(true), [])
  if (!isMounted) return null

  const handleLogout = () =>{
    router.push("/")
    console.log("Logging out...")
  } 

  const tabs = TABS[userRole] || []

  const TAB_CONTENT: Record<TabValue, React.ReactNode> = {
    dashboard: <StudentDashboard/>,
    admin: <>{children}</>,
    industrySupervisor: <>{children}</>,
    instituteSupervisor: <>{children}</>,
    itfPersonnel: <>{children}</>,
    "submit-logs": <SubmitLogPage/>,
    "my-logs": <MyLogsPage />,
    profile: <>{children}</>,
    students: <>{children}</>,
    "review-logs": <>{children}</>,
    calendar: <>{children}</>,
    users: <AdminUserDashboard />,
    analytics: <>{children}</>,
    settings: <>{children}</>,
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar tabs={tabs} activeTab={activeTab} setActiveTab={(value) => setActiveTab (value as TabValue)} user={user} onLogout={handleLogout} />
      <div className="flex-1 md:ml-64">
        <Header user={user} activeTab={activeTab} setActiveTab={(value) => setActiveTab(value as TabValue)} onLogout={handleLogout} tabs={tabs} />
        <main className="flex-1 container py-6">
          {TAB_CONTENT[activeTab]}
        </main>
        <footer className="w-full border-t py-4">
          <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} E-Logbook System. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </div>
  )
}
