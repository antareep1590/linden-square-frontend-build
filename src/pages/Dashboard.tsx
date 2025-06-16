
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Gift, Users, TrendingUp, Clock, AlertCircle, Package, Calendar, MapPin, User, Eye, CheckCircle, Truck } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePickerWithRange } from "@/components/ui/date-picker";
import { DateRange } from "react-day-picker";

const Dashboard: React.FC = () => {
  const [spendFilter, setSpendFilter] = useState('YTD');
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  // Mock data for recent orders (3 orders instead of 1)
  const recentOrders = [
    {
      id: 'ORD-001',
      giftName: 'Corporate Welcome Box',
      recipients: 24,
      status: 'Processing',
      date: '2025-04-02',
      estimatedDelivery: '2025-04-15',
    },
    {
      id: 'ORD-002',
      giftName: 'Executive Appreciation',
      recipients: 12,
      status: 'In Transit',
      date: '2025-03-28',
      estimatedDelivery: '2025-04-10',
    },
    {
      id: 'ORD-003',
      giftName: 'Holiday Wishes',
      recipients: 35,
      status: 'Delivered',
      date: '2025-03-25',
      estimatedDelivery: '2025-04-05',
    }
  ];

  const handleOrderClick = (orderId: string) => {
    // This would open a modal or navigate to order details
    console.log('Opening order details for:', orderId);
  };

  const getTotalSpendByFilter = () => {
    switch (spendFilter) {
      case 'YTD': return '$45,230';
      case 'MTD': return '$8,470';
      case 'Custom': return '$12,650';
      default: return '$45,230';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 space-y-8">
      {/* Standard Page Heading */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>
      </div>
      
      {/* Metrics Grid - Updated cards */}
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
                <p className="text-sm font-medium text-gray-600 mb-1">Claimed / Delivered</p>
                <div className="flex items-center space-x-4">
                  <div>
                    <p className="text-2xl font-bold text-gray-900">182</p>
                    <p className="text-xs text-gray-500">Claimed</p>
                  </div>
                  <div className="h-8 w-px bg-gray-300"></div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">156</p>
                    <p className="text-xs text-gray-500">Delivered</p>
                  </div>
                </div>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
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

        <Card className="bg-white border-0 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Spend</p>
                <p className="text-3xl font-bold text-gray-900">{getTotalSpendByFilter()}</p>
                <div className="mt-2">
                  <Select value={spendFilter} onValueChange={setSpendFilter}>
                    <SelectTrigger className="w-24 h-6 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="YTD">YTD</SelectItem>
                      <SelectItem value="MTD">MTD</SelectItem>
                      <SelectItem value="Custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Recent Orders Section */}
      <Card className="bg-white border-0 shadow-sm">
        <CardHeader className="border-b border-gray-100 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-semibold text-gray-900">Recent Orders</CardTitle>
              <p className="text-sm text-gray-600 mt-1">Your latest gift orders and their status</p>
            </div>
            <Button variant="outline" className="px-4 py-2">
              View All Orders
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6">
            {recentOrders.map((order, index) => (
              <div key={order.id} className="border border-gray-200 rounded-lg p-4 hover:border-linden-blue transition-colors">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-linden-lightblue rounded-lg">
                      <Package className="h-5 w-5 text-linden-blue" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Order ID</p>
                      <button 
                        className="font-semibold text-linden-blue hover:underline"
                        onClick={() => handleOrderClick(order.id)}
                      >
                        {order.id}
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Gift className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Gift Box</p>
                      <button 
                        className="font-semibold text-gray-900 hover:text-linden-blue"
                        onClick={() => handleOrderClick(order.id)}
                      >
                        {order.giftName}
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Users className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Recipients</p>
                      <button 
                        className="font-semibold text-gray-900 hover:text-linden-blue"
                        onClick={() => handleOrderClick(order.id)}
                      >
                        {order.recipients}
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-amber-100 rounded-lg">
                      <Calendar className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Est. Delivery</p>
                      <p className="font-semibold text-gray-900">{new Date(order.estimatedDelivery).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                {/* Order Status */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">Status:</span>
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
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleOrderClick(order.id)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Inventory Tracking Section */}
      <Card className="bg-white border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-900 flex items-center">
            <Package className="h-5 w-5 mr-2" />
            Inventory Tracking
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-gray-900">Corporate Welcome Box</span>
                <Badge variant="outline" className="bg-green-100 text-green-800">In Stock</Badge>
              </div>
              <p className="text-2xl font-bold text-gray-900">45 units</p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-gray-900">Executive Appreciation</span>
                <Badge variant="outline" className="bg-amber-100 text-amber-800">Low Stock</Badge>
              </div>
              <p className="text-2xl font-bold text-gray-900">8 units</p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-gray-900">Holiday Wishes</span>
                <Badge variant="outline" className="bg-red-100 text-red-800">Out of Stock</Badge>
              </div>
              <p className="text-2xl font-bold text-gray-900">0 units</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
