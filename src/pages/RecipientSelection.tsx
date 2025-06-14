import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Users, Plus, Upload, Download } from 'lucide-react';
import AddRecipientModal from '@/components/AddRecipientModal';
import BulkUploadModal from '@/components/BulkUploadModal';

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

interface GiftBox {
  id: string;
  name: string;
  theme: string;
}

const RecipientSelection = () => {
  const [recipients, setRecipients] = useState<Recipient[]>([
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      phone: '555-123-4567',
      department: 'Engineering',
      address: '123 Main St, San Francisco, CA 94105',
      status: 'confirmed',
      shippingMode: 'standard',
      source: 'manual',
      assignedGiftBoxes: ['1']
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '555-987-6543',
      department: 'Marketing',
      address: '456 Market St, San Francisco, CA 94105',
      status: 'pending',
      shippingMode: '',
      source: 'manual'
    },
    {
      id: 3,
      name: 'Bob Johnson',
      email: 'bob@example.com',
      phone: '555-555-5555',
      department: 'Sales',
      address: '',
      status: 'pending',
      shippingMode: '',
      source: 'bulk'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedRecipients, setSelectedRecipients] = useState<number[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [editingRecipient, setEditingRecipient] = useState<Recipient | null>(null);

  // Mock gift boxes for assignment
  const availableGiftBoxes: GiftBox[] = [
    { id: '1', name: 'Premium Coffee Collection', theme: 'Appreciation' },
    { id: '2', name: 'Wellness Package', theme: 'Wellness' },
    { id: '3', name: 'Tech Gadgets Box', theme: 'Innovation' }
  ];

  const filteredRecipients = recipients.filter(recipient => {
    const matchesSearch = recipient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         recipient.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = departmentFilter === 'all' || recipient.department === departmentFilter;
    const matchesStatus = statusFilter === 'all' || recipient.status === statusFilter;
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRecipients(filteredRecipients.map(r => r.id));
    } else {
      setSelectedRecipients([]);
    }
  };

  const handleSelectRecipient = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedRecipients(prev => [...prev, id]);
    } else {
      setSelectedRecipients(prev => prev.filter(recipientId => recipientId !== id));
    }
  };

  const handleAddRecipient = (recipient: Omit<Recipient, 'id'>) => {
    const newRecipient = {
      ...recipient,
      id: recipients.length > 0 ? Math.max(...recipients.map(r => r.id)) + 1 : 1
    };
    setRecipients(prev => [...prev, newRecipient]);
  };

  const handleEditRecipient = (recipient: Recipient) => {
    setRecipients(prev => prev.map(r => r.id === recipient.id ? recipient : r));
  };

  const handleDeleteSelected = () => {
    setRecipients(prev => prev.filter(r => !selectedRecipients.includes(r.id)));
    setSelectedRecipients([]);
  };

  const handleEditClick = (recipient: Recipient) => {
    setEditingRecipient(recipient);
    setShowAddModal(true);
  };

  const getStatusBadge = (status: 'pending' | 'confirmed') => {
    return status === 'confirmed' ? (
      <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Confirmed</Badge>
    ) : (
      <Badge variant="outline" className="text-amber-600 border-amber-400 hover:bg-amber-50">Pending</Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Select Recipients</h1>
          <p className="text-gray-600">Choose who will receive the gift boxes</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setShowAddModal(true)} variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Add Recipient
          </Button>
          <Button onClick={() => setShowBulkModal(true)} variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Bulk Upload
          </Button>
        </div>
      </div>

      {/* Filters with Labels */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search recipients..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Department</Label>
              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  <SelectItem value="Engineering">Engineering</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                  <SelectItem value="Sales">Sales</SelectItem>
                  <SelectItem value="HR">HR</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recipients Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Recipients ({filteredRecipients.length})
            </CardTitle>
            {selectedRecipients.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">
                  {selectedRecipients.length} selected
                </span>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={handleDeleteSelected}
                >
                  Delete Selected
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox 
                    checked={selectedRecipients.length === filteredRecipients.length && filteredRecipients.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Gift Box</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRecipients.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                    No recipients found. Add recipients or adjust your filters.
                  </TableCell>
                </TableRow>
              ) : (
                filteredRecipients.map((recipient) => (
                  <TableRow key={recipient.id}>
                    <TableCell>
                      <Checkbox 
                        checked={selectedRecipients.includes(recipient.id)}
                        onCheckedChange={(checked) => handleSelectRecipient(recipient.id, !!checked)}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{recipient.name}</TableCell>
                    <TableCell>{recipient.email}</TableCell>
                    <TableCell>{recipient.department}</TableCell>
                    <TableCell>
                      {recipient.address ? (
                        <span className="text-sm truncate block max-w-[200px]">{recipient.address}</span>
                      ) : (
                        <Badge variant="outline" className="text-red-600 border-red-400">Missing</Badge>
                      )}
                    </TableCell>
                    <TableCell>{getStatusBadge(recipient.status)}</TableCell>
                    <TableCell>
                      {recipient.assignedGiftBoxes && recipient.assignedGiftBoxes.length > 0 ? (
                        <Badge variant="secondary">
                          {recipient.assignedGiftBoxes.length} assigned
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-red-600 border-red-400">None</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleEditClick(recipient)}
                      >
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Download Template Button */}
      <div className="flex justify-end">
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Download Recipient Template
        </Button>
      </div>

      {/* Add/Edit Recipient Modal */}
      <AddRecipientModal
        open={showAddModal}
        onOpenChange={setShowAddModal}
        onAddRecipient={editingRecipient ? handleEditRecipient : handleAddRecipient}
        editingRecipient={editingRecipient}
        availableGiftBoxes={availableGiftBoxes}
      />

      {/* Bulk Upload Modal */}
      <BulkUploadModal
        isOpen={showBulkModal}
        onClose={() => setShowBulkModal(false)}
        onUploadSuccess={(newRecipients) => {
          setRecipients(prev => [
            ...prev,
            ...newRecipients.map((r, idx) => ({
              ...r,
              id: prev.length > 0 ? Math.max(...prev.map(r => r.id)) + idx + 1 : idx + 1,
              source: 'bulk' as const
            }))
          ]);
        }}
      />
    </div>
  );
};

export default RecipientSelection;
