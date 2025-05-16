"use client"

import { useState } from "react"
import { Calendar, momentLocalizer } from "react-big-calendar"
import moment from "moment"
import "react-big-calendar/lib/css/react-big-calendar.css"
import { useTheme } from "next-themes"
import { Loader2 } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { VisitEvent, VisitEventWithDetails } from "@/lib/types"
import { VisitDetailsDialog } from "./visit-details-dialog"

// Setup the localizer
const localizer = momentLocalizer(moment)

interface VisitCalendarProps {
  events: VisitEvent[]
  isLoading?: boolean
  userRole?: "industrySupervisor" | "instituteSupervisor" | "admin"
  onAddVisit?: () => void
  onEditVisit?: (visitId: string) => void
  onDeleteVisit?: (visitId: string) => void
}

export function VisitCalendar({
  events,
  isLoading = false,
  userRole = "industrySupervisor",
  onAddVisit,
  onEditVisit,
  onDeleteVisit,
}: VisitCalendarProps) {
  const { theme } = useTheme()
  const [selectedEvent, setSelectedEvent] = useState<VisitEventWithDetails | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  // Format events for the calendar
  const calendarEvents = events.map((event) => ({
    ...event,
    start: new Date(event.start),
    end: new Date(event.end),
  }))

  // Handle event selection
  const handleSelectEvent = (event: VisitEvent) => {
    // Find the event with details
    const eventWithDetails = events.find((e) => e.id === event.id) as VisitEventWithDetails
    setSelectedEvent(eventWithDetails)
    setIsDetailsOpen(true)
  }

  // Custom event styling
  const eventStyleGetter = (event: VisitEvent) => {
    let backgroundColor = "#3182ce" // Default blue
    let borderColor = "#2c5282"

    if (event.visitType === "institute") {
      backgroundColor = "#805ad5" // Purple for institution visits
      borderColor = "#553c9a"
    } else if (event.visitType === "industry") {
      backgroundColor = "#38a169" // Green for industry visits
      borderColor = "#2f855a"
    } else if (event.visitType === "itf") {
      backgroundColor = "#dd6b20" // Orange for ITF visits
      borderColor = "#c05621"
    }

    // Adjust colors for dark mode
    if (theme === "dark") {
      backgroundColor = backgroundColor + "dd" // Add transparency
    }

    return {
      style: {
        backgroundColor,
        borderColor,
        borderRadius: "4px",
        opacity: 0.9,
        color: "#fff",
        border: "0",
        display: "block",
        padding: "4px",
      },
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[500px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <Card>
      <CardContent className="p-4 md:p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Scheduled Visits</h2>
          {userRole === "admin" && onAddVisit && <Button onClick={onAddVisit}>Schedule New Visit</Button>}
        </div>
        <div className="h-[600px]">
          <Calendar
            localizer={localizer}
            events={calendarEvents}
            startAccessor="start"
            endAccessor="end"
            style={{ height: "100%" }}
            onSelectEvent={handleSelectEvent}
            eventPropGetter={eventStyleGetter}
            views={["month", "week", "day", "agenda"]}
            defaultView="month"
            tooltipAccessor={(event) => event.title}
            popup
          />
        </div>

        {selectedEvent && (
          <VisitDetailsDialog
            visit={selectedEvent}
            isOpen={isDetailsOpen}
            onClose={() => setIsDetailsOpen(false)}
            userRole={
              userRole === "industrySupervisor"
                ? "industry_supervisor"
                : userRole === "instituteSupervisor"
                ? "institution_supervisor"
                : userRole
            }
            onEdit={onEditVisit ? () => onEditVisit(selectedEvent.id) : undefined}
            onDelete={onDeleteVisit ? () => onDeleteVisit(selectedEvent.id) : undefined}
          />
        )}
      </CardContent>
    </Card>
  )
}
