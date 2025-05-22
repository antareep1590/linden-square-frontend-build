
import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';

const AdminDashboardLayout: React.FC = () => {
  return (
    <div className="flex h-screen w-full bg-gray-50">
      <Sidebar isAdmin={true} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar isAdmin={true} />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminDashboardLayout;
