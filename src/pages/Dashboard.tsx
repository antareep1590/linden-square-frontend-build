
import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Gift, Users, Package, TrendingUp, Clock, AlertCircle, Plus, Eye } from 'lucide-react';
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
    <div className="min-h-screen bg-gray-50 space-y-8">
      {/* Welcome Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-8">
        <div className="max-w-4xl">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Dashboard</h1>
          <p className="text-lg text-gray-600 mb-6">
            Welcome back! Here's an overview of your gift orders and activities.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button className="bg-linden-blue hover:bg-linden-blue/90 text-white px-6 py-2">
              <Plus className="h-4 w-4 mr-2" />
              Create New Order
            </Button>
            <Button variant="outline" className="px-6 py-2">
              <Eye className="h-4 w-4 mr-2" />
              View All Orders
            </Button>
          </div>
        </div>
      </div>
      
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white border-0 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Gifts Ordered</p>
                <p className="text-3xl font-bold text-gray-900">247</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                  <span className="text-sm text-green-600 font-medium">+12%</span>
                  <span className="text-sm text-gray-500 ml-1">vs last month</span>
                </div>
              </div>
              <div className="p-3 bg-linden-lightblue rounded-lg">
                <Gift className="h-6 w-6 text-linden-blue" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white border-0 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Pending Submissions</p>
                <p className="text-3xl font-bold text-gray-900">56</p>
                <p className="text-sm text-gray-500 mt-2">Across 2 active orders</p>
              </div>
              <div className="p-3 bg-amber-100 rounded-lg">
                <AlertCircle className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white border-0 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Inventory Available</p>
                <p className="text-3xl font-bold text-gray-900">384</p>
                <p className="text-sm text-gray-500 mt-2">Items in stock</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <Package className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-0 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Active Recipients</p>
                <p className="text-3xl font-bold text-gray-900">128</p>
                <p className="text-sm text-gray-500 mt-2">This month</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Recent Orders */}
      <Card className="bg-white border-0 shadow-sm">
        <CardHeader className="border-b border-gray-100 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-semibold text-gray-900">Recent Orders</CardTitle>
              <p className="text-sm text-gray-600 mt-1">Track and manage your latest gift orders</p>
            </div>
            <Button variant="outline" className="px-4 py-2">
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 border-0">
                <TableHead className="font-semibold text-gray-700 py-4">Order ID</TableHead>
                <TableHead className="font-semibold text-gray-700">Gift Name</TableHead>
                <TableHead className="font-semibold text-gray-700">Recipients</TableHead>
                <TableHead className="font-semibold text-gray-700">Status</TableHead>
                <TableHead className="font-semibold text-gray-700">Date</TableHead>
                <TableHead className="font-semibold text-gray-700">Priority</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockOrders.map((order) => (
                <TableRow key={order.id} className="hover:bg-gray-50 border-gray-100">
                  <TableCell className="font-medium text-linden-blue py-4">{order.id}</TableCell>
                  <TableCell className="font-medium text-gray-900">{order.giftName}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-700">{order.recipients}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant="secondary"
                      className={
                        order.status === 'Completed' ? 'bg-green-100 text-green-800 border-green-200' :
                        order.status === 'Processing' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                        order.status === 'Pending Addresses' ? 'bg-amber-100 text-amber-800 border-amber-200' :
                        order.status === 'Shipped' ? 'bg-indigo-100 text-indigo-800 border-indigo-200' : ''
                      }
                    >
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-600">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      {new Date(order.date).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline"
                      className={
                        order.priority === 'high' ? 'border-red-200 text-red-700 bg-red-50' :
                        order.priority === 'medium' ? 'border-amber-200 text-amber-700 bg-amber-50' :
                        'border-gray-200 text-gray-600 bg-gray-50'
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
      <Card className="bg-white border-0 shadow-sm">
        <CardHeader className="border-b border-gray-100 pb-4">
          <CardTitle className="text-xl font-semibold text-gray-900">Quick Actions</CardTitle>
          <p className="text-sm text-gray-600">Get started with common tasks</p>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="h-24 flex flex-col items-center gap-3 bg-linden-blue hover:bg-linden-blue/90 text-white">
              <Gift className="h-6 w-6" />
              <span className="font-medium">Select New Gifts</span>
            </Button>
            <Button variant="outline" className="h-24 flex flex-col items-center gap-3 border-gray-200 hover:bg-gray-50">
              <Users className="h-6 w-6 text-gray-600" />
              <span className="font-medium text-gray-700">Upload Recipients</span>
            </Button>
            <Button variant="outline" className="h-24 flex flex-col items-center gap-3 border-gray-200 hover:bg-gray-50">
              <Package className="h-6 w-6 text-gray-600" />
              <span className="font-medium text-gray-700">Track Orders</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
