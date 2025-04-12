import type { UseFormReturn } from "react-hook-form"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface StepThreeITFProps {
  form: UseFormReturn<any>
}

export function StepThreeITF({ form }: StepThreeITFProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Step 3: Office Information</h3>
      <p className="text-sm text-muted-foreground">Please provide your office location and contact details.</p>

      <div className="grid gap-4">
        <FormField
          control={form.control}
          name="officeLocation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Office Location</FormLabel>
              <FormControl>
                <Textarea placeholder="e.g. ITF Headquarters, Block A, Floor 3, Room 305" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
      </div>
    </div>
  )
}
