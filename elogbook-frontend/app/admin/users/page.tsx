// app/admin/user-management/page.tsx
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2, Eye, Trash2, Check, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
  Table,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
} from '@/components/ui/table';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type UserStatus = 'pending' | 'approved';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: UserStatus;
  role: string;
  department: string;
  institution: string;
}

const AdminUserDashboard = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const router = useRouter();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isLoaded, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const mockUsers: User[] = [
          {
            id: '1',
            name: 'Jane Doe',
            email: 'jane@example.com',
            phone: '+2348012345678',
            status: 'pending',
            role: 'student',
            department: 'Computer Science',
            institution: 'University of Abuja',
          },
          {
            id: '2',
            name: 'John Smith',
            email: 'john@example.com',
            phone: '+2348098765432',
            status: 'approved',
            role: 'industrySupervisor',
            department: 'Engineering',
            institution: 'Lagos State University',
          },
        ];
        setUsers(mockUsers);
        setFilteredUsers(mockUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const filtered = users.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = roleFilter === 'all' || user.role === roleFilter;
      return matchesSearch && matchesRole;
    });
    setFilteredUsers(filtered);
  }, [searchTerm, roleFilter, users]);

  const approveUser = (userId: string) => {
    setUsers(prevUsers =>
      prevUsers.map(user =>
        user.id === userId ? { ...user, status: 'approved' } : user
      )
    );
  };

  const deleteUser = (userId: string) => {
    setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
  };

  if (isLoaded) {
    return (
      //<DashboardLayout userRole="admin">
        <div className="flex items-center justify-center h-[calc(100vh-10rem)]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      //</DashboardLayout>
    );
  }

  return (
    //<DashboardLayout userRole="admin">
      <div className="p-6">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.push("./")}
            className="flex items-center"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h1 className="text-2xl font-bold">User Management</h1>
          
          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="student">Student</SelectItem>
                <SelectItem value="industrySupervisor">Industry Supervisor</SelectItem>
                <SelectItem value="instituteSupervisor">Institute Supervisor</SelectItem>
                <SelectItem value="itfPersonnel">ITF Personnel</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {filteredUsers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Search className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg text-muted-foreground">
              {users.length === 0 ? 'No users found' : 'No matching users found'}
            </p>
            {users.length > 0 && searchTerm && (
              <Button
                variant="ghost"
                className="mt-2"
                onClick={() => {
                  setSearchTerm('');
                  setRoleFilter('all');
                }}
              >
                Clear filters
              </Button>
            )}
          </div>
        ) : (
          <Table>
            <TableHeader className="">
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody className="">
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.phone}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        user.status === 'approved'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {user.status}
                    </span>
                  </TableCell>
                  <TableCell className="capitalize">
                    {user.role === 'industrySupervisor' ? 'Industry Supervisor' : user.role}
                  </TableCell>
                  <TableCell className="flex space-x-2">
                    {user.status === 'pending' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => approveUser(user.id)}
                      >
                        <Check className="w-4 h-4 mr-1" />
                        Approve
                      </Button>
                    )}
                    
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedUser(user)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>User Profile</DialogTitle>
                          <DialogDescription>
                            Detailed information about the user.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-2">
                          <p><strong>Name:</strong> {user.name}</p>
                          <p><strong>Email:</strong> {user.email}</p>
                          <p><strong>Phone:</strong> {user.phone}</p>
                          <p><strong>Role:</strong> {user.role === 'industrySupervisor' ? 'Industry Supervisor' : user.role}</p>
                          <p><strong>Department:</strong> {user.department}</p>
                          <p><strong>Institution:</strong> {user.institution}</p>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteUser(user.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    //</DashboardLayout>
  );
};

export default AdminUserDashboard;