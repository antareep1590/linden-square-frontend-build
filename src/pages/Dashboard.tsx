
import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Gift, Users, TrendingUp, Clock, AlertCircle, Package, MapPin, Calendar } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const mostRecentOrder = {
  id: 'ORD-001', 
  giftName: 'Corporate Welcome Box', 
  recipients: 24, 
  status: 'Processing', 
  date: '2025-04-02',
  priority: 'high',
  giftBoxItems: 'Premium Coffee Set, Luxury Notebook, Wellness Kit',
  estimatedDelivery: '2025-04-10',
  trackingNumber: 'TRK123456789'
};

const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 space-y-8">
      {/* Standard Page Heading */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>
      </div>
      
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
      
      {/* Most Recent Order */}
      <Card className="bg-white border-0 shadow-sm">
        <CardHeader className="border-b border-gray-100 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-semibold text-gray-900">Most Recent Order</CardTitle>
              <p className="text-sm text-gray-600 mt-1">Your latest gift order details</p>
            </div>
            <Button variant="outline" className="px-4 py-2">
              View All Orders
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Order Info */}
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Order Details</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Order ID:</span>
                    <span className="text-sm font-medium text-linden-blue">{mostRecentOrder.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Gift Name:</span>
                    <span className="text-sm font-medium">{mostRecentOrder.giftName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Recipients:</span>
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3 text-gray-400" />
                      <span className="text-sm font-medium">{mostRecentOrder.recipients}</span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Order Date:</span>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-gray-400" />
                      <span className="text-sm">{new Date(mostRecentOrder.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Status & Progress */}
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Status & Timeline</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Status:</span>
                    <Badge 
                      variant="secondary"
                      className="bg-blue-100 text-blue-800 border-blue-200"
                    >
                      {mostRecentOrder.status}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Priority:</span>
                    <Badge 
                      variant="outline"
                      className="border-red-200 text-red-700 bg-red-50"
                    >
                      {mostRecentOrder.priority}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Est. Delivery:</span>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-gray-400" />
                      <span className="text-sm">{new Date(mostRecentOrder.estimatedDelivery).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Tracking:</span>
                    <span className="text-sm font-mono text-gray-800">{mostRecentOrder.trackingNumber}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Gift Items */}
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Gift Items</h3>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Package className="h-4 w-4 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{mostRecentOrder.giftName}</p>
                      <p className="text-xs text-gray-600 mt-1">({mostRecentOrder.giftBoxItems})</p>
                    </div>
                  </div>
                </div>
                <div className="mt-3 flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    <MapPin className="h-3 w-3 mr-1" />
                    Track Order
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    View Details
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
