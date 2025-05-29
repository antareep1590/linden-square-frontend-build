
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter } from "lucide-react";

interface AdvancedFiltersModalProps {
  onFiltersApply: (filters: any) => void;
  currentFilters: any;
}

const AdvancedFiltersModal: React.FC<AdvancedFiltersModalProps> = ({ onFiltersApply, currentFilters }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState({
    categories: currentFilters.categories || [],
    priceRange: currentFilters.priceRange || [0, 100],
    occasions: currentFilters.occasions || [],
    availability: currentFilters.availability || 'all',
    rating: currentFilters.rating || [0, 5]
  });

  const categories = ['Beverages', 'Office', 'Health', 'Food', 'Technology', 'Home'];
  const occasions = ['Birthday', 'Holiday', 'Thank You', 'Welcome', 'Achievement', 'Milestone'];

  const handleCategoryChange = (category: string, checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      categories: checked 
        ? [...prev.categories, category]
        : prev.categories.filter((c: string) => c !== category)
    }));
  };

  const handleOccasionChange = (occasion: string, checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      occasions: checked 
        ? [...prev.occasions, occasion]
        : prev.occasions.filter((o: string) => o !== occasion)
    }));
  };

  const handleApplyFilters = () => {
    onFiltersApply(filters);
    setIsOpen(false);
  };

  const handleResetFilters = () => {
    const resetFilters = {
      categories: [],
      priceRange: [0, 100],
      occasions: [],
      availability: 'all',
      rating: [0, 5]
    };
    setFilters(resetFilters);
    onFiltersApply(resetFilters);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          More Filters
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Advanced Filters</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Categories */}
          <div>
            <Label className="text-base font-medium mb-3 block">Categories</Label>
            <div className="grid grid-cols-2 gap-3">
              {categories.map((category) => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox
                    id={`category-${category}`}
                    checked={filters.categories.includes(category)}
                    onCheckedChange={(checked) => handleCategoryChange(category, checked as boolean)}
                  />
                  <Label htmlFor={`category-${category}`} className="text-sm font-normal">
                    {category}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <Label className="text-base font-medium mb-3 block">
              Price Range: ${filters.priceRange[0]} - ${filters.priceRange[1]}
            </Label>
            <Slider
              value={filters.priceRange}
              onValueChange={(value) => setFilters(prev => ({ ...prev, priceRange: value }))}
              max={100}
              min={0}
              step={5}
              className="w-full"
            />
          </div>

          {/* Occasions */}
          <div>
            <Label className="text-base font-medium mb-3 block">Occasions</Label>
            <div className="grid grid-cols-2 gap-3">
              {occasions.map((occasion) => (
                <div key={occasion} className="flex items-center space-x-2">
                  <Checkbox
                    id={`occasion-${occasion}`}
                    checked={filters.occasions.includes(occasion)}
                    onCheckedChange={(checked) => handleOccasionChange(occasion, checked as boolean)}
                  />
                  <Label htmlFor={`occasion-${occasion}`} className="text-sm font-normal">
                    {occasion}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Availability */}
          <div>
            <Label className="text-base font-medium mb-3 block">Availability</Label>
            <Select 
              value={filters.availability} 
              onValueChange={(value) => setFilters(prev => ({ ...prev, availability: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select availability" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Items</SelectItem>
                <SelectItem value="in-stock">In Stock Only</SelectItem>
                <SelectItem value="limited">Limited Stock</SelectItem>
                <SelectItem value="pre-order">Pre-Order Available</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Rating */}
          <div>
            <Label className="text-base font-medium mb-3 block">
              Minimum Rating: {filters.rating[0]} stars
            </Label>
            <Slider
              value={filters.rating}
              onValueChange={(value) => setFilters(prev => ({ ...prev, rating: value }))}
              max={5}
              min={0}
              step={0.5}
              className="w-full"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between pt-6 border-t">
            <Button variant="outline" onClick={handleResetFilters}>
              Reset All
            </Button>
            <div className="space-x-2">
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleApplyFilters}>
                Apply Filters
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdvancedFiltersModal;
