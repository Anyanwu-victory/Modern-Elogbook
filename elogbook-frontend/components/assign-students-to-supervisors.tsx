"use client"

import { useState, useEffect, MouseEvent } from "react"
import { Check, ChevronsUpDown, Loader2, UserPlus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { assignStudentsToSupervisor, getAllUsers, User } from "@/lib/api/users"

// --- Reusable Supervisor Selector Component ---
interface SupervisorSelectorProps {
  label: string
  placeholder?: string
  supervisors: User[]
  selectedSupervisor: User | null
  onSelectSupervisor: (supervisor: User | null) => void
  disabled?: boolean
}

function SupervisorSelector({
  label,
  placeholder = "Select supervisor...",
  supervisors,
  selectedSupervisor,
  onSelectSupervisor,
  disabled = false,
}: SupervisorSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={isOpen}
            className="w-full justify-between"
            disabled={disabled}
          >
            {selectedSupervisor ? selectedSupervisor.fullName : placeholder}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
          <Command>
            <CommandInput placeholder="Search supervisors..." />
            <CommandList>
              <CommandEmpty>No supervisor found.</CommandEmpty>
              <CommandGroup>
                {supervisors.map((supervisor) => (
                  <CommandItem
                    key={supervisor.id}
                    value={supervisor.fullName}
                    onSelect={() => {
                      onSelectSupervisor(supervisor.id === selectedSupervisor?.id ? null : supervisor)
                      setIsOpen(false)
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedSupervisor?.id === supervisor.id ? "opacity-100" : "opacity-0",
                      )}
                    />
                    {supervisor.fullName}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
// --- End of Reusable Supervisor Selector Component ---

export function AssignStudentsToSupervisors() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [students, setStudents] = useState<User[]>([])
  const [industrySupervisors, setIndustrySupervisors] = useState<User[]>([])
  const [instituteSupervisors, setInstituteSupervisors] = useState<User[]>([])

  const [selectedIndustrySupervisor, setSelectedIndustrySupervisor] = useState<User | null>(null)
  const [selectedInstituteSupervisor, setSelectedInstituteSupervisor] = useState<User | null>(null) // Renamed
  const [selectedStudents, setSelectedStudents] = useState<User[]>([])

  // State for student popover only
  const [openStudent, setOpenStudent] = useState(false)

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true) // Set loading true at the start
      try {
        const response = await getAllUsers(1, 100) // Consider pagination if list grows large
        if (response.success) {
          const users = response.users || []
          setIndustrySupervisors(users.filter((user: User) => user.role === "industry_supervisor"))
          setInstituteSupervisors(users.filter((user: User) => user.role === "institution_supervisor"))
          setStudents(users.filter((user: User) => user.role === "student"))
        } else {
          // Handle API error reported in response.success = false
           toast({
             title: "Error",
             description: "Failed to fetch users.",
             variant: "destructive",
           })
        }
      } catch (error) {
        console.error("Error fetching users:", error)
        toast({
          title: "Error",
          description: "An unexpected error occurred while fetching users. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchUsers()
  }, [toast]) // Dependency array includes toast

  const handleSelectStudent = (student: User) => {
    setSelectedStudents((prevSelected) =>
      prevSelected.some((s) => s.id === student.id)
        ? prevSelected.filter((s) => s.id !== student.id)
        : [...prevSelected, student]
    )
  }

  const handleAssignStudents = async (supervisorType: "industry" | "institute") => {
    const targetSupervisor = supervisorType === "industry" ? selectedIndustrySupervisor : selectedInstituteSupervisor
    const supervisorRoleName = supervisorType === "industry" ? "Industry Supervisor" : "Institute Supervisor"

    if (!targetSupervisor) {
      toast({
        title: "Error",
        description: `Please select an ${supervisorRoleName}.`,
        variant: "destructive",
      })
      return
    }

    if (selectedStudents.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one student.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      const industrySupervisorId = supervisorType === "industry" ? targetSupervisor.id : ""
      const instituteSupervisorId = supervisorType === "institute" ? targetSupervisor.id : ""
      const studentIds = selectedStudents.map((s) => s.id)

      const response = await assignStudentsToSupervisor(industrySupervisorId, instituteSupervisorId, studentIds)
      console.log("Assign response:", response);
      console.log({
        industrySupervisorId,
        instituteSupervisorId,
        studentIds,
      });

      if (response.success) {
        toast({
          title: "Success",
          description: `${selectedStudents.length} student(s) assigned succesfully to ${targetSupervisor.fullName} (${supervisorRoleName}).`,
        })
        setSelectedStudents([]) // Clear selected students on success
        // Optionally, refetch data or update UI to reflect assignment
      } else {
        throw new Error(response.message || `Failed to assign students to ${supervisorRoleName}.`)
      }
    } catch (error: any) {
      console.error(`Error assigning students to ${supervisorRoleName}:`, error)
      toast({
        title: "Error",
        description: error.message || `Failed to assign students to ${supervisorRoleName}. Please try again.`,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Assign Students to Supervisors</CardTitle>
          <CardDescription>Loading user data...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Assign Students to Supervisors</CardTitle>
        <CardDescription>Select supervisors and students, then assign.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Reusable Industry Supervisor Selector */}
        <SupervisorSelector
          label="Select Industry Supervisor"
          supervisors={industrySupervisors}
          selectedSupervisor={selectedIndustrySupervisor}
          onSelectSupervisor={setSelectedIndustrySupervisor}
          disabled={isSubmitting}
        />

        {/* Reusable Institute Supervisor Selector */}
        <SupervisorSelector
          label="Select Institute Supervisor"
          supervisors={instituteSupervisors}
          selectedSupervisor={selectedInstituteSupervisor}
          onSelectSupervisor={setSelectedInstituteSupervisor}
          disabled={isSubmitting}
        />

        {/* Student Selector */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Select Students</label>
            <span className="text-xs text-muted-foreground">{selectedStudents.length} selected</span>
          </div>
          <Popover open={openStudent} onOpenChange={setOpenStudent}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={openStudent}
                className="w-full justify-between"
                disabled={isSubmitting || students.length === 0} // Disable if no students fetched
              >
                {selectedStudents.length > 0 ? `${selectedStudents.length} student(s) selected` : "Select students..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
              <Command>
                <CommandInput placeholder="Search students..." />
                <CommandList>
                  <CommandEmpty>No student found.</CommandEmpty>
                  <CommandGroup>
                    {students.map((student) => (
                      <CommandItem
                        key={student.id}
                        value={student.fullName} // Value used for searching
                        onSelect={() => handleSelectStudent(student)}
                        // Prevent closing popover on select for multi-select experience
                        // onClick={() => handleSelectStudent(student)} // Use onClick if onSelect closes popover
                      >
                        <div
                          className={cn(
                            "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                            selectedStudents.some((s) => s.id === student.id)
                              ? "bg-primary text-primary-foreground"
                              : "opacity-50 [&_svg]:invisible", // Hide checkmark better
                          )}
                          aria-hidden="true" // Hide decorative checkbox from screen readers
                        >
                          <Check className="h-3 w-3" />
                        </div>
                        {student.fullName}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        {/* Display Selected Students */}
        {selectedStudents.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">Selected Students:</h4>
            <div className="flex flex-wrap gap-2">
              {selectedStudents.map((student) => (
                <div
                  key={student.id}
                  className="flex items-center gap-1 bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-xs"
                >
                  {student.fullName}
                  <button
                    onClick={() => handleSelectStudent(student)}
                    className="text-secondary-foreground/70 hover:text-secondary-foreground focus:outline-none focus:ring-1 focus:ring-ring rounded-sm"
                    aria-label={`Remove ${student.fullName}`} // Accessibility
                    disabled={isSubmitting}
                  >
                    &times; {/* Consider using a small X icon */}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex flex-col sm:flex-row gap-4">
         {/* Assign to Industry Supervisor Button */}
        <Button
          onClick={() => handleAssignStudents("industry")}
          disabled={!selectedIndustrySupervisor || selectedStudents.length === 0 || isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Assigning...
            </>
          ) : (
            <>
              <UserPlus className="mr-2 h-4 w-4" />
              Assign to Industry Supervisor
            </>
          )}
        </Button>

         {/* Assign to Institute Supervisor Button */}
        <Button
          onClick={() => handleAssignStudents("institute")}
          disabled={!selectedInstituteSupervisor || selectedStudents.length === 0 || isSubmitting}
          variant="secondary"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Assigning...
            </>
          ) : (
            <>
              <UserPlus className="mr-2 h-4 w-4" />
              Assign to Institute Supervisor
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}