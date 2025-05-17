"use client"

import { useState,useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Loader2, StarOffIcon } from "lucide-react"
import {useUser} from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { getClient } from "@/sanity/lib/sanity.client"
import { writeToken } from "@/sanity/lib/sanity.api"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Form } from "@/components/ui/form"
import { useToast } from "@/components/ui/use-toast"
import { StepOne } from "@/components/setup-steps/step-one"
import { StepTwoStudent } from "@/components/setup-steps/step-two-student"
import { StepTwoIndustrySupervisor } from "@/components/setup-steps/step-two-industry-supervisor"
import { StepTwoInstitutionSupervisor } from "@/components/setup-steps/step-two-institute-supervisor"
import { StepTwoITF } from "@/components/setup-steps/step-two-itf"
import { StepTwoAdmin } from "@/components/setup-steps/step-two-admin"
import { StepThreeStudent } from "@/components/setup-steps/step-three-student"
import { StepThreeIndustrySupervisor } from "@/components/setup-steps/step-three-industry-supervisor"
import { StepThreeInstitutionSupervisor } from "@/components/setup-steps/step-three-institute-supervisor"
import { StepThreeITF } from "@/components/setup-steps/step-three-itf"
import { StepThreeAdmin } from "@/components/setup-steps/step-three-admin"
import { StepIndicator } from "@/components/setup-steps/step-indicator"
import { Phetsarath } from "next/font/google"

// Define the form schema for each step
const stepOneSchema = z.object({
  role: z.enum(["student", "industry_supervisor", "institution_supervisor", "admin", "itf"]),
})

const stepTwoStudentSchema = z.object({
  faculty: z.string().min(2, { message: "Faculty must be at least 2 characters." }),
  department: z.string().min(2, { message: "Department must be at least 2 characters." }),
  course: z.string().min(2, { message: "Course must be at least 2 characters." }),
  level: z.string({ required_error: "Please select your level." }),
  matricNo: z.string().min(5, { message: "Matriculation number must be at least 5 characters." }),
})

const stepTwoIndustrySupervisorSchema = z.object({
  staffId: z.string().min(5, { message: "Staff ID must be at least 5 characters." }),
})

const stepTwoInstitutionSupervisorSchema = z.object({
  staffId: z.string().min(5, { message: "Staff ID must be at least 5 characters." }),
  position: z.string().min(2, { message: "Position must be at least 2 characters." }),
  faculty: z.string().min(2, { message: "Faculty must be at least 2 characters." }),
  department: z.string().min(2, { message: "Department must be at least 2 characters." }),
})

const stepTwoITFSchema = z.object({
  staffId: z.string().min(5, { message: "Staff ID must be at least 5 characters." }),
})

const stepTwoAdminSchema = z.object({
  staffId: z.string().min(5, { message: "Staff ID must be at least 5 characters." }),
  faculty: z.string().min(2, { message: "Faculty must be at least 2 characters." }),
})

const stepThreeStudentSchema = z.object({
  organizationName: z.string().min(2, { message: "Organization name must be at least 2 characters." }),
  organizationAddress: z.string().min(5, { message: "Organization address must be at least 5 characters." }),
  supervisorName: z.string().min(2, { message: "Supervisor name must be at least 2 characters." }),
  supervisorEmail: z.string().email({ message: "Please enter a valid email address." }),
  startDate: z.string({ required_error: "Please select a start date." }),
  endDate: z.string({ required_error: "Please select an end date." }),
})

const stepThreeIndustrySupervisorSchema = z.object({
  organizationName: z.string().min(2, { message: "Organization name must be at least 2 characters." }),
  department: z.string().min(2, { message: "Department must be at least 2 characters." }),
  section: z.string().min(2, { message: "Section must be at least 2 characters." }),
  phoneNumber: z.string().min(10, { message: "Phone number must be at least 10 digits." }),
  signature: z.any().optional(),
})

const stepThreeInstitutionSupervisorSchema = z.object({
  signature: z.any().optional(),
  phoneNumber: z.string().min(10, { message: "Phone number must be at least 10 digits." }),
})

const stepThreeITFSchema = z.object({
  officeLocation: z.string().min(2, { message: "Office location must be at least 2 characters." }),
  phoneNumber: z.string().min(10, { message: "Phone number must be at least 10 digits." }),
})

const stepThreeAdminSchema = z.object({
  signature: z.any().optional(),
  phoneNumber: z.string().min(10, { message: "Phone number must be at least 10 digits." }),
})

// Combine all schemas for the final form data
const formSchema = z.object({
  role: stepOneSchema.shape.role,
  // Student fields
  faculty: z.string().optional(),
  department: z.string().optional(),
  course: z.string().optional(),
  level: z.string().optional(),
  matricNo: z.string().optional(),
  // Staff fields
  staffId: z.string().optional(),
  position: z.string().optional(),
  // Organization fields
  organizationName: z.string().optional(),
  organizationAddress: z.string().optional(),
  section: z.string().optional(),
  // Supervisor fields
  supervisorName: z.string().optional(),
  supervisorEmail: z.string().optional(),
  // Date fields
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  // Contact fields
  phoneNumber: z.string().optional(),
  officeLocation: z.string().optional(),
  specialization: z.string().optional(),
  // File fields
  signature: z.any().optional(),
})

type FormData = z.infer<typeof formSchema>
type Role = "student" | "industry_supervisor" | "institution_supervisor" | "itf" | "admin"

