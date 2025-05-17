"use client"

import React from "react"
import { BookOpen, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useUser } from "@clerk/nextjs"
import {UserResource} from "@clerk/types"
import { TabValue } from "./DashboardLayout"

export interface SidebarProps {
  tabs: { 
    value: string; 
    name: string; 
    icon: React.ElementType<any> }[]
  activeTab: TabValue
  setActiveTab: (value: TabValue) => void
  user?: UserResource | null
  onLogout: () => void
}

export function Sidebar({ tabs, activeTab, setActiveTab, user , onLogout }: SidebarProps) {
  //const { user } = useUser()

  return (
    <div className="hidden md:flex md:w-60 md:flex-col md:fixed md:inset-y-0 border-r">
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-center h-16 px-4 border-b">
          <div className="flex items-center gap-2 font-semibold">
            <BookOpen className="h-6 w-6" /> E-Logbook
          </div>
        </div>
        <nav className="flex-1 px-2 py-4 space-y-1">
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
        </nav>
        <div className="p-4 border-t">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
              {user?.firstName?.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.firstName}</p>
              <p className="text-xs text-muted-foreground truncate">
                {user?.primaryEmailAddress?.emailAddress}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            className="flex items-center gap-2 w-full mt-3 justify-start"
            onClick={onLogout}
          >
            <LogOut className="h-4 w-4" /> Logout
          </Button>
        </div>
      </div>
    </div>
  )
}
