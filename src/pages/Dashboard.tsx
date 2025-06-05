
import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Gift, Users, TrendingUp, Clock, AlertCircle, Package, Calendar, MapPin, User } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const Dashboard: React.FC = () => {
  // Mock data for the most recent order
  const mostRecentOrder = {
    id: 'ORD-001',
    giftName: 'Corporate Welcome Box',
    recipients: 24,
    status: 'Processing',
    date: '2025-04-02',
    priority: 'high',
    estimatedDelivery: '2025-04-15',
    giftBoxItems: ['Premium Coffee Set', 'Gourmet Chocolate Box', 'Scented Candle'],
    recipientDetails: [
      { name: 'John Smith', status: 'Delivered', email: 'john@company.com' },
      { name: 'Sarah Johnson', status: 'In Transit', email: 'sarah@partner.com' },
      { name: 'Mike Wilson', status: 'Processing', email: 'mike@team.com' },
      { name: '...and 21 more recipients', status: '', email: '' }
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50 space-y-8">
      {/* Standard Page Heading */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>
      </div>
      
      {/* Metrics Grid - Updated to remove Inventory Available */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
              <p className="text-sm text-gray-600 mt-1">Your latest gift order details and progress</p>
            </div>
            <Button variant="outline" className="px-4 py-2">
              View All Orders
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {/* Order Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-linden-lightblue rounded-lg">
                <Package className="h-5 w-5 text-linden-blue" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Order ID</p>
                <p className="font-semibold text-linden-blue">{mostRecentOrder.id}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Gift className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Gift Box</p>
                <p className="font-semibold text-gray-900">{mostRecentOrder.giftName}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Recipients</p>
                <p className="font-semibold text-gray-900">{mostRecentOrder.recipients}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-amber-100 rounded-lg">
                <Calendar className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Est. Delivery</p>
                <p className="font-semibold text-gray-900">{new Date(mostRecentOrder.estimatedDelivery).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          {/* Order Status */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-900">Order Status</h3>
              <Badge 
                variant="secondary"
                className="bg-blue-100 text-blue-800 border-blue-200"
              >
                {mostRecentOrder.status}
              </Badge>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-2">Gift Box Items:</p>
              <p className="text-gray-800">{mostRecentOrder.giftBoxItems.join(", ")}</p>
            </div>
          </div>

          {/* Recent Recipients */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Recent Recipients</h3>
            <div className="space-y-3">
              {mostRecentOrder.recipientDetails.map((recipient, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-white rounded-full">
                      <User className="h-4 w-4 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{recipient.name}</p>
                      {recipient.email && (
                        <p className="text-sm text-gray-600">{recipient.email}</p>
                      )}
                    </div>
                  </div>
                  {recipient.status && (
                    <Badge 
                      variant="secondary"
                      className={
                        recipient.status === 'Delivered' ? 'bg-green-100 text-green-800 border-green-200' :
                        recipient.status === 'In Transit' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                        'bg-amber-100 text-amber-800 border-amber-200'
                      }
                    >
                      {recipient.status}
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
