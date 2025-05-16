"use server"

import type { VisitEventWithDetails } from "@/lib/types"

// Mock data for visits
const mockVisits: VisitEventWithDetails[] = [
  {
    id: "visit-1",
    title: "Mid-term Evaluation",
    start: new Date(new Date().setDate(new Date().getDate() + 3)),
    end: new Date(new Date().setDate(new Date().getDate() + 3) + 60 * 60 * 1000),
    visitType: "institute",
    location: "Tech Solutions Inc., 123 Tech Street",
    company: "Tech Solutions Inc.",
    supervisor: "Dr. Michael Brown",
    students: ["John Doe", "Jane Smith"],
    notes: "Bring student evaluation forms and company feedback forms.",
  },
  {
    id: "visit-2",
    title: "Final Assessment",
    start: new Date(new Date().setDate(new Date().getDate() + 10)),
    end: new Date(new Date().setDate(new Date().getDate() + 10) + 90 * 60 * 1000),
    visitType: "institute",
    location: "Global Systems Ltd., 456 Innovation Avenue",
    company: "Global Systems Ltd.",
    supervisor: "Dr. Sarah Johnson",
    students: ["Bob Johnson", "Alice Williams"],
    notes: "Final assessment of student performance. Collect all required documentation.",
  },
  {
    id: "visit-3",
    title: "ITF Inspection",
    start: new Date(new Date().setDate(new Date().getDate() + 5)),
    end: new Date(new Date().setDate(new Date().getDate() + 5) + 120 * 60 * 1000),
    visitType: "itf",
    location: "Multiple companies in Tech Park",
    company: "Various",
    supervisor: "Mr. David Wilson (ITF)",
    students: ["John Doe", "Jane Smith", "Bob Johnson", "Alice Williams"],
    notes: "ITF representative will inspect student placements and verify training conditions.",
  },
  {
    id: "visit-4",
    title: "Industry Feedback Session",
    start: new Date(new Date().setDate(new Date().getDate() + 7)),
    end: new Date(new Date().setDate(new Date().getDate() + 7) + 60 * 60 * 1000),
    visitType: "industry",
    location: "University Conference Room",
    company: "Multiple Companies",
    supervisor: "Industry Panel",
    students: ["John Doe", "Jane Smith", "Bob Johnson"],
    notes: "Industry supervisors will provide feedback on the SIWES program.",
  },
]

// Mock supervisors data
const mockSupervisors = [
  { id: "sup-1", name: "Dr. Michael Brown" },
  { id: "sup-2", name: "Dr. Sarah Johnson" },
  { id: "sup-3", name: "Prof. Robert Davis" },
  { id: "sup-4", name: "Dr. Emily Wilson" },
]

// Mock students data
const mockStudents = [
  { id: "stu-1", name: "John Doe" },
  { id: "stu-2", name: "Jane Smith" },
  { id: "stu-3", name: "Bob Johnson" },
  { id: "stu-4", name: "Alice Williams" },
  { id: "stu-5", name: "Michael Thompson" },
  { id: "stu-6", name: "Sarah Parker" },
]

// Fetch all visits
export async function fetchAllVisits(): Promise<VisitEventWithDetails[]> {
  // In a real app, this would fetch from your database
  return mockVisits
}

// Fetch visits for industry supervisors
export async function fetchIndustrySupervisorVisits(): Promise<VisitEventWithDetails[]> {
  // In a real app, this would filter visits based on the logged-in industry supervisor
  return mockVisits.filter((visit) => visit.visitType === "institute" || visit.visitType === "itf")
}

// Fetch visits for institution supervisors
export async function fetchInstitutionSupervisorVisits(): Promise<VisitEventWithDetails[]> {
  // In a real app, this would filter visits based on the logged-in institution supervisor
  return mockVisits.filter(
    (visit) => visit.supervisor === "Dr. Michael Brown" || visit.supervisor === "Dr. Sarah Johnson",
  )
}

// Schedule a new visit
export async function scheduleVisit(visitData: any): Promise<VisitEventWithDetails> {
  // In a real app, this would create a new visit in your database
  const newVisit: VisitEventWithDetails = {
    id: `visit-${Date.now()}`,
    title: visitData.title,
    start: new Date(`${visitData.date.toISOString().split("T")[0]}T${visitData.startTime}`),
    end: new Date(`${visitData.date.toISOString().split("T")[0]}T${visitData.endTime}`),
    visitType: visitData.visitType,
    location: visitData.location,
    company: visitData.company || "",
    supervisor: mockSupervisors.find((s) => s.id === visitData.supervisorId)?.name || "",
    students: visitData.studentIds
      .map((id: string) => mockStudents.find((s) => s.id === id)?.name || "")
      .filter(Boolean),
    notes: visitData.notes || "",
  }

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // In a real app, you would return the newly created visit from your database
  return newVisit
}

// Update an existing visit
export async function updateVisit(visitId: string, visitData: any): Promise<VisitEventWithDetails> {
  // In a real app, this would update a visit in your database
  const updatedVisit: VisitEventWithDetails = {
    id: visitId,
    title: visitData.title,
    start: new Date(`${visitData.date.toISOString().split("T")[0]}T${visitData.startTime}`),
    end: new Date(`${visitData.date.toISOString().split("T")[0]}T${visitData.endTime}`),
    visitType: visitData.visitType,
    location: visitData.location,
    company: visitData.company || "",
    supervisor: mockSupervisors.find((s) => s.id === visitData.supervisorId)?.name || "",
    students: visitData.studentIds
      .map((id: string) => mockStudents.find((s) => s.id === id)?.name || "")
      .filter(Boolean),
    notes: visitData.notes || "",
  }

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // In a real app, you would return the updated visit from your database
  return updatedVisit
}

// Delete a visit
export async function deleteVisit(visitId: string): Promise<void> {
  // In a real app, this would delete a visit from your database

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // In a real app, you would perform the actual deletion in your database
  return
}

// Fetch supervisors
export async function fetchSupervisors(): Promise<{ id: string; name: string }[]> {
  // In a real app, this would fetch supervisors from your database
  return mockSupervisors
}

// Fetch students
export async function fetchStudents(): Promise<{ id: string; name: string }[]> {
  // In a real app, this would fetch students from your database
  return mockStudents
}
