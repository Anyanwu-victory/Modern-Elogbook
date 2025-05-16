"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

import { DashboardLayout } from "@/components/dashboard-layout"
import { VisitCalendar } from "@/components/calender/visit-calender" // Ensure this file exists at the specified path
import type { VisitEvent } from "@/lib/types"
import { fetchIndustrySupervisorVisits } from "@/lib/actions/visit-actions"

export default function IndustrySupervisorCalendarPage() {
  const router = useRouter()
  const [visits, setVisits] = useState<VisitEvent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadVisits = async () => {
      try {
        // In a real app, this would fetch from your API
        const data = await fetchIndustrySupervisorVisits()
        setVisits(data)
      } catch (error) {
        console.error("Error loading visits:", error)
      } finally {
        setLoading(false)
      }
    }

    loadVisits()
  }, [])

  if (loading) {
    return (
      
        <div className="flex items-center justify-center h-[calc(100vh-10rem)]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      
    )
  }

  return (
    //<DashboardLayout userRole="industrySupervisor">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Visit Calendar</h1>
          <p className="text-muted-foreground">
            View scheduled visits from institution supervisors and ITF representatives
          </p>
        </div>

        <VisitCalendar events={visits} userRole="industrySupervisor" />
      </div>
   // </DashboardLayout>
  )
}
