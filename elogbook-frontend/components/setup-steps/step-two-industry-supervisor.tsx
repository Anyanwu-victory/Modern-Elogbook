import type { UseFormReturn } from "react-hook-form"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"

interface StepTwoIndustrySupervisorProps {
  form: UseFormReturn<any>
}

export function StepTwoIndustrySupervisor({ form }: StepTwoIndustrySupervisorProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Step 2: Professional Information</h3>
      <p className="text-sm text-muted-foreground">Please provide your staff identification details.</p>

      <div className="grid gap-4">
        <FormField
          control={form.control}
          name="staffId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Staff ID</FormLabel>
              <FormControl>
                <Input placeholder="e.g. IND-001" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  )
}
