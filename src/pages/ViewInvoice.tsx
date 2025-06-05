
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
    amount: 1250.00,
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
    tax: 0.00,
    total: 1250.00,
    recipients: ["John Smith", "Sarah Johnson", "Mike Wilson", "Emily Davis", "...and 21 more"]
  }
};

const ViewInvoice = () => {
  const { invoiceId } = useParams();
  const navigate = useNavigate();
  
  const invoice = mockInvoiceData[invoiceId as keyof typeof mockInvoiceData];

  if (!invoice) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/invoices')}>
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
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/invoices')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Invoices
          </Button>
          <h1 className="text-2xl font-bold">Invoice {invoice.id}</h1>
        </div>
        <div className="flex gap-2">
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
        <CardContent className="p-8">
          {/* Invoice Header */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-3xl font-bold text-linden-blue mb-2">INVOICE</h2>
              <div className="space-y-1 text-gray-600">
                <p><strong>Invoice #:</strong> {invoice.id}</p>
                <p><strong>Date:</strong> {new Date(invoice.date).toLocaleDateString()}</p>
                <p><strong>Due Date:</strong> {new Date(invoice.dueDate).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="text-right">
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
              <div className="text-2xl font-bold text-linden-blue">
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
              <table className="w-full">
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
                            ({box.items.join(", ")})
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

          {/* Recipients */}
          <div className="mb-8">
            <h3 className="font-semibold text-gray-900 mb-4">Recipients</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-600">
                {invoice.recipients.join(", ")}
              </p>
            </div>
          </div>

          <Separator className="mb-6" />

          {/* Totals */}
          <div className="flex justify-end">
            <div className="w-64 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal:</span>
                <span>${invoice.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax:</span>
                <span>${invoice.tax.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-semibold">
                <span>Total:</span>
                <span>${invoice.total.toFixed(2)}</span>
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
        </CardContent>
      </Card>
    </div>
  );
};

export default ViewInvoice;
