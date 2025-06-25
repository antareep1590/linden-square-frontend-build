import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { User, MapPin, Truck, Package, Clock, CheckCircle, Circle, Download, LayoutGrid, List, Eye } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SubOrder {
  recipientName: string;
  recipientEmail: string;
  shippingAddress: string;
  deliveryStatus: string;
  estimatedDelivery: string;
  giftBoxContents: string[];
  trackingNumber?: string;
  carrier: string;
}

interface Order {
  id: string;
  recipientCount: number;
  shipDate: Date;
  carrier: string;
  trackingLink: string;
  status: string;
  deliveryType?: string;
  subOrders?: SubOrder[];
  recipients?: Array<{
    name: string;
    email: string;
    address: string;
    status: string;
    deliveryDate?: string;
    estimatedDelivery: string;
  }>;
}

interface OrderDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
}

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({ isOpen, onClose, order }) => {
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [selectedShipments, setSelectedShipments] = useState<Set<number>>(new Set());
  const [selectedRecipientForDetails, setSelectedRecipientForDetails] = useState<any | null>(null);
  const [isShipmentDetailsOpen, setIsShipmentDetailsOpen] = useState(false);

  if (!order) return null;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "in-transit":
        return <Truck className="h-5 w-5 text-blue-600" />;
      case "processing":
        return <Package className="h-5 w-5 text-amber-600" />;
      default:
        return <Clock className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-700";
      case "in-transit":
        return "bg-blue-100 text-blue-700";
      case "processing":
        return "bg-amber-100 text-amber-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // Generate delivery timeline for a shipment
  const generateDeliveryTimeline = (recipient: any) => {
    const baseDate = order.shipDate;
    const timeline = [
      {
        status: "Order Placed",
        date: new Date(baseDate.getTime() - 2 * 24 * 60 * 60 * 1000),
        completed: true,
        icon: <Package className="h-4 w-4" />
      },
      {
        status: "Processing",
        date: new Date(baseDate.getTime() - 1 * 24 * 60 * 60 * 1000),
        completed: true,
        icon: <Clock className="h-4 w-4" />
      },
      {
        status: "Shipped",
        date: baseDate,
        completed: recipient.status !== 'placed',
        icon: <Truck className="h-4 w-4" />
      },
      {
        status: "Out for Delivery",
        date: new Date(baseDate.getTime() + 2 * 24 * 60 * 60 * 1000),
        completed: recipient.status === 'delivered',
        icon: <MapPin className="h-4 w-4" />
      },
      {
        status: "Delivered",
        date: new Date(baseDate.getTime() + 3 * 24 * 60 * 60 * 1000),
        completed: recipient.status === 'delivered',
        icon: <CheckCircle className="h-4 w-4" />
      }
    ];

    return timeline;
  };

  // Use subOrders if available, otherwise use recipients
  const recipientData = order.subOrders || order.recipients?.map(recipient => ({
    recipientName: recipient.name,
    recipientEmail: recipient.email,
    shippingAddress: recipient.address,
    deliveryStatus: recipient.status,
    estimatedDelivery: recipient.estimatedDelivery,
    giftBoxContents: ["Premium Coffee", "Coffee Mug", "Gourmet Cookies"], // Mock data
    trackingNumber: "N/A",
    carrier: order.carrier
  })) || [];

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedShipments(new Set(recipientData.map((_, index) => index)));
    } else {
      setSelectedShipments(new Set());
    }
  };

  const handleSelectShipment = (index: number, checked: boolean) => {
    const newSelected = new Set(selectedShipments);
    if (checked) {
      newSelected.add(index);
    } else {
      newSelected.delete(index);
    }
    setSelectedShipments(newSelected);
  };

  const handleExportSelected = () => {
    const selectedData = recipientData.filter((_, index) => 
      selectedShipments.size === 0 || selectedShipments.has(index)
    );

    if (selectedData.length === 0) {
      toast.error("No shipments to export");
      return;
    }

    const exportData = selectedData.map(shipment => ({
      'Order ID': order.id,
      'Recipient Name': shipment.recipientName,
      'Recipient Email': shipment.recipientEmail,
      'Shipping Address': shipment.shippingAddress,
      'Carrier': shipment.carrier,
      'Tracking Number': shipment.trackingNumber || 'N/A',
      'Status': shipment.deliveryStatus.charAt(0).toUpperCase() + shipment.deliveryStatus.slice(1),
      'Expected Delivery': format(new Date(shipment.estimatedDelivery), "MMM d, yyyy"),
      'Gift Contents': shipment.giftBoxContents.join('; ')
    }));

    const headers = Object.keys(exportData[0]);
    const csvContent = [
      headers.join(','),
      ...exportData.map(row => 
        headers.map(header => `"${row[header as keyof typeof row] || ''}"`).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `shipments-${order.id}-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success(`Exported ${selectedData.length} shipment(s)`);
  };

  const truncateAddress = (address: string, maxLength: number = 30) => {
    return address.length > maxLength ? `${address.substring(0, maxLength)}...` : address;
  };

  // Mock delivery history for overall order
  const deliveryHistory = [
    {
      status: "Order Placed",
      date: new Date(order.shipDate.getTime() - 2 * 24 * 60 * 60 * 1000),
      description: "Order has been received and is being processed"
    },
    {
      status: "Processing",
      date: new Date(order.shipDate.getTime() - 1 * 24 * 60 * 60 * 1000),
      description: "Items are being prepared for shipment"
    },
    {
      status: "Shipped",
      date: order.shipDate,
      description: `Package shipped via ${order.carrier}`
    }
  ];

  if (order.status === "delivered") {
    deliveryHistory.push({
      status: "Delivered",
      date: new Date(order.shipDate.getTime() + 3 * 24 * 60 * 60 * 1000),
      description: "Package has been delivered successfully"
    });
  }

  const handleViewShipmentDetails = (recipient: any, index: number) => {
    setSelectedRecipientForDetails(recipient);
    setIsShipmentDetailsOpen(true);
  };

  const handleCloseShipmentDetails = () => {
    setIsShipmentDetailsOpen(false);
    setSelectedRecipientForDetails(null);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Order Details - {order.id}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Status</span>
                  <Badge className={`${getStatusColor(order.status)}`}>
                    {order.status === "in-transit" ? "In Transit" : 
                     order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Ship Date</span>
                  <span>{format(order.shipDate, "MMM d, yyyy")}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Carrier</span>
                  <div className="flex items-center gap-2">
                    <Truck className="h-4 w-4" />
                    {order.carrier}
                  </div>
                </div>
                {order.deliveryType && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Delivery Type</span>
                    <span className="font-medium">{order.deliveryType}</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Recipients</span>
                  <span>{order.recipientCount} recipients</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Tracking</span>
                  <a
                    href={order.trackingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Track Package
                  </a>
                </div>
              </CardContent>
            </Card>

            {/* Individual Shipments */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Individual Shipments ({recipientData.length})
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    {/* View Toggle */}
                    <div className="flex items-center border rounded-lg p-1">
                      <Button
                        variant={viewMode === 'cards' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setViewMode('cards')}
                        className="h-8 px-3"
                      >
                        <LayoutGrid className="h-4 w-4" />
                      </Button>
                      <Button
                        variant={viewMode === 'table' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setViewMode('table')}
                        className="h-8 px-3"
                      >
                        <List className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    {/* Export Button */}
                    <Button
                      onClick={handleExportSelected}
                      size="sm"
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <Download className="h-4 w-4" />
                      Export {selectedShipments.size > 0 ? `(${selectedShipments.size})` : 'All'}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {viewMode === 'table' ? (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-12">
                            <Checkbox
                              checked={selectedShipments.size === recipientData.length && recipientData.length > 0}
                              onCheckedChange={handleSelectAll}
                            />
                          </TableHead>
                          <TableHead>Recipient</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Address</TableHead>
                          <TableHead>Courier & Tracking</TableHead>
                          <TableHead>Expected Delivery</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Gift Contents</TableHead>
                          <TableHead className="w-12">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {recipientData.map((recipient, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              <Checkbox
                                checked={selectedShipments.has(index)}
                                onCheckedChange={(checked) => handleSelectShipment(index, checked as boolean)}
                              />
                            </TableCell>
                            <TableCell className="font-medium">{recipient.recipientName}</TableCell>
                            <TableCell className="text-sm text-gray-600">{recipient.recipientEmail}</TableCell>
                            <TableCell>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <span className="cursor-help">
                                      {truncateAddress(recipient.shippingAddress)}
                                    </span>
                                  </TooltipTrigger>
                                  <TooltipContent className="max-w-xs">
                                    <p>{recipient.shippingAddress}</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">
                                <div className="font-medium">{recipient.carrier}</div>
                                <div className="text-gray-500">{recipient.trackingNumber || 'N/A'}</div>
                              </div>
                            </TableCell>
                            <TableCell className="text-sm">
                              {format(new Date(recipient.estimatedDelivery), "MMM d, yyyy")}
                            </TableCell>
                            <TableCell>
                              <Badge className={`${getStatusColor(recipient.deliveryStatus)}`}>
                                {recipient.deliveryStatus === "in-transit" ? "In Transit" : 
                                 recipient.deliveryStatus.charAt(0).toUpperCase() + recipient.deliveryStatus.slice(1)}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Badge variant="outline" className="cursor-help">
                                      {recipient.giftBoxContents.length} items
                                    </Badge>
                                  </TooltipTrigger>
                                  <TooltipContent className="max-w-xs">
                                    <div className="space-y-1">
                                      {recipient.giftBoxContents.map((item, itemIndex) => (
                                        <p key={itemIndex} className="text-sm">• {item}</p>
                                      ))}
                                    </div>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </TableCell>
                            <TableCell>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      onClick={() => handleViewShipmentDetails(recipient, index)}
                                    >
                                      <Eye className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>View details</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {recipientData && recipientData.length > 0 ? (
                      recipientData.map((recipient, index) => (
                        <div key={index} className="border rounded-lg p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-start gap-3">
                              <Checkbox
                                checked={selectedShipments.has(index)}
                                onCheckedChange={(checked) => handleSelectShipment(index, checked as boolean)}
                              />
                              <div>
                                <p className="font-medium text-lg">{recipient.recipientName}</p>
                                <p className="text-sm text-gray-600">{recipient.recipientEmail}</p>
                              </div>
                            </div>
                            <Badge className={`${getStatusColor(recipient.deliveryStatus)}`}>
                              {recipient.deliveryStatus === "in-transit" ? "In Transit" : 
                               recipient.deliveryStatus.charAt(0).toUpperCase() + recipient.deliveryStatus.slice(1)}
                            </Badge>
                          </div>
                          
                          <div className="space-y-3 text-sm mb-6">
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-gray-500" />
                              <span>{recipient.shippingAddress}</span>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <Truck className="h-4 w-4 text-gray-500" />
                              <span>{recipient.carrier} - {recipient.trackingNumber || 'N/A'}</span>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-gray-500" />
                              <span>Expected: {format(new Date(recipient.estimatedDelivery), "MMM d, yyyy")}</span>
                            </div>
                            
                            {recipient.giftBoxContents && recipient.giftBoxContents.length > 0 && (
                              <div className="mt-3">
                                <p className="font-medium text-gray-700 mb-2">Gift Box Contents:</p>
                                <div className="flex flex-wrap gap-1">
                                  {recipient.giftBoxContents.map((item, itemIndex) => (
                                    <Badge key={itemIndex} variant="outline" className="text-xs">
                                      {item}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Delivery Timeline for Individual Shipment */}
                          <div className="border-t pt-4">
                            <h4 className="font-medium text-gray-900 mb-4">Delivery Timeline</h4>
                            <div className="relative">
                              {generateDeliveryTimeline(recipient).map((step, stepIndex) => (
                                <div key={stepIndex} className="flex items-start gap-4 pb-4 relative">
                                  {/* Timeline line */}
                                  {stepIndex < generateDeliveryTimeline(recipient).length - 1 && (
                                    <div className="absolute left-2 top-8 w-0.5 h-8 bg-gray-200"></div>
                                  )}
                                  
                                  {/* Timeline dot */}
                                  <div className={`flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center ${
                                    step.completed 
                                      ? 'bg-green-500 text-white' 
                                      : 'bg-gray-200 text-gray-400'
                                  }`}>
                                    {step.completed ? (
                                      <Circle className="w-2 h-2 fill-current" />
                                    ) : (
                                      <Circle className="w-2 h-2" />
                                    )}
                                  </div>
                                  
                                  {/* Timeline content */}
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-2">
                                        <div className={step.completed ? 'text-green-600' : 'text-gray-400'}>
                                          {step.icon}
                                        </div>
                                        <p className={`font-medium ${
                                          step.completed ? 'text-gray-900' : 'text-gray-500'
                                        }`}>
                                          {step.status}
                                        </p>
                                      </div>
                                      {step.completed && step.date && (
                                        <span className="text-sm text-gray-500">
                                          {format(step.date, "MMM d, h:mm a")}
                                        </span>
                                      )}
                                    </div>
                                    {step.status === "Shipped" && recipient.trackingNumber && recipient.trackingNumber !== "N/A" && (
                                      <p className="text-sm text-gray-600 mt-1">
                                        Tracking: {recipient.trackingNumber}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <MapPin className="h-4 w-4 mt-0.5 text-gray-600" />
                        <div>
                          <p className="font-medium">Single Recipient</p>
                          <p className="text-sm text-gray-600">Details will be shown here</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Overall Delivery History */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Overall Order History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {deliveryHistory.map((event, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium">{event.status}</p>
                          <span className="text-sm text-gray-500">
                            {format(event.date, "MMM d, h:mm a")}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{event.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>

      {/* Individual Shipment Details Modal */}
      <Dialog open={isShipmentDetailsOpen} onOpenChange={handleCloseShipmentDetails}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Shipment Details - {selectedRecipientForDetails?.recipientName}
            </DialogTitle>
          </DialogHeader>
          
          {selectedRecipientForDetails && (
            <div className="space-y-6">
              {/* Recipient Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recipient Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Name</label>
                      <p className="text-gray-900">{selectedRecipientForDetails.recipientName}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Email</label>
                      <p className="text-gray-900">{selectedRecipientForDetails.recipientEmail}</p>
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-sm font-medium text-gray-700">Shipping Address</label>
                      <p className="text-gray-900">{selectedRecipientForDetails.shippingAddress}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Shipping Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Carrier</label>
                      <p className="text-gray-900">{selectedRecipientForDetails.carrier}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Tracking Number</label>
                      <p className="text-gray-900">{selectedRecipientForDetails.trackingNumber || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Status</label>
                      <Badge className={`${getStatusColor(selectedRecipientForDetails.deliveryStatus)}`}>
                        {selectedRecipientForDetails.deliveryStatus === "in-transit" ? "In Transit" : 
                         selectedRecipientForDetails.deliveryStatus.charAt(0).toUpperCase() + selectedRecipientForDetails.deliveryStatus.slice(1)}
                      </Badge>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Expected Delivery</label>
                      <p className="text-gray-900">{format(new Date(selectedRecipientForDetails.estimatedDelivery), "MMM d, yyyy")}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Gift Box Contents */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Gift Box Contents</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {selectedRecipientForDetails.giftBoxContents?.map((item, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                        <Package className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Delivery Timeline */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Delivery Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {generateDeliveryTimeline(selectedRecipientForDetails).map((step, stepIndex) => (
                      <div key={stepIndex} className="flex items-start gap-4 pb-4 relative">
                        {/* Timeline line */}
                        {stepIndex < generateDeliveryTimeline(selectedRecipientForDetails).length - 1 && (
                          <div className="absolute left-2 top-8 w-0.5 h-8 bg-gray-200"></div>
                        )}
                        
                        {/* Timeline dot */}
                        <div className={`flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center ${
                          step.completed 
                            ? 'bg-green-500 text-white' 
                            : 'bg-gray-200 text-gray-400'
                        }`}>
                          {step.completed ? (
                            <Circle className="w-2 h-2 fill-current" />
                          ) : (
                            <Circle className="w-2 h-2" />
                          )}
                        </div>
                        
                        {/* Timeline content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className={step.completed ? 'text-green-600' : 'text-gray-400'}>
                                {step.icon}
                              </div>
                              <p className={`font-medium ${
                                step.completed ? 'text-gray-900' : 'text-gray-500'
                              }`}>
                                {step.status}
                              </p>
                            </div>
                            {step.completed && step.date && (
                              <span className="text-sm text-gray-500">
                                {format(step.date, "MMM d, h:mm a")}
                              </span>
                            )}
                          </div>
                          {step.status === "Shipped" && selectedRecipientForDetails.trackingNumber && selectedRecipientForDetails.trackingNumber !== "N/A" && (
                            <p className="text-sm text-gray-600 mt-1">
                              Tracking: {selectedRecipientForDetails.trackingNumber}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          
          <div className="flex justify-end pt-4">
            <Button onClick={handleCloseShipmentDetails}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default OrderDetailsModal;
