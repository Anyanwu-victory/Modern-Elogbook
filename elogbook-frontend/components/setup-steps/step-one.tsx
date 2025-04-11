"use client"

import type { UseFormReturn } from "react-hook-form"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { GraduationCap, Building, BookOpen, Settings, Briefcase } from "lucide-react"

interface StepOneProps {
  form: UseFormReturn<any>
}

export function StepOne({ form }: StepOneProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Step 1: Select Your Role</h3>
      <p className="text-sm text-muted-foreground">
        Choose the role that best describes your position in the SIWES program.
      </p>

      <FormField
        control={form.control}
        name="role"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>Role</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="grid grid-cols-1 gap-4 md:grid-cols-2"
              >
                <FormItem className="flex space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="student" id="student" className="sr-only peer" />
                  </FormControl>
                  <label
                    htmlFor="student"
                    className="flex flex-1 cursor-pointer items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <div className="flex items-center gap-3">
                      <GraduationCap className="h-5 w-5" />
                      <div className="font-medium">Student</div>
                    </div>
                  </label>
                </FormItem>

                <FormItem className="flex space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="industry_supervisor" id="industry_supervisor" className="sr-only peer" />
                  </FormControl>
                  <label
                    htmlFor="industry_supervisor"
                    className="flex flex-1 cursor-pointer items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <div className="flex items-center gap-3">
                      <Building className="h-5 w-5" />
                      <div className="font-medium">Industry Supervisor</div>
                    </div>
                  </label>
                </FormItem>

                <FormItem className="flex space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem
                      value="institution_supervisor"
                      id="institution_supervisor"
                      className="sr-only peer"
                    />
                  </FormControl>
                  <label
                    htmlFor="institution_supervisor"
                    className="flex flex-1 cursor-pointer items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <div className="flex items-center gap-3">
                      <BookOpen className="h-5 w-5" />
                      <div className="font-medium">Institution Supervisor</div>
                    </div>
                  </label>
                </FormItem>

                <FormItem className="flex space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="admin" id="admin" className="sr-only peer" />
                  </FormControl>
                  <label
                    htmlFor="admin"
                    className="flex flex-1 cursor-pointer items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <div className="flex items-center gap-3">
                      <Settings className="h-5 w-5" />
                      <div className="font-medium">Admin</div>
                    </div>
                  </label>
                </FormItem>

                <FormItem className="flex space-x-3 space-y-0 md:col-span-2">
                  <FormControl>
                    <RadioGroupItem value="itf" id="itf" className="sr-only peer" />
                  </FormControl>
                  <label
                    htmlFor="itf"
                    className="flex flex-1 cursor-pointer items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <div className="flex items-center gap-3">
                      <Briefcase className="h-5 w-5" />
                      <div className="font-medium">ITF Personnel</div>
                    </div>
                  </label>
                </FormItem>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}
