import type { UseFormReturn } from "react-hook-form"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"

interface StepThreeIndustrySupervisorProps {
  form: UseFormReturn<any>
}

export function StepThreeIndustrySupervisor({ form }: StepThreeIndustrySupervisorProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Step 3: Organization Information</h3>
      <p className="text-sm text-muted-foreground">Please provide details about your organization.</p>

      <div className="grid gap-4 md:grid-cols-2">
        <FormField
          control={form.control}
          name="organizationName"
          render={({ field }) => (
            <FormItem className="md:col-span-2">
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
          name="department"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Department</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Engineering" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="section"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Department/Section</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Software Development" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input placeholder="e.g. +1234567890" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  )
}
