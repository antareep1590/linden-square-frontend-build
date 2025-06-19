
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Package, 
  Users, 
  Truck, 
  AlertCircle,
  DollarSign,
  TrendingUp,
  Plus,
  Eye,
  FileText,
  Gift,
  Clock,
  MapPin,
  Calendar,
  CheckCircle,
  PackageCheck,
  Timer,
  Activity,
  ArrowUpRight,
  Settings
} from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const [timeFilter, setTimeFilter] = useState('today');

  // Mock data aligned with current system
  const summaryStats = {
    totalOrders: 42,
    pendingShipments: 18,
    activeClients: 15,
    pendingPayments: 7,
    totalRevenue: 28450.00,
    completedDeliveries: 156
  };

  const recentOrders = [
    {
      id: 'ORD-2024-156',
      client: 'TechCorp Solutions',
      recipients: 12,
      status: 'Pending Assignment',
      deliveryType: 'Express Delivery',
      boxSize: 'Medium',
      orderDate: '2024-01-15',
      amount: 1450.00
    },
    {
      id: 'ORD-2024-157',
      client: 'Marketing Inc',
      recipients: 8,
      status: 'Carrier Assigned',
      deliveryType: 'Normal Delivery',
      boxSize: 'Small',
      orderDate: '2024-01-15',
      amount: 680.00
    },
    {
      id: 'ORD-2024-158',
      client: 'Global Enterprises',
      recipients: 25,
      status: 'Pick-Up Scheduled',
      deliveryType: 'Express Delivery',
      boxSize: 'Large',
      orderDate: '2024-01-14',
      amount: 3200.00
    }
  ];

  const upcomingPickups = [
    {
      id: 'PU-001',
      carrier: 'FedEx Express',
      scheduledTime: '2024-01-16 10:00 AM',
      orders: 3,
      status: 'Confirmed'
    },
    {
      id: 'PU-002',
      carrier: 'UPS Ground',
      scheduledTime: '2024-01-16 2:00 PM',
      orders: 2,
      status: 'Window Requested'
    }
  ];

  const recentActivity = [
    {
      id: 1,
      action: 'Carrier assigned to ORD-2024-156',
      user: 'Admin',
      time: '10 minutes ago',
      type: 'assignment'
    },
    {
      id: 2,
      action: 'Pick-up scheduled for 3 orders',
      user: 'System',
      time: '25 minutes ago',
      type: 'scheduling'
    },
    {
      id: 3,
      action: 'Payment received from TechCorp',
      user: 'System',
      time: '1 hour ago',
      type: 'payment'
    },
    {
      id: 4,
      action: 'New customization settings saved',
      user: 'Admin',
      time: '2 hours ago',
      type: 'settings'
    }
  ];

  const lowInventoryItems = [
    { name: 'Premium Coffee Set', stock: 5, threshold: 10 },
    { name: 'Executive Notebook', stock: 3, threshold: 15 },
    { name: 'Wellness Package', stock: 7, threshold: 12 }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending Assignment': return 'bg-red-100 text-red-800';
      case 'Carrier Assigned': return 'bg-yellow-100 text-yellow-800';
      case 'Pick-Up Scheduled': return 'bg-blue-100 text-blue-800';
      case 'Picked Up': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'assignment': return <Truck className="h-4 w-4 text-blue-600" />;
      case 'scheduling': return <Calendar className="h-4 w-4 text-green-600" />;
      case 'payment': return <DollarSign className="h-4 w-4 text-emerald-600" />;
      case 'settings': return <Settings className="h-4 w-4 text-purple-600" />;
      default: return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-600">Overview of your operations and key metrics</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={timeFilter} onValueChange={setTimeFilter}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Quick Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summaryStats.totalOrders}</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="h-3 w-3 mr-1 text-green-600" />
              +12% from yesterday
            </p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Shipments</CardTitle>
            <Truck className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{summaryStats.pendingShipments}</div>
            <p className="text-xs text-muted-foreground">Requires attention</p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summaryStats.activeClients}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${summaryStats.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {summaryStats.pendingPayments} pending payments
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Recent Orders
              </CardTitle>
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Gift className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-semibold">{order.id}</p>
                        <p className="text-sm text-gray-600">{order.client}</p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(order.status)}>
                      {order.status}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Recipients</p>
                      <p className="font-medium">{order.recipients}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Delivery Type</p>
                      <p className="font-medium">{order.deliveryType}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Box Size</p>
                      <p className="font-medium">{order.boxSize}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Amount</p>
                      <p className="font-medium">${order.amount.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Pickups */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Upcoming Pickups
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingPickups.map((pickup) => (
                <div key={pickup.id} className="border rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium text-sm">{pickup.carrier}</p>
                    <Badge variant={pickup.status === 'Confirmed' ? 'default' : 'secondary'}>
                      {pickup.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span>{pickup.scheduledTime}</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{pickup.orders} orders</p>
                </div>
              ))}
              
              <Button className="w-full" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Schedule Pickup
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>by {activity.user}</span>
                      <span>•</span>
                      <span>{activity.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Inventory Alerts */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-500" />
                Low Inventory Alerts
              </CardTitle>
              <Button variant="ghost" size="sm">
                <ArrowUpRight className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {lowInventoryItems.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{item.name}</p>
                    <p className="text-xs text-gray-600">Threshold: {item.threshold} units</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-red-600">{item.stock}</p>
                    <p className="text-xs text-gray-500">remaining</p>
                  </div>
                </div>
              ))}
              
              <Button className="w-full mt-4" variant="outline">
                <Package className="h-4 w-4 mr-2" />
                Manage Inventory
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button className="h-20 flex flex-col gap-2" variant="outline">
              <Truck className="h-6 w-6" />
              Assign Carrier
            </Button>
            <Button className="h-20 flex flex-col gap-2" variant="outline">
              <Calendar className="h-6 w-6" />
              Schedule Pickup
            </Button>
            <Button className="h-20 flex flex-col gap-2" variant="outline">
              <Settings className="h-6 w-6" />
              Customization Settings
            </Button>
            <Button className="h-20 flex flex-col gap-2" variant="outline">
              <FileText className="h-6 w-6" />
              Generate Report
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
