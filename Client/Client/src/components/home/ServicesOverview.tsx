import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Page } from "../../App";
import api from "../../api";
import { buildSrcSet, replaceOrAddParam } from "../../utils/image.ts";

interface ServicesOverviewProps {
  setCurrentPage: (page: Page) => void;
}

const DEFAULT_SERVICES = [
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

interface ServiceItem {
  title: string;
  subtitle?: string;
  page?: Page | string;
  image?: string;
  height?: 'tall' | 'medium' | 'short' | string;
}

function ServiceCard({ svc, idx, setCurrentPage, isVisible }: { svc: ServiceItem; idx: number; setCurrentPage: (p: Page) => void; isVisible: boolean }) {
  const rowClass = svc.height === 'tall' ? 'md:row-span-2' : '';
  const delay = `${idx * 100}ms`;
  const width = svc.height === 'tall' ? 1200 : 800;
  const sets = svc.image ? buildSrcSet(svc.image) : { jpgSet: '', webpSet: '' };
  const loading = idx < 2 ? 'eager' : 'lazy';

  // Try to serve pre-generated optimized assets from /optimized when available.
  const optimizedMap: Record<string, string> = {
    'loan-assistance': 'service-loan',
    'documentation': 'service-docs',
    'rental-management': 'service-rental',
    'diaspora-strategy': 'service-portfolio',
    'verification': 'service-verification',
    'listings': 'service-listings'
  };
  const key = typeof svc.page === 'string' ? optimizedMap[svc.page] : undefined;
  const optimizedWebpSet = key
    ? [`/optimized/${key}-480.webp 480w`, `/optimized/${key}-800.webp 800w`, `/optimized/${key}-1200.webp 1200w`, `/optimized/${key}-1920.webp 1920w`].join(', ')
    : sets.webpSet;
  const optimizedJpgSet = key
    ? [`/optimized/${key}-480.webp 480w`, `/optimized/${key}-800.webp 800w`, `/optimized/${key}-1200.webp 1200w`, `/optimized/${key}-1920.webp 1920w`].join(', ')
    : sets.jpgSet;

  return (
    <div
      onClick={() => setCurrentPage((svc.page as Page) || 'services')}
      className={`group relative overflow-hidden cursor-pointer transition-all duration-700 ${rowClass} ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      style={{ transitionDelay: delay }}
    >
      <div className="relative h-full">
        {svc.image && (
          <picture>
            <source type="image/webp" srcSet={optimizedWebpSet} sizes="(max-width: 1024px) 100vw, 33vw" />
            <img
              src={key ? `/optimized/${key}-1200.webp` : replaceOrAddParam(svc.image!, 'w', String(width))}
              srcSet={optimizedJpgSet}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading={loading}
              decoding="async"
              alt={svc.title}
            />
          </picture>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/70 to-black/50 group-hover:from-black/75 transition-all duration-500"></div>

        <div className="absolute inset-0 p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-white font-montserrat mb-2 transition-all duration-300 group-hover:text-gold" style={{ fontSize: '1.25rem', fontWeight: 600, lineHeight: '1.2' }}>
              {svc.title}
            </h3>
            {svc.subtitle && (
              <p className="text-gray-300 font-inter" style={{ fontSize: '0.875rem', lineHeight: '1.4' }}>
                {svc.subtitle}
              </p>
            )}
          </div>

          <div className="flex items-end justify-start">
            <div className="w-12 h-12 rounded-full border-2 border-white/30 group-hover:border-gold group-hover:bg-gold flex items-center justify-center transition-all duration-300 group-hover:scale-110">
              <ArrowRight className="w-5 h-5 text-white group-hover:text-royal-blue transition-colors" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ServicesOverview({ setCurrentPage }: ServicesOverviewProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [serviceItems, setServiceItems] = useState<any[]>([]);
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
      setServiceItems(data || []);
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
          {(() => {
            const items = serviceItems.length ? serviceItems : DEFAULT_SERVICES;
            return items.map((svc, idx) => (
              <ServiceCard key={idx} svc={svc} idx={idx} setCurrentPage={setCurrentPage} isVisible={isVisible} />
            ));
          })()}
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