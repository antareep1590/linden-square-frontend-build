
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  User as UserIcon,
  UserPlus,
  MoreHorizontal,
  Shield,
  Settings,
  AlertCircle,
  KeyRound,
  LogIn,
  XCircle,
  CheckCircle,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

// Mock user data
const mockUsers: User[] = [
  {
    id: "1",
    name: "John Smith",
    email: "john.smith@example.com",
    role: "Admin",
    status: "active",
    lastLogin: new Date("2023-11-20T12:30:00"),
    createdAt: new Date("2022-06-15")
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    role: "Site Manager",
    status: "active",
    lastLogin: new Date("2023-11-19T09:15:00"),
    createdAt: new Date("2022-08-10")
  },
  {
    id: "3",
    name: "Michael Brown",
    email: "michael.b@example.com",
    role: "Admin",
    status: "inactive",
    lastLogin: new Date("2023-11-05T11:45:00"),
    createdAt: new Date("2022-07-20")
  },
  {
    id: "4",
    name: "Jennifer Lee",
    email: "jennifer.l@example.com",
    role: "Site Manager",
    status: "active",
    lastLogin: new Date("2023-11-18T14:20:00"),
    createdAt: new Date("2022-09-05")
  },
  {
    id: "5",
    name: "David Wilson",
    email: "david.w@example.com",
    role: "Admin",
    status: "active",
    lastLogin: new Date("2023-11-20T10:05:00"),
    createdAt: new Date("2022-05-12")
  },
  {
    id: "6",
    name: "Jessica Moore",
    email: "jessica.m@example.com",
    role: "Site Manager",
    status: "suspended",
    lastLogin: new Date("2023-10-25T16:30:00"),
    createdAt: new Date("2022-08-30")
  }
];

type UserStatus = "active" | "inactive" | "suspended";
type UserRole = "Admin" | "Site Manager";