interface SetupAccountModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onComplete: (role: Role) => void
}

export function SetupAccountModal({ isOpen, onOpenChange, onComplete }: SetupAccountModalProps) {
  const [step, setStep] = useState(1)
  const { user } = useUser()
  const router = useRouter()
  const client = getClient({ token: writeToken })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  // Initialize the form with the combined schema
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      role: undefined,
      faculty: "",
      department: "",
      course: "",
      level: "",
      matricNo: "",
      staffId: "",
      position: "",
      organizationName: "",
      organizationAddress: "",
      section: "",
      supervisorName: "",
      supervisorEmail: "",
      startDate: "",
      endDate: "",
      phoneNumber: "",
      officeLocation: "",
      specialization: "",
      signature: undefined,
    },
    mode: "onChange",
  })


  const getDashboardPath = (role: string) => {
    switch (role) {
      case "student":
        return "/dashboard";
      case "industry_supervisor":
        return "/industrySupervisor";
      case "institution_supervisor":
        return "/instituteSupervisor";
      case "itf":
        return "/itfPersonnel";
      case "admin":
        return "/admin";
      default:
        return "/"; // fallback
    }
  };
    

  const role = form.watch("role")
  const totalSteps = 3

  const handleNext = async () => {
    // Validate the current step before proceeding
    let isValid = false

    if (step === 1) {
      isValid = await form.trigger("role")
    } else if (step === 2) {
      if (role === "student") {
        isValid = await form.trigger(["faculty", "department", "course", "level", "matricNo"])
      } else if (role === "industry_supervisor") {
        isValid = await form.trigger(["staffId"])
      } else if (role === "institution_supervisor") {
        isValid = await form.trigger(["staffId", "position", "faculty", "department"])
      } else if (role === "itf") {
        isValid = await form.trigger(["staffId"])
      } else if (role === "admin") {
        isValid = await form.trigger(["staffId", "faculty"])
      }
    } else if (step === 3) {
      if (role === "student") {
        isValid = await form.trigger([
          "organizationName",
          "organizationAddress",
          "supervisorName",
          "supervisorEmail",
          "startDate",
          "endDate",
        ])
      } else if (role === "industry_supervisor") {
        isValid = await form.trigger(["organizationName", "department", "section", "phoneNumber"])
      } else if (role === "institution_supervisor") {
        isValid = await form.trigger(["phoneNumber"])
      } else if (role === "itf") {
        isValid = await form.trigger(["officeLocation", "phoneNumber"])
      } else if (role === "admin") {
        isValid = await form.trigger(["phoneNumber"])
      }
    }

    if (isValid) {
      if (step < totalSteps) {
        setStep(step + 1)
      } else {
        // Submit the form
        onSubmit(form.getValues())
      }
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
  
    try {
      let signatureBase64: string | undefined;
  
      if (data.signature && data.signature.length > 0) {
        const file = data.signature[0];
        const reader = new FileReader();
        signatureBase64 = await new Promise((resolve, reject) => {
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      }
  
      const { role, ...rest } = data;
  
      const response = await fetch("/pages/api/setup-profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          role,
          signature: signatureBase64,
          ...rest, // Spread the rest of the fields based on the role
        }),
      });
  
      const result = await response.json();
  
      if (!response.ok) {
        throw new Error(result.error || "Failed to set up profile.");
      }
  
      toast({
        title: "Account setup complete",
        description: "Your account has been successfully set up.",
      });
  
      onOpenChange(false);
      onComplete?.(role);
  
      router.push(getDashboardPath(role));
  
    } catch (error) {
      console.error("Error setting up account:", error);
      toast({
        title: "Error",
        description: "There was an error setting up your account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          
          <DialogTitle>Account Setup {user?.firstName}</DialogTitle>
          <DialogDescription>Complete your account setup to start using the E-Logbook system.</DialogDescription>
        </DialogHeader>

        <StepIndicator currentStep={step} totalSteps={totalSteps} />

        <Form {...form}>
          <form className="space-y-6">
            {step === 1 && <StepOne form={form} />}

            {step === 2 && role === "student" && <StepTwoStudent form={form} />}
            {step === 2 && role === "industry_supervisor" && <StepTwoIndustrySupervisor form={form} />}
            {step === 2 && role === "institution_supervisor" && <StepTwoInstitutionSupervisor form={form} />}
            {step === 2 && role === "itf" && <StepTwoITF form={form} />}
            {step === 2 && role === "admin" && <StepTwoAdmin form={form} />}

            {step === 3 && role === "student" && <StepThreeStudent form={form} />}
            {step === 3 && role === "industry_supervisor" && <StepThreeIndustrySupervisor form={form} />}
            {step === 3 && role === "institution_supervisor" && <StepThreeInstitutionSupervisor form={form} />}
            {step === 3 && role === "itf" && <StepThreeITF form={form} />}
            {step === 3 && role === "admin" && <StepThreeAdmin form={form} />}
          </form>
        </Form>

        <DialogFooter className="flex flex-col sm:flex-row sm:justify-between sm:space-x-2">
          <Button type="button" variant="outline" onClick={handleBack} disabled={step === 1 || isSubmitting}>
            Back
          </Button>
          <Button type="button" onClick={handleNext} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : step === totalSteps ? (
              "Complete Setup"
            ) : (
              "Next"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
