// lib/api/users.ts

export type User = {
    id: string
    firstName: string
    lastName: string
    fullName: string
    email: string
    role: string
  }
  
  // Fetch all users from the backend API
  export async function getAllUsers(page: number = 1, limit: number = 100): Promise<{ success: boolean; users: User[] }> {
    try {
      const res = await fetch(`/api/users`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        next: { revalidate: 60 }, // Optional: use for caching behavior
      })
  
      if (!res.ok) throw new Error("Failed to fetch")
  
      return await res.json()
    } catch (error) {
      console.error("getAllUsers error:", error)
      return { success: false, users: [] }
    }
  }
  
  // Assign students to a supervisor
  export async function assignStudentsToSupervisor(
    industrySupervisorId: string,
    instituteSupervisorId: string,
    studentIds: string[]
  ): Promise<{
    message: string; success: boolean;
}> {
  
    try {
      const res = await fetch(`/api/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ industrySupervisorId, instituteSupervisorId , studentIds }),
      })
  
      return await res.json()
    } catch (error) {
      console.error("assignStudentsToSupervisor error:", error)
      return {message: "Failed", success: false }
    }
  }
  