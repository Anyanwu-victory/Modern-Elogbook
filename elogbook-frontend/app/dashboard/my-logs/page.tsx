"use client";

import { useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { mockLogs, mockUser } from "@/pages/api/mock-data";

export default function MyLogsPage() {
  const user = mockUser;
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLog, setSelectedLog] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const itemsPerPage = 5;

  const filteredLogs = mockLogs.filter((log) =>
    (log.activity.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.day.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.date.includes(searchTerm)) &&
    (statusFilter === "all" || log.status === statusFilter)
  );

  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const paginatedLogs = filteredLogs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
//    <DashboardLayout userRole="student">
<>
      <Header router={router} />
      <Filters searchTerm={searchTerm} setSearchTerm={setSearchTerm} statusFilter={statusFilter} setStatusFilter={setStatusFilter} />
      <LogsTable logs={paginatedLogs} onViewLog={setSelectedLog} openDialog={setIsDialogOpen} />
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      <LogDetailsDialog log={selectedLog} isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} />
      </>
  //  </DashboardLayout>
  );
}

interface HeaderProps {
  router: ReturnType<typeof useRouter>;
}


function Header({ router }: HeaderProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
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

interface Log {
  id: string;
  day: string;
  date: string;
  activity: string;
  status: 'approved' | 'pending' | 'rejected';
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
                <TableCell>{log.activity}</TableCell>
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
        <p>{log?.activity}</p>
        <StatusBadge status={log?.status} />
        {log?.feedback && <p>{log.feedback}</p>}
        <Button onClick={onClose}>Close</Button>
      </DialogContent>
    </Dialog>
  );
}

function StatusBadge({ status }) {
  const variants = { approved: "success", pending: "outline", rejected: "destructive" };
  return <Badge variant={variants[status]}>{status}</Badge>;
}
