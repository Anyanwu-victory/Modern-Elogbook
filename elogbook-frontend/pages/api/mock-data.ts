// Mock user data for different roles
export const mockUser = {
    firstName: "Demo",
    fullName: "Demo User",
    primaryEmailAddress: { emailAddress: "demo@example.com" },
    
  }
  
  export const mockSupervisorUser = {
    firstName: "Supervisor",
    fullName: "Supervisor User",
    primaryEmailAddress: { emailAddress: "supervisor@example.com" },
  }
  
  export const mockAdminUser = {
    firstName: "Admin",
    fullName: "Admin User",
    primaryEmailAddress: { emailAddress: "admin@example.com" },
    password: "admin",
  }
  
  // Mock logs data
  export const mockLogs = [
    {
      id: 1,
      day: "Monday",
      date: "2025-03-24",
      activity: "Attended orientation and was introduced to the team. Learned about the company's products and services.",
      status: "approved",
      feedback: "Good job on your first day!",
    },
    {
      id: 2,
      day: "Wednesday",
      date: "2025-03-26",
      activity:
        "Worked on database design for the new customer management system. Created ER diagrams and discussed with the senior developer.",
      status: "pending",
      feedback: "",
    },
    {
      id: 3,
      day: "Friday",
      date: "2025-03-28",
      activity:
        "Attempted to implement the login functionality but faced issues with authentication. Need to revisit the documentation.",
      status: "rejected",
      feedback: "Please provide more details about the specific authentication issues you faced.",
    },
    {
      id: 4,
      day: "Monday",
      date: "2025-03-31",
      activity:
        "Fixed the authentication issues by implementing JWT tokens. Successfully completed the login functionality.",
      status: "approved",
      feedback: "Great problem-solving skills!",
    },
    {
      id: 5,
      day: "Wednesday",
      date: "2025-04-02",
      activity: "Started working on the user profile page. Created wireframes and discussed with the UI/UX team.",
      status: "pending",
      feedback: "",
    },
  ]
  
  // Mock data for supervisor dashboard
  export const recentSubmissions = [
    {
      id: 1,
      student: "John Doe",
      matricNo: "ENG/2020/001",
      date: "2025-03-28",
      status: "pending",
    },
    {
      id: 2,
      student: "Jane Smith",
      matricNo: "ENG/2020/002",
      date: "2025-03-27",
      status: "pending",
    },
    {
      id: 3,
      student: "Michael Johnson",
      matricNo: "ENG/2020/003",
      date: "2025-03-26",
      status: "approved",
    },
    {
      id: 4,
      student: "Emily Williams",
      matricNo: "ENG/2020/004",
      date: "2025-03-25",
      status: "rejected",
    },
  ]
  
  // Mock data for admin dashboard
  export const recentUsers = [
    {
      id: 1,
      name: "John Doe",
      role: "Student",
      email: "john.doe@example.com",
      date: "2025-03-28",
    },
    {
      id: 2,
      name: "Jane Smith",
      role: "Student",
      email: "jane.smith@example.com",
      date: "2025-03-27",
    },
    {
      id: 3,
      name: "Dr. Michael Johnson",
      role: "Supervisor",
      email: "michael.johnson@example.com",
      date: "2025-03-26",
    },
  ]
  
  