"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Loader2 } from "lucide-react"

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
import { StepTwoStaff } from "@/components/setup-steps/step-two-staff"
import { StepThreeStudent } from "@/components/setup-steps/step-three-student"
import { StepThreeStaff } from "@/components/setup-steps/step-three-staff"
import { StepIndicator } from "@/components/setup-steps/step-indicator"

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

const stepTwoStaffSchema = z.object({
  staffId: z.string().min(5, { message: "Staff ID must be at least 5 characters." }),
  department: z.string().min(2, { message: "Department must be at least 2 characters." }),
  position: z.string().min(2, { message: "Position must be at least 2 characters." }),
})

const stepThreeStudentSchema = z.object({
  organizationName: z.string().min(2, { message: "Organization name must be at least 2 characters." }),
  organizationAddress: z.string().min(5, { message: "Organization address must be at least 5 characters." }),
  supervisorName: z.string().min(2, { message: "Supervisor name must be at least 2 characters." }),
  supervisorEmail: z.string().email({ message: "Please enter a valid email address." }),
  startDate: z.string({ required_error: "Please select a start date." }),
  endDate: z.string({ required_error: "Please select an end date." }),
})

const stepThreeStaffSchema = z.object({
  phoneNumber: z.string().min(10, { message: "Phone number must be at least 10 digits." }),
  officeLocation: z.string().min(2, { message: "Office location must be at least 2 characters." }),
  specialization: z.string().optional(),
})

// Combine all schemas for the final form data
const formSchema = z.object({
  role: stepOneSchema.shape.role,
  // These fields are conditionally required based on the role
  faculty: z.string().optional(),
  department: z.string().optional(),
  course: z.string().optional(),
  level: z.string().optional(),
  matricNo: z.string().optional(),
  staffId: z.string().optional(),
  position: z.string().optional(),
  organizationName: z.string().optional(),
  organizationAddress: z.string().optional(),
  supervisorName: z.string().optional(),
  supervisorEmail: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  phoneNumber: z.string().optional(),
  officeLocation: z.string().optional(),
  specialization: z.string().optional(),
})

type FormData = z.infer<typeof formSchema>

interface SetupAccountModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onComplete: () => void
}

export function SetupAccountModal({ isOpen, onOpenChange, onComplete }: SetupAccountModalProps) {
  const [step, setStep] = useState(1)
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
      supervisorName: "",
      supervisorEmail: "",
      startDate: "",
      endDate: "",
      phoneNumber: "",
      officeLocation: "",
      specialization: "",
    },
    mode: "onChange",
  })

  const role = form.watch("role")
  const isStudent = role === "student"
  const totalSteps = 3

  const handleNext = async () => {
    // Validate the current step before proceeding
    let isValid = false

    if (step === 1) {
      isValid = await form.trigger("role")
    } else if (step === 2) {
      if (isStudent) {
        isValid = await form.trigger(["faculty", "department", "course", "level", "matricNo"])
      } else {
        isValid = await form.trigger(["staffId", "department", "position"])
      }
    } else if (step === 3) {
      if (isStudent) {
        isValid = await form.trigger([
          "organizationName",
          "organizationAddress",
          "supervisorName",
          "supervisorEmail",
          "startDate",
          "endDate",
        ])
      } else {
        isValid = await form.trigger(["phoneNumber", "officeLocation", "specialization"])
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
    setIsSubmitting(true)

    // In a real application, you would send this data to your backend
    console.log("Form submitted:", data)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      toast({
        title: "Account setup complete",
        description: "Your account has been successfully set up.",
      })
      onOpenChange(false)
      onComplete()
    }, 1500)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Account Setup</DialogTitle>
          <DialogDescription>Complete your account setup to start using the E-Logbook system.</DialogDescription>
        </DialogHeader>

        <StepIndicator currentStep={step} totalSteps={totalSteps} />

        <Form {...form}>
          <form className="space-y-6">
            {step === 1 && <StepOne form={form} />}

            {step === 2 && isStudent && <StepTwoStudent form={form} />}
            {step === 2 && !isStudent && <StepTwoStaff form={form} />}

            {step === 3 && isStudent && <StepThreeStudent form={form} />}
            {step === 3 && !isStudent && <StepThreeStaff form={form} />}
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
