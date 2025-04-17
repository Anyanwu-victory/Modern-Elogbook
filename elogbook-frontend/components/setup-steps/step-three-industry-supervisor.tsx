import { useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface StepThreeIndustrySupervisorProps {
  form: UseFormReturn<any>;
}

export function StepThreeIndustrySupervisor({
  form,
}: StepThreeIndustrySupervisorProps) {
  const [signaturePreview, setSignaturePreview] = useState<string | null>(null);

  const handleSignatureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSignaturePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      form.setValue("signature", file);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Step 3: Organization Information</h3>
      <p className="text-sm text-muted-foreground">
        Please provide details about your organization.
      </p>

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
                  <p className="text-sm text-muted-foreground mb-1">
                    Signature Preview:
                  </p>
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
  );
}
