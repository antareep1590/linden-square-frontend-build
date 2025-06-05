
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
import Invoices from '@/pages/Invoices';
import Inventory from '@/pages/Inventory';
import UploadRecipient from '@/pages/UploadRecipient';
import Profile from '@/pages/Profile';
import PaymentMethod from '@/pages/PaymentMethod';

// New Gift Box Flow pages
import GiftBoxFlow from '@/pages/GiftBoxFlow';
import BoxListing from '@/pages/BoxListing';
import BoxDetails from '@/pages/BoxDetails';
import BuildCustomBox from '@/pages/BuildCustomBox';
import PersonalizationStep from '@/pages/PersonalizationStep';
import RecipientSelection from '@/pages/RecipientSelection';
import MultiBoxRecipientSelection from '@/pages/MultiBoxRecipientSelection';
import FinalSummary from '@/pages/FinalSummary';

// Admin pages
import AdminDashboard from '@/pages/admin/Dashboard';
import AdminCustomers from '@/pages/admin/Customers';
import Users from '@/pages/admin/Users';
import GiftCatalog from '@/pages/admin/GiftCatalog';
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
      <CartProvider>
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
            
            {/* New Unified Gift Box Flow */}
            <Route path="/gift-box-flow" element={<DashboardLayout><GiftBoxFlow /></DashboardLayout>} />
            <Route path="/box-listing" element={<DashboardLayout><BoxListing /></DashboardLayout>} />
            <Route path="/box-details/:id" element={<DashboardLayout><BoxDetails /></DashboardLayout>} />
            <Route path="/build-custom-box" element={<DashboardLayout><BuildCustomBox /></DashboardLayout>} />
            <Route path="/personalization" element={<DashboardLayout><PersonalizationStep /></DashboardLayout>} />
            <Route path="/recipient-selection" element={<DashboardLayout><RecipientSelection /></DashboardLayout>} />
            <Route path="/final-summary" element={<DashboardLayout><FinalSummary /></DashboardLayout>} />
            <Route path="/payment-method" element={<DashboardLayout><PaymentMethod /></DashboardLayout>} />
            
            {/* Invoices */}
            <Route path="/invoices" element={<DashboardLayout><Invoices /></DashboardLayout>} />
            <Route path="/invoices/:invoiceId" element={<DashboardLayout><ViewInvoice /></DashboardLayout>} />
            
            {/* Legacy routes - kept for compatibility */}
            <Route path="/add-personalization" element={<DashboardLayout><AddPersonalization /></DashboardLayout>} />
            <Route path="/track-orders" element={<DashboardLayout><TrackOrders /></DashboardLayout>} />
            <Route path="/inventory" element={<DashboardLayout><Inventory /></DashboardLayout>} />
            <Route path="/upload-recipient" element={<DashboardLayout><UploadRecipient /></DashboardLayout>} />
            
            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={<AdminDashboardLayout><AdminDashboard /></AdminDashboardLayout>} />
            <Route path="/admin/customers" element={<AdminDashboardLayout><AdminCustomers /></AdminDashboardLayout>} />
            <Route path="/admin/users" element={<AdminDashboardLayout><Users /></AdminDashboardLayout>} />
            <Route path="/admin/gift-catalog" element={<AdminDashboardLayout><GiftCatalog /></AdminDashboardLayout>} />
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
      </CartProvider>
    </QueryClientProvider>
  );
}

export default App;
