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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  Trash2,
  Send,
  Info,
  ChevronDown,
  Check,
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
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Mock data for dispatches
const mockDispatches = [
  {
    id: 'DSP-10001',
    packageName: 'Premium Employee Gift',
    recipient: 'John Doe',
    address: '123 Main St, Suite 400, San Francisco, CA 94105',
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
    address: '456 Market Ave, Chicago, IL 60601',
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
    address: '789 Broadway, New York, NY 10001',
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
    address: '555 Peachtree St, Atlanta, GA 30308',
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
    address: '9876 Ocean Ave, Miami, FL 33139',
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
  'delivered': 'bg-emerald-100 text-emerald-700 border-emerald-200',
  'in-transit': 'bg-blue-100 text-blue-700 border-blue-200',
  'dispatched': 'bg-amber-100 text-amber-700 border-amber-200',
  'delayed': 'bg-red-100 text-red-700 border-red-200',
  'returned': 'bg-gray-100 text-gray-700 border-gray-200',
};

// Enhanced Status Dropdown Component
const StatusDropdown = ({ currentStatus, onStatusChange, dispatchId }: {
  currentStatus: string;
  onStatusChange: (id: string, status: string) => void;
  dispatchId: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleStatusSelect = (newStatus: string) => {
    onStatusChange(dispatchId, newStatus);
    setIsOpen(false);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-8 w-auto px-3 justify-between rounded-lg shadow-sm border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200 bg-white"
        >
          <Badge className={`${statusColors[currentStatus]} border px-2 py-1 font-medium`}>
            {statusLabels[currentStatus]}
          </Badge>
          <ChevronDown className={`ml-2 h-3 w-3 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        className="w-40 p-1 bg-white border border-gray-200 shadow-lg rounded-lg animate-in fade-in-0 zoom-in-95 duration-200"
        align="start"
      >
        {Object.entries(statusLabels).map(([value, label]) => (
          <DropdownMenuItem
            key={value}
            onClick={() => handleStatusSelect(value)}
            className="px-3 py-2 cursor-pointer rounded-md hover:bg-gray-50 transition-colors duration-150 focus:bg-gray-50"
          >
            <div className="flex items-center justify-between w-full">
              <Badge className={`${statusColors[value]} border px-2 py-1 text-xs font-medium`}>
                {label}
              </Badge>
              {currentStatus === value && <Check className="h-3 w-3 text-gray-600" />}
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
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
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [dispatchToDelete, setDispatchToDelete] = useState<string | null>(null);

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
    
    toast.success(`Status updated to ${statusLabels[newStatus]}`);
  };

  const handlePersonnelAssignment = (dispatchId: string, personnelName: string) => {
    setDispatches(
      dispatches.map(dispatch => 
        dispatch.id === dispatchId ? { ...dispatch, assignedTo: personnelName } : dispatch
      )
    );
    
    toast.success(`Assigned to ${personnelName}`);
  };
  
  const handleEditDispatch = (dispatch: typeof mockDispatches[0]) => {
    setSelectedDispatch(dispatch);
    setOpenUpdateModal(true);
  };
  
  const handleDeleteDispatch = (dispatchId: string) => {
    setDispatchToDelete(dispatchId);
    setConfirmDeleteOpen(true);
  };
  
  const confirmDeleteDispatch = () => {
    if (dispatchToDelete) {
      setDispatches(dispatches.filter(dispatch => dispatch.id !== dispatchToDelete));
      toast.success("Dispatch deleted successfully");
      setConfirmDeleteOpen(false);
      setDispatchToDelete(null);
    }
  };

  const resetFilters = () => {
    setSearchQuery('');
    setFilterCarrier('All');
    setFilterRegion('All');
    setFilterStatus('All');
    setDateRange({ start: '', end: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Delivery Management</h1>
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
              <TableHead>Delivery Address</TableHead>
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
                <TableCell className="max-w-xs truncate" title={dispatch.address}>
                  {dispatch.address}
                </TableCell>
                <TableCell>{dispatch.clientName}</TableCell>
                <TableCell>{dispatch.carrier}</TableCell>
                <TableCell>{format(new Date(dispatch.dispatchDate), 'MMM d, yyyy')}</TableCell>
                <TableCell>
                  <StatusDropdown
                    currentStatus={dispatch.status}
                    onStatusChange={handleStatusChange}
                    dispatchId={dispatch.id}
                  />
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
                  <div className="flex justify-end gap-1">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditDispatch(dispatch)}
                            className="h-8 w-8 rounded-md hover:bg-gray-100 transition-colors"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Edit dispatch</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteDispatch(dispatch.id)}
                            className="h-8 w-8 rounded-md hover:bg-red-50 hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Delete dispatch</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-md hover:bg-blue-50 hover:text-blue-600 transition-colors"
                          >
                            <Send className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Dispatch package</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-md hover:bg-gray-100 transition-colors"
                          >
                            <Info className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>View details</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
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
                        <MapPin size={14} className="text-gray-500" />
                        <span className="text-sm font-medium">Address</span>
                      </div>
                      <p className="text-sm">{selectedDispatch.address}</p>
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
                  onClick={() => {
                    handleStatusChange(selectedDispatch.id, 'in-transit');
                    setOpenUpdateModal(false);
                  }}
                  className="bg-linden-blue hover:bg-linden-blue/90"
                >
                  Update Status
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Confirm Delete Dialog */}
      <Dialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this dispatch? This action cannot be undone.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDeleteOpen(false)}>Cancel</Button>
            <Button 
              variant="destructive" 
              onClick={confirmDeleteDispatch}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DeliveryManagement;
