"use client"

import React from "react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface MobileMenuProps {
  tabs: { value: string; name: string; icon: React.ElementType }[]
  activeTab: string
  setActiveTab: (value: string) => void
  handleLogout: () => void
}

export function MobileMenu({ tabs, activeTab, setActiveTab, handleLogout }: MobileMenuProps) {
  return (
    <div className="md:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64">
          <div className="space-y-4">
            <div className="text-lg font-semibold px-4 pt-4">E-Logbook</div>
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <Button
                  key={tab.value}
                  variant="ghost"
                  className={cn(
                    "w-full justify-start gap-3 px-3 py-2 text-sm font-medium rounded-md",
                    activeTab === tab.value
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                  onClick={() => setActiveTab(tab.value)}
                >
                  <tab.icon className="h-5 w-5" /> {tab.name}
                </Button>
              ))}
            </nav>
            <div className="border-t pt-4">
              <Button
                variant="ghost"
                className="flex items-center gap-2 w-full justify-start"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" /> Logout
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
