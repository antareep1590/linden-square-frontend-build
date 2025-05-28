
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Truck, User } from "lucide-react";

interface CarrierAssigneeStepProps {
  selectedCarrier: string;
  selectedAssignee: string;
  onCarrierChange: (carrier: string) => void;
  onAssigneeChange: (assignee: string) => void;
}

const CarrierAssigneeStep = ({ 
  selectedCarrier, 
  selectedAssignee, 
  onCarrierChange, 
  onAssigneeChange 
}: CarrierAssigneeStepProps) => {
  const carriers = [
    { value: "fedex", label: "FedEx" },
    { value: "ups", label: "UPS" },
    { value: "usps", label: "USPS" },
    { value: "dhl", label: "DHL" }
  ];

  const assignees = [
    { value: "john-doe", label: "John Doe - Logistics Team" },
    { value: "jane-smith", label: "Jane Smith - Delivery Manager" },
    { value: "mike-johnson", label: "Mike Johnson - Operations" },
    { value: "sarah-wilson", label: "Sarah Wilson - Fulfillment" }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Truck className="h-5 w-5" />
          Step 3: Select Carrier & Assignee
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="carrier">Carrier</Label>
            <Select value={selectedCarrier} onValueChange={onCarrierChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select a carrier" />
              </SelectTrigger>
              <SelectContent>
                {carriers.map((carrier) => (
                  <SelectItem key={carrier.value} value={carrier.value}>
                    {carrier.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="assignee">Assignee</Label>
            <Select value={selectedAssignee} onValueChange={onAssigneeChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select an assignee" />
              </SelectTrigger>
              <SelectContent>
                {assignees.map((assignee) => (
                  <SelectItem key={assignee.value} value={assignee.value}>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      {assignee.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {selectedCarrier && selectedAssignee && (
          <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
            <h4 className="font-medium text-green-800 mb-2">Assignment Summary</h4>
            <div className="space-y-1 text-sm text-green-700">
              <p><strong>Carrier:</strong> {carriers.find(c => c.value === selectedCarrier)?.label}</p>
              <p><strong>Assignee:</strong> {assignees.find(a => a.value === selectedAssignee)?.label}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CarrierAssigneeStep;
