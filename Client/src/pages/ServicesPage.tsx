import { FileText, Building, ShieldCheck, Home, Globe, Users, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ScrollReveal } from "../components/animations/ScrollReveal";
import { useLanguage } from "../i18n/LanguageContext";

export function ServicesPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const servicesList = [
    {
      icon: FileText,
      title: t.services_page.items.loan.title,
      description: t.services_page.items.loan.desc,
      path: "/services/loan-assistance"
    },
    {
      icon: Building,
      title: t.services_page.items.docs.title,
      description: t.services_page.items.docs.desc,
      path: "/services/documentation"
    },
    {
      icon: ShieldCheck,
      title: t.services_page.items.verification.title,
      description: t.services_page.items.verification.desc,
      path: "/services/verification"
    },
    {
      icon: Home,
      title: t.services_page.items.rental.title,
      description: t.services_page.items.rental.desc,
      path: "/services/rental-management"
    },
    {
      icon: Globe,
      title: t.services_page.items.diaspora.title,
      description: t.services_page.items.diaspora.desc,
      path: "/services/diaspora-strategy"
    },
    {
      icon: Users,
      title: t.services_page.items.acquisition.title,
      description: t.services_page.items.acquisition.desc,
      path: "/listings"
    }
  ];

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative bg-primary py-24 overflow-hidden">
        <div className="absolute inset-0 bg-slate-900/50" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h5 className="text-accent font-semibold tracking-widest uppercase mb-4 animate-fade-in-up">
            {t.services_page.hero.tag}
          </h5>
          <h1 className="font-heading font-bold text-4xl md:text-5xl text-white mb-6 animate-fade-in-up delay-100">
            {t.services_page.hero.title}
          </h1>
          <p className="text-xl text-slate-300 animate-fade-in-up delay-200">
            {t.services_page.hero.desc}
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {servicesList.map((service, index) => {
              const Icon = service.icon;
              return (
                <ScrollReveal key={index} staggerIndex={index} className="h-full">
                  <div
                    className="p-8 bg-white rounded-2xl shadow-sm border border-slate-100 hover:border-accent hover:shadow-xl hover:-translate-y-1 hover:scale-[1.03] transition-all duration-300 cursor-pointer group flex flex-col h-full"
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
                      <span>{t.services_page.explore}</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
