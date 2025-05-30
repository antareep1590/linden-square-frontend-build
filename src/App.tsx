
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';

// Import pages
import LandingPage from '@/pages/LandingPage';
import Login from '@/pages/Login';
import NotFound from '@/pages/NotFound';

// Client pages
import Dashboard from '@/pages/Dashboard';
import Customers from '@/pages/Customers';
import SelectGifts from '@/pages/SelectGifts';
import AddPersonalization from '@/pages/AddPersonalization';
import GiftBoxPackaging from '@/pages/GiftBoxPackaging';
import TrackOrders from '@/pages/TrackOrders';
import Invoices from '@/pages/Invoices';
import Inventory from '@/pages/Inventory';
import UploadRecipient from '@/pages/UploadRecipient';
import Profile from '@/pages/Profile';

// Admin pages
import AdminDashboard from '@/pages/admin/Dashboard';
import AdminCustomers from '@/pages/admin/Customers';
import Users from '@/pages/admin/Users';
import PersonalizationSettings from '@/pages/admin/PersonalizationSettings';
import PackagingDelivery from '@/pages/admin/PackagingDelivery';
import DeliveryManagement from '@/pages/admin/DeliveryManagement';
import AdminTrackOrders from '@/pages/admin/TrackOrders';
import AdminInventory from '@/pages/admin/Inventory';
import AdminInvoices from '@/pages/admin/Invoices';
import AdminSettings from '@/pages/admin/Settings';
import MyProfile from '@/pages/admin/MyProfile';

// Layouts
import DashboardLayout from '@/layouts/DashboardLayout';
import AdminDashboardLayout from '@/layouts/AdminDashboardLayout';

// Placeholder page
import PlaceholderPage from '@/pages/PlaceholderPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Toaster />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/not-found" element={<NotFound />} />
          
          {/* Client Routes */}
          <Route path="/dashboard" element={<DashboardLayout><Dashboard /></DashboardLayout>} />
          <Route path="/customers" element={<DashboardLayout><Customers /></DashboardLayout>} />
          <Route path="/profile" element={<DashboardLayout><Profile /></DashboardLayout>} />
          <Route path="/select-gifts" element={<DashboardLayout><SelectGifts /></DashboardLayout>} />
          <Route path="/add-personalization" element={<DashboardLayout><AddPersonalization /></DashboardLayout>} />
          <Route path="/packaging" element={<DashboardLayout><GiftBoxPackaging /></DashboardLayout>} />
          <Route path="/track-orders" element={<DashboardLayout><TrackOrders /></DashboardLayout>} />
          <Route path="/invoices" element={<DashboardLayout><Invoices /></DashboardLayout>} />
          <Route path="/inventory" element={<DashboardLayout><Inventory /></DashboardLayout>} />
          <Route path="/upload-recipient" element={<DashboardLayout><UploadRecipient /></DashboardLayout>} />
          
          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<AdminDashboardLayout><AdminDashboard /></AdminDashboardLayout>} />
          <Route path="/admin/customers" element={<AdminDashboardLayout><AdminCustomers /></AdminDashboardLayout>} />
          <Route path="/admin/users" element={<AdminDashboardLayout><Users /></AdminDashboardLayout>} />
          <Route path="/admin/gift-catalog" element={<AdminDashboardLayout><PlaceholderPage title="Gift Catalog" /></AdminDashboardLayout>} />
          <Route path="/admin/personalization" element={<AdminDashboardLayout><PersonalizationSettings /></AdminDashboardLayout>} />
          <Route path="/admin/packaging" element={<AdminDashboardLayout><PackagingDelivery /></AdminDashboardLayout>} />
          <Route path="/admin/delivery" element={<AdminDashboardLayout><DeliveryManagement /></AdminDashboardLayout>} />
          <Route path="/admin/track-orders" element={<AdminDashboardLayout><AdminTrackOrders /></AdminDashboardLayout>} />
          <Route path="/admin/inventory" element={<AdminDashboardLayout><AdminInventory /></AdminDashboardLayout>} />
          <Route path="/admin/invoices" element={<AdminDashboardLayout><AdminInvoices /></AdminDashboardLayout>} />
          <Route path="/admin/settings" element={<AdminDashboardLayout><AdminSettings /></AdminDashboardLayout>} />
          <Route path="/admin/my-profile" element={<AdminDashboardLayout><MyProfile /></AdminDashboardLayout>} />
          
          <Route path="*" element={<Navigate to="/not-found" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
