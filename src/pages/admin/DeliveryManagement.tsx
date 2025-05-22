
import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';
import {
  Truck,
  Search,
  Upload,
  User,
  Calendar,
  MapPin,
  Package,
  Filter,
  Edit,
  FolderOpen,
} from 'lucide-react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

// Mock data for dispatches
const mockDispatches = [
  {
    id: 'DSP-10001',
    packageName: 'Premium Employee Gift',
    recipient: 'John Doe',
    clientName: 'Acme Corp',
    carrier: 'FedEx',
    trackingNumber: '12345678901',
    dispatchDate: '2025-05-10T10:30:00',
    status: 'delivered',
    deliveryDate: '2025-05-15T14:20:00',
    assignedTo: 'Sarah Johnson',
    region: 'West',
  },
  {
    id: 'DSP-10002',
    packageName: 'Client Appreciation',
    recipient: 'Jane Smith',
    clientName: 'Tech Innovations',
    carrier: 'UPS',
    trackingNumber: '98765432109',
    dispatchDate: '2025-05-12T09:15:00',
    status: 'in-transit',
    deliveryDate: null,
    assignedTo: 'Michael Chen',
    region: 'East',
  },
  {
    id: 'DSP-10003',
    packageName: 'New Client Welcome',
    recipient: 'Robert Johnson',
    clientName: 'Global Consulting',
    carrier: 'DHL',
    trackingNumber: '55566677788',
    dispatchDate: '2025-05-16T11:45:00',
    status: 'dispatched',
    deliveryDate: null,
    assignedTo: 'Sarah Johnson',
    region: 'Central',
  },
  {
    id: 'DSP-10004',
    packageName: 'Executive Appreciation',
    recipient: 'Emily Wilson',
    clientName: 'Metro Finance',
    carrier: 'USPS',
    trackingNumber: '44433322211',
    dispatchDate: '2025-05-08T14:20:00',
    status: 'delayed',
    deliveryDate: null,
    assignedTo: 'David Barnes',
    region: 'South',
  },
  {
    id: 'DSP-10005',
    packageName: 'Year-End Bonus Gift',
    recipient: 'Michelle Taylor',
    clientName: 'Health First',
    carrier: 'FedEx',
    trackingNumber: '11122233344',
    dispatchDate: '2025-05-14T08:30:00',
    status: 'returned',
    deliveryDate: null,
    assignedTo: 'Michael Chen',
    region: 'West',
  },
];

// Mock personnel data
const mockPersonnel = [
  { id: 1, name: 'Sarah Johnson', email: 'sarah@lindenlogistics.com', role: 'Logistics Manager' },
  { id: 2, name: 'Michael Chen', email: 'michael@lindenlogistics.com', role: 'Delivery Coordinator' },
  { id: 3, name: 'David Barnes', email: 'david@lindenlogistics.com', role: 'Logistics Specialist' },
  { id: 4, name: 'Lisa Rodriguez', email: 'lisa@lindenlogistics.com', role: 'Dispatch Manager' },
];

// Status color mapping
const statusColors: Record<string, string> = {
  'delivered': 'bg-green-500',
  'in-transit': 'bg-blue-500',
  'dispatched': 'bg-amber-500',
  'delayed': 'bg-red-500',
  'returned': 'bg-gray-500',
};

// Status display names
const statusLabels: Record<string, string> = {
  'delivered': 'Delivered',
  'in-transit': 'In Transit',
  'dispatched': 'Dispatched',
  'delayed': 'Delayed',
  'returned': 'Returned',
};

// Carriers
const carriers = ['All', 'FedEx', 'UPS', 'DHL', 'USPS'];

// Regions
const regions = ['All', 'East', 'West', 'Central', 'South'];

