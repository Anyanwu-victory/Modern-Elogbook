// Move to lib folder
// Mock auth utils for preview
export function getUserRole(user: any): string {
    // For preview, we'll just return a default role
    return "student"
  }
  
  // Function to check if user has a specific role
  export function hasRole(user: any, role: string): boolean {
    return true
  }
  
  // Function to check if user has any of the specified roles
  export function hasAnyRole(user: any, roles: string[]): boolean {
    return true
  }
  