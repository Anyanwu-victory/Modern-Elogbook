"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Loader2, Upload } from 'lucide-react'

import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { mockUser } from "@/pages/api/mock-data"

const logFormSchema = z.object({
  day: z.string({
    required_error: "Please select a day of the week.",
  }),
  date: z.string({
    required_error: "Please select a date.",
  }),
  activity: z.string().min(10, {
    message: "Activity description must be at least 10 characters.",
  }),
  image: z.any().optional(),
  supervisorVerified: z.boolean().refine((val) => val === true, {
    message: "IT Supervisor verification is required.",
  }),
})

type LogFormValues = z.infer<typeof logFormSchema>

export default function SubmitLogPage() {
  const user = mockUser
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  // Default values for the form
  const defaultValues: Partial<LogFormValues> = {
    day: "",
    date: new Date().toISOString().split("T")[0],
    activity: "",
    supervisorVerified: false,
  }

  const form = useForm<LogFormValues>({
    resolver: zodResolver(logFormSchema),
    defaultValues,
    mode: "onChange",
  })

  function onSubmit(data: LogFormValues) {
    setIsSubmitting(true)

    // In a real application, you would send this data to your backend
    setTimeout(() => {
      setIsSubmitting(false)
      toast({
        title: "Log submitted",
        description: "Your log has been submitted successfully.",
      })
      router.push("/dashboard/my-logs")
    }, 1500)
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        setSelectedImage(reader.result as string)
      }
      reader.readAsDataURL(file)
      form.setValue("image", file)
    }
  }

  // Mock data for industry supervisor (in a real app, this would come from the backend)
  const supervisorComment = ""
  const supervisorSignature = null

  return (
  //  <DashboardLayout userRole="student">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Submit Log</h1>
          <p className="text-muted-foreground">Record your daily activities during your industrial training.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Daily Activity Log</CardTitle>
            <CardDescription>Fill in the details of your activities for the day.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="day"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Day of the Week</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select day" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Monday">Monday</SelectItem>
                            <SelectItem value="Tuesday">Tuesday</SelectItem>
                            <SelectItem value="Wednesday">Wednesday</SelectItem>
                            <SelectItem value="Thursday">Thursday</SelectItem>
                            <SelectItem value="Friday">Friday</SelectItem>
                            <SelectItem value="Saturday">Saturday</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="activity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Activity Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe your activities for the day in detail..."
                          className="min-h-[150px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Provide a detailed description of the tasks you performed, skills you learned, and challenges
                        you faced.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Upload Image (Optional)</FormLabel>
                      <FormControl>
                        <Input type="file" accept="image/*" onChange={handleImageChange} className="cursor-pointer" />
                      </FormControl>
                      <FormDescription>
                        Upload an image related to your activity (e.g., work environment, project, etc.)
                      </FormDescription>
                      <FormMessage />
                      {selectedImage && (
                        <div className="mt-2">
                          <img
                            src={selectedImage || "/placeholder.svg"}
                            alt="Selected"
                            className="max-h-[200px] rounded-md border"
                          />
                        </div>
                      )}
                    </FormItem>
                  )}
                />
                
                <Separator className="my-6" />

                {/* Industry Supervisor Comment and Signature Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Industry Supervisor Review</h3>
                  <p className="text-sm text-muted-foreground">
                    This section will be filled by your industry supervisor during the weekly review.
                  </p>

                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Supervisor Comment</h4>
                      <div className="border rounded-md p-3 min-h-[100px] bg-muted/30">
                        {supervisorComment ? (
                          <p>{supervisorComment}</p>
                        ) : (
                          <p className="text-muted-foreground italic">No comments yet</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium mb-2">Supervisor Signature</h4>
                      <div className="border rounded-md p-3 min-h-[100px] bg-muted/30 flex items-center justify-center">
                        {supervisorSignature ? (
                          <img
                            src={supervisorSignature || "/placeholder.svg"}
                            alt="Supervisor Signature"
                            className="max-h-[80px]"
                          />
                        ) : (
                          <p className="text-muted-foreground italic">Not signed yet</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Submit Log
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
//    </DashboardLayout>
  )
}
