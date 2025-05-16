// Visit event types
export interface VisitEvent {
    id: string
    title: string
    start: string | Date
    end: string | Date
    visitType: "institute" | "industry" | "itf"
    location: string
  }
  
  export interface VisitEventWithDetails extends VisitEvent {
    company: string
    supervisor: string
    students: string[]
    notes?: string
  }
  