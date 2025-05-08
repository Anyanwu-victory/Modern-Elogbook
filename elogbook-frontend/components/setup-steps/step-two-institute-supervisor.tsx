import type { UseFormReturn } from "react-hook-form"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { getClient,getAllDepartments, getAllFaculties } from "@/sanity/lib/sanity.client"
import { Department,Faculty } from "@/sanity/lib/sanity.queries";
import { readToken } from "@/sanity/lib/sanity.api";
import { useState, useEffect } from "react"
import { useUser } from "@clerk/nextjs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
  

interface StepTwoInstitutionSupervisorProps {
  form: UseFormReturn<any>
}


export function StepTwoInstitutionSupervisor({ form }: StepTwoInstitutionSupervisorProps) {

const client = getClient({ token: readToken });
const [departments, setDepartments] = useState<Department[]>([]);
const [faculties, setFaculties] = useState<Faculty[]>([]);

useEffect(() => {
  const fetchData = async () => {
    const [departmentsData, facultiesData] = await Promise.all([
      getAllDepartments(client),
      getAllFaculties(client),
    ]);
    setDepartments(departmentsData);
    setFaculties(facultiesData);
  };

  fetchData();
}, [client]);


  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Step 2: Professional Information</h3>
      <p className="text-sm text-muted-foreground">Please provide your academic and professional details.</p>

      <div className="grid gap-4 md:grid-cols-2">
        <FormField
          control={form.control}
          name="staffId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Staff ID</FormLabel>
              <FormControl>
                <Input placeholder="e.g. INST-001" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="position"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Position</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Senior Lecturer" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
      </div>
    </div>
  )
}
