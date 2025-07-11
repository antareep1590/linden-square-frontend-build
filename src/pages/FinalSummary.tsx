
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Package, Users, CreditCard, FileText, Gift, MapPin, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LindenSquareLogo from '@/components/LindenSquareLogo';
import { toast } from 'sonner';

const FinalSummary = () => {
  const navigate = useNavigate();
  
  // Check if this is a standalone flow (new client)
  const isStandalone = !window.location.pathname.includes('/dashboard');
  
  // Sample data that would come from previous steps
  const orderData = {
    selectedBoxes: [
      {
        id: 1,
        name: 'Executive Appreciation',
        price: 89.99,
        image: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
        personalization: {
          ribbon: 'Gold Elegant',
          packaging: 'Premium Box',
          message: 'Thank you for your outstanding work this quarter!',
          from: 'Management Team'
        },
        assignedRecipients: [
          { 
            id: 1, 
            name: 'John Smith', 
            email: 'john@company.com', 
            phone: '555-123-4567',
            address: '123 Main St, Anytown, CA 12345',
            department: 'Sales' 
          },
          { 
            id: 2, 
            name: 'Sarah Johnson', 
            email: 'sarah@company.com', 
            phone: '',
            address: '',
            department: 'Marketing' 
          }
        ]
      },
      {
        id: 2,
        name: 'Team Celebration',
        price: 45.99,
        image: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
        personalization: {
          ribbon: 'Blue Classic',
          packaging: 'Standard Box',
          message: 'Celebrating our team success!',
          from: 'HR Department'
        },
        assignedRecipients: [
          { 
            id: 3, 
            name: 'Mike Chen', 
            email: 'mike@company.com', 
            phone: '555-987-6543',
            address: '456 Oak Ave, Somewhere, CA 67890',
            department: 'Engineering' 
          },
          { 
            id: 4, 
            name: 'Emily Davis', 
            email: 'emily@company.com', 
            phone: '',
            address: '',
            department: 'HR' 
          }
        ]
      }
    ],
    costs: {
      subtotal: 271.96,
      personalization: 35.00,
      tax: 24.56,
      shipping: 0, // Will be calculated
      total: 331.52
    }
  };

  const handleProceedToCheckout = () => {
    if (isStandalone) {
      // Redirect new clients to login/signup
      navigate('/login');
    } else {
      // Existing clients go to payment
      navigate('/payment-method');
    }
  };

  const handlePayLater = () => {
    if (isStandalone) {
      // Redirect new clients to login/signup  
      navigate('/login');
    } else {
      // For existing clients: trigger invoice email and show confirmation
      // This would be a backend API call in a real application
      toast.success('Campaign saved as draft. Invoice email has been sent to your registered account.');
      console.log('Triggering invoice email to client account - Backend API call would go here');
      
      // Update order status and log the action
      console.log('Order status updated: Invoice Sent');
      console.log('Action logged against client order ID:', Date.now());
      
      // Stay on the current page or navigate to dashboard
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    }
  };

  const handleBack = () => {
    navigate('/recipient-selection');
  };

  const getTotalRecipients = () => {
    return orderData.selectedBoxes.reduce((total, box) => total + box.assignedRecipients.length, 0);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {isStandalone && (
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <LindenSquareLogo size="medium" />
                <div className="hidden sm:block h-6 w-px bg-gray-300"></div>
                <h1 className="hidden sm:block text-xl font-semibold text-gray-900">Review Your Order</h1>
              </div>
              <Button variant="outline" onClick={handleBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </div>
          </div>
        </header>
      )}

      <div className={`${isStandalone ? 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8' : 'space-y-6'}`}>
        {!isStandalone && (
          <div className="flex items-center gap-4 mb-6">
            <Button variant="outline" size="sm" onClick={handleBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold">Review Your Order</h1>
              <p className="text-gray-600">Review your gift campaign before proceeding to payment</p>
            </div>
          </div>
        )}

        {isStandalone && (
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Review Your Order
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Please review your gift selection, recipients, and pricing before proceeding to checkout.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Selected Gift Boxes with Recipients */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gift className="h-5 w-5" />
                  Recipients & Assignments ({orderData.selectedBoxes.length} boxes, {getTotalRecipients()} recipients)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {orderData.selectedBoxes.map((box) => (
                  <div key={box.id} className="border rounded-lg p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <img 
                        src={box.image} 
                        alt={box.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{box.name}</h3>
                        <p className="text-linden-blue font-semibold">${box.price} each</p>
                        
                        <div className="mt-3 space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">Ribbon:</span>
                            <Badge variant="outline">{box.personalization.ribbon}</Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">Packaging:</span>
                            <Badge variant="outline">{box.personalization.packaging}</Badge>
                          </div>
                          <div className="text-sm">
                            <span className="text-gray-600">Message:</span>
                            <p className="italic mt-1">"{box.personalization.message}"</p>
                            <p className="text-right text-xs text-gray-500 mt-1">- {box.personalization.from}</p>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">{box.assignedRecipients.length} recipients</p>
                        <p className="font-semibold text-linden-blue">
                          ${(box.price * box.assignedRecipients.length).toFixed(2)} total
                        </p>
                      </div>
                    </div>

                    {/* Recipients for this box */}
                    <div className="border-t pt-4">
                      <h4 className="font-medium text-gray-900 mb-3">
                        Assigned Recipients ({box.assignedRecipients.length})
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {box.assignedRecipients.map((recipient) => (
                          <div key={recipient.id} className="flex flex-col gap-2 p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h5 className="font-medium text-sm">{recipient.name}</h5>
                                <p className="text-xs text-gray-600">{recipient.email}</p>
                                {recipient.phone && (
                                  <p className="text-xs text-gray-600">{recipient.phone}</p>
                                )}
                                {recipient.address ? (
                                  <div className="flex items-start gap-1 mt-1">
                                    <MapPin className="h-3 w-3 text-gray-400 mt-0.5" />
                                    <span className="text-xs text-gray-500">{recipient.address}</span>
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-1 mt-1">
                                    <Mail className="h-3 w-3 text-gray-400" />
                                    <span className="text-xs text-gray-500">Address will be collected</span>
                                  </div>
                                )}
                              </div>
                              {!isStandalone && recipient.department && (
                                <Badge variant="outline" className="text-xs">
                                  {recipient.department}
                                </Badge>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Delivery Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Delivery Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">Address Collection Process</h4>
                  <p className="text-sm text-blue-800">
                    Recipients without addresses will receive an email with a secure link to provide their delivery address and preferences. 
                    You'll be notified once all addresses are collected and shipping can begin.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary Sidebar */}
          <div className="space-y-6">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                
                {/* Cost Breakdown */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Gift Boxes Subtotal:</span>
                    <span>${orderData.costs.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Personalization:</span>
                    <span>+${orderData.costs.personalization.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Tax (8%):</span>
                    <span>${orderData.costs.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Shipping:</span>
                    <span>Calculated after addresses</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total:</span>
                      <span>${orderData.costs.total.toFixed(2)}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">*Final total may vary based on shipping</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-4 space-y-3">
                  <Button 
                    className="w-full bg-linden-blue hover:bg-linden-blue/90"
                    onClick={handleProceedToCheckout}
                  >
                    <CreditCard className="mr-2 h-4 w-4" />
                    {isStandalone ? 'Proceed to Checkout' : 'Proceed to Payment'}
                  </Button>
                  
                  <Button 
                    variant="outline"
                    className="w-full"
                    onClick={handlePayLater}
                  >
                    {isStandalone ? 'Pay Later' : 'Save & Email Invoice'}
                  </Button>
                  
                  {isStandalone && (
                    <p className="text-xs text-center text-gray-500">
                      You'll be prompted to create an account before payment
                    </p>
                  )}
                  
                  {!isStandalone && (
                    <p className="text-xs text-center text-gray-500">
                      Invoice will be sent to your registered email address
                    </p>
                  )}
                </div>

                {/* Campaign Details */}
                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-3">Campaign Details</h4>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Gift Boxes:</span>
                      <span>{orderData.selectedBoxes.length} types</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Recipients:</span>
                      <span>{getTotalRecipients()} people</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Estimated Delivery:</span>
                      <span>5-7 business days</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinalSummary;
