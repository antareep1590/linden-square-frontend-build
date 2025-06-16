
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePickerWithRange } from "@/components/ui/date-picker";
import { Search } from "lucide-react";

// Updated mock data for recipients with combined address
const mockRecipients = [
  {
    id: "1",
    firstName: "John",
    lastName: "Smith",
    email: "john@company.com",
    phone: "+1234567890",
    address: "123 Main St, Anytown, CA 12345",
    tag: "Client",
    lastOrderDate: "2023-11-15"
  },
  {
    id: "2",
    firstName: "Sarah",
    lastName: "Johnson",
    email: "sarah@partner.com",
    phone: "+1234567891",
    address: "456 Oak Ave, Somewhere, NY 67890",
    tag: "Partner",
    lastOrderDate: "2023-11-10"
  },
  {
    id: "3",
    firstName: "Mike",
    lastName: "Wilson",
    email: "mike@team.com",
    phone: "+1234567892",
    address: "789 Pine Rd, Nowhere, TX 54321",
    tag: "Team Member",
    lastOrderDate: "2023-11-05"
  }
];

const Recipients = () => {
  const [recipients] = useState(mockRecipients);
  const [searchTerm, setSearchTerm] = useState("");
  const [tagFilter, setTagFilter] = useState("all");
  const [dateRange, setDateRange] = useState<any>(null);

  const filteredRecipients = recipients.filter(recipient => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = recipient.firstName.toLowerCase().includes(searchLower) ||
                         recipient.lastName.toLowerCase().includes(searchLower) ||
                         recipient.email.toLowerCase().includes(searchLower) ||
                         recipient.phone.toLowerCase().includes(searchLower) ||
                         recipient.address.toLowerCase().includes(searchLower);
    const matchesTag = tagFilter === "all" || recipient.tag === tagFilter;
    return matchesSearch && matchesTag;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Recipients</h1>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 bg-muted/20 p-4 rounded-lg">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search by name, email, phone, or address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 w-full"
            />
          </div>
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
                <TableHead>First Name</TableHead>
                <TableHead>Last Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Tag</TableHead>
                <TableHead>Last Order</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRecipients.map((recipient) => (
                <TableRow key={recipient.id}>
                  <TableCell className="font-medium">{recipient.firstName}</TableCell>
                  <TableCell className="font-medium">{recipient.lastName}</TableCell>
                  <TableCell>{recipient.email}</TableCell>
                  <TableCell>{recipient.phone}</TableCell>
                  <TableCell className="max-w-xs truncate" title={recipient.address}>
                    {recipient.address}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="text-xs">
                      {recipient.tag}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(recipient.lastOrderDate).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {filteredRecipients.length === 0 && (
        <div className="text-center py-10">
          <p className="text-gray-500">No recipients found matching your search criteria.</p>
        </div>
      )}
    </div>
  );
};

export default Recipients;
