import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Page } from "../../App";
import api from "../../api";

interface ServicesOverviewProps {
  setCurrentPage: (page: Page) => void;
}

const services = [
  {
    title: "Real Estate Loan Support",
    subtitle: "Simplifying the process from application to approval.",
    page: "loan-assistance" as Page,
    image: "https://images.unsplash.com/photo-1739430630591-9380bdf1c798?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    height: "tall" // spans 2 rows
  },
  {
    title: "Land & Property Documentation",
    subtitle: "Accurate, transparent, legally compliant documentation.",
    page: "documentation" as Page,
    image: "https://images.unsplash.com/photo-1609424612637-20f39c4187ee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    height: "medium" // spans 1 row - middle card
  },
  {
    title: "Rental Management",
    subtitle: "Hands-free tenant management and property oversight.",
    page: "rental-management" as Page,
    image: "https://images.unsplash.com/photo-1603736043044-65d44d3c6230?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    height: "medium" // spans 1 row - middle card
  },
  {
    title: "Portfolio Strategy for Investors",
    subtitle: "Smart, data-driven investment plans for locals & diaspora.",
    page: "diaspora-strategy" as Page,
    image: "https://images.unsplash.com/photo-1761587941453-bd1790225d52?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    height: "tall" // spans 2 rows
  },
  {
    title: "Property Verification",
    subtitle: "Verify land ownership, boundaries, and legitimacy before payment.",
    page: "verification" as Page,
    image: "https://images.unsplash.com/photo-1716037991590-c975184b37df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    height: "short" // spans 1 row
  },
  {
    title: "Verified Property Listings",
    subtitle: "Curated, verified properties you can trust.",
    page: "listings" as Page,
    image: "https://images.unsplash.com/photo-1610401511615-a36fb6e94657?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    height: "short" // spans 1 row
  }
];

