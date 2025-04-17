"use client"

import type React from "react"

import { useState, useRef } from "react"
import { ChevronDown, ChevronUp, Clock, FileText } from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

// Type for a single daily log
interface DailyLog {
  id: string | number
  date: string
  day: string
  activity: string
  status: "pending" | "approved" | "rejected"
  imageUrl?: string
}

// Type for a weekly group of logs
interface WeeklyLogs {
  weekNumber: number
  startDate: string
  endDate: string
  studentName: string
  studentId: string
  logs: DailyLog[]
  supervisorComment?: string
  supervisorSignature?: string
  status: "pending" | "approved" | "rejected"
}

interface WeeklyLogReviewProps {
  weeklyLogs: WeeklyLogs
  onApprove: (weekId: number, comment: string, signatureURL: string) => void
  onReject: (weekId: number, comment: string) => void
}

export function WeeklyLogReview({ weeklyLogs, onApprove, onReject }: WeeklyLogReviewProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [comment, setComment] = useState(weeklyLogs.supervisorComment || "")
  const [signatureURL, setSignatureURL] = useState(weeklyLogs.supervisorSignature || "")
  const signatureCanvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [hasSignature, setHasSignature] = useState(!!weeklyLogs.supervisorSignature)

  // Simple signature pad implementation
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = signatureCanvasRef.current
    if (!canvas) return

    setIsDrawing(true)
    setHasSignature(true)

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let clientX, clientY
    if ("touches" in e) {
      clientX = e.touches[0].clientX
      clientY = e.touches[0].clientY
    } else {
      clientX = e.clientX
      clientY = e.clientY
    }

    const rect = canvas.getBoundingClientRect()
    ctx.beginPath()
    ctx.moveTo(clientX - rect.left, clientY - rect.top)
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return
    const canvas = signatureCanvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let clientX, clientY
    if ("touches" in e) {
      clientX = e.touches[0].clientX
      clientY = e.touches[0].clientY
    } else {
      clientX = e.clientX
      clientY = e.clientY
    }

    const rect = canvas.getBoundingClientRect()
    ctx.lineTo(clientX - rect.left, clientY - rect.top)
    ctx.stroke()
  }

  const stopDrawing = () => {
    if (!isDrawing) return
    setIsDrawing(false)

    const canvas = signatureCanvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.closePath()

    // Save the signature as URL
    setSignatureURL(canvas.toDataURL())
  }

  const clearSignature = () => {
    const canvas = signatureCanvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    setSignatureURL("")
    setHasSignature(false)
  }

  const formatDate = (dateStr: string) => {
    return format(new Date(dateStr), "dd MMM yyyy")
  }

  const isCompleted = weeklyLogs.status === "approved" || weeklyLogs.status === "rejected"

  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              Week {weeklyLogs.weekNumber}
              <Badge
                variant={
                  weeklyLogs.status === "approved"
                    ? "success"
                    : weeklyLogs.status === "rejected"
                      ? "destructive"
                      : "outline"
                }
              >
                {weeklyLogs.status === "pending" ? (
                  <>
                    <Clock className="mr-1 h-3 w-3" /> Pending
                  </>
                ) : weeklyLogs.status === "approved" ? (
                  "Approved"
                ) : (
                  "Rejected"
                )}
              </Badge>
            </CardTitle>
            <CardDescription>
              {formatDate(weeklyLogs.startDate)} - {formatDate(weeklyLogs.endDate)}
            </CardDescription>
          </div>
          <div>
            <p className="text-sm font-medium">{weeklyLogs.studentName}</p>
            <p className="text-xs text-muted-foreground">{weeklyLogs.studentId}</p>
          </div>
        </div>
      </CardHeader>

      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="w-full flex justify-between items-center rounded-none border-t">
            <span className="flex items-center">
              <FileText className="mr-2 h-4 w-4" />
              View {weeklyLogs.logs.length} Daily Logs
            </span>
            {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="p-4 space-y-4">
            {weeklyLogs.logs.map((log) => (
              <div key={log.id} className="border rounded-md p-3">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-medium">{log.day}</h4>
                    <p className="text-xs text-muted-foreground">{formatDate(log.date)}</p>
                  </div>
                  <Badge
                    variant={
                      log.status === "approved" ? "success" : log.status === "rejected" ? "destructive" : "outline"
                    }
                  >
                    {log.status}
                  </Badge>
                </div>
                <p className="text-sm whitespace-pre-line">{log.activity}</p>
                {log.imageUrl && (
                  <div className="mt-2">
                    <p className="text-xs text-muted-foreground mb-1">Attached Image:</p>
                    <img
                      src={log.imageUrl || "/placeholder.svg"}
                      alt="Log attachment"
                      className="max-h-[150px] rounded border"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>

      <CardContent className="pt-4">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Weekly Supervisor Comments</label>
            <Textarea
              placeholder="Provide feedback on this week's logs..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="min-h-[100px]"
              disabled={isCompleted}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Supervisor Signature</label>
            {isCompleted && weeklyLogs.supervisorSignature ? (
              <div className="border rounded-md p-2 bg-muted/20">
                <img
                  src={weeklyLogs.supervisorSignature || "/placeholder.svg"}
                  alt="Supervisor Signature"
                  className="h-20 max-w-[250px] object-contain"
                />
              </div>
            ) : (
              <div className="border rounded-md p-2">
                <canvas
                  ref={signatureCanvasRef}
                  width={400}
                  height={100}
                  className="w-full border rounded-md bg-white touch-none"
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                ></canvas>
                <div className="flex justify-end mt-1">
                  <Button type="button" variant="outline" size="sm" onClick={clearSignature} disabled={isCompleted}>
                    Clear
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>

      {!isCompleted && (
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => onReject(weeklyLogs.weekNumber, comment)} disabled={!comment}>
            Reject Logs
          </Button>
          <Button
            onClick={() => onApprove(weeklyLogs.weekNumber, comment, signatureURL)}
            disabled={!comment || !hasSignature}
          >
            Approve Logs
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
