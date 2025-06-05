
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, MapPin, Truck, Package, Clock, CheckCircle } from "lucide-react";
import { format } from "date-fns";

interface SubOrder {
  recipientName: string;
  recipientEmail: string;
  shippingAddress: string;
  deliveryStatus: string;
  estimatedDelivery: string;
  giftBoxContents: string[];
}

interface Order {
  id: string;
  recipientCount: number;
  shipDate: Date;
  carrier: string;
  trackingLink: string;
  status: string;
  subOrders?: SubOrder[];
}

interface OrderDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
}

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({ isOpen, onClose, order }) => {
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

  // Mock delivery history
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
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

          {/* Recipient Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="h-5 w-5" />
                Recipient Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.subOrders && order.subOrders.length > 0 ? (
                  order.subOrders.map((subOrder, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="font-medium">{subOrder.recipientName}</p>
                          <p className="text-sm text-gray-600">{subOrder.recipientEmail}</p>
                        </div>
                        <Badge className={`${getStatusColor(subOrder.deliveryStatus)}`}>
                          {subOrder.deliveryStatus === "in-transit" ? "In Transit" : 
                           subOrder.deliveryStatus.charAt(0).toUpperCase() + subOrder.deliveryStatus.slice(1)}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-gray-500" />
                          <span>{subOrder.shippingAddress}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <span>Expected: {format(new Date(subOrder.estimatedDelivery), "MMM d, yyyy")}</span>
                        </div>
                        
                        {subOrder.giftBoxContents && subOrder.giftBoxContents.length > 0 && (
                          <div className="mt-3">
                            <p className="font-medium text-gray-700 mb-2">Gift Box Contents:</p>
                            <div className="flex flex-wrap gap-1">
                              {subOrder.giftBoxContents.map((item, itemIndex) => (
                                <Badge key={itemIndex} variant="outline" className="text-xs">
                                  {item}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
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
            </CardContent>
          </Card>

          {/* Delivery History */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Delivery History</CardTitle>
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
  );
};

export default OrderDetailsModal;
