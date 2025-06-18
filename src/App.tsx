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
import Invoices from '@/pages/Invoices';

// New standalone pages
import ChooseGiftBox from '@/pages/ChooseGiftBox';
import ProfileStandalone from '@/pages/ProfileStandalone';
import CustomizeGiftBox from '@/pages/CustomizeGiftBox';
import StandaloneCustomization from '@/pages/StandaloneCustomization';
import StandaloneShipping from '@/pages/StandaloneShipping';

// E-gift pages
import EGiftSendOptions from '@/pages/EGiftSendOptions';

// Client pages
import Dashboard from '@/pages/Dashboard';
import Customers from '@/pages/Customers';
import AddPersonalization from '@/pages/AddPersonalization';
import TrackOrders from '@/pages/TrackOrders';
import BoxListing from '@/pages/BoxListing';
import PersonalizationStep from '@/pages/PersonalizationStep';
import CustomizationPage from '@/pages/CustomizationPage';
import RecipientSelection from '@/pages/RecipientSelection';
import FinalSummary from '@/pages/FinalSummary';
import PaymentMethod from '@/pages/PaymentMethod';
import Profile from '@/pages/Profile';
import ShippingFulfillment from '@/pages/ShippingFulfillment';

// Delivery method and e-gift pages now moved to dashboard layout
import ChooseDeliveryMethod from '@/pages/ChooseDeliveryMethod';
import CustomizeEGift from '@/pages/CustomizeEGift';
import SelectRecipientsEGift from '@/pages/SelectRecipientsEGift';

// Admin pages  
import AdminDashboard from '@/pages/admin/Dashboard';
import AdminClientManagement from '@/pages/admin/ClientManagement';
import PresetGiftBoxSetup from '@/pages/admin/PresetGiftBoxSetup';
import AdminPackagingDelivery from '@/pages/admin/PackagingDelivery';
import AdminTrackOrders from '@/pages/admin/TrackOrders';
import AdminInventory from '@/pages/admin/Inventory';
import AdminInvoices from '@/pages/admin/Invoices';
import AdminSettings from '@/pages/admin/Settings';
import AdminUsers from '@/pages/admin/Users';
import MyProfile from '@/pages/admin/MyProfile';

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
              
              {/* Standalone pages for anonymous users */}
              <Route path="/choose-gift-box" element={<ChooseGiftBox />} />
              <Route path="/customize-gift-box" element={<CustomizeGiftBox />} />
              <Route path="/recipients" element={<RecipientSelection />} />
              <Route path="/summary" element={<FinalSummary />} />
              <Route path="/profile-standalone" element={<ProfileStandalone />} />
              
              {/* Client routes - all delivery method and order management routes now in dashboard */}
              <Route element={<DashboardLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/customers" element={<Customers />} />
                <Route path="/gift-box-flow" element={<BoxListing />} />
                <Route path="/box-listing" element={<BoxListing />} />
                <Route path="/choose-delivery-method" element={<ChooseDeliveryMethod />} />
                <Route path="/recipient-selection" element={<RecipientSelection />} />
                <Route path="/customization" element={<CustomizationPage />} />
                {/* Shipping & Fulfillment only for physical delivery */}
                <Route path="/shipping-fulfillment" element={<ShippingFulfillment />} />
                {/* Digital gift settings for email delivery */}
                <Route path="/egift-send-options" element={<EGiftSendOptions />} />
                <Route path="/payment-method" element={<PaymentMethod />} />
                <Route path="/add-personalization" element={<AddPersonalization />} />
                <Route path="/track-orders" element={<TrackOrders />} />
                <Route path="/invoices" element={<Invoices />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/customization-defaults" element={<StandaloneCustomization />} />
                <Route path="/shipping-defaults" element={<StandaloneShipping />} />
                
                {/* Legacy e-gift flow routes - keeping for backward compatibility */}
                <Route path="/customize-egift" element={<CustomizeEGift />} />
                <Route path="/select-recipients-egift" element={<SelectRecipientsEGift />} />
              </Route>

              {/* Admin routes */}
              <Route element={<AdminDashboardLayout />}>
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/users" element={<AdminUsers />} />
                <Route path="/admin/client-management" element={<AdminClientManagement />} />
                <Route path="/admin/preset-setup" element={<PresetGiftBoxSetup />} />
                <Route path="/admin/packaging-delivery" element={<AdminPackagingDelivery />} />
                <Route path="/admin/track-orders" element={<AdminTrackOrders />} />
                <Route path="/admin/inventory" element={<AdminInventory />} />
                <Route path="/admin/invoices" element={<AdminInvoices />} />
                <Route path="/admin/settings" element={<AdminSettings />} />
                <Route path="/admin/my-profile" element={<MyProfile />} />
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
