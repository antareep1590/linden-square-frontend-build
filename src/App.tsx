
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import ViewInvoice from "./pages/ViewInvoice";

// Client pages
import Dashboard from "./pages/Dashboard";
import Customers from "./pages/Customers";
import GiftBoxFlow from "./pages/GiftBoxFlow";
import BoxListing from "./pages/BoxListing";
import BoxDetails from "./pages/BoxDetails";
import SelectGifts from "./pages/SelectGifts";
import PersonalizationStep from "./pages/PersonalizationStep";
import RecipientSelection from "./pages/RecipientSelection";
import FinalSummary from "./pages/FinalSummary";
import TrackOrders from "./pages/TrackOrders";
import Invoices from "./pages/Invoices";
import Profile from "./pages/Profile";

// Admin pages
import AdminDashboard from "./pages/admin/Dashboard";
import AdminCustomers from "./pages/admin/Customers";
import AdminGiftCatalog from "./pages/admin/GiftCatalog";
import AdminPersonalizationSettings from "./pages/admin/PersonalizationSettings";
import AdminPackagingDelivery from "./pages/admin/PackagingDelivery";
import AdminDeliveryManagement from "./pages/admin/DeliveryManagement";
import AdminTrackOrders from "./pages/admin/TrackOrders";
import AdminInventory from "./pages/admin/Inventory";
import AdminInvoices from "./pages/admin/Invoices";
import AdminSettings from "./pages/admin/Settings";
import AdminUsers from "./pages/admin/Users";
import AdminMyProfile from "./pages/admin/MyProfile";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/invoices/:invoiceId" element={<ViewInvoice />} />
          
          {/* Client routes */}
          <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
          <Route path="/customers" element={<Layout><Customers /></Layout>} />
          <Route path="/gift-box-flow" element={<Layout><GiftBoxFlow /></Layout>} />
          <Route path="/box-listing" element={<Layout><BoxListing /></Layout>} />
          <Route path="/box-details/:id" element={<Layout><BoxDetails /></Layout>} />
          <Route path="/select-gifts" element={<Layout><SelectGifts /></Layout>} />
          <Route path="/personalization" element={<Layout><PersonalizationStep /></Layout>} />
          <Route path="/recipient-selection" element={<Layout><RecipientSelection /></Layout>} />
          <Route path="/final-summary" element={<Layout><FinalSummary /></Layout>} />
          <Route path="/track-orders" element={<Layout><TrackOrders /></Layout>} />
          <Route path="/invoices" element={<Layout><Invoices /></Layout>} />
          <Route path="/profile" element={<Layout><Profile /></Layout>} />
          
          {/* Admin routes */}
          <Route path="/admin/dashboard" element={<Layout><AdminDashboard /></Layout>} />
          <Route path="/admin/customers" element={<Layout><AdminCustomers /></Layout>} />
          <Route path="/admin/gift-catalog" element={<Layout><AdminGiftCatalog /></Layout>} />
          <Route path="/admin/personalization" element={<Layout><AdminPersonalizationSettings /></Layout>} />
          <Route path="/admin/packaging" element={<Layout><AdminPackagingDelivery /></Layout>} />
          <Route path="/admin/delivery" element={<Layout><AdminDeliveryManagement /></Layout>} />
          <Route path="/admin/track-orders" element={<Layout><AdminTrackOrders /></Layout>} />
          <Route path="/admin/inventory" element={<Layout><AdminInventory /></Layout>} />
          <Route path="/admin/invoices" element={<Layout><AdminInvoices /></Layout>} />
          <Route path="/admin/settings" element={<Layout><AdminSettings /></Layout>} />
          <Route path="/admin/users" element={<Layout><AdminUsers /></Layout>} />
          <Route path="/admin/my-profile" element={<Layout><AdminMyProfile /></Layout>} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
