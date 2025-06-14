
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from './contexts/CartContext';
import Index from "./pages/Index";
import OrderManagement from "./pages/OrderManagement";
import PackagingCenter from "./pages/PackagingCenter";
import TrackingCenter from "./pages/TrackingCenter";
import Invoices from "./pages/Invoices";
import Dashboard from "./pages/Dashboard";
import StandaloneShipping from "./pages/StandaloneShipping";
import PaymentMethod from "./pages/PaymentMethod";
import BoxListing from "./pages/BoxListing";
import CustomizeBox from "./pages/CustomizeBox";
import CustomizeGiftBox from "./pages/CustomizeGiftBox";
import Personalization from "./pages/Personalization";
import Recipients from "./pages/Recipients";
import ShippingFulfillment from "./pages/ShippingFulfillment";
import ChooseGiftBox from "./pages/ChooseGiftBox";
import CustomizationPage from "./pages/CustomizationPage";
import AdminDashboard from "./pages/AdminDashboard";
import AdminClients from "./pages/AdminClients";
import AdminGiftBoxes from "./pages/AdminGiftBoxes";
import AdminInventory from "./pages/AdminInventory";

// Public pages for new users
import CustomizeGiftBoxPublic from "./pages/public/CustomizeGiftBoxPublic";
import SelectRecipientsPublic from "./pages/public/SelectRecipientsPublic";
import ShippingFulfillmentPublic from "./pages/public/ShippingFulfillmentPublic";
import PaymentMethodPublic from "./pages/public/PaymentMethodPublic";

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
              
              {/* Logged-in app routes */}
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/order-management" element={<OrderManagement />} />
              <Route path="/packaging-center" element={<PackagingCenter />} />
              <Route path="/tracking-center" element={<TrackingCenter />} />
              <Route path="/invoices" element={<Invoices />} />
              <Route path="/shipping-defaults" element={<StandaloneShipping />} />
              <Route path="/payment-method" element={<PaymentMethod />} />
              <Route path="/box-listing" element={<BoxListing />} />
              <Route path="/customize-box" element={<CustomizeBox />} />
              <Route path="/customize-gift-box" element={<CustomizeGiftBox />} />
              <Route path="/personalization" element={<Personalization />} />
              <Route path="/recipients" element={<Recipients />} />
              <Route path="/shipping-fulfillment" element={<ShippingFulfillment />} />
              <Route path="/choose-gift-box" element={<ChooseGiftBox />} />
              <Route path="/customization" element={<CustomizationPage />} />
              
              {/* Admin routes */}
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/clients" element={<AdminClients />} />
              <Route path="/admin/gift-boxes" element={<AdminGiftBoxes />} />
              <Route path="/admin/inventory" element={<AdminInventory />} />
              
              {/* Public routes for new users */}
              <Route path="/public/customize-gift-box" element={<CustomizeGiftBoxPublic />} />
              <Route path="/public/select-recipients" element={<SelectRecipientsPublic />} />
              <Route path="/public/shipping-fulfillment" element={<ShippingFulfillmentPublic />} />
              <Route path="/public/payment-method" element={<PaymentMethodPublic />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </CartProvider>
    </QueryClientProvider>
  );
}

export default App;
