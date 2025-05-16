import { Loader2 } from "lucide-react"

import { DashboardLayout } from "@/components/dashboard-layout"

export default function AdminSettingsLoading() {
  return (
  
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">Manage your SIWES system settings and configurations.</p>
        </div>

        <div className="flex items-center justify-center h-[calc(100vh-10rem)]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
  
  )
}
