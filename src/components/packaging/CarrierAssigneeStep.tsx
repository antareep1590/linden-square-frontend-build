
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Truck, User } from "lucide-react";

interface CarrierAssigneeStepProps {
  selectedCarrier: string;
  selectedAssignee: string;
  onCarrierChange: (carrier: string) => void;
  onAssigneeChange: (assignee: string) => void;
}

const CarrierAssigneeStep: React.FC<CarrierAssigneeStepProps> = ({
  selectedCarrier,
  selectedAssignee,
  onCarrierChange,
  onAssigneeChange
}) => {
  const carriers = [
    { value: "fedex", label: "FedEx" },
    { value: "ups", label: "UPS" },
    { value: "usps", label: "USPS" },
    { value: "dhl", label: "DHL" },
    { value: "amazon", label: "Amazon Logistics" }
  ];

  const assignees = [
    { value: "john-doe", label: "John Doe" },
    { value: "jane-smith", label: "Jane Smith" },
    { value: "mike-wilson", label: "Mike Wilson" },
    { value: "sarah-johnson", label: "Sarah Johnson" },
    { value: "delivery-team", label: "Delivery Team" }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Select Carrier & Assignee</h3>
        <p className="text-gray-600 mb-6">Choose the shipping carrier and assign a team member to manage this delivery.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Carrier Selection */}
        <Card className="bg-gray-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Truck className="h-5 w-5" />
              Shipping Carrier
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="carrier">Select Carrier</Label>
              <Select value={selectedCarrier} onValueChange={onCarrierChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a carrier" />
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
          </CardContent>
        </Card>

        {/* Assignee Selection */}
        <Card className="bg-gray-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <User className="h-5 w-5" />
              Delivery Assignee
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="assignee">Assign Team Member</Label>
              <Select value={selectedAssignee} onValueChange={onAssigneeChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose an assignee" />
                </SelectTrigger>
                <SelectContent>
                  {assignees.map((assignee) => (
                    <SelectItem key={assignee.value} value={assignee.value}>
                      {assignee.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Summary */}
      {selectedCarrier && selectedAssignee && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <h4 className="font-medium mb-2">Delivery Assignment Summary</h4>
            <div className="text-sm text-gray-600 space-y-1">
              <p><strong>Carrier:</strong> {carriers.find(c => c.value === selectedCarrier)?.label}</p>
              <p><strong>Assigned to:</strong> {assignees.find(a => a.value === selectedAssignee)?.label}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CarrierAssigneeStep;
