"use client"

import React, { useState, useEffect } from "react"
import {
  BarChart3,
  BookOpen,
  Calendar,
  ChevronDown,
  ClipboardList,
  FileText,
  Home,
  LogOut,
  Menu,
  Settings,
  Users,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useUser } from "@clerk/nextjs" 
import SubmitLogPage from "@/app/dashboard/submit-logs/page"
import MyLogsPage from "@/app/dashboard/my-logs/page"
import AdminUserDashboard from "@/app/admin/users/page"
import { ModeToggle } from "./mood-toggle"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


const mockUser = {
  firstName: "Demo",
  fullName: "Demo User",
  primaryEmailAddress: { emailAddress: "demo@example.com" },
}

interface DashboardLayoutProps {
  children: React.ReactNode
  userRole:
    | "student"
    | "industrySupervisor"
    | "instituteSupervisor"
    | "itfPersonnel"
    | "admin"
}

type TabValue =
  | "dashboard"
  | "submit-logs"
  | "my-logs"
  | "profile"
  | "students"
  | "review-logs"
  | "calendar"
  | "users"
  | "analytics"
  | "settings"

const TABS = {
  student: [
    { value: "dashboard", name: "Dashboard", icon: Home },
    { value: "submit-logs", name: "Submit Logs", icon: FileText },
    { value: "my-logs", name: "My Logs", icon: ClipboardList },
    { value: "profile", name: "Profile", icon: Users },
  ],
  admin: [
    { value: "dashboard", name: "Dashboard", icon: Home },
    { value: "users", name: "Users", icon: Users },
    { value: "my-logs", name: "Logs", icon: BookOpen },
    { value: "analytics", name: "Analytics", icon: BarChart3 },
    { value: "settings", name: "Settings", icon: Settings },
  ],
  institute: [

  ],
  itf: [
    
  ],
  supervisor: [
    { value: "dashboard", name: "Dashboard", icon: Home },
    { value: "students", name: "Students", icon: Users },
    { value: "review-logs", name: "Review Logs", icon: ClipboardList },
    { value: "calendar", name: "Calendar", icon: Calendar },
  ],
}

export function DashboardLayout({ children, userRole }: DashboardLayoutProps) {
  const [isMounted, setIsMounted] = useState(false)
  const [activeTab, setActiveTab] = useState<TabValue>("dashboard")
  const { user } = useUser()
  const isAdmin = userRole === "admin"
  const isStudent = userRole === "student"
  const tabs = isStudent ? TABS.student : isAdmin ? TABS.admin : TABS.supervisor

  useEffect(() => setIsMounted(true), [])
  if (!isMounted) return null

  const handleLogout = () => console.log("Logging out...")

  
const TAB_CONTENT: Record<TabValue, React.ReactNode> = {
  //dashboard: <div> dash</div>,
  dashboard: <>{children}</>,
  "submit-logs": <><SubmitLogPage/> </>,
  "my-logs": <> <MyLogsPage/> </>,
  profile: <>{children}</>,
  students: <>{children}</>,
  "review-logs": <>{children}</>,
  calendar: <>{children}</>,
  users: <><AdminUserDashboard/> </>,
  analytics: <>{children}</>,
  settings: <>{children}</>,
}

  const renderSidebar = () => (
    <div className="hidden md:flex md:w-60 md:flex-col md:fixed md:inset-y-0 border-r">
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-center h-16 px-4 border-b">
          <div className="flex items-center gap-2 font-semibold">
            <BookOpen className="h-6 w-6" /> E-Logbook
          </div>
        </div>
        <nav className="flex-1 px-2 py-4 space-y-1 ">
          {tabs.map((tab) => (
            <Button
              key={tab.value}
              variant="ghost"
              className={cn(
                "w-full justify-start gap-3 px-3 py-2 text-sm font-medium rounded-md mx-2",
                activeTab === tab.value
                  ? "bg-primary text-primary-foreground "
                  : "text-muted-foreground  hover:bg-muted hover:text-foreground"
              )}
              onClick={() => setActiveTab(tab.value as TabValue)}
            >
              <tab.icon className="h-5 w-5" /> {tab.name}
            </Button>
          ))}
        </nav>
        <div className="p-4 border-t">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
             {user?.firstName?.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.fullName}</p>
              <p className="text-xs text-muted-foreground truncate">
                {user?.primaryEmailAddress?.emailAddress}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="flex min-h-screen">
      {renderSidebar()}
      <div className="flex-1 md:ml-64">
        <header className="sticky top-0 z-40 w-full px-3 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 lg:px-10">
          <div className="container flex h-14 items-center justify-between">
            <div className="flex items-center gap-2 md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle navigation menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[240px] sm:w-[300px]">
                  <nav className="flex flex-col gap-4 py-4 h-full">
                    <div className="flex items-center justify-center h-16 px-4 border-b mb-4">
                      <div className="flex items-center gap-2 font-semibold">
                        <BookOpen className="h-6 w-6" /> E-Logbook
                      </div>
                    </div>
                    <div className="flex-1">
                      {tabs.map((tab) => (
                        <Button
                          key={tab.value}
                          variant="ghost"
                          className={cn(
                            "w-full justify-start gap-3 px-3 py-2 text-sm font-medium rounded-md mx-2",
                            activeTab === tab.value
                              ? "bg-primary text-primary-foreground"
                              : "text-muted-foreground hover:bg-muted hover:text-foreground"
                          )}
                          onClick={() => setActiveTab(tab.value as TabValue)}
                        >
                          <tab.icon className="h-5 w-5" /> {tab.name}
                        </Button>
                      ))}
                    </div>
                    <div className="p-4 border-t">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                        {user?.firstName?.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{user?.fullName}</p>
                          <p className="text-xs text-muted-foreground truncate">
                            {user?.primaryEmailAddress?.emailAddress}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        className="flex items-center gap-2 w-full mt-3 justify-start"
                        onClick={handleLogout}
                      >
                        <LogOut className="h-4 w-4" /> Logout
                      </Button>
                    </div>
                  </nav>
                </SheetContent>
              </Sheet>
            </div>

            <div className="md:hidden">
              <Tabs
                value={activeTab}
                onValueChange={(value) => setActiveTab(value as TabValue)}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-2">
                  {tabs.slice(0, 2).map((tab) => (
                    <TabsTrigger key={tab.value} value={tab.value}>
                      {tab.name}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>

            <div className="flex items-center gap-2">
              <ModeToggle />
              <DropdownMenu>
                <DropdownMenuTrigger asChild >
                  <Button variant="ghost" size="sm" className="gap-1">
                    <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                      {user?.firstName?.charAt(0)}
                    </div>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setActiveTab("profile")}> <Users className="mr-2 h-4 w-4" /> Profile </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}> <LogOut className="mr-2 h-4 w-4" /> Logout </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        <main className="flex-1 container py-6">{TAB_CONTENT[activeTab]}</main>

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



