import { useState } from "react";
import { HomePage } from "./pages/HomePage";
import { AboutPage } from "./pages/AboutPage";
import { ServicesPage } from "./pages/ServicesPage";
import { BlogPage } from "./pages/BlogPage";
import { ContactPage } from "./pages/ContactPage";
import { LoanAssistancePage } from "./pages/services/LoanAssistancePage";
import { DocumentationPage } from "./pages/services/DocumentationPage";
import { VerificationPage } from "./pages/services/VerificationPage";
import { RentalManagementPage } from "./pages/services/RentalManagementPage";
import { DiasporaStrategyPage } from "./pages/services/DiasporaStrategyPage";
import { PropertyListingsPage } from "./pages/PropertyListingsPage";
import { Navigation } from "./components/Navigation";
import { Footer } from "./components/Footer";

export type Page = 
  | "home" 
  | "about" 
  | "services" 
  | "blog" 
  | "contact"
  | "loan-assistance"
  | "documentation"
  | "verification"
  | "rental-management"
  | "diaspora-strategy"
  | "listings";

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("home");

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <HomePage setCurrentPage={setCurrentPage} />;
      case "about":
        return <AboutPage />;
      case "services":
        return <ServicesPage setCurrentPage={setCurrentPage} />;
      case "blog":
        return <BlogPage />;
      case "contact":
        return <ContactPage />;
      case "loan-assistance":
        return <LoanAssistancePage />;
      case "documentation":
        return <DocumentationPage />;
      case "verification":
        return <VerificationPage />;
      case "rental-management":
        return <RentalManagementPage />;
      case "diaspora-strategy":
        return <DiasporaStrategyPage />;
      case "listings":
        return <PropertyListingsPage />;
      default:
        return <HomePage setCurrentPage={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen">
      <Navigation currentPage={currentPage} setCurrentPage={setCurrentPage} />
      {renderPage()}
      <Footer setCurrentPage={setCurrentPage} />
    </div>
  );
}
