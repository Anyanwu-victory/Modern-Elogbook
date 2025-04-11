import type { UseFormReturn } from "react-hook-form"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"

interface StepTwoStaffProps {
  form: UseFormReturn<any>
}

export function StepTwoStaff({ form }: StepTwoStaffProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Step 2: Professional Information</h3>
      <p className="text-sm text-muted-foreground">Please provide your professional details.</p>

      <div className="grid gap-4 md:grid-cols-2">
        <FormField
          control={form.control}
          name="staffId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Staff ID</FormLabel>
              <FormControl>
                <Input placeholder="e.g. STAFF-001" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="department"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Department</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Computer Science" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="position"
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel>Position</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Senior Lecturer" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  )
}
