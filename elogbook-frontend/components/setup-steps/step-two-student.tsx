"use client"
import { useState, useEffect } from "react"
import type { UseFormReturn } from "react-hook-form"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getClient} from "@/sanity/lib/sanity.client"
import { Department,Faculty } from "@/sanity/lib/sanity.queries";
import { readToken } from "@/sanity/lib/sanity.api";
import { getAllFaculties,getAllDepartments } from "@/sanity/lib/sanity.queries"

interface StepTwoStudentProps {
  form: UseFormReturn<any>
}

export function StepTwoStudent({ form }: StepTwoStudentProps) {
  
  const [departments, setDepartments] = useState<Department[]>([])
  const [faculties, setFaculties] = useState<Faculty[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const [departmentsData, facultiesData] = await Promise.all([
        getAllDepartments(),
        getAllFaculties(),
      ])
      setDepartments(departmentsData)
      setFaculties(facultiesData)
    }
   console.log(getAllDepartments())
    fetchData()
  }, [])


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
                {faculties.map((faculty: any) => (
                    <SelectItem key={faculty._id} value={faculty.name}>
                      {faculty.name}
                    </SelectItem>
                  ))}
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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a department" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {departments.map((department: any) => (
                    <SelectItem key={department._id} value={department.name}>
                      {department.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
