import { FileText, Building, ShieldCheck, Home, Globe, Users, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const services = [
  {
    icon: FileText,
    title: "Real Estate Loan Assistance",
    description: "We help individuals and businesses secure real estate loans for buying land, building, renovation, and more. Get professional support from eligibility assessment through to loan approval.",
    path: "/services/loan-assistance"
  },
  {
    icon: Building,
    title: "Land & Property Documentation",
    description: "Navigate land certificates, survey plans, sales agreements, mutation, and title acquisition with expert guidance. Avoid costly documentation mistakes.",
    path: "/services/documentation"
  },
  {
    icon: ShieldCheck,
    title: "Property Verification (Due Diligence)",
    description: "Verify ownership, boundaries, authenticity, and legitimacy before making any payment. Protect yourself from fake documents, double sales, and scams.",
    path: "/services/verification"
  },
  {
    icon: Home,
    title: "Rental Property Management",
    description: "Professional tenant management, rent collection, maintenance coordination, and digital reporting. Let us handle your property while you enjoy the returns.",
    path: "/services/rental-management"
  },
  {
    icon: Globe,
    title: "Portfolio Strategy (Diaspora)",
    description: "Specialized guidance for Cameroonians abroad. Choose the right property, avoid common traps, build long-term ROI, and manage remotely with confidence.",
    path: "/services/diaspora-strategy"
  },
  {
    icon: Users,
    title: "Verified Property Acquisition",
    description: "Access our curated selection of verified properties. Every listing includes photos, documentation status, verification details, and acquisition support.",
    path: "/listings"
  }
];

export function ServicesPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative bg-primary py-24 overflow-hidden">
        <div className="absolute inset-0 bg-slate-900/50" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h5 className="text-accent font-semibold tracking-widest uppercase mb-4 animate-fade-in-up">What We Do</h5>
          <h1 className="font-heading font-bold text-4xl md:text-5xl text-white mb-6 animate-fade-in-up delay-100">
            Comprehensive Real Estate Solutions
          </h1>
          <p className="text-xl text-slate-300 animate-fade-in-up delay-200">
            From funding to management, we provide the expertise you need to succeed in Cameroon's property market.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <div
                  key={index}
                  className="p-8 bg-white rounded-2xl shadow-sm border border-slate-100 hover:border-accent hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group flex flex-col h-full"
                  onClick={() => {
                    navigate(service.path);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  <div className="w-14 h-14 bg-primary/5 rounded-xl flex items-center justify-center mb-6 text-primary group-hover:bg-accent group-hover:text-white transition-colors">
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold text-primary mb-3 group-hover:text-accent transition-colors">{service.title}</h3>
                  <p className="text-slate-600 mb-8 leading-relaxed flex-grow">{service.description}</p>
                  <div className="flex items-center gap-2 text-accent font-semibold text-sm group-hover:gap-3 transition-all">
                    <span>Explore Service</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
