
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Download, Mail, FileText } from "lucide-react";
import LindenSquareLogo from '@/components/LindenSquareLogo';

const ViewInvoice = () => {
  const navigate = useNavigate();
  const { invoiceId } = useParams();

  // Mock invoice data - in real app this would come from API
  const invoice = {
    id: "INV-2023-001",
    client: "Acme Corporation",
    clientEmail: "billing@acme.com",
    clientAddress: "123 Business St, Corporate City, CC 12345",
    amount: 1250.00,
    subtotal: 1150.00,
    tax: 100.00,
    date: "2023-11-01",
    dueDate: "2023-11-31",
    status: "paid",
    giftBoxes: [
      {
        name: "Premium Gift Box Set",
        quantity: 25,
        unitPrice: 46.00,
        total: 1150.00,
        items: ["Premium Coffee Set", "Gourmet Chocolate Box", "Scented Candle"]
      }
    ],
    personalizations: [
      { type: "Custom Message", description: "Thank you for your partnership", cost: 0 },
      { type: "Premium Ribbon", description: "Gold ribbon with company logo", cost: 0 }
    ],
    recipients: [
      { name: "John Smith", email: "john@partner.com", address: "456 Partner Ave, City, ST 67890" },
      { name: "Sarah Johnson", email: "sarah@client.com", address: "789 Client Blvd, Town, ST 13579" }
    ]
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <Button 
            variant="outline" 
            onClick={() => navigate('/invoices')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Invoices
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
            <Button variant="outline" size="sm">
              <Mail className="h-4 w-4 mr-2" />
              Send Email
            </Button>
          </div>
        </div>

        {/* Invoice Card */}
        <Card className="bg-white shadow-lg">
          <CardContent className="p-8">
            {/* Invoice Header */}
            <div className="flex justify-between items-start mb-8">
              <div>
                <LindenSquareLogo size="medium" />
                <div className="mt-4 text-sm text-gray-600">
                  <p>123 Business Lane</p>
                  <p>Corporate City, CC 12345</p>
                  <p>billing@lindensquare.com</p>
                </div>
              </div>
              <div className="text-right">
                <h1 className="text-2xl font-bold text-linden-blue mb-2">INVOICE</h1>
                <p className="text-lg font-semibold">{invoice.id}</p>
                <div className="mt-2">
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
              </div>
            </div>

            {/* Bill To & Invoice Details */}
            <div className="grid grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Bill To:</h3>
                <div className="text-sm text-gray-600">
                  <p className="font-medium">{invoice.client}</p>
                  <p>{invoice.clientAddress}</p>
                  <p>{invoice.clientEmail}</p>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Invoice Details:</h3>
                <div className="text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Invoice Date:</span>
                    <span>{formatDate(invoice.date)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Due Date:</span>
                    <span>{formatDate(invoice.dueDate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Amount:</span>
                    <span className="font-medium">{formatCurrency(invoice.amount)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Gift Boxes Table */}
            <div className="mb-8">
              <h3 className="font-semibold text-gray-900 mb-4">Gift Boxes & Items</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Gift Box & Contents</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Unit Price</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoice.giftBoxes.map((box, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{box.name}</p>
                          <p className="text-sm text-gray-500">
                            ({box.items.join(', ')})
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>{box.quantity}</TableCell>
                      <TableCell>{formatCurrency(box.unitPrice)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(box.total)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Personalizations */}
            {invoice.personalizations && invoice.personalizations.length > 0 && (
              <div className="mb-8">
                <h3 className="font-semibold text-gray-900 mb-4">Personalizations</h3>
                <div className="space-y-2">
                  {invoice.personalizations.map((item, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
                      <div>
                        <p className="font-medium">{item.type}</p>
                        <p className="text-sm text-gray-500">{item.description}</p>
                      </div>
                      <span className="text-sm text-gray-600">
                        {item.cost > 0 ? formatCurrency(item.cost) : 'Included'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recipients */}
            <div className="mb-8">
              <h3 className="font-semibold text-gray-900 mb-4">Recipients ({invoice.recipients.length})</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {invoice.recipients.map((recipient, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg">
                    <p className="font-medium">{recipient.name}</p>
                    <p className="text-sm text-gray-600">{recipient.email}</p>
                    <p className="text-sm text-gray-600">{recipient.address}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Invoice Totals */}
            <div className="border-t pt-6">
              <div className="flex justify-end">
                <div className="w-64">
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Subtotal:</span>
                    <span>{formatCurrency(invoice.subtotal)}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Tax:</span>
                    <span>{formatCurrency(invoice.tax)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-t border-gray-300 font-semibold text-lg">
                    <span>Total:</span>
                    <span>{formatCurrency(invoice.amount)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t text-center text-sm text-gray-500">
              <p>Thank you for your business!</p>
              <p>If you have any questions about this invoice, please contact us at billing@lindensquare.com</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ViewInvoice;
