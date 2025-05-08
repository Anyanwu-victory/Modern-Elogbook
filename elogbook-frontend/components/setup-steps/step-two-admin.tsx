import type { UseFormReturn } from "react-hook-form"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { getClient,getAllDepartments, getAllFaculties } from "@/sanity/lib/sanity.client"
import { Department,Faculty } from "@/sanity/lib/sanity.queries";
import { readToken } from "@/sanity/lib/sanity.api";
import { useState, useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
  



interface StepTwoAdminProps {
  form: UseFormReturn<any>
}

export function StepTwoAdmin({ form }: StepTwoAdminProps) {

  
const client = getClient({ token: readToken });
const [faculties, setFaculties] = useState<Faculty[]>([]);

useEffect(() => {
  const fetchData = async () => {
    const [facultiesData] = await Promise.all([
      getAllFaculties(client),
    ]);
    setFaculties(facultiesData);
  };

  fetchData();
  
}, [client]);


  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Step 2: Professional Information</h3>
      <p className="text-sm text-muted-foreground">Please provide your administrative details.</p>

      <div className="grid gap-4 md:grid-cols-2">
        <FormField
          control={form.control}
          name="staffId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Staff ID</FormLabel>
              <FormControl>
                <Input placeholder="e.g. ADMIN-001" {...field} />
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

      </div>
    </div>
  )
}
