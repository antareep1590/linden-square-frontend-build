
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
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Truck,
  Search,
  Edit,
  ExternalLink,
  Filter,
  User,
  Calendar,
  Package,
  ChevronDown,
  Check,
} from 'lucide-react';
import { format } from 'date-fns';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

// Mock data for orders
const mockOrders = [
  {
    id: 'ORD-5001',
    recipient: 'John Smith',
    items: ['Luxury Candle Set', 'Premium Wine Bottle'],
    clientName: 'Acme Corp',
    carrier: 'FedEx',
    trackingNumber: 'FDX123456789',
    trackingUrl: '#',
    dispatchDate: '2025-05-10T10:30:00',
    estimatedDelivery: '2025-05-15T00:00:00',
    status: 'delivered',
    deliveryDate: '2025-05-14T14:20:00',
    logs: [
      { date: '2025-05-10T10:30:00', action: 'Order dispatched', user: 'System' },
      { date: '2025-05-12T08:15:00', action: 'In transit', user: 'Carrier Update' },
      { date: '2025-05-14T14:20:00', action: 'Delivered', user: 'Carrier Update' }
    ]
  },
  {
    id: 'ORD-5002',
    recipient: 'Sarah Johnson',
    items: ['Gourmet Chocolate Box'],
    clientName: 'Tech Innovations',
    carrier: 'UPS',
    trackingNumber: 'UPS987654321',
    trackingUrl: '#',
    dispatchDate: '2025-05-12T09:15:00',
    estimatedDelivery: '2025-05-16T00:00:00',
    status: 'in-transit',
    deliveryDate: null,
    logs: [
      { date: '2025-05-12T09:15:00', action: 'Order dispatched', user: 'System' },
      { date: '2025-05-14T11:30:00', action: 'In transit', user: 'Carrier Update' }
    ]
  },
  {
    id: 'ORD-5003',
    recipient: 'Michael Brown',
    items: ['Leather Journal', 'Gourmet Coffee Sampler'],
    clientName: 'Global Consulting',
    carrier: 'DHL',
    trackingNumber: 'DHL555666777',
    trackingUrl: '#',
    dispatchDate: '2025-05-16T11:45:00',
    estimatedDelivery: '2025-05-20T00:00:00',
    status: 'dispatched',
    deliveryDate: null,
    logs: [
      { date: '2025-05-16T11:45:00', action: 'Order dispatched', user: 'System' },
    ]
  },
  {
    id: 'ORD-5004',
    recipient: 'Emily Wilson',
    items: ['Luxury Bath Set'],
    clientName: 'Metro Finance',
    carrier: 'USPS',
    trackingNumber: 'USPS444333222',
    trackingUrl: '#',
    dispatchDate: '2025-05-08T14:20:00',
    estimatedDelivery: '2025-05-14T00:00:00',
    status: 'delayed',
    deliveryDate: null,
    logs: [
      { date: '2025-05-08T14:20:00', action: 'Order dispatched', user: 'System' },
      { date: '2025-05-10T17:45:00', action: 'In transit', user: 'Carrier Update' },
      { date: '2025-05-13T09:30:00', action: 'Delivery attempted but failed', user: 'Carrier Update' },
      { date: '2025-05-13T10:15:00', action: 'Marked as delayed', user: 'Admin (Sarah)' }
    ]
  },
  {
    id: 'ORD-5005',
    recipient: 'Michelle Taylor',
    items: ['Premium Coffee Sampler'],
    clientName: 'Health First',
    carrier: 'FedEx',
    trackingNumber: 'FDX111222333',
    trackingUrl: '#',
    dispatchDate: '2025-05-14T08:30:00',
    estimatedDelivery: '2025-05-18T00:00:00',
    status: 'returned',
    deliveryDate: null,
    logs: [
      { date: '2025-05-14T08:30:00', action: 'Order dispatched', user: 'System' },
      { date: '2025-05-16T11:20:00', action: 'In transit', user: 'Carrier Update' },
      { date: '2025-05-17T14:10:00', action: 'Delivery attempted but failed', user: 'Carrier Update' },
      { date: '2025-05-18T09:45:00', action: 'Returned to sender', user: 'Carrier Update' }
    ]
  },
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

// Clients
const clients = ['All', 'Acme Corp', 'Tech Innovations', 'Global Consulting', 'Metro Finance', 'Health First'];

// Modern Status Dropdown Component
const ModernStatusDropdown = ({ currentStatus, onStatusChange, orderId }: {
  currentStatus: string;
  onStatusChange: (id: string, status: string) => void;
  orderId: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const statusOptions = Object.keys(statusLabels).map(status => ({
    value: status,
    label: statusLabels[status]
  }));

  const handleStatusSelect = (newStatus: string) => {
    onStatusChange(orderId, newStatus);
    setIsOpen(false);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-9 w-auto px-3 justify-between rounded-full shadow-sm border border-gray-200/60 hover:border-gray-300 hover:shadow-md transition-all duration-300 bg-white/80 backdrop-blur-sm"
        >
          <Badge className={`${statusColors[currentStatus]} text-white border-0 px-3 py-1 font-medium text-xs rounded-full`}>
            {statusLabels[currentStatus]}
          </Badge>
          <ChevronDown className={`ml-2 h-3 w-3 text-gray-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        className="w-44 p-2 bg-white/95 backdrop-blur-md border border-gray-200/60 shadow-xl rounded-xl animate-in fade-in-0 zoom-in-95 duration-300"
        align="start"
      >
        {statusOptions.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => handleStatusSelect(option.value)}
            className="px-3 py-2.5 cursor-pointer rounded-lg hover:bg-gray-50/80 transition-colors duration-200 focus:bg-gray-50/80 group"
          >
            <div className="flex items-center justify-between w-full">
              <Badge className={`${statusColors[option.value]} text-white border-0 px-3 py-1 text-xs font-medium rounded-full group-hover:shadow-sm transition-shadow duration-200`}>
                {option.label}
              </Badge>
              {currentStatus === option.value && <Check className="h-3.5 w-3.5 text-gray-600" />}
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const TrackOrders = () => {
  const [orders, setOrders] = useState(mockOrders);
  const [selectedOrder, setSelectedOrder] = useState<typeof mockOrders[0] | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterClient, setFilterClient] = useState('All');
  const [filterCarrier, setFilterCarrier] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [openFilters, setOpenFilters] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [newTrackingNumber, setNewTrackingNumber] = useState('');
  const [selectedTab, setSelectedTab] = useState<string>('details');

  // Filtered orders
  const filteredOrders = orders.filter(order => {
    // Search query filter
    const searchFields = [
      order.id,
      order.recipient,
      order.trackingNumber,
      ...(order.items || []),
    ].join(' ').toLowerCase();
    const matchesSearch = !searchQuery || searchFields.includes(searchQuery.toLowerCase());
    
    // Client filter
    const matchesClient = filterClient === 'All' || order.clientName === filterClient;
    
    // Carrier filter
    const matchesCarrier = filterCarrier === 'All' || order.carrier === filterCarrier;
    
    // Status filter
    const matchesStatus = filterStatus === 'All' || order.status === filterStatus;
    
    return matchesSearch && matchesClient && matchesCarrier && matchesStatus;
  });

  const handleStatusUpdate = (orderId: string, newStatus: string) => {
    const now = new Date().toISOString();
    setOrders(
      orders.map(order => {
        if (order.id === orderId) {
          return {
            ...order,
            status: newStatus,
            logs: [
              ...order.logs,
              {
                date: now,
                action: `Status changed to ${statusLabels[newStatus]}`,
                user: 'Admin'
              }
            ]
          };
        }
        return order;
      })
    );
    setOpenUpdateModal(false);
    toast.success(`Order ${orderId} status updated to ${statusLabels[newStatus]}`);
  };

  const handleAddTrackingNumber = () => {
    if (selectedOrder && newTrackingNumber) {
      const now = new Date().toISOString();
      setOrders(
        orders.map(order => {
          if (order.id === selectedOrder.id) {
            return {
              ...order,
              trackingNumber: newTrackingNumber,
              logs: [
                ...order.logs,
                {
                  date: now,
                  action: `Tracking number updated to ${newTrackingNumber}`,
                  user: 'Admin'
                }
              ]
            };
          }
          return order;
        })
      );
      setNewTrackingNumber('');
      setSelectedTab('details');
      toast.success('Tracking number updated successfully');
    }
  };

  const resetFilters = () => {
    setSearchQuery('');
    setFilterClient('All');
    setFilterCarrier('All');
    setFilterStatus('All');
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Track Orders</h1>
        
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
                <Label>Client</Label>
                <Select value={filterClient} onValueChange={setFilterClient}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select client" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map(client => (
                      <SelectItem key={client} value={client}>
                        {client}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
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

      <div className="flex items-center gap-3 mb-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input 
            placeholder="Search by order ID, recipient, tracking..." 
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
              <TableHead>Order ID</TableHead>
              <TableHead>Recipient</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Carrier</TableHead>
              <TableHead>Tracking #</TableHead>
              <TableHead>Ship Date</TableHead>
              <TableHead>Est. Delivery</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell>{order.recipient}</TableCell>
                <TableCell>
                  <div className="max-w-[150px] truncate">
                    {order.items.join(', ')}
                  </div>
                </TableCell>
                <TableCell>{order.clientName}</TableCell>
                <TableCell>{order.carrier}</TableCell>
                <TableCell className="font-mono text-xs">
                  {order.trackingNumber}
                </TableCell>
                <TableCell>{format(new Date(order.dispatchDate), 'MMM d, yyyy')}</TableCell>
                <TableCell>
                  {order.estimatedDelivery ? 
                    format(new Date(order.estimatedDelivery), 'MMM d, yyyy') : 
                    '-'
                  }
                </TableCell>
                <TableCell>
                  <ModernStatusDropdown
                    currentStatus={order.status}
                    onStatusChange={handleStatusUpdate}
                    orderId={order.id}
                  />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedOrder(order);
                        setOpenUpdateModal(true);
                      }}
                    >
                      <Edit size={16} />
                    </Button>
                    <a href={order.trackingUrl} target="_blank" rel="noopener noreferrer">
                      <Button
                        variant="ghost"
                        size="sm"
                      >
                        <ExternalLink size={16} />
                      </Button>
                    </a>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      {filteredOrders.length === 0 && (
        <div className="text-center py-10">
          <Truck size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-medium mb-2">No orders found</h3>
          <p className="text-gray-500">Try adjusting your filters to see more results.</p>
        </div>
      )}
      
      {/* Update Order Modal */}
      <Dialog open={openUpdateModal} onOpenChange={setOpenUpdateModal}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
          </DialogHeader>
          
          {selectedOrder && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <div>
                  <span className="text-sm text-gray-500">Order ID:</span>
                  <span className="ml-2 font-medium">{selectedOrder.id}</span>
                </div>
                <Badge className={statusColors[selectedOrder.status]}>
                  {statusLabels[selectedOrder.status]}
                </Badge>
              </div>
              
              <Tabs defaultValue="details" value={selectedTab} onValueChange={setSelectedTab}>
                <TabsList className="mb-4">
                  <TabsTrigger value="details">Order Details</TabsTrigger>
                  <TabsTrigger value="timeline">Event Timeline</TabsTrigger>
                  <TabsTrigger value="tracking">Update Tracking</TabsTrigger>
                  <TabsTrigger value="status">Update Status</TabsTrigger>
                </TabsList>
                
                <TabsContent value="details">
                  <Card>
                    <CardContent className="p-6">
                      <div className="grid grid-cols-2 gap-8">
                        <div>
                          <h3 className="text-lg font-medium mb-4">Order Information</h3>
                          <div className="space-y-4">
                            <div className="flex items-start gap-3">
                              <Package size={18} className="text-gray-500 mt-0.5" />
                              <div>
                                <div className="font-medium">Items</div>
                                <div className="text-sm text-gray-500">
                                  {selectedOrder.items.join(', ')}
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-start gap-3">
                              <User size={18} className="text-gray-500 mt-0.5" />
                              <div>
                                <div className="font-medium">Client</div>
                                <div className="text-sm text-gray-500">
                                  {selectedOrder.clientName}
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-start gap-3">
                              <User size={18} className="text-gray-500 mt-0.5" />
                              <div>
                                <div className="font-medium">Recipient</div>
                                <div className="text-sm text-gray-500">
                                  {selectedOrder.recipient}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-medium mb-4">Shipping Information</h3>
                          <div className="space-y-4">
                            <div className="flex items-start gap-3">
                              <Calendar size={18} className="text-gray-500 mt-0.5" />
                              <div>
                                <div className="font-medium">Ship Date</div>
                                <div className="text-sm text-gray-500">
                                  {format(new Date(selectedOrder.dispatchDate), 'MMMM d, yyyy')}
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-start gap-3">
                              <Calendar size={18} className="text-gray-500 mt-0.5" />
                              <div>
                                <div className="font-medium">Estimated Delivery</div>
                                <div className="text-sm text-gray-500">
                                  {selectedOrder.estimatedDelivery ? 
                                    format(new Date(selectedOrder.estimatedDelivery), 'MMMM d, yyyy') : 
                                    'Not available'
                                  }
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-start gap-3">
                              <Truck size={18} className="text-gray-500 mt-0.5" />
                              <div>
                                <div className="font-medium">Carrier Information</div>
                                <div className="text-sm text-gray-500">
                                  {selectedOrder.carrier} - {selectedOrder.trackingNumber}
                                </div>
                                <a 
                                  href={selectedOrder.trackingUrl} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-sm text-blue-600 hover:underline flex items-center gap-1 mt-1"
                                >
                                  View tracking <ExternalLink size={12} />
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="timeline">
                  <Card>
                    <CardHeader>
                      <CardTitle>Order Timeline</CardTitle>
                      <CardDescription>
                        Complete history of events for this order
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-[300px] pr-4">
                        <div className="relative pl-6">
                          {selectedOrder.logs.map((log, index) => (
                            <div key={index} className="mb-6 relative">
                              {/* Timeline connector */}
                              {index < selectedOrder.logs.length - 1 && (
                                <div className="absolute top-6 left-2.5 h-full w-0.5 -ml-0.5 bg-gray-200"></div>
                              )}
                              
                              {/* Event dot */}
                              <div className="absolute top-1.5 left-0 w-5 h-5 rounded-full border-2 border-blue-600 bg-white"></div>
                              
                              <div className="pl-8">
                                <p className="text-sm text-gray-500">
                                  {format(new Date(log.date), 'MMM d, yyyy - h:mm a')}
                                </p>
                                <p className="font-medium">{log.action}</p>
                                <p className="text-sm text-gray-500">By: {log.user}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="tracking">
                  <Card>
                    <CardHeader>
                      <CardTitle>Update Tracking Information</CardTitle>
                      <CardDescription>
                        Add or update tracking number for this order
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-4">
                        <div>
                          <Label>Current Carrier</Label>
                          <div className="flex justify-between items-center mt-2 p-2 rounded border">
                            <div>
                              <span className="font-medium">{selectedOrder.carrier}</span>
                            </div>
                            <Button variant="outline" size="sm">Change</Button>
                          </div>
                        </div>
                        
                        <div>
                          <Label>Current Tracking #</Label>
                          <div className="flex justify-between items-center mt-2 p-2 rounded border">
                            <div>
                              <span className="font-mono">{selectedOrder.trackingNumber}</span>
                            </div>
                          </div>
                        </div>
                        
                        <Separator />
                        
                        <div className="space-y-2">
                          <Label>New Tracking Number</Label>
                          <Input 
                            placeholder="Enter new tracking number" 
                            value={newTrackingNumber}
                            onChange={(e) => setNewTrackingNumber(e.target.value)}
                          />
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-end">
                      <Button 
                        variant="outline" 
                        className="mr-2"
                        onClick={() => setSelectedTab('details')}
                      >
                        Cancel
                      </Button>
                      <Button onClick={handleAddTrackingNumber}>
                        Update Tracking
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
                
                <TabsContent value="status">
                  <Card>
                    <CardHeader>
                      <CardTitle>Update Order Status</CardTitle>
                      <CardDescription>
                        Change the current status of this order
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label>Current Status</Label>
                        <div className="flex items-center mt-2">
                          <Badge className={statusColors[selectedOrder.status]}>
                            {statusLabels[selectedOrder.status]}
                          </Badge>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div className="space-y-2">
                        <Label>New Status</Label>
                        <Select defaultValue={selectedOrder.status} onValueChange={(value) => handleStatusUpdate(selectedOrder.id, value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select new status" />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.keys(statusLabels).map(status => (
                              <SelectItem key={status} value={status}>
                                {statusLabels[status]}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Status Notes (Optional)</Label>
                        <Textarea placeholder="Add any notes about this status change..." />
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-end">
                      <Button 
                        variant="outline" 
                        className="mr-2"
                        onClick={() => setSelectedTab('details')}
                      >
                        Cancel
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenUpdateModal(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TrackOrders;
