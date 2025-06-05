
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Search, 
  Filter, 
  Edit,
  Trash2,
  Calendar,
  Tag
} from "lucide-react";
import { toast } from "sonner";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  tags: string[];
  lastOrder: string;
}

const mockCustomers: Customer[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john@company.com',
    phone: '+1 (555) 123-4567',
    address: '123 Main St, Anytown, CA 12345',
    tags: ['VIP', 'Corporate'],
    lastOrder: '2023-05-15'
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    phone: '+1 (555) 987-6543',
    address: '456 Oak Ave, Somewhere, NY 67890',
    tags: ['Retail'],
    lastOrder: '2023-06-22'
  },
  {
    id: '3',
    name: 'Michael Brown',
    email: 'michael@business.com',
    phone: '+1 (555) 456-7890',
    address: '789 Pine Rd, Nowhere, TX 54321',
    tags: ['Corporate', 'New'],
    lastOrder: '2023-07-03'
  },
  {
    id: '4',
    name: 'Emily Davis',
    email: 'emily@company.org',
    phone: '+1 (555) 234-5678',
    address: '321 Elm Blvd, Anywhere, WA 13579',
    tags: ['VIP'],
    lastOrder: '2023-04-18'
  },
  {
    id: '5',
    name: 'David Wilson',
    email: 'david@example.net',
    phone: '+1 (555) 876-5432',
    address: '654 Maple Ln, Everywhere, FL 97531',
    tags: ['Retail', 'New'],
    lastOrder: '2023-07-10'
  }
];

const Customers = () => {
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [searchTerm, setSearchTerm] = useState('');
  const [tagFilter, setTagFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTag = tagFilter === 'all' || customer.tags.some(tag => 
      tag.toLowerCase() === tagFilter.toLowerCase()
    );
    
    let matchesDate = true;
    if (dateFilter !== 'all') {
      const orderDate = new Date(customer.lastOrder);
      const now = new Date();
      const daysDiff = Math.floor((now.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24));
      
      switch (dateFilter) {
        case 'week':
          matchesDate = daysDiff <= 7;
          break;
        case 'month':
          matchesDate = daysDiff <= 30;
          break;
        case 'quarter':
          matchesDate = daysDiff <= 90;
          break;
      }
    }
    
    return matchesSearch && matchesTag && matchesDate;
  });

  const handleEditCustomer = (customer: Customer) => {
    setEditingCustomer({ ...customer });
    setIsEditModalOpen(true);
  };

  const handleUpdateCustomer = () => {
    if (!editingCustomer) return;

    setCustomers(customers.map(customer => 
      customer.id === editingCustomer.id ? editingCustomer : customer
    ));
    setIsEditModalOpen(false);
    setEditingCustomer(null);
    toast.success("Recipient updated successfully");
  };

  const handleDeleteCustomer = (id: string) => {
    setCustomers(customers.filter(customer => customer.id !== id));
    toast.success("Recipient deleted successfully");
  };

  const getAllTags = () => {
    const allTags = customers.flatMap(customer => customer.tags);
    return Array.from(new Set(allTags));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Recipients</h1>
          <p className="text-gray-600">Manage your gift recipients and their information</p>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>All Recipients</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search recipients..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2">
              <Select value={tagFilter} onValueChange={setTagFilter}>
                <SelectTrigger className="w-40">
                  <Tag className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by Tag" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tags</SelectItem>
                  {getAllTags().map(tag => (
                    <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="w-48">
                  <Calendar className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by Date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Dates</SelectItem>
                  <SelectItem value="week">Last Week</SelectItem>
                  <SelectItem value="month">Last Month</SelectItem>
                  <SelectItem value="quarter">Last Quarter</SelectItem>
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
                  <TableHead>Tags</TableHead>
                  <TableHead>Last Order</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell className="font-medium">{customer.name}</TableCell>
                    <TableCell>{customer.email}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {customer.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>{new Date(customer.lastOrder).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditCustomer(customer)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteCustomer(customer.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredCustomers.length === 0 && (
            <div className="text-center py-10">
              <p className="text-gray-500">No recipients found</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Customer Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Recipient</DialogTitle>
          </DialogHeader>
          
          {editingCustomer && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Full Name</Label>
                <Input
                  id="edit-name"
                  value={editingCustomer.name}
                  onChange={(e) => setEditingCustomer({ ...editingCustomer, name: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={editingCustomer.email}
                  onChange={(e) => setEditingCustomer({ ...editingCustomer, email: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-phone">Phone</Label>
                <Input
                  id="edit-phone"
                  value={editingCustomer.phone}
                  onChange={(e) => setEditingCustomer({ ...editingCustomer, phone: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-tags">Tags (comma separated)</Label>
                <Input
                  id="edit-tags"
                  value={editingCustomer.tags.join(', ')}
                  onChange={(e) => setEditingCustomer({ 
                    ...editingCustomer, 
                    tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag) 
                  })}
                />
              </div>
              
              <div className="col-span-2 space-y-2">
                <Label htmlFor="edit-address">Address</Label>
                <Input
                  id="edit-address"
                  value={editingCustomer.address}
                  onChange={(e) => setEditingCustomer({ ...editingCustomer, address: e.target.value })}
                />
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsEditModalOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdateCustomer}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Customers;