const DeliveryManagement = () => {
  const [dispatches, setDispatches] = useState(mockDispatches);
  const [selectedDispatch, setSelectedDispatch] = useState<typeof mockDispatches[0] | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCarrier, setFilterCarrier] = useState('All');
  const [filterRegion, setFilterRegion] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [openFilters, setOpenFilters] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [bulkUploadOpen, setBulkUploadOpen] = useState(false);

  // Filtered dispatches
  const filteredDispatches = dispatches.filter(dispatch => {
    // Search query filter
    const searchFields = [
      dispatch.id,
      dispatch.packageName,
      dispatch.recipient,
      dispatch.clientName,
      dispatch.trackingNumber,
    ].join(' ').toLowerCase();
    const matchesSearch = !searchQuery || searchFields.includes(searchQuery.toLowerCase());
    
    // Carrier filter
    const matchesCarrier = filterCarrier === 'All' || dispatch.carrier === filterCarrier;
    
    // Region filter
    const matchesRegion = filterRegion === 'All' || dispatch.region === filterRegion;
    
    // Status filter
    const matchesStatus = filterStatus === 'All' || dispatch.status === filterStatus;
    
    // Date range filter
    const dispatchDate = new Date(dispatch.dispatchDate);
    const startDate = dateRange.start ? new Date(dateRange.start) : null;
    const endDate = dateRange.end ? new Date(dateRange.end) : null;
    
    const withinDateRange = !startDate || !endDate || 
      (dispatchDate >= startDate && dispatchDate <= endDate);
    
    return matchesSearch && matchesCarrier && matchesRegion && matchesStatus && withinDateRange;
  });

  const handleStatusChange = (dispatchId: string, newStatus: string) => {
    setDispatches(
      dispatches.map(dispatch => 
        dispatch.id === dispatchId ? { ...dispatch, status: newStatus } : dispatch
      )
    );
    
    setOpenUpdateModal(false);
    setSelectedDispatch(null);
  };

  const handlePersonnelAssignment = (dispatchId: string, personnelName: string) => {
    setDispatches(
      dispatches.map(dispatch => 
        dispatch.id === dispatchId ? { ...dispatch, assignedTo: personnelName } : dispatch
      )
    );
  };

  const resetFilters = () => {
    setSearchQuery('');
    setFilterCarrier('All');
    setFilterRegion('All');
    setFilterStatus('All');
    setDateRange({ start: '', end: '' });
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Delivery Management</h1>
        
        <div className="flex gap-2">
          <Dialog open={bulkUploadOpen} onOpenChange={setBulkUploadOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Upload size={16} /> Bulk Dispatch
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Bulk Dispatch Manager</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Upload CSV File</Label>
                  <Input type="file" accept=".csv" />
                  <p className="text-xs text-gray-500">
                    Upload CSV with columns: Recipient, Address, Package Details, Carrier
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label>Assign to Personnel</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select personnel" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockPersonnel.map(person => (
                        <SelectItem key={person.id} value={person.name}>
                          {person.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Dispatch Notes</Label>
                  <Textarea placeholder="Add any notes for this batch dispatch..." />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setBulkUploadOpen(false)}>Cancel</Button>
                <Button onClick={() => setBulkUploadOpen(false)}>Process Dispatches</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <Popover open={openFilters} onOpenChange={setOpenFilters}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter size={16} /> Filters
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4 p-2">
                <h3 className="font-medium">Filter Options</h3>
                
                <div className="space-y-2">
                  <Label>Carrier</Label>
                  <Select value={filterCarrier} onValueChange={setFilterCarrier}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select carrier" />
                    </SelectTrigger>
                    <SelectContent>
                      {carriers.map(carrier => (
                        <SelectItem key={carrier} value={carrier}>
                          {carrier}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Region</Label>
                  <Select value={filterRegion} onValueChange={setFilterRegion}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select region" />
                    </SelectTrigger>
                    <SelectContent>
                      {regions.map(region => (
                        <SelectItem key={region} value={region}>
                          {region}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Status</SelectItem>
                      {Object.keys(statusLabels).map(status => (
                        <SelectItem key={status} value={status}>
                          {statusLabels[status]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Date Range</Label>
                  <div className="flex gap-2">
                    <div className="w-1/2">
                      <Label className="text-xs">From</Label>
                      <Input 
                        type="date" 
                        value={dateRange.start}
                        onChange={e => setDateRange({...dateRange, start: e.target.value})}
                      />
                    </div>
                    <div className="w-1/2">
                      <Label className="text-xs">To</Label>
                      <Input 
                        type="date"
                        value={dateRange.end}
                        onChange={e => setDateRange({...dateRange, end: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={resetFilters}
                  >
                    Reset Filters
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input 
            placeholder="Search by ID, package, recipient..." 
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Dispatch ID</TableHead>
              <TableHead>Package Name</TableHead>
              <TableHead>Recipient</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Carrier</TableHead>
              <TableHead>Dispatch Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Assigned To</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDispatches.map((dispatch) => (
              <TableRow key={dispatch.id}>
                <TableCell className="font-medium">{dispatch.id}</TableCell>
                <TableCell>{dispatch.packageName}</TableCell>
                <TableCell>{dispatch.recipient}</TableCell>
                <TableCell>{dispatch.clientName}</TableCell>
                <TableCell>{dispatch.carrier}</TableCell>
                <TableCell>{format(new Date(dispatch.dispatchDate), 'MMM d, yyyy')}</TableCell>
                <TableCell>
                  <Badge className={statusColors[dispatch.status]}>
                    {statusLabels[dispatch.status]}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Select 
                    defaultValue={dispatch.assignedTo}
                    onValueChange={(value) => handlePersonnelAssignment(dispatch.id, value)}
                  >
                    <SelectTrigger className="w-32 h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {mockPersonnel.map(person => (
                        <SelectItem key={person.id} value={person.name}>
                          {person.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedDispatch(dispatch);
                        setOpenUpdateModal(true);
                      }}
                    >
                      <Edit size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                    >
                      <FolderOpen size={16} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      <div className="mt-4 flex justify-between items-center">
        <div className="text-sm text-gray-500">
          Showing {filteredDispatches.length} of {mockDispatches.length} dispatches
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
              <PaginationLink href="#">2</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
      
      {/* Update Status Modal */}
      <Dialog open={openUpdateModal} onOpenChange={setOpenUpdateModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Dispatch Status</DialogTitle>
          </DialogHeader>
          
          {selectedDispatch && (
            <div className="space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Dispatch Information</CardTitle>
                  <CardDescription>{selectedDispatch.id}</CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Package size={14} className="text-gray-500" />
                        <span className="text-sm font-medium">Package</span>
                      </div>
                      <p className="text-sm">{selectedDispatch.packageName}</p>
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <User size={14} className="text-gray-500" />
                        <span className="text-sm font-medium">Recipient</span>
                      </div>
                      <p className="text-sm">{selectedDispatch.recipient}</p>
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Truck size={14} className="text-gray-500" />
                        <span className="text-sm font-medium">Carrier</span>
                      </div>
                      <p className="text-sm">{selectedDispatch.carrier} - {selectedDispatch.trackingNumber}</p>
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Calendar size={14} className="text-gray-500" />
                        <span className="text-sm font-medium">Dispatch Date</span>
                      </div>
                      <p className="text-sm">{format(new Date(selectedDispatch.dispatchDate), 'MMM d, yyyy')}</p>
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <MapPin size={14} className="text-gray-500" />
                        <span className="text-sm font-medium">Region</span>
                      </div>
                      <p className="text-sm">{selectedDispatch.region}</p>
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <User size={14} className="text-gray-500" />
                        <span className="text-sm font-medium">Assigned To</span>
                      </div>
                      <p className="text-sm">{selectedDispatch.assignedTo}</p>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <Label className="mb-2 block">Current Status</Label>
                    <Badge className={statusColors[selectedDispatch.status]}>
                      {statusLabels[selectedDispatch.status]}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Update Status</Label>
                    <Select defaultValue={selectedDispatch.status}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.keys(statusLabels).map((status) => (
                          <SelectItem key={status} value={status}>
                            {statusLabels[status]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Add Notes</Label>
                    <Textarea placeholder="Add any notes about this status update..." />
                  </div>
                </CardContent>
              </Card>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpenUpdateModal(false)}>Cancel</Button>
                <Button 
                  onClick={() => handleStatusChange(selectedDispatch.id, 'in-transit')}
                  className="bg-linden-blue hover:bg-linden-blue/90"
                >
                  Update Status
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DeliveryManagement;
