import { Shield, Award, Laptop, UserCheck, Languages, AlertTriangle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import api from "../../api";

export function WhyChooseUs() {
  const [isVisible, setIsVisible] = useState(false);
  const [reasons, setReasons] = useState<any[]>([]);
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
    api.get('/api/why-choose/').then((data) => {
      if (!mounted) return;
      setReasons(data || []);
    }).catch((err) => console.error(err));
    return () => { mounted = false };
  }, []);

  return (
    <section ref={sectionRef} className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-16 transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <h2 className="text-royal-blue mb-4 font-montserrat" style={{ fontSize: '2.5rem', fontWeight: 700 }}>
            How We Work
          </h2>
          <p className="text-slate font-inter mb-2" style={{ fontSize: '1.125rem' }}>
            Simple. Transparent. Professional.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-16 max-w-5xl mx-auto">
          {["Book a free consultation", "Discuss your goals", "We assess the best solution", "We support you from start to finish"].map((step, index) => (
            <div 
              key={index} 
              className={`text-center transition-all duration-700 hover:scale-110 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="w-16 h-16 bg-gold rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg hover:shadow-gold/50 transition-shadow">
                <span className="text-royal-blue font-montserrat" style={{ fontSize: '1.5rem', fontWeight: 700 }}>{index + 1}</span>
              </div>
              <p className="text-slate font-inter" style={{ fontSize: '0.95rem', lineHeight: '1.5' }}>{step}</p>
            </div>
          ))}
        </div>

        <div className={`text-center mb-12 transition-all duration-700 delay-400 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <h3 className="text-royal-blue mb-8 font-montserrat" style={{ fontSize: '2rem', fontWeight: 700 }}>
            Why Choose REI Consulting Firm
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reasons.map((reason: any, index: number) => {
            const Icon = [Shield, Award, Laptop, UserCheck, Languages, AlertTriangle][index % 6];
            return (
              <div
                key={reason.id || index}
                className={`flex gap-4 p-6 bg-ivory rounded-lg border border-gold/20 hover:border-gold hover:shadow-xl transition-all duration-500 hover:scale-105 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${500 + index * 100}ms` }}
              >
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gold/20 rounded-lg flex items-center justify-center hover:bg-gold/30 transition-colors">
                    <Icon className="w-6 h-6 text-royal-blue" />
                  </div>
                </div>
                <div>
                  <h4 className="text-royal-blue mb-2 font-montserrat" style={{ fontSize: '1rem', fontWeight: 600 }}>
                    {reason.title}
                  </h4>
                  <p className="text-slate font-inter" style={{ fontSize: '0.875rem', lineHeight: '1.6' }}>
                    {reason.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
