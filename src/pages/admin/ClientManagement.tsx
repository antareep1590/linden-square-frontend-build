
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { User, Building, Mail, Phone, Calendar as CalendarDays, Package, Plus, Eye, Edit, Palette } from "lucide-react";
import AddClientModal from "@/components/admin/AddClientModal";
import { toast } from "sonner";

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
  recipientCount: number;
  portalTheme: string;
  logoUrl?: string;
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
    lastOrderDate: new Date("2023-11-01"),
    recipientCount: 45,
    portalTheme: "Professional Blue",
    logoUrl: "https://via.placeholder.com/100x50/4285F4/FFFFFF?text=ACME"
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
    lastOrderDate: new Date("2023-10-28"),
    recipientCount: 28,
    portalTheme: "Modern Dark",
    logoUrl: "https://via.placeholder.com/100x50/000000/FFFFFF?text=TECH"
  },
  {
    id: "CLI-003",
    companyName: "Global Consulting",
    contactPerson: "Mike Wilson",
    email: "mike@global.com",
    phone: "+1 (555) 555-5555",
    status: "pending",
    joinDate: new Date("2023-11-05"),
    totalOrders: 0,
    recipientCount: 0,
    portalTheme: "Clean Light"
  }
];

const AdminClientManagement = () => {
  const [clients, setClients] = useState<Client[]>(mockClients);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  // New filters
  const [dateJoinedFrom, setDateJoinedFrom] = useState<Date>();
  const [dateJoinedTo, setDateJoinedTo] = useState<Date>();
  const [minOrders, setMinOrders] = useState("");
  const [maxOrders, setMaxOrders] = useState("");

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || client.status === statusFilter;
    
    const matchesDateRange = (!dateJoinedFrom || client.joinDate >= dateJoinedFrom) &&
                            (!dateJoinedTo || client.joinDate <= dateJoinedTo);
    
    const matchesOrderRange = (!minOrders || client.totalOrders >= parseInt(minOrders)) &&
                             (!maxOrders || client.totalOrders <= parseInt(maxOrders));
    
    return matchesSearch && matchesStatus && matchesDateRange && matchesOrderRange;
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

  const handleViewClient = (client: Client) => {
    setSelectedClient(client);
    setIsViewModalOpen(true);
  };

  const handleEditClient = (client: Client) => {
    setEditingClient({...client});
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = () => {
    if (!editingClient) return;
    
    setClients(clients.map(client => 
      client.id === editingClient.id ? editingClient : client
    ));
    setIsEditModalOpen(false);
    setEditingClient(null);
    toast.success('Client updated successfully');
  };

  const handleAddClient = (newClient: Client) => {
    setClients([...clients, newClient]);
  };

  const resetFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setDateJoinedFrom(undefined);
    setDateJoinedTo(undefined);
    setMinOrders("");
    setMaxOrders("");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Client Management</h1>
          <p className="text-gray-600">Manage client relationships and account details</p>
        </div>
        <Button 
          className="bg-linden-blue hover:bg-linden-blue/90"
          onClick={() => setIsAddModalOpen(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New Client
        </Button>
      </div>

      {/* Enhanced Filters */}
      <div className="bg-muted/20 p-4 rounded-lg space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Search</Label>
            <Input
              placeholder="Search by company name, contact person, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label className="text-sm font-medium">Status</Label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
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

          <div className="space-y-2">
            <Label className="text-sm font-medium">Date Joined - From</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !dateJoinedFrom && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateJoinedFrom ? format(dateJoinedFrom, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={dateJoinedFrom}
                  onSelect={setDateJoinedFrom}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Date Joined - To</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !dateJoinedTo && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateJoinedTo ? format(dateJoinedTo, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={dateJoinedTo}
                  onSelect={setDateJoinedTo}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Min Total Orders</Label>
            <Input
              type="number"
              placeholder="0"
              value={minOrders}
              onChange={(e) => setMinOrders(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Max Total Orders</Label>
            <Input
              type="number"
              placeholder="100"
              value={maxOrders}
              onChange={(e) => setMaxOrders(e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button variant="outline" onClick={resetFilters}>
            Reset Filters
          </Button>
        </div>
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
              <TableHead># of Recipients</TableHead>
              <TableHead>Total Orders</TableHead>
              <TableHead>Date Joined</TableHead>
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
                <TableCell>{client.recipientCount}</TableCell>
                <TableCell>{client.totalOrders}</TableCell>
                <TableCell>{formatDate(client.joinDate)}</TableCell>
                <TableCell>
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleViewClient(client)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleEditClient(client)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* View Details Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
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
                  <div className="flex items-center gap-3">
                    <Palette className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Portal Theme</p>
                      <p className="font-medium">{selectedClient.portalTheme}</p>
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
                    <CalendarDays className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Date Joined</p>
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
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500"># of Recipients</p>
                      <p className="font-medium">{selectedClient.recipientCount}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Company Logo Section */}
              <div className="pt-4 border-t">
                <div className="space-y-3">
                  <p className="text-sm text-gray-500">Company Logo</p>
                  {selectedClient.logoUrl ? (
                    <div className="flex items-center justify-center p-4 border rounded-lg bg-gray-50">
                      <img 
                        src={selectedClient.logoUrl} 
                        alt={`${selectedClient.companyName} logo`}
                        className="max-h-12 object-contain"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center justify-center p-8 border rounded-lg bg-gray-50 text-gray-400">
                      <Building className="h-8 w-8 mr-2" />
                      <span>No logo uploaded</span>
                    </div>
                  )}
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

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Client - {editingClient?.companyName}</DialogTitle>
          </DialogHeader>
          {editingClient && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Company Name</Label>
                  <Input
                    value={editingClient.companyName}
                    onChange={(e) => setEditingClient({...editingClient, companyName: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Contact Person</Label>
                  <Input
                    value={editingClient.contactPerson}
                    onChange={(e) => setEditingClient({...editingClient, contactPerson: e.target.value})}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={editingClient.email}
                    onChange={(e) => setEditingClient({...editingClient, email: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input
                    value={editingClient.phone}
                    onChange={(e) => setEditingClient({...editingClient, phone: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select 
                  value={editingClient.status} 
                  onValueChange={(value) => setEditingClient({...editingClient, status: value as Client['status']})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Client Modal */}
      <AddClientModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onClientAdded={handleAddClient}
      />
    </div>
  );
};

export default AdminClientManagement;
