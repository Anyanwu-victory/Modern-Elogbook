"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Loader2, Upload } from 'lucide-react'
import DashboardLayout from "@/components/main-dashboard/DashboardLayout"
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
import { getClient } from "@/sanity/lib/sanity.client"
import { writeToken } from "@/sanity/lib/sanity.api";
import {useUser} from "@clerk/nextjs";
import {auth} from "@clerk/nextjs/server"

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
})

/**
 * Calculates the week number of a given date based on the ISO week date system.
 *
 * @param date - The date for which the week number is to be calculated.
 * @returns The week number of the year for the provided date.
 *
 * @remarks
 * This function determines the week number by calculating the number of days
 * passed since the start of the year and dividing it by 7, while accounting
 * for the day of the week of the year's start.
 *
 * @example
 * ```typescript
 * const date = new Date('2023-03-15');
 * const weekNumber = getWeekNumber(date);
 * console.log(weekNumber); // Outputs the week number for March 15, 2023
 * ```
 */

function getWeekNumber(date: Date): number { 
  const startOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date.getTime() - startOfYear.getTime()) / 86400000;
  return Math.ceil((pastDaysOfYear + startOfYear.getDay() + 1) / 7);
}

type LogFormValues = z.infer<typeof logFormSchema>

export default function SubmitLogPage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  // Default values for the form
  const defaultValues: Partial<LogFormValues> = {
    day: "",
    date: new Date().toISOString().split("T")[0],
    activity: "",
    image: null,
  }

  const form = useForm<LogFormValues>({
    resolver: zodResolver(logFormSchema),
    defaultValues,
    mode: "onChange",
  })
 
  async function onSubmit(data: LogFormValues) {
    
    console.log(data)

    if (!isSignedIn || !user) {
      toast({
        title: "Error",
        description: "Please sign in to submit logs",
        variant: "destructive",
      });
      return;
    }
    setIsSubmitting(true)

    const weekNumber = getWeekNumber(new Date(data.date));
    
      try {
    
        const response = await fetch('/api/submit-logs/route.ts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            // Prepare data matching your schema
            title: `${data.day} Log`,
            studentId: user.id,
            day: data.day,
            weekNumber,
            date: data.date,
            activities: data.activity,
            image: data.image ? data.image : null, // Handle image upload separately or via base64 
            // Handle image upload separately or via base64
          }),
        });
    
        if (!response.ok) throw new Error('Submission failed');
        // if (data.image && data.image.size > 5 * 1024 * 1024) { // 5MB
        //   throw new Error('Image must be smaller than 5MB');
        // }
       toast({ title: "Log submitted successfully" });
        router.push("/dashboard/my-logs");
      } catch (error) {
        toast({
          title: "Error",
          description: 'Failed to submit log. Please try again.',
          variant: "destructive",
        });
      } finally {
        setIsSubmitting(false);
      }
    }
    
//     async function convertToBase64(file: File): Promise<string> {
//   return new Promise((resolve, reject) => {
//     const reader = new FileReader();
//     reader.readAsDataURL(file);
//     reader.onload = () => resolve(reader.result?.toString().split(',')[1] || '');
//     reader.onerror = error => reject(error);
//   });
// }
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
  //<DashboardLayout userRole="student">
      <div className="space-y-6">
        <div className="space-x-2 mx-3">
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
                        <Input type="file" accept="image/*" onChange={handleImageChange} 
                        className="cursor-pointer" />
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
//  </DashboardLayout>
  )
}
