"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Download,
  Eye,
  FileText,
  Filter,
  Search,
  XCircle,
} from "lucide-react";

import { DashboardLayout } from "@/components/dashboard-layout";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast"
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { getClient } from "@/sanity/lib/sanity.client";
import {useUser} from "@clerk/nextjs";
import {getStudentLogsQuery} from "@/sanity/lib/sanity.queries"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { mockLogs, mockUser } from "@/pages/api/mock-data";

export default function MyLogsPage() {
  const {user , isSignedIn , isLoaded} = useUser();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();
  const [logs, setLogs] = useState<Log[]>([]);
  const [selectedLog, setSelectedLog] = useState<Log | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const itemsPerPage = 5;
  
  useEffect(() => {
    const fetchLogs = async () => {
      if (!user?.id) return;
  
      if (!isLoaded || !user) {
        toast({
          title: "Error",
          description: "Please sign in to submit logs",
          variant: "destructive",
        });
        return;
      }
    
      try {
        const client = getClient(); // no token needed for read
        const query = getStudentLogsQuery(user.id);
        const result = await client.fetch(query);

        setLogs(result);
      } catch (error) {
        console.error("Failed to fetch logs:", error);
      }
    };

    fetchLogs();
  }, [user?.id]);



  const filteredLogs = mockLogs.filter((log) =>
    (log.activity.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.day.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.date.includes(searchTerm)) &&
    (statusFilter === "all" || log.status === statusFilter)
  );

  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const paginatedLogs = filteredLogs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  
  const handleViewLog = (log: Log) => {
    setSelectedLog(log);
  }
  
  return (
//<DashboardLayout userRole="student">
<>

      <Header router={router} />
      <Filters searchTerm={searchTerm} setSearchTerm={setSearchTerm} statusFilter={statusFilter} setStatusFilter={setStatusFilter} />
      <LogsTable logs={logs} onViewLog={handleViewLog} openDialog={setIsDialogOpen} />
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      <LogDetailsDialog log={selectedLog} isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} />
      </>
//</DashboardLayout>
  );
}

interface HeaderProps {
  router: ReturnType<typeof useRouter>;
}


function Header({ router }: HeaderProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mx-3">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Logs</h1>
        <p className="text-muted-foreground">View and manage your submitted logs.</p>
      </div>
      <Button onClick={() => router.push("/dashboard/submit-log")}>
        <FileText className="mr-2 h-4 w-4" /> Submit New Log
      </Button>
    </div>
  );
}

interface FiltersProps {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  statusFilter: string;
  setStatusFilter: React.Dispatch<React.SetStateAction<string>>;
}


function Filters({ searchTerm, setSearchTerm, statusFilter, setStatusFilter }: FiltersProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4">
      <InputWithIcon icon={Search} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search logs..." />
      <Select value={statusFilter} onValueChange={setStatusFilter}>
        <SelectTrigger>
          <Filter className="h-4 w-4" />
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          <SelectItem value="approved">Approved</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="rejected">Rejected</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

interface InputWithIconProps {
  icon: React.ElementType;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

const InputWithIcon = ({ icon: Icon, value, onChange, placeholder }: InputWithIconProps) => (
  <div className="relative w-full">
    <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
    <Input value={value} onChange={onChange} placeholder={placeholder} className="pl-10" />
  </div>
);

export interface Log {
  id: string;
  _type: 'log'
  day: string;
  date: string;
  activities: string;
  status: 'approved' | 'pending' | 'reviewed';
  student?: {
    _ref: string;
    _type: 'reference';
  };
  // I need feedback, add it explicitly:
  industrySupervisorFeedback?: string;
  institutionSupervisorFeedback?: string;
  industrySupervisorSignature?: {
    _type: 'file';
    asset: {
      _type: 'reference';   
      _ref: string;
    }
  };
}

interface LogsTableProps {
  logs: Log[];
  onViewLog: (log: Log) => void;
  openDialog: (open: boolean) => void;
}


function LogsTable({ logs, onViewLog, openDialog }: LogsTableProps) {
    //const handleViewLog = (log: Log) => {
    
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Day</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Activity</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.length > 0 ? (
            logs.map((log) => (
              <TableRow key={log.id}>
                <TableCell>{log.day}</TableCell>
                <TableCell>{log.date}</TableCell>
                <TableCell>{log.activities}</TableCell>
                <TableCell><StatusBadge status={log.status} /></TableCell>
                <TableCell>
                  <Button variant="outline" size="icon" onClick={() => { onViewLog(log); openDialog(true); }}>
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center">No logs found.</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );

}

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}


function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  return (
    <div className="flex justify-center space-x-2">
      <Button variant="outline" size="icon" disabled={currentPage === 1} onClick={() => onPageChange(currentPage - 1)}>
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <span>Page {currentPage} of {totalPages}</span>
      <Button variant="outline" size="icon" disabled={currentPage === totalPages} onClick={() => onPageChange(currentPage + 1)}>
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
interface LogDetailsDialogProps {
  log: Log | null;
  isOpen: boolean;
  onClose: () => void;
}


function LogDetailsDialog({ log, isOpen, onClose }: LogDetailsDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Log Details</DialogTitle>
          <DialogDescription>{log?.day}, {log?.date}</DialogDescription>
        </DialogHeader>
        
        <h1 className="font-bold">Activity</h1>
        <p>{log?.activities}</p>
        
        <h1 className="font-bold">Status </h1>
        <StatusBadge status={log?.status || 'pending'} />

        <p className="font-bold">Industry Supervisor Feedback:</p>
        {log?.industrySupervisorFeedback || <p>{'No feedback yet'}</p>}
        
        <p className="font-bold"> Industry Supervisor Signature:</p>
        {log?.industrySupervisorSignature && (
          <img 
           src={log.industrySupervisorSignature.asset._ref}
           alt="Industry Supervisor Signature"
            className="w-32 h-32 rounded-md border"
          />
        )}

        <Button onClick={onClose}>Close</Button>
      </DialogContent>
    </Dialog>
  );
}

// Add type for status variants
const statusVariants: Record<'approved' | 'pending' | 'reviewed', string> = {
  approved: 'bg-green-100 text-green-800',
  pending: 'bg-yellow-100 text-yellow-800',
  reviewed: 'bg-red-100 text-red-800',
};

// Then type your component props:
interface StatusBadgeProps {
  status: 'approved' | 'pending' | 'reviewed';
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
  return (
    <span className={`text-xs font-medium px-2.5 py-0.5 rounded ${statusVariants[status]}`}>
      {status}
    </span>
  );
};