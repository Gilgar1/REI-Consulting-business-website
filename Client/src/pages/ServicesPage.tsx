import { FileText, Building, ShieldCheck, Home, Globe, Users } from "lucide-react";
import { Page } from "../App";

interface ServicesPageProps {
  setCurrentPage: (page: Page) => void;
}

const services = [
  {
    icon: FileText,
    title: "Real Estate Loan Assistance",
    description: "We help individuals and businesses secure real estate loans for buying land, building, renovation, and more. Get professional support from eligibility assessment through to loan approval.",
    page: "loan-assistance" as Page
  },
  {
    icon: Building,
    title: "Land & Property Documentation Guidance",
    description: "Navigate land certificates, survey plans, sales agreements, mutation, and title acquisition with expert guidance. Avoid costly documentation mistakes.",
    page: "documentation" as Page
  },
  {
    icon: ShieldCheck,
    title: "Property Verification (Anti-Fraud)",
    description: "Verify ownership, boundaries, authenticity, and legitimacy before making any payment. Protect yourself from fake documents, double sales, and scams.",
    page: "verification" as Page
  },
  {
    icon: Home,
    title: "Rental Property Management",
    description: "Professional tenant management, rent collection, maintenance coordination, and digital reporting. Let us handle your property while you enjoy the returns.",
    page: "rental-management" as Page
  },
  {
    icon: Globe,
    title: "Portfolio Strategy for Diaspora Investors",
    description: "Specialized guidance for Cameroonians abroad. Choose the right property, avoid common traps, build long-term ROI, and manage remotely with confidence.",
    page: "diaspora-strategy" as Page
  },
  {
    icon: Users,
    title: "Verified Property Listings / Acquisition Support",
    description: "Access our curated selection of verified properties. Every listing includes photos, documentation status, verification details, and acquisition support.",
    page: "listings" as Page
  }
];

export function ServicesPage({ setCurrentPage }: ServicesPageProps) {
  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="py-24 bg-gradient-to-br from-blue-600 to-blue-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-white mb-6">Services We Offer</h1>
          <p className="text-blue-100 text-xl">
            Choose the guidance you need
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <div
                  key={index}
                  className="p-8 bg-gray-50 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all cursor-pointer"
                  onClick={() => setCurrentPage(service.page)}
                >
                  <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mb-6">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-gray-900 mb-4">{service.title}</h2>
                  <p className="text-gray-600 mb-6 leading-relaxed">{service.description}</p>
                  <button className="text-blue-600 hover:text-blue-700 transition-colors">
                    Learn More →
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
