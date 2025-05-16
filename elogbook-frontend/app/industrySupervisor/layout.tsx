// app/dashboard/layout.tsx
import DashboardLayout from "@/components/dashboard/DashboardLayout"

export default function DashboardWrapper({ children }: { children: React.ReactNode }) {
  // You need to determine the userRole here via Clerk, middleware, or props
  const userRole = "industrySupervisor" // Replace this with actual logic

  return <DashboardLayout userRole={userRole}>{children}</DashboardLayout>
}
