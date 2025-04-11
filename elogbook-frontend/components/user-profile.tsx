import React from 'react'
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Activity, AlertCircle, Calendar, CheckCircle2, Clock, FileText, Info, Loader2, XCircle } from "lucide-react"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"


const userProfile = () => {
  return (
    <div>
   <h1>User profile</h1>
    </div>
  )
}

export default userProfile;