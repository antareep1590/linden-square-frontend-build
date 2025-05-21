
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocation } from 'react-router-dom';

interface PlaceholderPageProps {
  title: string;
}

const PlaceholderPage: React.FC<PlaceholderPageProps> = ({ title }) => {
  const location = useLocation();
  const path = location.pathname.substring(1); // Remove the leading slash
  
  // Capitalize and format the path for display
  const formattedPath = path
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold mb-1">{title || formattedPath}</h1>
        <p className="text-gray-500">This page is under construction.</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-gray-100 p-6 mb-4">
              <div className="w-16 h-16 text-linden-gold">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
            </div>
            <h2 className="text-xl font-medium text-linden-blue mb-2">This feature is coming soon</h2>
            <p className="text-gray-500 max-w-md">
              We're working hard to bring you the best experience possible. Check back later for updates.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlaceholderPage;
