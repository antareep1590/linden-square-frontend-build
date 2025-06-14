
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, Image, FileText, Tag } from 'lucide-react';

interface PreviewData {
  brandedNotecard?: {
    enabled: boolean;
    template: string;
    message: string;
    logo: File | null;
  };
  giftTags?: {
    enabled: boolean;
    type: string;
    presetMessage: string;
    customMessage: string;
  };
  messageCard?: {
    enabled: boolean;
    message: string;
    senderName: string;
  };
}

interface CustomizationPreviewProps {
  customization: PreviewData | undefined;
  boxName?: string;
}

const CustomizationPreview: React.FC<CustomizationPreviewProps> = ({ customization, boxName }) => {
  // Handle undefined or empty customization object
  const safeCustomization = customization || {};
  
  const hasAnyCustomization = safeCustomization.brandedNotecard?.enabled || 
                             safeCustomization.giftTags?.enabled || 
                             safeCustomization.messageCard?.enabled;

  if (!hasAnyCustomization) {
    return (
      <div className="bg-gray-50 rounded-lg p-8 text-center">
        <Eye className="mx-auto h-12 w-12 text-gray-300 mb-3" />
        <p className="text-sm text-gray-500">
          Preview will appear here as you enable customizations
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {boxName && (
        <h4 className="font-medium text-sm text-gray-700">Preview for {boxName}</h4>
      )}
      
      {/* Branded Notecard Preview */}
      {safeCustomization.brandedNotecard?.enabled && (
        <Card className="border-2 border-dashed border-blue-200 bg-blue-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Image className="h-4 w-4" />
              Branded Notecard
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="bg-white rounded-md p-3 min-h-20 text-xs">
              {safeCustomization.brandedNotecard.logo && (
                <div className="mb-2">
                  <Badge variant="outline" className="text-xs">
                    Logo: {safeCustomization.brandedNotecard.logo.name}
                  </Badge>
                </div>
              )}
              {safeCustomization.brandedNotecard.template && (
                <div className="text-gray-600 mb-2">
                  Template: {safeCustomization.brandedNotecard.template}
                </div>
              )}
              <div className="font-medium">
                {safeCustomization.brandedNotecard.message || 'Your custom message will appear here...'}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Gift Tags Preview */}
      {safeCustomization.giftTags?.enabled && (
        <Card className="border-2 border-dashed border-green-200 bg-green-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Tag className="h-4 w-4" />
              Gift Tag
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="inline-block bg-white rounded-full px-3 py-1 text-xs font-medium shadow-sm">
              {safeCustomization.giftTags.type === 'preset' 
                ? safeCustomization.giftTags.presetMessage || 'Select a preset message'
                : safeCustomization.giftTags.customMessage || 'Your custom tag message'
              }
            </div>
          </CardContent>
        </Card>
      )}

      {/* Message Card Preview */}
      {safeCustomization.messageCard?.enabled && (
        <Card className="border-2 border-dashed border-purple-200 bg-purple-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Message Card
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-white rounded-md p-3 text-xs">
              <div className="mb-2 font-medium">
                {safeCustomization.messageCard.message || 'Your personal message will appear here...'}
              </div>
              {safeCustomization.messageCard.senderName && (
                <div className="text-right text-gray-600 italic">
                  - {safeCustomization.messageCard.senderName}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CustomizationPreview;
