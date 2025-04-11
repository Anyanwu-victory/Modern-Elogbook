import type { UseFormReturn } from "react-hook-form"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface StepThreeStaffProps {
  form: UseFormReturn<any>
}

export function StepThreeStaff({ form }: StepThreeStaffProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Step 3: Additional Information</h3>
      <p className="text-sm text-muted-foreground">Please provide additional contact and professional details.</p>

      <div className="grid gap-4 md:grid-cols-2">
        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input placeholder="e.g. +1234567890" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="officeLocation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Office Location</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Block A, Room 101" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="specialization"
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel>Area of Specialization (Optional)</FormLabel>
              <FormControl>
                <Textarea placeholder="e.g. Database Systems, Machine Learning" className="min-h-[80px]" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  )
}
