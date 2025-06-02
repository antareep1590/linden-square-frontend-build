import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Settings, 
  Plus, 
  Edit, 
  Trash2,
  Type,
  Palette,
  Image as ImageIcon,
  Heart,
  Star,
  Gift
} from "lucide-react";

interface Font {
  id: string;
  name: string;
}

interface Color {
  id: string;
  name: string;
  hexCode: string;
}

interface Image {
  id: string;
  name: string;
  url: string;
}

const mockFonts: Font[] = [
  { id: "font-1", name: "Open Sans" },
  { id: "font-2", name: "Roboto" },
  { id: "font-3", name: "Lato" },
];

const mockColors: Color[] = [
  { id: "color-1", name: "Linden Blue", hexCode: "#2563EB" },
  { id: "color-2", name: "Emerald Green", hexCode: "#10B981" },
  { id: "color-3", name: "Sunset Orange", hexCode: "#F59E0B" },
];

const mockImages: Image[] = [
  { id: "image-1", name: "Abstract 1", url: "https://source.unsplash.com/300x200/?abstract" },
  { id: "image-2", name: "Nature 1", url: "https://source.unsplash.com/300x200/?nature" },
  { id: "image-3", name: "City 1", url: "https://source.unsplash.com/300x200/?city" },
];

const PersonalizationSettings = () => {
  const [selectedFont, setSelectedFont] = useState<string | undefined>(mockFonts[0].id);
  const [selectedColor, setSelectedColor] = useState<string | undefined>(mockColors[0].id);
  const [customText, setCustomText] = useState("Thank You!");
  const [isCustomTextEnabled, setIsCustomTextEnabled] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | undefined>(mockImages[0].id);
  const [isImageEnabled, setIsImageEnabled] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);

  const handleFontChange = (fontId: string) => {
    setSelectedFont(fontId);
  };

  const handleColorChange = (colorId: string) => {
    setSelectedColor(colorId);
  };

  const handleTextChange = (text: string) => {
    setCustomText(text);
  };

  const handleImageChange = (imageId: string) => {
    setSelectedImage(imageId);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Personalization Settings</h1>
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add New Setting
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Setting</DialogTitle>
            </DialogHeader>
            <div>
              {/* Add form fields here */}
            </div>
            <DialogFooter>
              <Button>Add Setting</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Text Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="customText">Enable Custom Text</Label>
            <Switch
              id="customText"
              checked={isCustomTextEnabled}
              onCheckedChange={setIsCustomTextEnabled}
            />
          </div>
          <Input
            type="text"
            placeholder="Enter custom text"
            value={customText}
            onChange={(e) => handleTextChange(e.target.value)}
            disabled={!isCustomTextEnabled}
          />
          <Separator />
          <div className="space-y-2">
            <Label htmlFor="font">Select Font</Label>
            <Select onValueChange={handleFontChange} defaultValue={selectedFont}>
              <SelectTrigger>
                <SelectValue placeholder="Select a font" />
              </SelectTrigger>
              <SelectContent>
                {mockFonts.map((font) => (
                  <SelectItem key={font.id} value={font.id}>
                    {font.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="color">Select Color</Label>
            <Select onValueChange={handleColorChange} defaultValue={selectedColor}>
              <SelectTrigger>
                <SelectValue placeholder="Select a color" />
              </SelectTrigger>
              <SelectContent>
                {mockColors.map((color) => (
                  <SelectItem key={color.id} value={color.id}>
                    {color.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Image Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="enableImage">Enable Image</Label>
            <Switch
              id="enableImage"
              checked={isImageEnabled}
              onCheckedChange={setIsImageEnabled}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="image">Select Image</Label>
            <Select onValueChange={handleImageChange} defaultValue={selectedImage}>
              <SelectTrigger>
                <SelectValue placeholder="Select an image" />
              </SelectTrigger>
              <SelectContent>
                {mockImages.map((image) => (
                  <SelectItem key={image.id} value={image.id}>
                    {image.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PersonalizationSettings;
