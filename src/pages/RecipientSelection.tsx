
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Plus, Upload, Edit, Trash2, Users, Filter } from 'lucide-react';
import AddRecipientModal from '@/components/AddRecipientModal';

interface Recipient {
  id: number;
  name: string;
  email: string;
  phone: string;
  department: string;
  address: string;
  status: 'pending' | 'confirmed';
  shippingMode: string;
  source: 'manual' | 'bulk' | 'auto';
  assignedGiftBoxes?: string[];
}

const RecipientSelection = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingRecipient, setEditingRecipient] = useState<Recipient | null>(null);

  // Mock recipients data
  const [recipients, setRecipients] = useState<Recipient[]>([
    {
      id: 1,
      name: 'Sarah Johnson',
      email: 'sarah@company.com',
      phone: '(555) 123-4567',
      department: 'Sales',
      address: '123 Main St, New York, NY 10001',
      status: 'confirmed',
      shippingMode: 'Standard',
      source: 'manual',
      assignedGiftBoxes: ['1']
    },
    {
      id: 2,
      name: 'Mike Davis',
      email: 'mike@company.com',
      phone: '(555) 234-5678',
      department: 'Engineering',
      address: '456 Oak Ave, San Francisco, CA 94102',
      status: 'pending',
      shippingMode: 'Express',
      source: 'bulk',
      assignedGiftBoxes: ['2']
    }
  ]);

  const filteredRecipients = recipients.filter(recipient => {
    const matchesSearch = recipient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         recipient.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || recipient.status === statusFilter;
    const matchesDepartment = departmentFilter === 'all' || recipient.department === departmentFilter;
    const matchesSource = sourceFilter === 'all' || recipient.source === sourceFilter;
    return matchesSearch && matchesStatus && matchesDepartment && matchesSource;
  });

  const uniqueDepartments = Array.from(new Set(recipients.map(r => r.department)));

  const handleAddRecipient = (newRecipient: Omit<Recipient, 'id'>) => {
    const recipient: Recipient = {
      ...newRecipient,
      id: Math.max(...recipients.map(r => r.id)) + 1
    };
    setRecipients([...recipients, recipient]);
    toast.success('Recipient added successfully');
  };

  const handleEditRecipient = (recipient: Recipient) => {
    setEditingRecipient(recipient);
    setIsAddModalOpen(true);
  };

  const handleDeleteRecipient = (id: number) => {
    setRecipients(recipients.filter(r => r.id !== id));
    toast.success('Recipient deleted successfully');
  };

  const getStatusBadge = (status: string) => {
    return status === 'confirmed' ? (
      <Badge className="bg-green-100 text-green-800">Confirmed</Badge>
    ) : (
      <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
    );
  };

  const getSourceBadge = (source: string) => {
    const configs = {
      manual: { color: 'bg-blue-100 text-blue-800', label: 'Manual' },
      bulk: { color: 'bg-purple-100 text-purple-800', label: 'Bulk Upload' },
      auto: { color: 'bg-gray-100 text-gray-800', label: 'Auto Import' }
    };
    
    const config = configs[source as keyof typeof configs];
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Recipients</h1>
          <p className="text-gray-600">Manage your gift recipients and their delivery information</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Bulk Upload
          </Button>
          <Button onClick={() => setIsAddModalOpen(true)} className="bg-linden-blue hover:bg-linden-blue/90">
            <Plus className="h-4 w-4 mr-2" />
            Add Recipient
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Recipients</p>
                <p className="text-2xl font-bold">{filteredRecipients.length}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Confirmed</p>
                <p className="text-2xl font-bold">{filteredRecipients.filter(r => r.status === 'confirmed').length}</p>
              </div>
              <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-bold">✓</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold">{filteredRecipients.filter(r => r.status === 'pending').length}</p>
              </div>
              <div className="h-8 w-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <span className="text-yellow-600 font-bold">⏳</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium">Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Department</Label>
              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {uniqueDepartments.map(dept => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Source</Label>
              <Select value={sourceFilter} onValueChange={setSourceFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sources</SelectItem>
                  <SelectItem value="manual">Manual</SelectItem>
                  <SelectItem value="bulk">Bulk Upload</SelectItem>
                  <SelectItem value="auto">Auto Import</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recipients Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recipients ({filteredRecipients.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRecipients.map((recipient) => (
                <TableRow key={recipient.id}>
                  <TableCell className="font-medium">{recipient.name}</TableCell>
                  <TableCell>{recipient.email}</TableCell>
                  <TableCell>{recipient.department}</TableCell>
                  <TableCell className="max-w-xs truncate">{recipient.address}</TableCell>
                  <TableCell>{getStatusBadge(recipient.status)}</TableCell>
                  <TableCell>{getSourceBadge(recipient.source)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditRecipient(recipient)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteRecipient(recipient.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AddRecipientModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onAddRecipient={handleAddRecipient}
        editingRecipient={editingRecipient}
      />
    </div>
  );
};

export default RecipientSelection;
