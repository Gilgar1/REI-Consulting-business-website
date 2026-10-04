import { useState, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { AboutPage } from "./pages/AboutPage";
import { ServicesPage } from "./pages/ServicesPage";
import { BlogPage } from "./pages/BlogPage";
import { ContactPage } from "./pages/ContactPage";
import { BookingSuccessPage } from "./pages/BookingSuccessPage";
import { LoanAssistancePage } from "./pages/services/LoanAssistancePage";
import { DocumentationPage } from "./pages/services/DocumentationPage";
import { VerificationPage } from "./pages/services/VerificationPage";
import { RentalManagementPage } from "./pages/services/RentalManagementPage";
import { DiasporaStrategyPage } from "./pages/services/DiasporaStrategyPage";
import { PropertyListingsPage } from "./pages/PropertyListingsPage";
import { Navigation } from "./components/Navigation";
import { Footer } from "./components/Footer";
import { AuthProvider } from "./context/AuthContext";
import { LoginPage } from "./pages/LoginPage";

import { SignupPage } from "./pages/SignupPage";
import { initGA } from "./utils/analytics";
import { usePageTracking } from "./hooks/usePageTracking";
import { supabase } from "./utils/supabase";

// Initialize GA once
initGA();

function AppShell() {
  usePageTracking();
  const [properties, setProperties] = useState<{ id: string; title: string }[]>([]);

  useEffect(() => {
    async function getProperties() {
      const { data, error } = await supabase.from("properties").select();

      if (error) {
        console.error("Error fetching properties from Supabase:", error.message);
      } else if (data) {
        setProperties(data as { id: string; title: string }[]);
      }
    }

    getProperties();
  }, []);

  return (
    <div className="min-h-screen bg-surface flex flex-col font-sans">
      <Navigation />
      {/* Added pt-20 to account for fixed navbar height */}
      <main className="flex-grow pt-20">
        {properties.length > 0 && (
          <ul className="mx-auto max-w-4xl px-4 py-6">
            {properties.map((property) => (
              <li key={property.id}>{property.title}</li>
            ))}
          </ul>
        )}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/services/loan-assistance" element={<LoanAssistancePage />} />
          <Route path="/services/documentation" element={<DocumentationPage />} />
          <Route path="/services/verification" element={<VerificationPage />} />
          <Route path="/services/rental-management" element={<RentalManagementPage />} />
          <Route path="/services/diaspora-strategy" element={<DiasporaStrategyPage />} />
          <Route path="/listings" element={<PropertyListingsPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/booking-success" element={<BookingSuccessPage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppShell />
      </BrowserRouter>
    </AuthProvider>
  );
}