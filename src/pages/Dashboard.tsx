
import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Gift, Users, Package, TrendingUp, Clock, AlertCircle } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const mockOrders = [
  { 
    id: 'ORD-001', 
    giftName: 'Corporate Welcome Box', 
    recipients: 24, 
    status: 'Processing', 
    date: '2025-04-02',
    priority: 'high'
  },
  { 
    id: 'ORD-002', 
    giftName: 'Holiday Gift Bundle', 
    recipients: 56, 
    status: 'Pending Addresses', 
    date: '2025-03-28',
    priority: 'medium'
  },
  { 
    id: 'ORD-003', 
    giftName: 'Employee Appreciation Kit', 
    recipients: 12, 
    status: 'Completed', 
    date: '2025-03-15',
    priority: 'low'
  },
  { 
    id: 'ORD-004', 
    giftName: 'Client Thank You Package', 
    recipients: 8, 
    status: 'Shipped', 
    date: '2025-03-10',
    priority: 'low'
  },
];

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-linden-blue to-linden-blue/80 rounded-lg p-6 text-white">
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-white/90 text-lg">Welcome back to your Linden Square dashboard. Here's what's happening with your gift orders.</p>
        <div className="mt-4 flex gap-4">
          <Button className="bg-white text-linden-blue hover:bg-gray-100">
            Create New Order
          </Button>
          <Button variant="outline" className="border-white text-white hover:bg-white/10">
            View All Orders
          </Button>
        </div>
      </div>
      
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-linden-blue">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Gifts Ordered</CardTitle>
            <Gift className="h-5 w-5 text-linden-blue" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">247</div>
            <div className="flex items-center mt-2">
              <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
              <p className="text-sm text-green-600 font-medium">+12% from last month</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-amber-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Pending Address Submissions</CardTitle>
            <AlertCircle className="h-5 w-5 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">56</div>
            <p className="text-sm text-gray-500 mt-2">Across 2 active orders</p>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Inventory Remaining</CardTitle>
            <Package className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">384</div>
            <p className="text-sm text-gray-500 mt-2">Items currently in stock</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Active Recipients</CardTitle>
            <Users className="h-5 w-5 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">128</div>
            <p className="text-sm text-gray-500 mt-2">Recipients this month</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Recent Orders Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-semibold text-gray-900">Latest Bulk Orders</CardTitle>
              <p className="text-sm text-gray-500 mt-1">Track and manage your recent gift orders</p>
            </div>
            <Button variant="outline">View All Orders</Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold">Order ID</TableHead>
                <TableHead className="font-semibold">Gift Name</TableHead>
                <TableHead className="font-semibold">Recipients</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Date</TableHead>
                <TableHead className="font-semibold">Priority</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockOrders.map((order) => (
                <TableRow key={order.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium text-linden-blue">{order.id}</TableCell>
                  <TableCell className="font-medium">{order.giftName}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-gray-400" />
                      {order.recipients}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={
                        order.status === 'Completed' ? 'default' :
                        order.status === 'Processing' ? 'secondary' :
                        order.status === 'Pending Addresses' ? 'destructive' :
                        'outline'
                      }
                      className={
                        order.status === 'Completed' ? 'bg-green-100 text-green-800 hover:bg-green-100' :
                        order.status === 'Processing' ? 'bg-blue-100 text-blue-800 hover:bg-blue-100' :
                        order.status === 'Pending Addresses' ? 'bg-amber-100 text-amber-800 hover:bg-amber-100' :
                        order.status === 'Shipped' ? 'bg-indigo-100 text-indigo-800 hover:bg-indigo-100' : ''
                      }
                    >
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-600">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-gray-400" />
                      {new Date(order.date).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline"
                      className={
                        order.priority === 'high' ? 'border-red-200 text-red-700' :
                        order.priority === 'medium' ? 'border-amber-200 text-amber-700' :
                        'border-gray-200 text-gray-600'
                      }
                    >
                      {order.priority}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-900">Quick Actions</CardTitle>
          <p className="text-sm text-gray-500">Frequently used actions to manage your orders</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="h-20 flex flex-col items-center gap-2 bg-linden-blue hover:bg-linden-blue/90">
              <Gift className="h-6 w-6" />
              <span>Select New Gifts</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center gap-2">
              <Users className="h-6 w-6" />
              <span>Upload Recipients</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center gap-2">
              <Package className="h-6 w-6" />
              <span>Track Orders</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
