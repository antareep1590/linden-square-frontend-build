
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, Truck, Clock, CheckCircle, AlertCircle, Calendar, MapPin } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import CarrierAssigneeStep from "@/components/packaging/CarrierAssigneeStep";
import { deliveryStatusService } from "@/services/deliveryStatusService";

interface PackagingOrder {
  id: string;
  clientName: string;
  recipientCount: number;
  items: string;
  status: 'ready-to-pack' | 'packaging' | 'packed' | 'ready-to-ship';
  priority: 'low' | 'medium' | 'high';
  dueDate: Date;
}

interface DeliveryAssignment {
  id: string;
  orderId: string;
  clientName: string;
  destination: string;
  status: 'pending' | 'assigned' | 'in-transit' | 'delivered';
  assignedTo?: string;
  estimatedDelivery: Date;
  carrier?: string;
}

const PackagingDelivery = () => {
  const [packagingOrders] = useState<PackagingOrder[]>([
    {
      id: "PKG-001",
      clientName: "Acme Corp",
      recipientCount: 25,
      items: "Premium Gift Boxes",
      status: 'ready-to-pack',
      priority: 'high',
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
    },
    {
      id: "PKG-002",
      clientName: "Tech Solutions",
      recipientCount: 15,
      items: "Custom Notebooks, Coffee Mugs",
      status: 'packaging',
      priority: 'medium',
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
    }
  ]);

  const [deliveryAssignments, setDeliveryAssignments] = useState<DeliveryAssignment[]>([
    {
      id: "DEL-001",
      orderId: "ORD-2023-001",
      clientName: "Global Consulting",
      destination: "New York, NY",
      status: 'pending',
      estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    },
    {
      id: "DEL-002",
      orderId: "ORD-2023-002",
      clientName: "StartupX",
      destination: "San Francisco, CA",
      status: 'assigned',
      assignedTo: "John Doe",
      carrier: "FedEx",
      estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
    }
  ]);

  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState<DeliveryAssignment | null>(null);
  const [selectedCarrier, setSelectedCarrier] = useState('');
  const [selectedAssignee, setSelectedAssignee] = useState('');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready-to-pack':
        return 'bg-yellow-500';
      case 'packaging':
        return 'bg-blue-500';
      case 'packed':
        return 'bg-green-500';
      case 'ready-to-ship':
        return 'bg-purple-500';
      case 'pending':
        return 'bg-gray-500';
      case 'assigned':
        return 'bg-blue-500';
      case 'in-transit':
        return 'bg-orange-500';
      case 'delivered':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const handleAssignDelivery = (delivery: DeliveryAssignment) => {
    setSelectedDelivery(delivery);
    setSelectedCarrier('');
    setSelectedAssignee('');
    setIsAssignModalOpen(true);
  };

  const handleCompleteAssignment = () => {
    if (!selectedDelivery || !selectedCarrier || !selectedAssignee) {
      toast.error("Please select both carrier and assignee");
      return;
    }

    const carrierNames: { [key: string]: string } = {
      'fedex': 'FedEx',
      'ups': 'UPS',
      'usps': 'USPS',
      'dhl': 'DHL'
    };

    const assigneeNames: { [key: string]: string } = {
      'john-doe': 'John Doe',
      'jane-smith': 'Jane Smith',
      'mike-johnson': 'Mike Johnson',
      'sarah-wilson': 'Sarah Wilson'
    };

    // Update local state
    setDeliveryAssignments(prev => prev.map(delivery => 
      delivery.id === selectedDelivery.id 
        ? { 
            ...delivery, 
            status: 'assigned' as const,
            carrier: carrierNames[selectedCarrier],
            assignedTo: assigneeNames[selectedAssignee]
          }
        : delivery
    ));

    // Update global delivery status
    deliveryStatusService.updateStatus(selectedDelivery.orderId, 'processing', assigneeNames[selectedAssignee]);

    toast.success(`Delivery assigned to ${assigneeNames[selectedAssignee]} via ${carrierNames[selectedCarrier]}`);
    setIsAssignModalOpen(false);
    setSelectedDelivery(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Packaging & Delivery</h1>
        <p className="text-gray-500">Manage packaging operations and delivery assignments</p>
      </div>

      <Tabs defaultValue="packaging" className="space-y-6">
        <TabsList>
          <TabsTrigger value="packaging">Packaging Queue</TabsTrigger>
          <TabsTrigger value="delivery">Delivery Management</TabsTrigger>
        </TabsList>

        <TabsContent value="packaging">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Packaging Orders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Recipients</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {packagingOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>{order.clientName}</TableCell>
                      <TableCell>{order.recipientCount}</TableCell>
                      <TableCell>{order.items}</TableCell>
                      <TableCell>
                        <Badge className={`${getPriorityColor(order.priority)} text-white border-0 capitalize`}>
                          {order.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${getStatusColor(order.status)} text-white border-0`}>
                          {order.status.replace('-', ' ').toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>{format(order.dueDate, 'MMM d, yyyy')}</TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline">
                          Update Status
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="delivery">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Delivery Assignments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Assignment ID</TableHead>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Destination</TableHead>
                    <TableHead>Carrier</TableHead>
                    <TableHead>Assigned To</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Est. Delivery</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {deliveryAssignments.map((delivery) => (
                    <TableRow key={delivery.id}>
                      <TableCell className="font-medium">{delivery.id}</TableCell>
                      <TableCell>{delivery.orderId}</TableCell>
                      <TableCell>{delivery.clientName}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {delivery.destination}
                        </div>
                      </TableCell>
                      <TableCell>{delivery.carrier || "Not assigned"}</TableCell>
                      <TableCell>{delivery.assignedTo || "Not assigned"}</TableCell>
                      <TableCell>
                        <Badge className={`${getStatusColor(delivery.status)} text-white border-0 capitalize`}>
                          {delivery.status.replace('-', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {format(delivery.estimatedDelivery, 'MMM d')}
                        </div>
                      </TableCell>
                      <TableCell>
                        {delivery.status === 'pending' && (
                          <Button 
                            size="sm" 
                            onClick={() => handleAssignDelivery(delivery)}
                          >
                            Assign
                          </Button>
                        )}
                        {delivery.status === 'assigned' && (
                          <Button size="sm" variant="outline">
                            View Details
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Assign Delivery Modal with Step 3 */}
      <Dialog open={isAssignModalOpen} onOpenChange={setIsAssignModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Assign Delivery - {selectedDelivery?.id}</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Steps 1 & 2 would be here - showing Step 3 for this implementation */}
            <CarrierAssigneeStep
              selectedCarrier={selectedCarrier}
              selectedAssignee={selectedAssignee}
              onCarrierChange={setSelectedCarrier}
              onAssigneeChange={setSelectedAssignee}
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAssignModalOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleCompleteAssignment}
              disabled={!selectedCarrier || !selectedAssignee}
            >
              Complete Assignment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PackagingDelivery;
