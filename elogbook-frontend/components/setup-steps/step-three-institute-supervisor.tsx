"use client"

import type React from "react"

import { useState } from "react"
import type { UseFormReturn } from "react-hook-form"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"

interface StepThreeInstitutionSupervisorProps {
  form: UseFormReturn<any>
}

export function StepThreeInstitutionSupervisor({ form }: StepThreeInstitutionSupervisorProps) {
  const [signaturePreview, setSignaturePreview] = useState<string | null>(null)

  const handleSignatureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        setSignaturePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
      form.setValue("signature", file)
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Step 3: Additional Information</h3>
      <p className="text-sm text-muted-foreground">Please provide your signature and contact details.</p>

      <div className="grid gap-4">
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
          name="signature"
          render={({ field: { value, onChange, ...field } }) => (
            <FormItem>
              <FormLabel>Upload Signature</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleSignatureChange}
                  className="cursor-pointer"
                  {...field}
                />
              </FormControl>
              
              <FormMessage />
              {signaturePreview && (
                <div className="mt-2">
                  <p className="text-sm text-muted-foreground mb-1">Signature Preview:</p>
                  <img
                    src={signaturePreview || "/placeholder.svg"}
                    alt="Signature Preview"
                    className="max-h-[100px] border rounded-md"
                  />
                </div>
              )}
            </FormItem>
          )}
        />
      </div>
    </div>
  )
}