type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  lastLogin: Date;
  createdAt: Date;
};

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [isViewActivityDialogOpen, setIsViewActivityDialogOpen] = useState(false);
  const [isResetPasswordDialogOpen, setIsResetPasswordDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserRole, setNewUserRole] = useState<UserRole>("Site Manager");

  // Filter users based on search term, role, and status
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter ? user.role === roleFilter : true;
    const matchesStatus = statusFilter ? user.status === statusFilter : true;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Mock activity logs for demonstration
  const activityLogs = [
    { action: "User Login", timestamp: new Date("2023-11-20T12:30:00"), details: "Successful login from 192.168.1.1" },
    { action: "Password Changed", timestamp: new Date("2023-11-15T10:22:00"), details: "User updated password" },
    { action: "Settings Updated", timestamp: new Date("2023-11-10T09:15:00"), details: "User updated notification preferences" },
    { action: "Order Created", timestamp: new Date("2023-11-08T14:45:00"), details: "Created order #12345" },
    { action: "Customer Added", timestamp: new Date("2023-11-05T11:30:00"), details: "Added 20 new customers via CSV upload" }
  ];

  // Handle add new user
  const handleAddUser = () => {
    if (!newUserName || !newUserEmail) {
      toast.error("Please fill in all required fields");
      return;
    }

    const newUser: User = {
      id: (users.length + 1).toString(),
      name: newUserName,
      email: newUserEmail,
      role: newUserRole,
      status: "active",
      lastLogin: new Date(),
      createdAt: new Date()
    };

    setUsers([...users, newUser]);
    toast.success(`New ${newUserRole.toLowerCase()} "${newUserName}" added successfully`);
    
    // Reset form and close dialog
    setNewUserName("");
    setNewUserEmail("");
    setNewUserRole("Site Manager");
    setIsAddUserDialogOpen(false);
  };

  // Handle reset password
  const handleResetPassword = () => {
    if (!currentUser) return;
    
    toast.success(`Password reset link sent to ${currentUser.email}`);
    setIsResetPasswordDialogOpen(false);
  };

  // Handle toggle user status
  const handleToggleUserStatus = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;
    
    const newStatus: UserStatus = user.status === "active" ? "inactive" : "active";
    
    setUsers(users.map(u => 
      u.id === userId ? { ...u, status: newStatus } : u
    ));
    
    toast.success(`${user.name} is now ${newStatus}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">User Management</h1>
        <Button onClick={() => setIsAddUserDialogOpen(true)}>
          <UserPlus className="mr-2 h-4 w-4" /> Add New User
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 bg-muted/20 p-4 rounded-lg">
        <div className="flex-1">
          <Input
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-full md:w-48">
          <Select value={roleFilter || "all"} onValueChange={setRoleFilter}>
            <SelectTrigger>
              <SelectValue placeholder="All Roles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="Admin">Admin</SelectItem>
              <SelectItem value="Site Manager">Site Manager</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="w-full md:w-48">
          <Select value={statusFilter || "all"} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Login</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <UserIcon className="h-4 w-4" />
                      {user.name}
                    </div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={
                      user.role === "Admin" 
                        ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300" 
                        : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                    }>
                      {user.role === "Admin" && <Shield className="h-3 w-3 mr-1" />}
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {user.status === "active" ? (
                      <Badge variant="outline" className="bg-green-100 text-green-800 border-transparent">
                        Active
                      </Badge>
                    ) : user.status === "inactive" ? (
                      <Badge variant="outline" className="bg-gray-100 text-gray-800 border-transparent">
                        Inactive
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-red-100 text-red-800 border-transparent">
                        Suspended
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>{format(user.lastLogin, "MMM d, yyyy h:mm a")}</TableCell>
                  <TableCell>{format(user.createdAt, "MMM d, yyyy")}</TableCell>
                  <TableCell>
                    <div className="flex justify-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => {
                            setCurrentUser(user);
                            setIsResetPasswordDialogOpen(true);
                          }}>
                            <KeyRound className="mr-2 h-4 w-4" />
                            Reset Password
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleToggleUserStatus(user.id)}>
                            {user.status === "active" ? (
                              <>
                                <XCircle className="mr-2 h-4 w-4" />
                                Deactivate User
                              </>
                            ) : (
                              <>
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Activate User
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => {
                            setCurrentUser(user);
                            setIsViewActivityDialogOpen(true);
                          }}>
                            <LogIn className="mr-2 h-4 w-4" />
                            View Activity Log
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => toast.info("Edit user functionality to be implemented")}>
                            <Settings className="mr-2 h-4 w-4" />
                            Edit User
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">
                  No users found matching your search criteria.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#" isActive>1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      {/* Add User Dialog */}
      <Dialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>
              Create a new admin or site manager account.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input 
                id="name" 
                value={newUserName}
                onChange={(e) => setNewUserName(e.target.value)}
                placeholder="Enter user's full name"
              />
            </div>
            <div className="flex flex-col space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input 
                id="email" 
                type="email"
                value={newUserEmail}
                onChange={(e) => setNewUserEmail(e.target.value)}
                placeholder="Enter user's email address"
              />
            </div>
            <div className="flex flex-col space-y-2">
              <Label htmlFor="role">Role *</Label>
              <Select 
                value={newUserRole} 
                onValueChange={(value) => setNewUserRole(value as UserRole)}
              >
                <SelectTrigger id="role">
                  <SelectValue placeholder="Select user role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Site Manager">Site Manager</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddUserDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddUser}>
              Add User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Activity Log Dialog */}
      <Dialog open={isViewActivityDialogOpen} onOpenChange={setIsViewActivityDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Activity Log</DialogTitle>
            <DialogDescription>
              Recent activity for {currentUser?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-96 overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Action</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activityLogs.map((log, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{log.action}</TableCell>
                    <TableCell>{format(log.timestamp, "MMM d, h:mm a")}</TableCell>
                    <TableCell>{log.details}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsViewActivityDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reset Password Dialog */}
      <Dialog open={isResetPasswordDialogOpen} onOpenChange={setIsResetPasswordDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset User Password</DialogTitle>
            <DialogDescription>
              This will send a password reset link to {currentUser?.email}.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="flex items-center p-3 bg-amber-50 text-amber-800 rounded-md">
              <AlertCircle className="h-5 w-5 mr-2" />
              <p className="text-sm">
                The user will need to create a new password upon their next login.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsResetPasswordDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleResetPassword}>
              Send Reset Link
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagement;
