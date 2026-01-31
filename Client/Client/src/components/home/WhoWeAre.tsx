import { CheckCircle2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import api from "../../api";

export function WhoWeAre() {
  const [isVisible, setIsVisible] = useState(false);
  const [items, setItems] = useState<any[]>([]);
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
    api.get('/api/who-we-are/').then((data) => {
      if (!mounted) return;
      setItems(data || []);
    }).catch((err) => console.error(err));
    return () => { mounted = false };
  }, []);

  return (
    <section ref={sectionRef} className="py-24 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className={`text-royal-blue mb-6 font-montserrat transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`} style={{ fontSize: '2.5rem', fontWeight: 700 }}>
            Why REI Consulting Firm
          </h2>
          
          <p className={`text-slate mb-8 font-inter transition-all duration-700 delay-100 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`} style={{ fontSize: '1.125rem', lineHeight: '1.8' }}>
            A modern real estate consulting firm based in Yaoundé—helping you navigate the property market with clarity and confidence.
          </p>

          <p className={`text-slate mb-8 font-inter transition-all duration-700 delay-200 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`} style={{ fontSize: '1.125rem', lineHeight: '1.8' }}>
            At REI Consulting Firm, we simplify real estate for individuals, diaspora investors, and businesses. Whether you're securing a loan, verifying land documents, or building an investment portfolio, we bring expertise, transparency, and professionalism to every step.
          </p>

          <h3 className={`text-royal-blue mb-8 font-montserrat transition-all duration-700 delay-300 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`} style={{ fontSize: '1.5rem', fontWeight: 600 }}>
            What sets us apart:
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {items.map((item, index) => (
              <div 
                key={item.id || index} 
                className={`flex items-start gap-3 p-6 bg-ivory rounded-lg border border-gold/20 hover:border-gold hover:shadow-lg transition-all duration-500 hover:scale-105 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${400 + index * 150}ms` }}
              >
                <CheckCircle2 className="w-6 h-6 text-emerald flex-shrink-0 mt-1" />
                <span className="text-royal-blue font-inter text-left" style={{ fontSize: '1rem', lineHeight: '1.6' }}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}