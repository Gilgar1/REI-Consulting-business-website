import { Target, Eye, Award, User, Lightbulb, CheckCircle2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import architectImg from "../assets/architect.jpg";
import { ScrollReveal } from "../components/animations/ScrollReveal";
import { useLanguage } from "../i18n/LanguageContext";

export function AboutPage() {
  const { t } = useLanguage();

  const valuesList = [
    {
      icon: Award,
      title: t.about.values.integrity.title,
      description: t.about.values.integrity.desc
    },
    {
      icon: Lightbulb,
      title: t.about.values.competence.title,
      description: t.about.values.competence.desc
    },
    {
      icon: User,
      title: t.about.values.professionalism.title,
      description: t.about.values.professionalism.desc
    },
    {
      icon: Eye,
      title: t.about.values.transparency.title,
      description: t.about.values.transparency.desc
    },
    {
      icon: Target,
      title: t.about.values.technology.title,
      description: t.about.values.technology.desc
    }
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-primary py-24 lg:py-32 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-slate-800/20 skew-x-12 translate-x-20" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <h5 className="text-accent font-semibold tracking-widest uppercase mb-4 animate-fade-in-up">
              {t.about.who_we_are}
            </h5>
            <h1 className="font-heading font-bold text-4xl sm:text-5xl lg:text-6xl text-white mb-6 leading-tight animate-fade-in-up delay-100">
              {t.about.title_prefix} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-amber-300">
                {t.about.title_highlight}
              </span>
            </h1>
            <p className="text-xl text-slate-300 leading-relaxed mb-8 max-w-2xl animate-fade-in-up delay-200">
              {t.about.description}
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision Grid */}
      <section className="py-24 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Mission Card */}
            <div className="bg-white p-10 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 hover:-translate-y-2 transition-transform duration-500 group">
              <div className="w-16 h-16 bg-primary/5 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-accent group-hover:text-white transition-colors duration-300">
                <Target className="w-8 h-8 text-primary group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-2xl font-heading font-bold text-primary mb-4">{t.about.mission.title}</h3>
              <p className="text-slate-600 leading-relaxed text-lg">
                {t.about.mission.desc}
              </p>
            </div>

            {/* Vision Card */}
            <div className="bg-white p-10 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 hover:-translate-y-2 transition-transform duration-500 group">
              <div className="w-16 h-16 bg-primary/5 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-accent group-hover:text-white transition-colors duration-300">
                <Eye className="w-8 h-8 text-primary group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-2xl font-heading font-bold text-primary mb-4">{t.about.vision.title}</h3>
              <p className="text-slate-600 leading-relaxed text-lg">
                {t.about.vision.desc}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Founder Section (Asymmetrical) */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">

            {/* Image Side */}
            <div className="w-full lg:w-5/12 relative">
              <div className="absolute inset-0 bg-accent/20 rounded-3xl transform rotate-6 translate-x-4 translate-y-4" />
              <div className="relative bg-primary rounded-3xl overflow-hidden shadow-2xl aspect-[4/5] group">
                <img
                  src={architectImg}
                  alt={t.about.founder.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                <div className="absolute inset-0 flex flex-col justify-end items-center text-white text-center p-6 pb-2">
                  <h4 className="font-heading font-bold text-2xl mb-1 text-accent">{t.about.founder.name}</h4>
                  <p className="text-accent font-medium text-sm tracking-wide uppercase mb-4">{t.about.founder.role}</p>
                  <p className="text-sm text-slate-200 italic opacity-90">"{t.about.founder.quote}"</p>
                </div>
              </div>
            </div>

            {/* Content Side */}
            <div className="w-full lg:w-7/12 space-y-8">
              <h2 className="text-4xl lg:text-5xl font-heading font-bold text-primary leading-tight">
                {t.about.founder.title_prefix} <br /><span className="text-accent">{t.about.founder.title_highlight}</span>
              </h2>

              <div className="space-y-6 text-lg text-slate-600 leading-relaxed">
                <p>{t.about.founder.p1}</p>
                <p>{t.about.founder.p2}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                {t.about.founder.points.map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-accent" />
                    <span className="font-medium text-primary">{item}</span>
                  </div>
                ))}
              </div>

              <div className="pt-8">
                <Link to="/book" className="inline-flex items-center gap-2 text-accent font-bold hover:gap-4 transition-all duration-300">
                  {t.about.founder.cta} <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Values Grid */}
      <section className="py-24 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-heading font-bold text-primary mb-4">{t.about.values.title}</h2>
            <p className="text-slate-600">{t.about.values.subtitle}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {valuesList.map((value, index) => {
              const Icon = value.icon;
              return (
                <ScrollReveal key={index} staggerIndex={index} className="h-full">
                  <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg hover:scale-[1.03] transition-all duration-300 h-full">
                    <div className="w-12 h-12 bg-primary/5 rounded-xl flex items-center justify-center mb-6 text-primary">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-primary mb-3">{value.title}</h3>
                    <p className="text-slate-600 leading-relaxed">{value.description}</p>
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
