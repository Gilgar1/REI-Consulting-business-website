import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { AboutPage } from "./pages/AboutPage";
import { ServicesPage } from "./pages/ServicesPage";
import { BlogPage } from "./pages/BlogPage";
import { BlogArticlePage } from "./pages/BlogArticlePage";
import { BookingSuccessPage } from "./pages/BookingSuccessPage";
import { LoanAssistancePage } from "./pages/services/LoanAssistancePage";
import { DocumentationPage } from "./pages/services/DocumentationPage";
import { VerificationPage } from "./pages/services/VerificationPage";
import { RentalManagementPage } from "./pages/services/RentalManagementPage";
import { DiasporaStrategyPage } from "./pages/services/DiasporaStrategyPage";
import { PropertyListingsPage } from "./pages/PropertyListingsPage";
import { BookingPage } from "./pages/BookingPage";
import { LoanSimulatorPage } from "./pages/LoanSimulatorPage";
import { EligibilityPage } from "./pages/EligibilityPage";
import { Navigation } from "./components/Navigation";
import { Footer } from "./components/Footer";
import { AuthProvider } from "./context/AuthContext";
import { LoginPage } from "./pages/LoginPage";
import { SignupPage } from "./pages/SignupPage";
import { ResetPasswordPage } from "./pages/ResetPasswordPage";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AdminLayout } from "./components/admin/AdminLayout";
import { AdminDashboardPage } from "./pages/admin/AdminDashboardPage";
import { AdminListingsPage } from "./pages/admin/AdminListingsPage";
import { AdminBlogPage } from "./pages/admin/AdminBlogPage";
import { AdminLeadsPage } from "./pages/admin/AdminLeadsPage";
import { Toaster } from "./components/ui/sonner";
import { initGA } from "./utils/analytics";
import { usePageTracking } from "./hooks/usePageTracking";
import { LanguageProvider } from "./i18n/LanguageContext";

// Initialize GA once
initGA();

function AppShell() {
  usePageTracking();
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");
  const isFunnelWizard = location.pathname === "/eligibility";

  return (
    <div className="min-h-screen bg-surface flex flex-col font-sans">
      {!isAdminRoute && !isFunnelWizard && <Navigation />}
      {/* Added pt-20 to account for fixed navbar height on public routes */}
      <main className={`flex-grow ${!isAdminRoute && !isFunnelWizard ? "pt-20" : ""}`}>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/services/loan-assistance" element={<LoanAssistancePage />} />
          <Route path="/services/documentation" element={<DocumentationPage />} />
          <Route path="/services/verification" element={<VerificationPage />} />
          <Route path="/services/rental-management" element={<RentalManagementPage />} />
          <Route path="/services/diaspora-strategy" element={<DiasporaStrategyPage />} />
          <Route path="/listings" element={<PropertyListingsPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogArticlePage />} />
          <Route path="/contact" element={<Navigate to="/book" replace />} />
          <Route path="/book" element={<BookingPage />} />
          <Route path="/simulator" element={<LoanSimulatorPage />} />
          <Route path="/loan-simulator" element={<LoanSimulatorPage />} />
          <Route path="/eligibility" element={<EligibilityPage />} />
          <Route path="/booking-success" element={<BookingSuccessPage />} />

          {/* Admin routes wrapped in ProtectedRoute */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboardPage />} />
            <Route path="listings" element={<AdminListingsPage />} />
            <Route path="blog" element={<AdminBlogPage />} />
            <Route path="leads" element={<AdminLeadsPage />} />
          </Route>

          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>
      {!isAdminRoute && <Footer />}
      <Toaster richColors position="top-right" />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <BrowserRouter>
          <AppShell />
        </BrowserRouter>
      </LanguageProvider>
    </AuthProvider>
  );
}