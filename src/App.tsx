
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { CartProvider } from '@/contexts/CartContext';

// Import pages
import LandingPage from '@/pages/LandingPage';
import Login from '@/pages/Login';
import NotFound from '@/pages/NotFound';
import ViewInvoice from '@/pages/ViewInvoice';

// Client pages
import Dashboard from '@/pages/Dashboard';
import Customers from '@/pages/Customers';
import AddPersonalization from '@/pages/AddPersonalization';
import TrackOrders from '@/pages/TrackOrders';
import GiftBoxFlow from '@/pages/GiftBoxFlow';
import BoxListing from '@/pages/BoxListing';
import CustomizeBox from '@/pages/CustomizeBox';
import BuildCustomBox from '@/pages/BuildCustomBox';
import PersonalizationStep from '@/pages/PersonalizationStep';
import RecipientSelection from '@/pages/RecipientSelection';
import FinalSummary from '@/pages/FinalSummary';
import PaymentMethod from '@/pages/PaymentMethod';

// Admin pages  
import AdminDashboard from '@/pages/admin/Dashboard';
import AdminClientManagement from '@/pages/admin/ClientManagement';
import AdminGiftCatalog from '@/pages/admin/GiftCatalog';
import PresetGiftBoxSetup from '@/pages/admin/PresetGiftBoxSetup';
import AdminPackagingDelivery from '@/pages/admin/PackagingDelivery';
import AdminTrackOrders from '@/pages/admin/TrackOrders';
import AdminInventory from '@/pages/admin/Inventory';
import AdminInvoices from '@/pages/admin/Invoices';
import AdminSettings from '@/pages/admin/Settings';
import AdminUsers from '@/pages/admin/Users';

// Layouts
import DashboardLayout from '@/layouts/DashboardLayout';
import AdminDashboardLayout from '@/layouts/AdminDashboardLayout';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-gray-50">
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/view-invoice/:id" element={<ViewInvoice />} />
              
              {/* Client routes */}
              <Route element={<DashboardLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/customers" element={<Customers />} />
                <Route path="/gift-box-flow" element={<GiftBoxFlow />} />
                <Route path="/box-listing" element={<BoxListing />} />
                <Route path="/customize-box" element={<CustomizeBox />} />
                <Route path="/build-custom-box" element={<BuildCustomBox />} />
                <Route path="/personalization" element={<PersonalizationStep />} />
                <Route path="/recipients" element={<RecipientSelection />} />
                <Route path="/summary" element={<FinalSummary />} />
                <Route path="/payment-method" element={<PaymentMethod />} />
                <Route path="/add-personalization" element={<AddPersonalization />} />
                <Route path="/track-orders" element={<TrackOrders />} />
              </Route>

              {/* Admin routes */}
              <Route element={<AdminDashboardLayout />}>
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/client-management" element={<AdminClientManagement />} />
                <Route path="/admin/gift-catalog" element={<AdminGiftCatalog />} />
                <Route path="/admin/preset-setup" element={<PresetGiftBoxSetup />} />
                <Route path="/admin/packaging-delivery" element={<AdminPackagingDelivery />} />
                <Route path="/admin/track-orders" element={<AdminTrackOrders />} />
                <Route path="/admin/inventory" element={<AdminInventory />} />
                <Route path="/admin/invoices" element={<AdminInvoices />} />
                <Route path="/admin/settings" element={<AdminSettings />} />
                <Route path="/admin/users" element={<AdminUsers />} />
              </Route>

              {/* Catch all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
          <Toaster />
        </BrowserRouter>
      </CartProvider>
    </QueryClientProvider>
  );
}

export default App;
