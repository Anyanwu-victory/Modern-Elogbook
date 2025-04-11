import type { UseFormReturn } from "react-hook-form"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface StepThreeStudentProps {
  form: UseFormReturn<any>
}

export function StepThreeStudent({ form }: StepThreeStudentProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Step 3: Internship Information</h3>
      <p className="text-sm text-muted-foreground">Please provide details about your internship organization.</p>

      <div className="grid gap-4 md:grid-cols-2">
        <FormField
          control={form.control}
          name="organizationName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Organization Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Tech Solutions Inc." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="organizationAddress"
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel>Organization Address</FormLabel>
              <FormControl>
                <Textarea placeholder="e.g. 123 Tech Street, Tech City" className="min-h-[80px]" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="supervisorName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Industry Supervisor Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="supervisorEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Industry Supervisor Email</FormLabel>
              <FormControl>
                <Input placeholder="e.g. john.doe@example.com" type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="startDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Internship Start Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="endDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Internship End Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  )
}
