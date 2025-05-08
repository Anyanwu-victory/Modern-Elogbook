"use client"

import React from "react"
import { MobileMenu } from "./MobileMenu"
import { useUser } from "@clerk/nextjs"
import {UserResource} from "@clerk/types"
import { TabValue } from "./DashboardLayout"
import { ModeToggle } from "../mood-toggle"
import  { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "../ui/button"
import { ChevronDown } from "lucide-react"
import { LogOut, Users } from "lucide-react"
import { useRouter } from "next/navigation"

export interface HeaderProps {
  tabs: { 
    value: string; 
    name: string; 
    icon: React.ElementType<any> }[]
  activeTab: TabValue
  setActiveTab: (value: TabValue) => void
  user?: UserResource | null
  onLogout: () => void
}

export function Header({ tabs, activeTab, setActiveTab, user,  onLogout }: HeaderProps) {
  //const { user } = useUser() //removed md:pl:60

  return (
    <header className="sticky top-0 z-40 w-full lg:w-full"> 
      <div className="flex h-16 items-center justify-between px-4 border-b bg-background">
        <MobileMenu
          tabs={tabs}
          activeTab={activeTab}
          setActiveTab={(value) => setActiveTab(value as TabValue)}
          handleLogout={onLogout}
        />
        <div className="flex items-center space-x-4">
          <div className="text-sm font-medium text-[#fff]">{user?.firstName}</div>
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
                  <DropdownMenuItem onClick={onLogout}>
                     <LogOut className="mr-2 h-4 w-4" /> Logout
                      </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

      </div>
    </header>
  )
}