export function ServicesOverview({ setCurrentPage }: ServicesOverviewProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [services, setServices] = useState<any[]>([]);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  useEffect(() => {
    let mounted = true;
    api.get('/api/services/').then((data) => {
      if (!mounted) return;
      setServices(data || []);
    }).catch((err) => console.error(err));
    return () => { mounted = false };
  }, []);

  return (
    <section ref={sectionRef} className="py-20 bg-royal-blue relative overflow-hidden">
      {/* Decorative Gold Line */}
      <div className="absolute top-0 left-0 w-40 h-1 bg-gold"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className={`flex items-start justify-between mb-16 transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
        }`}>
          <div>
            <h2 className="text-white mb-2 font-montserrat" style={{ fontSize: '3rem', fontWeight: 700, letterSpacing: '-0.02em' }}>
              Core Services
            </h2>
          </div>
          <div className="hidden lg:block max-w-md text-right">
            <p className="text-gray-300 font-inter" style={{ fontSize: '1rem', lineHeight: '1.7' }}>
              Your trusted partner for real estate clarity and access
            </p>
          </div>
        </div>

        {/* Services Grid - Masonry Style Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[200px]">
          {/* Card 1 - Tall (Left) */}
          <div
            onClick={() => setCurrentPage(services[0]?.page)}
            className={`group relative overflow-hidden cursor-pointer md:row-span-2 transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
            style={{ transitionDelay: '0ms' }}
          >
            <div className="relative h-full">
              {/* Image */}
              <img 
                src={services[0]?.image} 
                alt={services[0]?.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              {/* Dark Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/70 to-black/50 group-hover:from-black/75 transition-all duration-500"></div>
              
              {/* Content */}
              <div className="absolute inset-0 p-8 flex flex-col justify-between">
                <div>
                  <h3 className="text-white font-montserrat mb-2 transition-all duration-300 group-hover:text-gold" style={{ fontSize: '1.5rem', fontWeight: 600, lineHeight: '1.2' }}>
                    {services[0]?.title}
                  </h3>
                  <p className="text-gray-300 font-inter" style={{ fontSize: '0.875rem', lineHeight: '1.5' }}>
                    {services[0]?.subtitle}
                  </p>
                </div>
                
                {/* Arrow Button */}
                <div className="flex items-end justify-start">
                  <div className="w-12 h-12 rounded-full border-2 border-white/30 group-hover:border-gold group-hover:bg-gold flex items-center justify-center transition-all duration-300 group-hover:scale-110">
                    <ArrowRight className="w-5 h-5 text-white group-hover:text-royal-blue transition-colors" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2 & 3 - Middle two with same height */}
          <div
            onClick={() => setCurrentPage(services[1]?.page)}
            className={`group relative overflow-hidden cursor-pointer md:col-span-2 lg:col-span-1 transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
            style={{ transitionDelay: '100ms' }}
          >
            <div className="relative h-full">
              <img 
                src={services[1]?.image} 
                alt={services[1]?.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/70 to-black/50 group-hover:from-black/75 transition-all duration-500"></div>
              
              <div className="absolute inset-0 p-6 flex flex-col justify-between">
                <div>
                  <h3 className="text-white font-montserrat mb-2 transition-all duration-300 group-hover:text-gold" style={{ fontSize: '1.25rem', fontWeight: 600, lineHeight: '1.2' }}>
                    {services[1]?.title}
                  </h3>
                  <p className="text-gray-300 font-inter text-sm" style={{ fontSize: '0.875rem', lineHeight: '1.4' }}>
                    {services[1]?.subtitle}
                  </p>
                </div>
                
                <div className="flex items-end justify-start">
                  <div className="w-12 h-12 rounded-full border-2 border-white/30 group-hover:border-gold group-hover:bg-gold flex items-center justify-center transition-all duration-300 group-hover:scale-110">
                    <ArrowRight className="w-5 h-5 text-white group-hover:text-royal-blue transition-colors" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            onClick={() => setCurrentPage(services[2]?.page)}
            className={`group relative overflow-hidden cursor-pointer md:col-span-2 lg:col-span-1 transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
            style={{ transitionDelay: '200ms' }}
          >
            <div className="relative h-full">
              <img 
                src={services[2]?.image} 
                alt={services[2]?.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/70 to-black/50 group-hover:from-black/75 transition-all duration-500"></div>
              
              <div className="absolute inset-0 p-6 flex flex-col justify-between">
                <div>
                  <h3 className="text-white font-montserrat mb-2 transition-all duration-300 group-hover:text-gold" style={{ fontSize: '1.25rem', fontWeight: 600, lineHeight: '1.2' }}>
                    {services[2]?.title}
                  </h3>
                  <p className="text-gray-300 font-inter" style={{ fontSize: '0.875rem', lineHeight: '1.4' }}>
                    {services[2]?.subtitle}
                  </p>
                </div>
                
                <div className="flex items-end justify-start">
                  <div className="w-12 h-12 rounded-full border-2 border-white/30 group-hover:border-gold group-hover:bg-gold flex items-center justify-center transition-all duration-300 group-hover:scale-110">
                    <ArrowRight className="w-5 h-5 text-white group-hover:text-royal-blue transition-colors" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 4 - Tall (Right) */}
          <div
            onClick={() => setCurrentPage(services[3]?.page)}
            className={`group relative overflow-hidden cursor-pointer md:row-span-2 transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
            style={{ transitionDelay: '300ms' }}
          >
            <div className="relative h-full">
              <img 
                src={services[3]?.image} 
                alt={services[3]?.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/70 to-black/50 group-hover:from-black/75 transition-all duration-500"></div>
              
              <div className="absolute inset-0 p-8 flex flex-col justify-between">
                <div>
                  <h3 className="text-white font-montserrat mb-2 transition-all duration-300 group-hover:text-gold" style={{ fontSize: '1.5rem', fontWeight: 600, lineHeight: '1.2' }}>
                    {services[3]?.title}
                  </h3>
                  <p className="text-gray-300 font-inter" style={{ fontSize: '0.875rem', lineHeight: '1.5' }}>
                    {services[3]?.subtitle}
                  </p>
                </div>
                
                <div className="flex items-end justify-start">
                  <div className="w-12 h-12 rounded-full border-2 border-white/30 group-hover:border-gold group-hover:bg-gold flex items-center justify-center transition-all duration-300 group-hover:scale-110">
                    <ArrowRight className="w-5 h-5 text-white group-hover:text-royal-blue transition-colors" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 5 & 6 - Bottom row */}
          <div
            onClick={() => setCurrentPage(services[4]?.page)}
            className={`group relative overflow-hidden cursor-pointer md:col-span-2 lg:col-span-1 transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
            style={{ transitionDelay: '400ms' }}
          >
            <div className="relative h-full">
              <img 
                src={services[4]?.image} 
                alt={services[4]?.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/70 to-black/50 group-hover:from-black/75 transition-all duration-500"></div>
              
              <div className="absolute inset-0 p-6 flex flex-col justify-between">
                <div>
                  <h3 className="text-white font-montserrat mb-2 transition-all duration-300 group-hover:text-gold" style={{ fontSize: '1.25rem', fontWeight: 600, lineHeight: '1.2' }}>
                    {services[4]?.title}
                  </h3>
                  <p className="text-gray-300 font-inter" style={{ fontSize: '0.875rem', lineHeight: '1.4' }}>
                    {services[4]?.subtitle}
                  </p>
                </div>
                
                <div className="flex items-end justify-start">
                  <div className="w-12 h-12 rounded-full border-2 border-white/30 group-hover:border-gold group-hover:bg-gold flex items-center justify-center transition-all duration-300 group-hover:scale-110">
                    <ArrowRight className="w-5 h-5 text-white group-hover:text-royal-blue transition-colors" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            onClick={() => setCurrentPage(services[5]?.page)}
            className={`group relative overflow-hidden cursor-pointer md:col-span-2 lg:col-span-1 transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
            style={{ transitionDelay: '500ms' }}
          >
            <div className="relative h-full">
              <img 
                src={services[5]?.image} 
                alt={services[5]?.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/70 to-black/50 group-hover:from-black/75 transition-all duration-500"></div>
              
              <div className="absolute inset-0 p-6 flex flex-col justify-between">
                <div>
                  <h3 className="text-white font-montserrat mb-2 transition-all duration-300 group-hover:text-gold" style={{ fontSize: '1.25rem', fontWeight: 600, lineHeight: '1.2' }}>
                    {services[5]?.title}
                  </h3>
                  <p className="text-gray-300 font-inter" style={{ fontSize: '0.875rem', lineHeight: '1.4' }}>
                    {services[5]?.subtitle}
                  </p>
                </div>
                
                <div className="flex items-end justify-start">
                  <div className="w-12 h-12 rounded-full border-2 border-white/30 group-hover:border-gold group-hover:bg-gold flex items-center justify-center transition-all duration-300 group-hover:scale-110">
                    <ArrowRight className="w-5 h-5 text-white group-hover:text-royal-blue transition-colors" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div className={`text-center mt-16 transition-all duration-700 delay-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <button
            onClick={() => setCurrentPage("services")}
            className="group inline-flex items-center px-10 py-4 bg-gradient-to-r from-gold via-gold to-gold/90 text-royal-blue rounded-full hover:shadow-2xl hover:shadow-gold/50 transition-all duration-300 font-inter transform hover:scale-110 hover:-translate-y-1"
            style={{ fontWeight: 600, fontSize: '1.05rem' }}
          >
            Explore All Services
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-2 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
}