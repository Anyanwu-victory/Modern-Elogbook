// components/dashboard/tabs.ts
import { Home, FileText, ClipboardList, Users, Calendar, BookOpen, BarChart3, Settings } from "lucide-react"

export const TABS = {
  student: [
    { value: "dashboard", name: "Dashboard", icon: Home },
    { value: "submit-logs", name: "Submit Logs", icon: FileText },
    { value: "my-logs", name: "My Logs", icon: ClipboardList },
  ],
  admin: [
    { value: "admin", name: "Dashboard", icon: Home },
    { value: "users", name: "Users", icon: Users },
    { value: "my-logs", name: "Logs", icon: BookOpen },
    { value: "analytics", name: "Analytics", icon: BarChart3 },
    { value: "settings", name: "Settings", icon: Settings },
  ],
  industrySupervisor: [
    { value: "industrySupervisor", name: "Dashboard", icon: Home },
    { value: "review-logs", name: "Review Logs", icon: ClipboardList },
    { value: "calendar", name: "Calendar", icon: Calendar },
  ],
  instituteSupervisor: [
    { value: "instituteSupervisor", name: "Dashboard", icon: Home },
    { value: "students", name: "Students", icon: Users },
    { value: "review-logs", name: "Review Logs", icon: ClipboardList },
  ],
  itfPersonnel: [
    { value: "itfPersonnel", name: "Dashboard", icon: Home },
    { value: "students", name: "Students", icon: Users },
    { value: "analytics", name: "Analytics", icon: BarChart3 },
  ],
}
