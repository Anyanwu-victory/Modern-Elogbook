"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Plus, Loader2 } from "lucide-react"

import { DashboardLayout } from "@/components/dashboard-layout"
import { VisitCalendar } from "@/components/calender/visit-calender" // Ensure this file exists at the specified path
import { ScheduleVisitForm } from "@/components/calender/schedule-visit-form" // Ensure this file exists at the specified path
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { VisitEvent } from "@/lib/types"
import {
  fetchAllVisits,
  scheduleVisit,
  updateVisit,
  deleteVisit,
  fetchSupervisors,
  fetchStudents,
} from "@/lib/actions/visit-actions"
import { toast } from "@/components/ui/use-toast"

export default function AdminScheduleVisitsPage() {
  const router = useRouter()
  const [visits, setVisits] = useState<VisitEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [currentVisit, setCurrentVisit] = useState<VisitEvent | null>(null)
  const [supervisors, setSupervisors] = useState<{ id: string; name: string }[]>([])
  const [students, setStudents] = useState<{ id: string; name: string }[]>([])
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    const loadData = async () => {
      try {
        // In a real app, these would fetch from your API
        const [visitsData, supervisorsData, studentsData] = await Promise.all([
          fetchAllVisits(),
          fetchSupervisors(),
          fetchStudents(),
        ])

        setVisits(visitsData)
        setSupervisors(supervisorsData)
        setStudents(studentsData)
      } catch (error) {
        console.error("Error loading data:", error)
        toast({
          title: "Error",
          description: "Failed to load data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const handleAddVisit = () => {
    setIsEditMode(false)
    setCurrentVisit(null)
    setIsFormOpen(true)
  }

  const handleEditVisit = (visitId: string) => {
    const visit = visits.find((v) => v.id === visitId)
    if (visit) {
      setCurrentVisit(visit)
      setIsEditMode(true)
      setIsFormOpen(true)
    }
  }

  const handleDeleteVisit = async (visitId: string) => {
    try {
      // In a real app, this would call your API
      await deleteVisit(visitId)

      // Update local state
      setVisits(visits.filter((visit) => visit.id !== visitId))

      toast({
        title: "Visit deleted",
        description: "The visit has been deleted successfully.",
      })
    } catch (error) {
      console.error("Error deleting visit:", error)
      toast({
        title: "Error",
        description: "Failed to delete the visit. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleFormSubmit = async (data: any) => {
    try {
      if (isEditMode && currentVisit) {
        // Update existing visit
        const updatedVisit = await updateVisit(currentVisit.id, data)

        // Update local state
        setVisits(visits.map((visit) => (visit.id === currentVisit.id ? updatedVisit : visit)))
      } else {
        // Create new visit
        const newVisit = await scheduleVisit(data)

        // Update local state
        setVisits([...visits, newVisit])
      }

      // Close the form dialog
      setIsFormOpen(false)
    } catch (error) {
      console.error("Error submitting form:", error)
      throw error // Re-throw to be handled by the form component
    }
  }

  // Filter visits based on active tab
  const filteredVisits = visits.filter((visit) => {
    if (activeTab === "all") return true
    return visit.visitType === activeTab
  })

  if (loading) {
    return (
      <DashboardLayout userRole="admin">
        <div className="flex items-center justify-center h-[calc(100vh-10rem)]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout userRole="admin">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Schedule Visits</h1>
            <p className="text-muted-foreground">Manage and schedule visits for institution supervisors</p>
          </div>
          <Button onClick={handleAddVisit}>
            <Plus className="mr-2 h-4 w-4" />
            Schedule New Visit
          </Button>
        </div>

        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All Visits</TabsTrigger>
            <TabsTrigger value="institution">Institution Visits</TabsTrigger>
            <TabsTrigger value="industry">Industry Visits</TabsTrigger>
            <TabsTrigger value="itf">ITF Visits</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="mt-6">
            <VisitCalendar
              events={filteredVisits}
              userRole="admin"
              onAddVisit={handleAddVisit}
              onEditVisit={handleEditVisit}
              onDeleteVisit={handleDeleteVisit}
            />
          </TabsContent>
          <TabsContent value="institution" className="mt-6">
            <VisitCalendar
              events={filteredVisits}
              userRole="admin"
              onAddVisit={handleAddVisit}
              onEditVisit={handleEditVisit}
              onDeleteVisit={handleDeleteVisit}
            />
          </TabsContent>
          <TabsContent value="industry" className="mt-6">
            <VisitCalendar
              events={filteredVisits}
              userRole="admin"
              onAddVisit={handleAddVisit}
              onEditVisit={handleEditVisit}
              onDeleteVisit={handleDeleteVisit}
            />
          </TabsContent>
          <TabsContent value="itf" className="mt-6">
            <VisitCalendar
              events={filteredVisits}
              userRole="admin"
              onAddVisit={handleAddVisit}
              onEditVisit={handleEditVisit}
              onDeleteVisit={handleDeleteVisit}
            />
          </TabsContent>
        </Tabs>

        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{isEditMode ? "Edit Visit" : "Schedule New Visit"}</DialogTitle>
            </DialogHeader>
            <ScheduleVisitForm
              onSubmit={handleFormSubmit}
              supervisors={supervisors}
              students={students}
              initialData={currentVisit || undefined}
              isEdit={isEditMode}
            />
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}
