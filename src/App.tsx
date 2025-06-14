
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from './contexts/CartContext';
import Dashboard from "./pages/Dashboard";
import StandaloneShipping from "./pages/StandaloneShipping";
import Invoices from "./pages/Invoices";
import PlaceholderPage from "./pages/PlaceholderPage";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";

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
              {/* Landing & Authentication */}
              <Route path="/" element={<Login />} />
              
              {/* Logged-in app routes */}
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/invoices" element={<Invoices />} />
              <Route path="/shipping-defaults" element={<StandaloneShipping />} />
              
              {/* Placeholder routes for not-yet-implemented pages */}
              <Route path="/order-management" element={<PlaceholderPage title="Order Management" />} />
              <Route path="/packaging-center" element={<PlaceholderPage title="Packaging Center" />} />
              <Route path="/tracking-center" element={<PlaceholderPage title="Tracking Center" />} />
              <Route path="/payment-method" element={<PlaceholderPage title="Payment Method" />} />
              <Route path="/box-listing" element={<PlaceholderPage title="Box Listing" />} />
              <Route path="/customize-box" element={<PlaceholderPage title="Customize Box" />} />
              <Route path="/customize-gift-box" element={<PlaceholderPage title="Customize Gift Box" />} />
              <Route path="/personalization" element={<PlaceholderPage title="Personalization" />} />
              <Route path="/recipients" element={<PlaceholderPage title="Recipients" />} />
              <Route path="/shipping-fulfillment" element={<PlaceholderPage title="Shipping Fulfillment" />} />
              <Route path="/choose-gift-box" element={<PlaceholderPage title="Choose Gift Box" />} />
              <Route path="/customization" element={<PlaceholderPage title="Customization Page" />} />
              
              {/* Admin routes */}
              <Route path="/admin" element={<PlaceholderPage title="Admin Dashboard" />} />
              <Route path="/admin/clients" element={<PlaceholderPage title="Admin Clients" />} />
              <Route path="/admin/gift-boxes" element={<PlaceholderPage title="Admin Gift Boxes" />} />
              <Route path="/admin/inventory" element={<PlaceholderPage title="Admin Inventory" />} />
              
              {/* Public routes for new users */}
              <Route path="/public/customize-gift-box" element={<CustomizeGiftBoxPublic />} />
              <Route path="/public/select-recipients" element={<SelectRecipientsPublic />} />
              <Route path="/public/shipping-fulfillment" element={<ShippingFulfillmentPublic />} />
              <Route path="/public/payment-method" element={<PaymentMethodPublic />} />
              
              {/* Fallback for non-existent routes */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </CartProvider>
    </QueryClientProvider>
  );
}

export default App;
