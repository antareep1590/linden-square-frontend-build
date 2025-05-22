
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Search, PlusCircle, Upload, Pencil, Trash2 } from 'lucide-react';

// Mock client data
const clients = [
  { id: 1, name: 'Acme Corporation', email: 'contact@acmecorp.com', phone: '(555) 123-4567', status: 'active' },
  { id: 2, name: 'Widget Industries', email: 'info@widgetind.com', phone: '(555) 234-5678', status: 'active' },
  { id: 3, name: 'Globex Corporation', email: 'admin@globex.com', phone: '(555) 345-6789', status: 'inactive' },
  { id: 4, name: 'Massive Dynamic', email: 'hello@massivedynamic.com', phone: '(555) 456-7890', status: 'active' },
  { id: 5, name: 'Umbrella Corporation', email: 'support@umbrella.com', phone: '(555) 567-8901', status: 'inactive' },
];

const AdminCustomers: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('nameAZ');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [newClientData, setNewClientData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    company: '',
    notes: ''
  });
  
  // Filter clients based on search query and status
  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || client.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
  
  // Sort clients based on selected sort order
  const sortedClients = [...filteredClients].sort((a, b) => {
    switch (sortOrder) {
      case 'nameAZ':
        return a.name.localeCompare(b.name);
      case 'nameZA':
        return b.name.localeCompare(a.name);
      case 'newest':
        return b.id - a.id;
      case 'oldest':
        return a.id - b.id;
      default:
        return 0;
    }
  });

  // Handler for the new client form
  const handleNewClientChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewClientData(prev => ({ ...prev, [name]: value }));
  };
  
  // Reset Filters
  const resetFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setSortOrder('nameAZ');
  };
  
  // Handle new client form submission
  const handleAddClient = () => {
    // Here you would typically add the client to your database
    console.log('Adding new client:', newClientData);
    
    // Reset the form
    setNewClientData({
      name: '',
      email: '',
      phone: '',
      address: '',
      company: '',
      notes: ''
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Client Management</h1>
        
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add New Client
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px] p-6">
              <DialogHeader>
                <DialogTitle className="text-xl">Add New Client</DialogTitle>
                <DialogDescription>
                  Enter the client's information below. Click save when you're done.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-6 py-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="company">Company Name</Label>
                    <Input
                      id="company"
                      name="company"
                      value={newClientData.company}
                      onChange={handleNewClientChange}
                      className="w-full"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Contact Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={newClientData.name}
                      onChange={handleNewClientChange}
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Contact Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={newClientData.email}
                      onChange={handleNewClientChange}
                      className="w-full"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={newClientData.phone}
                      onChange={handleNewClientChange}
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select defaultValue="active">
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    name="address"
                    value={newClientData.address}
                    onChange={handleNewClientChange}
                    className="w-full"
                    rows={3}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    value={newClientData.notes}
                    onChange={handleNewClientChange}
                    className="w-full"
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline">Cancel</Button>
                <Button type="submit" onClick={handleAddClient}>Save Client</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Upload className="mr-2 h-4 w-4" />
                Bulk Import
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Bulk Import Clients</DialogTitle>
                <DialogDescription>
                  Upload a CSV file with client information.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-6 py-4">
                <div className="space-y-2">
                  <Label htmlFor="csv-file">Select CSV File</Label>
                  <Input id="csv-file" type="file" accept=".csv" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Column Format</p>
                  <p className="text-sm text-muted-foreground">
                    The CSV should include columns for: Name, Email, Phone, Address, and Status.
                  </p>
                </div>
                <div className="p-3 rounded-md bg-muted text-sm">
                  <p className="font-medium mb-1">Example Format:</p>
                  <code className="block text-xs">
                    Name,Email,Phone,Address,Status<br />
                    Acme Corp,contact@acme.com,(555) 123-4567,"123 Business Ave, Suite 100",active
                  </code>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline">Cancel</Button>
                <Button type="submit">Import</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 bg-muted/20 p-4 rounded-lg">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by client name or email…"
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex flex-col md:flex-row gap-4">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Filter by Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={sortOrder} onValueChange={setSortOrder}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="nameAZ">Name A–Z</SelectItem>
              <SelectItem value="nameZA">Name Z–A</SelectItem>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" onClick={resetFilters}>Reset</Button>
        </div>
      </div>
      
      <div className="rounded-md border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedClients.map((client) => (
              <TableRow key={client.id} className="hover:bg-muted/50">
                <TableCell className="font-medium">{client.name}</TableCell>
                <TableCell>{client.email}</TableCell>
                <TableCell>{client.phone}</TableCell>
                <TableCell>
                  <Select defaultValue={client.status}>
                    <SelectTrigger className="w-28">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="text-right">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Edit Client</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Delete Client</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminCustomers;
