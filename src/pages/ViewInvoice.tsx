
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Download, Mail, Printer } from "lucide-react";

// Mock invoice data
const mockInvoiceData = {
  "INV-2023-001": {
    id: "INV-2023-001",
    client: "Acme Corporation",
    clientAddress: "123 Business St, Corporate City, CA 12345",
    amount: 1375.00,
    date: "2023-11-01",
    dueDate: "2023-11-30",
    status: "paid",
    giftBoxes: [
      {
        name: "Premium Gift Box Set",
        quantity: 25,
        unitPrice: 50.00,
        items: ["Premium Coffee Set", "Gourmet Chocolate Box", "Scented Candle"]
      }
    ],
    subtotal: 1250.00,
    personalization: 75.00,
    shipping: 50.00,
    tax: 0.00,
    total: 1375.00,
    recipients: ["John Smith", "Sarah Johnson", "Mike Wilson", "Emily Davis", "Robert Brown", "Lisa White", "David Lee", "Maria Garcia", "James Wilson", "Jennifer Taylor", "...and 15 more"]
  },
  "INV-2023-002": {
    id: "INV-2023-002",
    client: "Tech Innovations Inc.",
    clientAddress: "456 Innovation Ave, Tech City, TC 67890",
    amount: 965.50,
    date: "2023-10-28",
    dueDate: "2023-11-27",
    status: "unpaid",
    giftBoxes: [
      {
        name: "Custom Corporate Gifts",
        quantity: 15,
        unitPrice: 59.37,
        items: ["Tech Accessories Kit", "Premium Notebook Set", "Wellness Kit"]
      }
    ],
    subtotal: 890.50,
    personalization: 45.00,
    shipping: 30.00,
    tax: 0.00,
    total: 965.50,
    recipients: ["Alice Cooper", "Bob Johnson", "Charlie Brown", "Diana Prince", "Edward Smith", "Fiona Green", "George Wilson", "Helen Davis", "Ivan Lee", "Julia Martinez", "...and 5 more"]
  }
};

const ViewInvoice = () => {
  const { id: invoiceId } = useParams();
  const navigate = useNavigate();
  
  const invoice = mockInvoiceData[invoiceId as keyof typeof mockInvoiceData];

  if (!invoice) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => navigate('/invoices')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Invoices
            </Button>
          </div>
          <Card>
            <CardContent className="p-8 text-center">
              <h2 className="text-xl font-semibold mb-2">Invoice Not Found</h2>
              <p className="text-gray-600">The requested invoice could not be found.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => navigate('/invoices')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Invoices
            </Button>
            <h1 className="text-2xl font-bold">Invoice {invoice.id}</h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
            <Button variant="outline" size="sm">
              <Printer className="mr-2 h-4 w-4" />
              Print
            </Button>
            {invoice.status === 'unpaid' && (
              <Button variant="outline" size="sm">
                <Mail className="mr-2 h-4 w-4" />
                Send Reminder
              </Button>
            )}
          </div>
        </div>

        {/* Invoice Details */}
        <Card>
          <CardContent className="p-6 sm:p-8">
            {/* Invoice Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start mb-8 gap-6">
              <div>
                <h2 className="text-3xl font-bold text-blue-600 mb-4">INVOICE</h2>
                <div className="space-y-1 text-gray-600">
                  <p><strong>Invoice #:</strong> {invoice.id}</p>
                  <p><strong>Date:</strong> {new Date(invoice.date).toLocaleDateString()}</p>
                  <p><strong>Due Date:</strong> {new Date(invoice.dueDate).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="text-left lg:text-right">
                <div className="mb-4">
                  <Badge className={
                    invoice.status === "paid" 
                      ? "bg-green-500 text-white" 
                      : invoice.status === "overdue"
                      ? "bg-red-500 text-white"
                      : "bg-amber-500 text-white"
                  }>
                    {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                  </Badge>
                </div>
                <div className="text-2xl font-bold text-blue-600">
                  ${invoice.total.toFixed(2)}
                </div>
              </div>
            </div>

            <Separator className="mb-8" />

            {/* Billing Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">From:</h3>
                <div className="text-gray-600">
                  <p className="font-medium">Linden Square</p>
                  <p>123 Gifting Avenue</p>
                  <p>Gift City, GC 12345</p>
                  <p>hello@lindensquare.com</p>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Bill To:</h3>
                <div className="text-gray-600">
                  <p className="font-medium">{invoice.client}</p>
                  <p>{invoice.clientAddress}</p>
                </div>
              </div>
            </div>

            <Separator className="mb-8" />

            {/* Gift Box Items */}
            <div className="mb-8">
              <h3 className="font-semibold text-gray-900 mb-4">Gift Box Items</h3>
              <div className="border rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[600px]">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left p-4 font-medium">Gift Box</th>
                        <th className="text-center p-4 font-medium">Quantity</th>
                        <th className="text-right p-4 font-medium">Unit Price</th>
                        <th className="text-right p-4 font-medium">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoice.giftBoxes.map((box, index) => (
                        <tr key={index} className="border-t">
                          <td className="p-4">
                            <div>
                              <p className="font-medium">{box.name}</p>
                              <p className="text-sm text-gray-600">
                                Includes: {box.items.join(", ")}
                              </p>
                            </div>
                          </td>
                          <td className="text-center p-4">{box.quantity}</td>
                          <td className="text-right p-4">${box.unitPrice.toFixed(2)}</td>
                          <td className="text-right p-4">${(box.quantity * box.unitPrice).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Recipients */}
            <div className="mb-8">
              <h3 className="font-semibold text-gray-900 mb-4">Recipients ({invoice.giftBoxes.reduce((total, box) => total + box.quantity, 0)} total)</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-600 leading-relaxed">
                  {invoice.recipients.join(", ")}
                </p>
              </div>
            </div>

            <Separator className="mb-6" />

            {/* Totals */}
            <div className="flex justify-end">
              <div className="w-full sm:w-80 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal:</span>
                  <span>${invoice.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Personalization:</span>
                  <span>${invoice.personalization.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping:</span>
                  <span>${invoice.shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax:</span>
                  <span>${invoice.tax.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total:</span>
                  <span className="text-blue-600">${invoice.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            {invoice.status === 'paid' && (
              <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800 font-medium">✓ Payment Received</p>
                <p className="text-green-700 text-sm">Thank you for your payment. This invoice has been paid in full.</p>
              </div>
            )}

            {invoice.status === 'unpaid' && (
              <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-amber-800 font-medium">⏰ Payment Pending</p>
                <p className="text-amber-700 text-sm">Payment due by {new Date(invoice.dueDate).toLocaleDateString()}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ViewInvoice;
