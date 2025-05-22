
import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Pen, Plus, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

// Mock personalization options data
const mockPersonalizationOptions = [
  {
    id: 1,
    type: "Text Engraving",
    characterLimit: 50,
    previewFormat: "[Text] in elegant script font",
    enabled: true,
  },
  {
    id: 2,
    type: "Logo Placement",
    characterLimit: 0,
    previewFormat: "Company logo on top left corner",
    enabled: true,
  },
  {
    id: 3,
    type: "Handwritten Note",
    characterLimit: 200,
    previewFormat: "Custom message with signature",
    enabled: true,
  },
  {
    id: 4,
    type: "Custom Date Stamp",
    characterLimit: 10,
    previewFormat: "MM/DD/YYYY format in roman numerals",
    enabled: false,
  },
  {
    id: 5,
    type: "Recipient Name",
    characterLimit: 30,
    previewFormat: "Name in gold foil on gift tag",
    enabled: true,
  },
];

// Schema for personalization form validation
const personalizationFormSchema = z.object({
  type: z.string().min(3, { message: "Type must be at least 3 characters." }),
  characterLimit: z.coerce.number().int().nonnegative(),
  previewFormat: z.string().min(5, { message: "Preview format must be at least 5 characters." }),
  enabled: z.boolean().default(true),
});

type PersonalizationFormValues = z.infer<typeof personalizationFormSchema>;

const PersonalizationSettings = () => {
  const [personalizationOptions, setPersonalizationOptions] = useState(mockPersonalizationOptions);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [previewOption, setPreviewOption] = useState<typeof mockPersonalizationOptions[0] | null>(null);

  const form = useForm<PersonalizationFormValues>({
    resolver: zodResolver(personalizationFormSchema),
    defaultValues: {
      type: "",
      characterLimit: 0,
      previewFormat: "",
      enabled: true,
    },
  });

  const onSubmit = (data: PersonalizationFormValues) => {
    if (editingId !== null) {
      // Update existing option
      setPersonalizationOptions(
        personalizationOptions.map((option) =>
          option.id === editingId ? { ...option, ...data } : option
        )
      );
      setEditingId(null);
    } else {
      // Add new option
      const newOption = {
        id: personalizationOptions.length + 1,
        ...data,
      };
      setPersonalizationOptions([...personalizationOptions, newOption]);
    }
    
    setOpenAddDialog(false);
    form.reset();
  };

  const handleEdit = (option: typeof mockPersonalizationOptions[0]) => {
    setEditingId(option.id);
    form.reset({
      type: option.type,
      characterLimit: option.characterLimit,
      previewFormat: option.previewFormat,
      enabled: option.enabled,
    });
    setOpenAddDialog(true);
  };

  const handleToggleEnabled = (id: number, enabled: boolean) => {
    setPersonalizationOptions(
      personalizationOptions.map((option) =>
        option.id === id ? { ...option, enabled } : option
      )
    );
  };

  const handlePreview = (option: typeof mockPersonalizationOptions[0]) => {
    setPreviewOption(option);
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Personalization Settings</h1>
        
        <Dialog open={openAddDialog} onOpenChange={setOpenAddDialog}>
          <DialogTrigger asChild>
            <Button className="bg-linden-blue hover:bg-linden-blue/90">
              <Plus size={16} className="mr-2" /> Add Personalization Option
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {editingId !== null ? "Edit Personalization Option" : "Add Personalization Option"}
              </DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Text Engraving" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="characterLimit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Character Limit (0 for no limit)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="previewFormat"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preview Format</FormLabel>
                      <FormControl>
                        <Input placeholder="Description of how it will appear" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="enabled"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel>Enabled</FormLabel>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <DialogFooter>
                  <Button type="submit">
                    {editingId !== null ? "Save Changes" : "Add Option"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Character Limit</TableHead>
              <TableHead>Preview Format</TableHead>
              <TableHead>Enabled</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {personalizationOptions.map((option) => (
              <TableRow key={option.id}>
                <TableCell className="font-medium">{option.type}</TableCell>
                <TableCell>
                  {option.characterLimit > 0 ? option.characterLimit : "No limit"}
                </TableCell>
                <TableCell className="max-w-[300px] truncate">{option.previewFormat}</TableCell>
                <TableCell>
                  <Switch
                    checked={option.enabled}
                    onCheckedChange={(checked) => handleToggleEnabled(option.id, checked)}
                  />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePreview(option)}
                    >
                      <Eye size={14} className="mr-1" /> Preview
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(option)}
                    >
                      <Pen size={14} className="mr-1" /> Edit
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Preview Modal */}
      <Dialog open={!!previewOption} onOpenChange={() => setPreviewOption(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Preview: {previewOption?.type}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Status</Label>
              <div className="mt-1">
                {previewOption?.enabled ? 
                  <Badge className="bg-green-500">Enabled</Badge> : 
                  <Badge variant="outline">Disabled</Badge>
                }
              </div>
            </div>
            
            <div>
              <Label className="text-sm font-medium">Character Limit</Label>
              <div className="mt-1 text-sm">
                {previewOption?.characterLimit ? previewOption.characterLimit : "No limit"}
              </div>
            </div>
            
            <Card>
              <CardContent className="p-4">
                <div className="text-sm text-gray-500 mb-2">Preview Format:</div>
                <div className="font-medium">{previewOption?.previewFormat}</div>
              </CardContent>
            </Card>
            
            <div className="border rounded-md p-4 bg-gray-50">
              <h4 className="text-sm font-medium mb-2">How it appears to clients:</h4>
              <div className="p-3 bg-white border rounded">
                <div className="flex items-center gap-2 mb-2">
                  <Label htmlFor="previewInput" className="text-sm font-medium">
                    {previewOption?.type}:
                  </Label>
                  {previewOption?.characterLimit ? (
                    <Badge variant="outline" className="text-xs">
                      Max {previewOption.characterLimit} characters
                    </Badge>
                  ) : null}
                </div>
                <Input 
                  id="previewInput" 
                  placeholder="Enter your personalization..." 
                  className="mb-2"
                  maxLength={previewOption?.characterLimit || undefined}
                />
                <div className="text-xs text-gray-500">{previewOption?.previewFormat}</div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setPreviewOption(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PersonalizationSettings;
