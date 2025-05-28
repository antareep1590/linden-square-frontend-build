
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Package, User, Truck, MapPin, Clock, CheckCircle } from "lucide-react";
import { format } from "date-fns";

interface OrderDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: {
    id: string;
    recipientCount: number;
    shipDate: Date;
    carrier: string;
    trackingLink: string;
    status: string;
  } | null;
}

const OrderDetailsModal = ({ isOpen, onClose, order }: OrderDetailsModalProps) => {
  if (!order) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "in-transit":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "processing":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "pending":
        return "bg-gray-100 text-gray-700 border-gray-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const deliveryHistory = [
    { status: "Order Placed", date: new Date(order.shipDate.getTime() - 3 * 24 * 60 * 60 * 1000), icon: Package },
    { status: "Processing", date: new Date(order.shipDate.getTime() - 2 * 24 * 60 * 60 * 1000), icon: Clock },
    { status: "Shipped", date: order.shipDate, icon: Truck },
    { status: "In Transit", date: new Date(order.shipDate.getTime() + 1 * 24 * 60 * 60 * 1000), icon: MapPin },
    { status: "Delivered", date: new Date(order.shipDate.getTime() + 3 * 24 * 60 * 60 * 1000), icon: CheckCircle, completed: order.status === "delivered" }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Order Details - {order.id}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Order Summary */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="font-semibold text-sm text-gray-600">Order ID</h3>
              <p className="font-mono">{order.id}</p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-sm text-gray-600">Status</h3>
              <Badge className={`${getStatusColor(order.status)} border px-2 py-1 font-medium`}>
                {order.status === "in-transit" ? "In Transit" : 
                 order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </Badge>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-sm text-gray-600">Recipients</h3>
              <p className="flex items-center gap-1">
                <User className="h-4 w-4" />
                {order.recipientCount} recipients
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-sm text-gray-600">Ship Date</h3>
              <p>{format(order.shipDate, "MMM d, yyyy")}</p>
            </div>
          </div>

          <Separator />

          {/* Shipping Information */}
          <div>
            <h3 className="font-semibold mb-4">Shipping Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium text-sm text-gray-600">Carrier</h4>
                <p className="flex items-center gap-2">
                  <Truck className="h-4 w-4" />
                  {order.carrier}
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-sm text-gray-600">Tracking</h4>
                <a
                  href={order.trackingLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-sm"
                >
                  Track Package
                </a>
              </div>
            </div>
          </div>

          <Separator />

          {/* Delivery History */}
          <div>
            <h3 className="font-semibold mb-4">Delivery History</h3>
            <div className="space-y-4">
              {deliveryHistory.map((item, index) => {
                const Icon = item.icon;
                const isCompleted = item.completed !== false && (order.status === "delivered" || index < deliveryHistory.length - 1);
                
                return (
                  <div key={index} className={`flex items-center gap-4 p-3 rounded-lg ${isCompleted ? 'bg-green-50' : 'bg-gray-50'}`}>
                    <div className={`p-2 rounded-full ${isCompleted ? 'bg-green-100' : 'bg-gray-100'}`}>
                      <Icon className={`h-4 w-4 ${isCompleted ? 'text-green-600' : 'text-gray-400'}`} />
                    </div>
                    <div className="flex-1">
                      <p className={`font-medium ${isCompleted ? 'text-green-800' : 'text-gray-600'}`}>
                        {item.status}
                      </p>
                      <p className={`text-sm ${isCompleted ? 'text-green-600' : 'text-gray-500'}`}>
                        {format(item.date, "MMM d, yyyy 'at' h:mm a")}
                      </p>
                    </div>
                    {isCompleted && (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailsModal;
