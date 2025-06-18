
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Plus, Edit, Trash2, Eye, Building } from "lucide-react";
import { Calendar } from "lucide-react";
import { toast } from "sonner";
import AddClientModal from '@/components/admin/AddClientModal';

interface Client {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive';
  totalOrders: number;
  lastOrderDate: Date | null;
  recipientCount: number;
  portalTheme: string;
  logoUrl: string;
}

const mockClients: Client[] = [
  {
    id: '1',
    companyName: 'Tech Innovations Inc.',
    contactName: 'Alice Johnson',
    email: 'alice.johnson@techinnovations.com',
    phone: '555-123-4567',
    status: 'active',
    totalOrders: 15,
    lastOrderDate: new Date('2023-11-15'),
    recipientCount: 500,
    portalTheme: 'Professional Blue',
    logoUrl: '/placeholder.svg'
  },
  {
    id: '2',
    companyName: 'Global Solutions Ltd.',
    contactName: 'Bob Williams',
    email: 'bob.williams@globalsolutions.com',
    phone: '555-987-6543',
    status: 'inactive',
    totalOrders: 8,
    lastOrderDate: new Date('2023-10-20'),
    recipientCount: 300,
    portalTheme: 'Natural Green',
    logoUrl: '/placeholder.svg'
  },
  {
    id: '3',
    companyName: 'Creative Designs Co.',
    contactName: 'Cathy Davis',
    email: 'cathy.davis@creativedesigns.com',
    phone: '555-246-8013',
    status: 'active',
    totalOrders: 22,
    lastOrderDate: new Date('2023-12-01'),
    recipientCount: 750,
    portalTheme: 'Creative Purple',
    logoUrl: '/placeholder.svg'
  },
  {
    id: '4',
    companyName: 'Sunrise Marketing Group',
    contactName: 'David Garcia',
    email: 'david.garcia@sunrisemarketing.com',
    phone: '555-369-1592',
    status: 'active',
    totalOrders: 5,
    lastOrderDate: new Date('2023-09-28'),
    recipientCount: 200,
    portalTheme: 'Energetic Orange',
    logoUrl: '/placeholder.svg'
  },
  {
    id: '5',
    companyName: 'Pinnacle Investments LLC',
    contactName: 'Emily Rodriguez',
    email: 'emily.rodriguez@pinnacleinvestments.com',
    phone: '555-482-7309',
    status: 'inactive',
    totalOrders: 12,
    lastOrderDate: new Date('2023-11-05'),
    recipientCount: 400,
    portalTheme: 'Modern Dark',
    logoUrl: '/placeholder.svg'
  }
];

const AdminClientManagement = () => {
  const [clients, setClients] = useState<Client[]>(mockClients);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isAddClientOpen, setIsAddClientOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          client.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          client.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || client.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleViewDetails = (client: Client) => {
    setSelectedClient(client);
    setIsDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setIsDetailsOpen(false);
    setSelectedClient(null);
  };

  const handleAddClient = (clientData: any) => {
    const newClient: Client = {
      id: (clients.length + 1).toString(),
      companyName: clientData.companyName,
      contactName: clientData.contactName,
      email: clientData.email,
      phone: clientData.phone,
      status: 'active',
      totalOrders: 0,
      lastOrderDate: null,
      recipientCount: 0,
      portalTheme: 'Professional Blue',
      logoUrl: '/placeholder.svg'
    };
    
    setClients([...clients, newClient]);
    setIsAddClientOpen(false);
    toast.success("Client added successfully");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Client Management</h1>
        <Button 
          onClick={() => setIsAddClientOpen(true)}
          className="bg-linden-blue hover:bg-linden-blue/90"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Client
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search clients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <select
            className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <Button variant="outline" onClick={() => {
            setSearchTerm("");
            setStatusFilter("all");
          }}>
            Reset
          </Button>
        </div>
      </div>

      {/* Clients Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Company</TableHead>
              <TableHead>Contact Person</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead># of Recipients</TableHead>
              <TableHead>Total Orders</TableHead>
              <TableHead>Last Order</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredClients.length > 0 ? (
              filteredClients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell className="font-medium">{client.companyName}</TableCell>
                  <TableCell>{client.contactName}</TableCell>
                  <TableCell>{client.email}</TableCell>
                  <TableCell>{client.phone}</TableCell>
                  <TableCell>{client.recipientCount}</TableCell>
                  <TableCell>{client.totalOrders}</TableCell>
                  <TableCell>
                    {client.lastOrderDate ? formatDate(client.lastOrderDate) : 'No orders yet'}
                  </TableCell>
                  <TableCell>
                    <Badge className={
                      client.status === 'active' 
                        ? 'bg-green-500 text-white' 
                        : 'bg-gray-500 text-white'
                    }>
                      {client.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleViewDetails(client)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                  No clients found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Client Details Modal */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Client Details</DialogTitle>
          </DialogHeader>
          {selectedClient && (
            <div className="space-y-6">
              {/* Client Logo - Fixed with proper centering and rounded background */}
              <div className="flex justify-center">
                <div className="w-24 h-24 rounded-full bg-gray-100 border-2 border-gray-200 flex items-center justify-center overflow-hidden">
                  {selectedClient.logoUrl && selectedClient.logoUrl !== '/placeholder.svg' ? (
                    <img 
                      src={selectedClient.logoUrl} 
                      alt={`${selectedClient.companyName} logo`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Building className="w-8 h-8 text-gray-400" />
                  )}
                </div>
              </div>

              {/* Client Information */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500">Company</Label>
                  <p className="text-sm font-medium">{selectedClient.companyName}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Phone</Label>
                  <p className="text-sm">{selectedClient.phone}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Contact Person</Label>
                  <p className="text-sm">{selectedClient.contactName}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Email</Label>
                  <p className="text-sm">{selectedClient.email}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Portal Theme</Label>
                  <p className="text-sm">{selectedClient.portalTheme}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Status</Label>
                  <Badge className={
                    selectedClient.status === 'active' 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-500 text-white'
                  }>
                    {selectedClient.status}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Total Orders</Label>
                  <p className="text-sm">{selectedClient.totalOrders}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500"># of Recipients</Label>
                  <p className="text-sm">{selectedClient.recipientCount}</p>
                </div>
                <div className="col-span-2">
                  <Label className="text-sm font-medium text-gray-500">Last Order Date</Label>
                  <p className="text-sm">
                    {selectedClient.lastOrderDate ? formatDate(selectedClient.lastOrderDate) : 'No orders yet'}
                  </p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={handleCloseDetails}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Client Modal */}
      <AddClientModal
        isOpen={isAddClientOpen}
        onClose={() => setIsAddClientOpen(false)}
        onClientAdded={handleAddClient}
      />
    </div>
  );
};

export default AdminClientManagement;
