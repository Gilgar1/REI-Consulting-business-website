import { ArrowRight, CheckCircle2, Building, LineChart, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { useProperties } from "../hooks/useProperties";
import { FEATURED_CITIES } from "../utils/constants";
import { PropertyCard } from "../components/PropertyCard";

export function HomePage() {
  const { properties, loading, error } = useProperties();

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-primary px-4">
        {/* Background Overlay */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/95 to-primary/80 z-10" />
          <img
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop"
            alt="Modern Architecture"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="relative z-20 max-w-7xl mx-auto text-center text-white space-y-8 w-full">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-accent font-semibold text-sm animate-fade-in-up">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            Leading Real Estate Consultancy in Cameroon
          </div>

          <h1 className="font-heading font-bold text-4xl md:text-6xl lg:text-7xl leading-tight max-w-4xl mx-auto text-white">
            Secure Your Future in <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-amber-300">
              African Real Estate
            </span>
          </h1>

          <p className="text-base md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            We guide diaspora investors and local businesses through complex property acquisitions, loan financing, and due diligence with 100% transparency.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 px-4 sm:px-0">
            <Link
              to="/contact"
              className="w-full sm:w-auto justify-center px-8 py-4 bg-accent hover:bg-accent/90 text-white font-bold rounded-full transition-all duration-300 shadow-lg shadow-accent/25 hover:-translate-y-1 flex items-center gap-2"
            >
              Book Free Consultation
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/listings"
              className="w-full sm:w-auto justify-center px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white font-bold rounded-full transition-all duration-300 flex items-center gap-2"
            >
              View Properties
            </Link>
          </div>

          {/* Trust Ticker */}
          <div className="pt-12 md:pt-16 opacity-70">
            <p className="text-sm font-medium tracking-widest text-slate-400 mb-6 uppercase">Trusted By Partners In</p>
            <div className="flex justify-center gap-8 md:gap-12 grayscale opacity-60 flex-wrap">
              {FEATURED_CITIES.map((city) => (
                <span key={city} className="font-heading font-bold text-lg md:text-xl">{city}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services Preview (Floating Cards) */}
      <section className="py-16 md:py-24 bg-surface -mt-20 relative z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                icon: Shield,
                title: "Due Diligence",
                desc: "We verify every document, ensuring your land title is genuine and fraud-free."
              },
              {
                icon: LineChart,
                title: "Investment Strategy",
                desc: "Data-driven insights to maximize ROI on rental units and land appreciation."
              },
              {
                icon: Building,
                title: "Loan Assistance",
                desc: "Expert navigation of Crédit Foncier du Cameroun (CFC) for property funding."
              }
            ].map((service, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 hover:-translate-y-2 transition-all duration-300 group">
                <div className="w-14 h-14 bg-primary/5 rounded-xl flex items-center justify-center mb-6 group-hover:bg-accent group-hover:text-white transition-colors duration-300 text-primary">
                  <service.icon className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-primary">{service.title}</h3>
                <p className="text-slate-600 leading-relaxed">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties Section - Dynamic Data */}
      <section className="py-16 md:py-24 bg-surface/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-heading font-bold text-primary mb-4">Featured Opportunities</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">Exclusive, verified properties selected for high appreciation potential and secure legal standing.</p>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : error ? (
            <div className="text-center text-red-500 py-12">{error}</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {properties.slice(0, 3).map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
              {properties.length === 0 && (
                <div className="col-span-full text-center py-12 bg-white rounded-xl border border-dashed border-slate-300">
                  <Building className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500">No active listings allowed for public view at this moment.</p>
                  <Link to="/contact" className="text-accent font-semibold hover:underline mt-2 inline-block">Contact us for private inventory</Link>
                </div>
              )}
            </div>
          )}

          {properties.length > 0 && (
            <div className="mt-12 text-center">
              <Link to="/listings" className="inline-flex items-center gap-2 px-8 py-3 border border-primary text-primary font-bold rounded-full hover:bg-primary hover:text-white transition-all duration-300">
                View All Listings
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-4xl md:text-5xl font-heading font-bold text-primary leading-tight">
                Why Investing in Cameroon is <br />
                <span className="text-accent">Smarter With Us</span>
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed">
                The real estate market is filled with potential, but also hidden risks. We act as your eyes and ears on the ground, shielding you from scams and connecting you to genuine opportunities.
              </p>

              <ul className="space-y-4">
                {[
                  "Zero hidden fees or surprise costs.",
                  "Direct access to verified titles (Titres Fonciers).",
                  "Comprehensive post-purchase management.",
                  "Legal backing for every transaction."
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-primary font-medium">
                    <CheckCircle2 className="w-6 h-6 text-accent flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>

              <Link to="/about" className="inline-block mt-4 text-accent font-bold hover:text-accent/80 transition-colors border-b-2 border-accent/20 hover:border-accent">
                Read More About Our Mission
              </Link>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 bg-accent/10 rounded-3xl transform rotate-3" />
              <img
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1973&auto=format&fit=crop"
                alt="Consulting Meeting"
                className="relative rounded-2xl shadow-2xl w-full h-auto object-cover transform -rotate-1 hover:rotate-0 transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
