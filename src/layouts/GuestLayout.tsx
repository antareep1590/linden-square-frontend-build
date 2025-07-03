import React from 'react';
import { Outlet } from 'react-router-dom';
import LindenSquareLogo from '@/components/LindenSquareLogo';

interface GuestLayoutProps {
  children?: React.ReactNode;
}

const GuestLayout: React.FC<GuestLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with logo only */}
      <header className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center sm:justify-start h-16">
          <LindenSquareLogo size="small" />
        </div>
      </header>
      
      {/* Main content */}
      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6">
        {children || <Outlet />}
      </main>
    </div>
  );
};

export default GuestLayout;