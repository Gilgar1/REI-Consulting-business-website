import { ArrowRight } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { Page } from "../../App";
import { useEffect, useState } from "react";
import api from "../../api";

interface HeroProps {
  setCurrentPage: (page: Page) => void;
}

export function Hero({ setCurrentPage }: HeroProps) {
  const [hero, setHero] = useState<any | null>(null);
  useEffect(() => {
    let mounted = true;
    api.get('/api/hero/').then((data) => {
      if (!mounted) return;
      setHero(data && data.length ? data[0] : null);
    }).catch((err) => console.error(err));
    return () => { mounted = false };
  }, []);

  const bg = hero?.image_url || 'https://images.unsplash.com/photo-1588334488081-06fca9a234f9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080';
  const title = hero?.title || 'Real Estate Intelligence for Modern Africa';
  const subtitle = hero?.subtitle || 'Trusted guidance for property financing, land documentation, and investment strategy—built on integrity, competence, and data-driven insight.';

  return (
    <div className="relative min-h-screen flex items-center pt-16">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <ImageWithFallback
          src={bg}
          alt="Yaoundé Cameroon Cityscape"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-royal-blue/95 via-royal-blue/85 to-royal-blue/60"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="max-w-4xl">
          <h1 className="text-white mb-8 font-montserrat" style={{ fontSize: '3.5rem', fontWeight: 800, lineHeight: '1.1', letterSpacing: '-0.02em' }}>
            {title}
          </h1>
          
          <p className="text-gray-200 mb-12 max-w-3xl font-inter" style={{ fontSize: '1.25rem', lineHeight: '1.7' }}>
            {subtitle}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={() => setCurrentPage("contact")}
              className="inline-flex items-center justify-center px-8 py-4 bg-gold text-royal-blue rounded-lg hover:bg-gold-dark transition-all shadow-lg hover:shadow-xl font-inter"
              style={{ fontWeight: 600 }}
            >
              {hero?.cta_text || 'Book a Free Consultation'}
              <ArrowRight className="ml-2 w-5 h-5" />
            </button>
            <button 
              onClick={() => setCurrentPage("services")}
              className="inline-flex items-center justify-center px-8 py-4 bg-white/10 text-white border-2 border-white/30 rounded-lg hover:bg-white/20 transition-all backdrop-blur-sm font-inter"
              style={{ fontWeight: 600 }}
            >
              Explore Services
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
