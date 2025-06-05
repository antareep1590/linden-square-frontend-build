
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { DatePickerWithRange } from "@/components/ui/date-picker";
import { Edit, Trash2, Search } from "lucide-react";
import { toast } from "sonner";

// Mock data for recipients
const mockRecipients = [
  {
    id: "1",
    name: "John Smith",
    email: "john@company.com",
    phone: "+1234567890",
    address: "123 Main St, Anytown, CA 12345",
    tag: "Client",
    lastOrderDate: "2023-11-15"
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah@partner.com",
    phone: "+1234567891",
    address: "456 Oak Ave, Somewhere, NY 67890",
    tag: "Partner",
    lastOrderDate: "2023-11-10"
  },
  {
    id: "3",
    name: "Mike Wilson",
    email: "mike@team.com",
    phone: "+1234567892",
    address: "789 Pine Rd, Nowhere, TX 54321",
    tag: "Team Member",
    lastOrderDate: "2023-11-05"
  }
];

const Recipients = () => {
  const [recipients, setRecipients] = useState(mockRecipients);
  const [searchTerm, setSearchTerm] = useState("");
  const [tagFilter, setTagFilter] = useState("all");
  const [dateRange, setDateRange] = useState<any>(null);
  const [editingRecipient, setEditingRecipient] = useState<any>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const filteredRecipients = recipients.filter(recipient => {
    const matchesSearch = recipient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         recipient.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = tagFilter === "all" || recipient.tag === tagFilter;
    return matchesSearch && matchesTag;
  });

  const handleEditRecipient = (recipient: any) => {
    setEditingRecipient({ ...recipient });
    setIsEditModalOpen(true);
  };

  const handleUpdateRecipient = () => {
    if (!editingRecipient?.name || !editingRecipient?.email) {
      toast.error('Name and email are required');
      return;
    }

    setRecipients(prev => prev.map(r => 
      r.id === editingRecipient.id ? editingRecipient : r
    ));
    setIsEditModalOpen(false);
    setEditingRecipient(null);
    toast.success('Recipient updated successfully');
  };

  const handleDeleteRecipient = (id: string) => {
    setRecipients(prev => prev.filter(r => r.id !== id));
    toast.success('Recipient deleted successfully');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Recipients</h1>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 bg-muted/20 p-4 rounded-lg">
        <div className="flex-1">
          <Input
            placeholder="Search recipients by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        
        <Select value={tagFilter} onValueChange={setTagFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by Tag" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tags</SelectItem>
            <SelectItem value="Client">Client</SelectItem>
            <SelectItem value="Partner">Partner</SelectItem>
            <SelectItem value="Team Member">Team Member</SelectItem>
          </SelectContent>
        </Select>

        <div className="w-64">
          <DatePickerWithRange
            date={dateRange}
            onDateChange={setDateRange}
            placeholder="Filter by Last Order Date"
          />
        </div>
      </div>

      {/* Recipients Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Tag</TableHead>
                <TableHead>Last Order</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRecipients.map((recipient) => (
                <TableRow key={recipient.id}>
                  <TableCell className="font-medium">{recipient.name}</TableCell>
                  <TableCell>{recipient.email}</TableCell>
                  <TableCell>{recipient.phone}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="text-xs">
                      {recipient.tag}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(recipient.lastOrderDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
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
        </CardContent>
      </Card>

      {/* Edit Recipient Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Recipient</DialogTitle>
          </DialogHeader>
          
          {editingRecipient && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Full Name *</Label>
                <Input
                  id="edit-name"
                  value={editingRecipient.name}
                  onChange={(e) => setEditingRecipient({ ...editingRecipient, name: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email *</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={editingRecipient.email}
                  onChange={(e) => setEditingRecipient({ ...editingRecipient, email: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-phone">Phone</Label>
                <Input
                  id="edit-phone"
                  value={editingRecipient.phone || ''}
                  onChange={(e) => setEditingRecipient({ ...editingRecipient, phone: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-tag">Tag</Label>
                <Input
                  id="edit-tag"
                  value={editingRecipient.tag}
                  onChange={(e) => setEditingRecipient({ ...editingRecipient, tag: e.target.value })}
                />
              </div>
              
              <div className="col-span-2 space-y-2">
                <Label htmlFor="edit-address">Address</Label>
                <Input
                  id="edit-address"
                  value={editingRecipient.address || ''}
                  onChange={(e) => setEditingRecipient({ ...editingRecipient, address: e.target.value })}
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
            <Button onClick={handleUpdateRecipient}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Recipients;
