
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Gift, Package, Sparkles, Users, Plus } from 'lucide-react';

const GiftBoxFlow = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Create Your Gift Campaign</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Build multiple gift boxes in one order. Choose from preset boxes or create custom ones, then assign recipients to each box.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Preset Boxes Option */}
        <Card className="relative overflow-hidden transition-all duration-300 hover:shadow-xl cursor-pointer group" 
              onClick={() => navigate('/box-listing')}>
          <div className="absolute inset-0 bg-gradient-to-br from-linden-blue/10 to-linden-blue/5"></div>
          <CardHeader className="relative z-10 text-center pb-4">
            <div className="mx-auto mb-4 p-3 bg-linden-blue/10 rounded-full w-16 h-16 flex items-center justify-center">
              <Gift className="h-8 w-8 text-linden-blue" />
            </div>
            <CardTitle className="text-xl">Start with Preset Boxes</CardTitle>
          </CardHeader>
          <CardContent className="relative z-10 text-center space-y-4">
            <p className="text-gray-600 mb-6">
              Choose from expertly curated gift boxes. Select multiple boxes and customize each one.
            </p>
            
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-center gap-2">
                <Plus className="h-4 w-4 text-linden-blue" />
                <span>Select multiple preset boxes</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Package className="h-4 w-4 text-linden-blue" />
                <span>Customize gifts in each box</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Sparkles className="h-4 w-4 text-linden-blue" />
                <span>Personalize each box individually</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Users className="h-4 w-4 text-linden-blue" />
                <span>Assign recipients to each box</span>
              </div>
            </div>

            <Button className="w-full mt-6 bg-linden-blue hover:bg-linden-blue/90 group-hover:scale-105 transition-transform">
              Browse Preset Boxes
            </Button>
          </CardContent>
        </Card>

        {/* Custom Box Option */}
        <Card className="relative overflow-hidden transition-all duration-300 hover:shadow-xl cursor-pointer group" 
              onClick={() => navigate('/build-custom-box')}>
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-purple-500/5"></div>
          <CardHeader className="relative z-10 text-center pb-4">
            <div className="mx-auto mb-4 p-3 bg-purple-500/10 rounded-full w-16 h-16 flex items-center justify-center">
              <Package className="h-8 w-8 text-purple-500" />
            </div>
            <CardTitle className="text-xl">Build Custom Boxes</CardTitle>
          </CardHeader>
          <CardContent className="relative z-10 text-center space-y-4">
            <p className="text-gray-600 mb-6">
              Create completely custom gift boxes from scratch. Build multiple unique boxes for different recipients.
            </p>
            
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-center gap-2">
                <Plus className="h-4 w-4 text-purple-500" />
                <span>Create multiple custom boxes</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Package className="h-4 w-4 text-purple-500" />
                <span>Choose size, theme & gifts</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Sparkles className="h-4 w-4 text-purple-500" />
                <span>Full personalization control</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Users className="h-4 w-4 text-purple-500" />
                <span>Recipient assignment per box</span>
              </div>
            </div>

            <Button className="w-full mt-6 bg-purple-500 hover:bg-purple-500/90 group-hover:scale-105 transition-transform">
              Start Building
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="text-center mt-8">
        <p className="text-sm text-gray-500">
          Mix and match preset and custom boxes in the same order • Assign different recipients to each box
        </p>
      </div>
    </div>
  );
};

export default GiftBoxFlow;
