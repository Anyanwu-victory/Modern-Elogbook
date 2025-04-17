"use client"

import type { UseFormReturn } from "react-hook-form"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface StepTwoStudentProps {
  form: UseFormReturn<any>
}

export function StepTwoStudent({ form }: StepTwoStudentProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Step 2: Academic Information</h3>
      <p className="text-sm text-muted-foreground">Please provide your academic details.</p>

      <div className="grid gap-4 md:grid-cols-2">
        <FormField
          control={form.control}
          name="faculty"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Faculty</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your Faculty" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="100L">100L</SelectItem>
                  <SelectItem value="200L">200L</SelectItem>
                  <SelectItem value="300L">300L</SelectItem>
                  <SelectItem value="400L">400L</SelectItem>
                  <SelectItem value="500L">500L</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
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
          name="level"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Level</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your level" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="100L">100L</SelectItem>
                  <SelectItem value="200L">200L</SelectItem>
                  <SelectItem value="300L">300L</SelectItem>
                  <SelectItem value="400L">400L</SelectItem>
                  <SelectItem value="500L">500L</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="matricNo"
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel>Matriculation Number</FormLabel>
              <FormControl>
                <Input placeholder="e.g. ENG/2020/001" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  )
}
