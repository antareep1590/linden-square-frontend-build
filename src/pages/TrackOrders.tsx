
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Package, Truck, MapPin, Eye, Calendar, Clock } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface Order {
  id: string;
  orderNumber: string;
  recipientName: string;
  items: string;
  orderDate: string;
  status: 'placed' | 'fulfilled' | 'shipped' | 'delivered';
  trackingNumber?: string;
  estimatedDelivery?: string;
  shippingCarrier?: string;
}

const TrackOrders = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showTimeline, setShowTimeline] = useState(false);

  // Mock orders data
  const orders: Order[] = [
    {
      id: '1',
      orderNumber: 'ORD-2024-001',
      recipientName: 'Sarah Johnson',
      items: 'Premium Coffee Set',
      orderDate: '2024-01-15',
      status: 'delivered',
      trackingNumber: 'FX123456789',
      estimatedDelivery: '2024-01-18',
      shippingCarrier: 'FedEx'
    },
    {
      id: '2',
      orderNumber: 'ORD-2024-002',
      recipientName: 'Michael Chen',
      items: 'Wellness Package',
      orderDate: '2024-01-16',
      status: 'shipped',
      trackingNumber: 'UP987654321',
      estimatedDelivery: '2024-01-20',
      shippingCarrier: 'UPS'
    },
    {
      id: '3',
      orderNumber: 'ORD-2024-003',
      recipientName: 'Emily Rodriguez',
      items: 'Tech Starter Kit',
      orderDate: '2024-01-17',
      status: 'fulfilled',
      trackingNumber: 'DH456789123',
      estimatedDelivery: '2024-01-21',
      shippingCarrier: 'DHL'
    },
    {
      id: '4',
      orderNumber: 'ORD-2024-004',
      recipientName: 'David Wilson',
      items: 'Gourmet Treats',
      orderDate: '2024-01-18',
      status: 'placed',
      estimatedDelivery: '2024-01-23'
    }
  ];

  const getStatusBadge = (status: string) => {
    const configs = {
      placed: { color: 'bg-blue-100 text-blue-800', label: 'Placed' },
      fulfilled: { color: 'bg-yellow-100 text-yellow-800', label: 'Fulfilled' },
      shipped: { color: 'bg-purple-100 text-purple-800', label: 'Shipped' },
      delivered: { color: 'bg-green-100 text-green-800', label: 'Delivered' }
    };
    
    const config = configs[status as keyof typeof configs];
    return (
      <Badge className={config.color}>
        {config.label}
      </Badge>
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'placed': return <Package className="h-4 w-4" />;
      case 'fulfilled': return <Clock className="h-4 w-4" />;
      case 'shipped': return <Truck className="h-4 w-4" />;
      case 'delivered': return <MapPin className="h-4 w-4" />;
      default: return <Package className="h-4 w-4" />;
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.recipientName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleViewTimeline = (order: Order) => {
    setSelectedOrder(order);
    setShowTimeline(true);
  };

  const renderTimeline = (order: Order) => {
    const timelineSteps = [
      { status: 'placed', label: 'Order Placed', date: order.orderDate, completed: true },
      { status: 'fulfilled', label: 'Order Fulfilled', date: '2024-01-17', completed: ['fulfilled', 'shipped', 'delivered'].includes(order.status) },
      { status: 'shipped', label: 'Shipped', date: '2024-01-18', completed: ['shipped', 'delivered'].includes(order.status) },
      { status: 'delivered', label: 'Delivered', date: order.estimatedDelivery, completed: order.status === 'delivered' }
    ];

    return (
      <div className="space-y-4">
        {timelineSteps.map((step, index) => (
          <div key={step.status} className="flex items-center gap-4">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step.completed ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
            }`}>
              {getStatusIcon(step.status)}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className={`font-medium ${step.completed ? 'text-gray-900' : 'text-gray-500'}`}>
                  {step.label}
                </span>
                <span className="text-sm text-gray-500">{step.date}</span>
              </div>
              {step.status === 'shipped' && order.trackingNumber && (
                <div className="text-sm text-gray-600 mt-1">
                  Tracking: {order.trackingNumber} ({order.shippingCarrier})
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Track Orders</h1>
          <p className="text-gray-600">Monitor the status and delivery progress of your gift orders</p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by order number or recipient name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="placed">Placed</SelectItem>
                <SelectItem value="fulfilled">Fulfilled</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Orders ({filteredOrders.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order Number</TableHead>
                <TableHead>Recipient</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Order Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Tracking</TableHead>
                <TableHead>Est. Delivery</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.orderNumber}</TableCell>
                  <TableCell>{order.recipientName}</TableCell>
                  <TableCell>{order.items}</TableCell>
                  <TableCell>{order.orderDate}</TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  <TableCell>
                    {order.trackingNumber ? (
                      <div>
                        <div className="text-sm font-medium">{order.trackingNumber}</div>
                        <div className="text-xs text-gray-500">{order.shippingCarrier}</div>
                      </div>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </TableCell>
                  <TableCell>{order.estimatedDelivery}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewTimeline(order)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Order Timeline Modal */}
      <Dialog open={showTimeline} onOpenChange={setShowTimeline}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Order Timeline</DialogTitle>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="space-y-4">
              <div className="border-b pb-4">
                <div className="font-medium">{selectedOrder.orderNumber}</div>
                <div className="text-sm text-gray-600">Recipient: {selectedOrder.recipientName}</div>
                <div className="text-sm text-gray-600">Items: {selectedOrder.items}</div>
              </div>
              
              {renderTimeline(selectedOrder)}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TrackOrders;
