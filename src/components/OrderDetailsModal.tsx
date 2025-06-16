
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Users, Calendar, MapPin, Gift, Truck, CheckCircle } from 'lucide-react';

interface OrderDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
}

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({ isOpen, onClose, orderId }) => {
  // Mock data - in a real app, this would fetch based on orderId
  const orderDetails = {
    'ORD-001': {
      id: 'ORD-001',
      giftName: 'Corporate Welcome Box',
      recipients: 24,
      status: 'Processing',
      date: '2025-04-02',
      estimatedDelivery: '2025-04-15',
      actualDelivery: null,
      totalCost: '$1,440.00',
      customizations: {
        brandedNotecard: true,
        giftTags: true,
        messageCard: true,
        message: 'Welcome to our team!'
      },
      timeline: [
        { status: 'Order Placed', date: '2025-04-02', completed: true },
        { status: 'Processing', date: '2025-04-03', completed: true },
        { status: 'In Transit', date: null, completed: false },
        { status: 'Delivered', date: null, completed: false }
      ]
    },
    'ORD-002': {
      id: 'ORD-002',
      giftName: 'Executive Appreciation',
      recipients: 12,
      status: 'In Transit',
      date: '2025-03-28',
      estimatedDelivery: '2025-04-10',
      actualDelivery: null,
      totalCost: '$720.00',
      customizations: {
        brandedNotecard: true,
        giftTags: false,
        messageCard: true,
        message: 'Thank you for your hard work!'
      },
      timeline: [
        { status: 'Order Placed', date: '2025-03-28', completed: true },
        { status: 'Processing', date: '2025-03-29', completed: true },
        { status: 'In Transit', date: '2025-04-01', completed: true },
        { status: 'Delivered', date: null, completed: false }
      ]
    },
    'ORD-003': {
      id: 'ORD-003',
      giftName: 'Holiday Wishes',
      recipients: 35,
      status: 'Delivered',
      date: '2025-03-25',
      estimatedDelivery: '2025-04-05',
      actualDelivery: '2025-04-04',
      totalCost: '$2,100.00',
      customizations: {
        brandedNotecard: true,
        giftTags: true,
        messageCard: true,
        message: 'Happy holidays from our team!'
      },
      timeline: [
        { status: 'Order Placed', date: '2025-03-25', completed: true },
        { status: 'Processing', date: '2025-03-26', completed: true },
        { status: 'In Transit', date: '2025-03-30', completed: true },
        { status: 'Delivered', date: '2025-04-04', completed: true }
      ]
    }
  };

  const order = orderDetails[orderId as keyof typeof orderDetails];

  if (!order) return null;

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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Gift className="h-8 w-8 text-linden-blue" />
                  <div>
                    <p className="text-sm text-gray-600">Gift Box</p>
                    <p className="font-semibold">{order.giftName}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Users className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-600">Recipients</p>
                    <p className="font-semibold">{order.recipients}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Calendar className="h-8 w-8 text-purple-600" />
                  <div>
                    <p className="text-sm text-gray-600">Total Cost</p>
                    <p className="font-semibold">{order.totalCost}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Status & Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Order Status & Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <Badge 
                  variant="secondary"
                  className={
                    order.status === 'Delivered' ? 'bg-green-100 text-green-800 border-green-200' :
                    order.status === 'In Transit' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                    'bg-amber-100 text-amber-800 border-amber-200'
                  }
                >
                  {order.status}
                </Badge>
                <div className="text-sm text-gray-600">
                  {order.actualDelivery ? 
                    `Delivered: ${new Date(order.actualDelivery).toLocaleDateString()}` :
                    `Est. Delivery: ${new Date(order.estimatedDelivery).toLocaleDateString()}`
                  }
                </div>
              </div>
              
              <div className="space-y-3">
                {order.timeline.map((step, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full ${step.completed ? 'bg-green-500' : 'bg-gray-300'}`}>
                      {step.completed && <CheckCircle className="w-4 h-4 text-white" />}
                    </div>
                    <div className="flex-1">
                      <p className={`font-medium ${step.completed ? 'text-gray-900' : 'text-gray-500'}`}>
                        {step.status}
                      </p>
                      {step.date && (
                        <p className="text-sm text-gray-500">
                          {new Date(step.date).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Customizations */}
          <Card>
            <CardHeader>
              <CardTitle>Customizations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span>Branded Notecard</span>
                    <Badge variant={order.customizations.brandedNotecard ? "default" : "secondary"}>
                      {order.customizations.brandedNotecard ? "Included" : "Not Included"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Gift Tags</span>
                    <Badge variant={order.customizations.giftTags ? "default" : "secondary"}>
                      {order.customizations.giftTags ? "Included" : "Not Included"}
                    </Badge>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span>Message Card</span>
                    <Badge variant={order.customizations.messageCard ? "default" : "secondary"}>
                      {order.customizations.messageCard ? "Included" : "Not Included"}
                    </Badge>
                  </div>
                </div>
              </div>
              {order.customizations.message && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-700">Custom Message:</p>
                  <p className="text-sm text-gray-600 mt-1">"{order.customizations.message}"</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div className="flex justify-end pt-4">
          <Button onClick={onClose}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailsModal;
