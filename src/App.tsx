
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Customers from "./pages/Customers";
import TrackOrders from "./pages/TrackOrders";
import Invoices from "./pages/Invoices";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import ChooseDeliveryMethod from "./pages/ChooseDeliveryMethod";
import RecipientSelection from "./pages/RecipientSelection";
import CustomizationPage from "./pages/CustomizationPage";
import ShippingFulfillment from "./pages/ShippingFulfillment";
import EGiftSendOptions from "./pages/EGiftSendOptions";
import BoxListing from "./pages/BoxListing";
import BoxDetails from "./pages/BoxDetails";
import FinalSummary from "./pages/FinalSummary";
import PaymentMethod from "./pages/PaymentMethod";
import SelectRecipientsEGift from "./pages/SelectRecipientsEGift";
import CustomizeEGift from "./pages/CustomizeEGift";
import NotFound from "./pages/NotFound";
import LandingPage from "./pages/LandingPage";

// Admin pages
import AdminDashboard from "./pages/admin/Dashboard";
import AdminUsers from "./pages/admin/Users";
import AdminClientManagement from "./pages/admin/ClientManagement";
import AdminPresetSetup from "./pages/admin/PresetGiftBoxSetup";
import AdminShippingDelivery from "./pages/admin/PackagingDelivery";
import AdminTrackOrders from "./pages/admin/TrackOrders";
import AdminInventory from "./pages/admin/Inventory";
import AdminInvoices from "./pages/admin/Invoices";
import AdminCustomizationSettings from "./pages/admin/CustomizationSettings";
import AdminSettings from "./pages/admin/Settings";

import DashboardLayout from "./layouts/DashboardLayout";
import AdminDashboardLayout from "./layouts/AdminDashboardLayout";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <TooltipProvider>
          <Toaster />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/landing" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              
              {/* Client Dashboard Routes */}
              <Route path="/dashboard" element={<DashboardLayout><Dashboard /></DashboardLayout>} />
              <Route path="/customers" element={<DashboardLayout><Customers /></DashboardLayout>} />
              <Route path="/track-orders" element={<DashboardLayout><TrackOrders /></DashboardLayout>} />
              <Route path="/invoices" element={<DashboardLayout><Invoices /></DashboardLayout>} />
              <Route path="/profile" element={<DashboardLayout><Profile /></DashboardLayout>} />
              <Route path="/choose-delivery-method" element={<DashboardLayout><ChooseDeliveryMethod /></DashboardLayout>} />
              <Route path="/recipient-selection" element={<DashboardLayout><RecipientSelection /></DashboardLayout>} />
              <Route path="/customization" element={<DashboardLayout><CustomizationPage /></DashboardLayout>} />
              <Route path="/shipping-fulfillment" element={<DashboardLayout><ShippingFulfillment /></DashboardLayout>} />
              <Route path="/egift-send-options" element={<DashboardLayout><EGiftSendOptions /></DashboardLayout>} />
              <Route path="/box-listing" element={<DashboardLayout><BoxListing /></DashboardLayout>} />
              <Route path="/box-details/:id" element={<DashboardLayout><BoxDetails /></DashboardLayout>} />
              <Route path="/final-summary" element={<DashboardLayout><FinalSummary /></DashboardLayout>} />
              <Route path="/payment-method" element={<DashboardLayout><PaymentMethod /></DashboardLayout>} />
              <Route path="/select-recipients-egift" element={<DashboardLayout><SelectRecipientsEGift /></DashboardLayout>} />
              <Route path="/customize-egift" element={<DashboardLayout><CustomizeEGift /></DashboardLayout>} />

              {/* Admin Dashboard Routes */}
              <Route path="/admin/dashboard" element={<AdminDashboardLayout><AdminDashboard /></AdminDashboardLayout>} />
              <Route path="/admin/users" element={<AdminDashboardLayout><AdminUsers /></AdminDashboardLayout>} />
              <Route path="/admin/client-management" element={<AdminDashboardLayout><AdminClientManagement /></AdminDashboardLayout>} />
              <Route path="/admin/preset-setup" element={<AdminDashboardLayout><AdminPresetSetup /></AdminDashboardLayout>} />
              <Route path="/admin/packaging-delivery" element={<AdminDashboardLayout><AdminShippingDelivery /></AdminDashboardLayout>} />
              <Route path="/admin/track-orders" element={<AdminDashboardLayout><AdminTrackOrders /></AdminDashboardLayout>} />
              <Route path="/admin/inventory" element={<AdminDashboardLayout><AdminInventory /></AdminDashboardLayout>} />
              <Route path="/admin/invoices" element={<AdminDashboardLayout><AdminInvoices /></AdminDashboardLayout>} />
              <Route path="/admin/customization-settings" element={<AdminDashboardLayout><AdminCustomizationSettings /></AdminDashboardLayout>} />
              <Route path="/admin/settings" element={<AdminDashboardLayout><AdminSettings /></AdminDashboardLayout>} />

              {/* Catch all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </CartProvider>
    </QueryClientProvider>
  );
}

export default App;
