
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { User, Building, Mail, Phone, Calendar, Package, Plus, Eye } from "lucide-react";

interface Client {
  id: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  status: 'active' | 'pending' | 'inactive';
  joinDate: Date;
  totalOrders: number;
  lastOrderDate?: Date;
}

const mockClients: Client[] = [
  {
    id: "CLI-001",
    companyName: "Acme Corp",
    contactPerson: "John Smith",
    email: "john@acme.com",
    phone: "+1 (555) 123-4567",
    status: "active",
    joinDate: new Date("2023-01-15"),
    totalOrders: 12,
    lastOrderDate: new Date("2023-11-01")
  },
  {
    id: "CLI-002",
    companyName: "Tech Innovations",
    contactPerson: "Sarah Johnson",
    email: "sarah@techinno.com",
    phone: "+1 (555) 987-6543",
    status: "active",
    joinDate: new Date("2023-03-20"),
    totalOrders: 8,
    lastOrderDate: new Date("2023-10-28")
  },
  {
    id: "CLI-003",
    companyName: "Global Consulting",
    contactPerson: "Mike Wilson",
    email: "mike@global.com",
    phone: "+1 (555) 555-5555",
    status: "pending",
    joinDate: new Date("2023-11-05"),
    totalOrders: 0
  }
];

const AdminClientManagement = () => {
  const [clients, setClients] = useState<Client[]>(mockClients);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || client.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const statusColors = {
      "active": "bg-green-500 text-white border-0",
      "pending": "bg-amber-500 text-white border-0",
      "inactive": "bg-gray-500 text-white border-0"
    };
    
    return (
      <Badge className={statusColors[status as keyof typeof statusColors]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Client Management</h1>
          <p className="text-gray-600">Manage client relationships and account details</p>
        </div>
        <Button className="bg-linden-blue hover:bg-linden-blue/90">
          <Plus className="h-4 w-4 mr-2" />
          Add New Client
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 bg-muted/20 p-4 rounded-lg">
        <div className="flex-1">
          <Input
            placeholder="Search by company name, contact person, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Clients Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client ID</TableHead>
              <TableHead>Company Name</TableHead>
              <TableHead>Contact Person</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Total Orders</TableHead>
              <TableHead>Join Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredClients.map((client) => (
              <TableRow key={client.id}>
                <TableCell className="font-medium">{client.id}</TableCell>
                <TableCell>{client.companyName}</TableCell>
                <TableCell>{client.contactPerson}</TableCell>
                <TableCell>{client.email}</TableCell>
                <TableCell>{client.phone}</TableCell>
                <TableCell>{getStatusBadge(client.status)}</TableCell>
                <TableCell>{client.totalOrders}</TableCell>
                <TableCell>{formatDate(client.joinDate)}</TableCell>
                <TableCell className="text-right">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedClient(client)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Client Details - {selectedClient?.companyName}</DialogTitle>
                      </DialogHeader>
                      {selectedClient && (
                        <div className="space-y-6">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-4">
                              <div className="flex items-center gap-3">
                                <Building className="h-5 w-5 text-gray-500" />
                                <div>
                                  <p className="text-sm text-gray-500">Company</p>
                                  <p className="font-medium">{selectedClient.companyName}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <User className="h-5 w-5 text-gray-500" />
                                <div>
                                  <p className="text-sm text-gray-500">Contact Person</p>
                                  <p className="font-medium">{selectedClient.contactPerson}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <Mail className="h-5 w-5 text-gray-500" />
                                <div>
                                  <p className="text-sm text-gray-500">Email</p>
                                  <p className="font-medium">{selectedClient.email}</p>
                                </div>
                              </div>
                            </div>
                            <div className="space-y-4">
                              <div className="flex items-center gap-3">
                                <Phone className="h-5 w-5 text-gray-500" />
                                <div>
                                  <p className="text-sm text-gray-500">Phone</p>
                                  <p className="font-medium">{selectedClient.phone}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <Calendar className="h-5 w-5 text-gray-500" />
                                <div>
                                  <p className="text-sm text-gray-500">Join Date</p>
                                  <p className="font-medium">{formatDate(selectedClient.joinDate)}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <Package className="h-5 w-5 text-gray-500" />
                                <div>
                                  <p className="text-sm text-gray-500">Total Orders</p>
                                  <p className="font-medium">{selectedClient.totalOrders}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="pt-4 border-t">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-500">Status</span>
                              {getStatusBadge(selectedClient.status)}
                            </div>
                            {selectedClient.lastOrderDate && (
                              <div className="flex justify-between items-center mt-2">
                                <span className="text-sm text-gray-500">Last Order</span>
                                <span className="text-sm">{formatDate(selectedClient.lastOrderDate)}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminClientManagement;
