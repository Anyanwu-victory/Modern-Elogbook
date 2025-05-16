"use client"

import { MapPin, CalendarIcon, Clock, Users, Building, GraduationCap, User } from "lucide-react"
import { formatDate, formatTime } from "@/lib/utils"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { VisitEventWithDetails } from "@/lib/types"

interface VisitDetailsDialogProps {
  visit: VisitEventWithDetails
  isOpen: boolean
  onClose: () => void
  userRole: "industry_supervisor" | "institution_supervisor" | "admin"
  onEdit?: () => void
  onDelete?: () => void
}

export function VisitDetailsDialog({ visit, isOpen, onClose, userRole, onEdit, onDelete }: VisitDetailsDialogProps) {
  // Get the badge color based on visit type
  const getBadgeVariant = (type: string) => {
    switch (type) {
      case "institution":
        return "purple"
      case "industry":
        return "green"
      case "itf":
        return "orange"
      default:
        return "blue"
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{visit.title}</DialogTitle>
          <div className="mt-2">
            <Badge
              className={`bg-${getBadgeVariant(visit.visitType)}-100 text-${getBadgeVariant(
                visit.visitType,
              )}-800 dark:bg-${getBadgeVariant(visit.visitType)}-900 dark:text-${getBadgeVariant(visit.visitType)}-300`}
            >
              {visit.visitType === "institution"
                ? "Institution Visit"
                : visit.visitType === "industry"
                  ? "Industry Visit"
                  : visit.visitType === "itf"
                    ? "ITF Visit"
                    : "Visit"}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex items-start gap-3">
            <CalendarIcon className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Date</p>
              <p className="text-sm text-muted-foreground">{formatDate(visit.start)}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Clock className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Time</p>
              <p className="text-sm text-muted-foreground">
                {formatTime(visit.start)} - {formatTime(visit.end)}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Location</p>
              <p className="text-sm text-muted-foreground">{visit.location}</p>
            </div>
          </div>

          {visit.company && (
            <div className="flex items-start gap-3">
              <Building className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Company</p>
                <p className="text-sm text-muted-foreground">{visit.company}</p>
              </div>
            </div>
          )}

          {visit.supervisor && (
            <div className="flex items-start gap-3">
              <GraduationCap className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Institution Supervisor</p>
                <p className="text-sm text-muted-foreground">{visit.supervisor}</p>
              </div>
            </div>
          )}

          <div className="flex items-start gap-3">
            <Users className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Students</p>
              <ul className="text-sm text-muted-foreground space-y-1 mt-1">
                {visit.students.map((student, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <User className="h-3 w-3" />
                    {student}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {visit.notes && (
            <div className="flex items-start gap-3">
              <div className="h-5 w-5 shrink-0" />
              <div>
                <p className="font-medium">Notes</p>
                <p className="text-sm text-muted-foreground whitespace-pre-line">{visit.notes}</p>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          {userRole === "admin" && (
            <>
              {onEdit && (
                <Button variant="outline" onClick={onEdit}>
                  Edit Visit
                </Button>
              )}
              {onDelete && (
                <Button variant="destructive" onClick={onDelete}>
                  Delete Visit
                </Button>
              )}
            </>
          )}
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
