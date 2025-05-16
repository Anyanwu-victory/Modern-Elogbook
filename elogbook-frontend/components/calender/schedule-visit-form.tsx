"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { CalendarIcon, Clock, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { MultiSelect } from "@/components/ui/multi-select"
import { cn } from "@/lib/utils"
import { toast } from "@/components/ui/use-toast"

// Define the form schema
const formSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  date: z.date({ required_error: "Please select a date" }),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: "Please enter a valid time (HH:MM)" }),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: "Please enter a valid time (HH:MM)" }),
  visitType: z.enum(["institute", "industry", "itf"]),
  location: z.string().min(3, { message: "Location must be at least 3 characters" }),
  company: z.string().optional(),
  supervisorId: z.string().optional(),
  studentIds: z.array(z.string()).min(1, { message: "Please select at least one student" }),
  notes: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

interface ScheduleVisitFormProps {
  onSubmit: (data: FormValues) => Promise<void>
  supervisors: { id: string; name: string }[]
  students: { id: string; name: string }[]
  initialData?: Partial<FormValues>
  isEdit?: boolean
}

export function ScheduleVisitForm({
  onSubmit,
  supervisors,
  students,
  initialData,
  isEdit = false,
}: ScheduleVisitFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Convert student array to options format
  const studentOptions = students.map((student) => ({
    value: student.id,
    label: student.name,
  }))

  // Initialize form with default values or edit data
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData?.title || "",
      date: initialData?.date || new Date(),
      startTime: initialData?.startTime || "09:00",
      endTime: initialData?.endTime || "10:00",
      visitType: initialData?.visitType || "institute",
      location: initialData?.location || "",
      company: initialData?.company || "",
      supervisorId: initialData?.supervisorId || "",
      studentIds: initialData?.studentIds || [],
      notes: initialData?.notes || "",
    },
  })

  // Handle form submission
  const handleSubmit = async (values: FormValues) => {
    setIsSubmitting(true)
    try {
      await onSubmit(values)
      toast({
        title: isEdit ? "Visit updated" : "Visit scheduled",
        description: isEdit ? "The visit has been updated successfully." : "The visit has been scheduled successfully.",
      })
    } catch (error) {
      console.error("Error submitting form:", error)
      toast({
        title: "Error",
        description: "There was an error scheduling the visit. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Visit Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter visit title" {...field} />
              </FormControl>
              <FormDescription>A descriptive title for the visit (e.g., "Mid-term Evaluation Visit")</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                      >
                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date: Date) => date < new Date("1900-01-01")}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="visitType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Visit Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select visit type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="institution">Institution Visit</SelectItem>
                    <SelectItem value="industry">Industry Visit</SelectItem>
                    <SelectItem value="itf">ITF Visit</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="startTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Time</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input placeholder="HH:MM" {...field} />
                    <Clock className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  </div>
                </FormControl>
                <FormDescription>Enter time in 24-hour format (e.g., 14:30)</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Time</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input placeholder="HH:MM" {...field} />
                    <Clock className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  </div>
                </FormControl>
                <FormDescription>Enter time in 24-hour format (e.g., 15:30)</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input placeholder="Enter visit location" {...field} />
              </FormControl>
              <FormDescription>The physical address or location where the visit will take place</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="company"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="Enter company name" {...field} />
              </FormControl>
              <FormDescription>The name of the company where the student is interning</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="supervisorId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Institution Supervisor</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a supervisor" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {supervisors.map((supervisor) => (
                    <SelectItem key={supervisor.id} value={supervisor.id}>
                      {supervisor.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>The institution supervisor who will conduct the visit</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="studentIds"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Students</FormLabel>
              <FormControl>
                <MultiSelect
                  options={studentOptions}
                  selected={field.value}
                  onChange={field.onChange}
                  placeholder="Select students"
                />
              </FormControl>
              <FormDescription>Select the students who will be visited</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter any additional notes or instructions"
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEdit ? "Update Visit" : "Schedule Visit"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
