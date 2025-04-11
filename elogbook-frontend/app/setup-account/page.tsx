"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SetupAccountModal } from "@/components/setup-account-modal"

export default function SetupAccountPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false)
      // Auto-open the modal when the page loads
      setIsModalOpen(true)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const handleSetupComplete = () => {
    // Redirect to dashboard after setup is complete
    router.push("/dashboard")
  }

  if (isLoading) {
    return (
     
        <div className="flex items-center justify-center h-[calc(100vh-10rem)]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
     
    )
  }

  return (
    
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Account Setup</h1>
          <p className="text-muted-foreground">Complete your account setup to start using the E-Logbook system.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Welcome to SIWESTrack</CardTitle>
            <CardDescription>
              Please complete your account setup to get started with the E-Logbook system.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Your account needs to be configured before you can start using the system. This will only take a few
              minutes.
            </p>
            <p>You'll need to provide information about your role, personal details, and organization information.</p>
            <Button onClick={() => setIsModalOpen(true)}>Start Setup</Button>
          </CardContent>
        </Card>

        <SetupAccountModal isOpen={isModalOpen} onOpenChange={setIsModalOpen} onComplete={handleSetupComplete} />
      </div>

  )
}
