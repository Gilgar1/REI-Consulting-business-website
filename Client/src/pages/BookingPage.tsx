import { useSearchParams } from 'react-router-dom';
import { CalendlyEmbed } from '../components/CalendlyEmbed';
import { Calendar, ShieldCheck, CheckCircle2, Phone, Clock, FileCheck } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

export function BookingPage() {
  const [searchParams] = useSearchParams();
  const name = searchParams.get('name') || '';
  const email = searchParams.get('email') || '';
  const score = searchParams.get('score');
  const { language } = useLanguage();

  return (
    <div className="min-h-screen bg-surface flex flex-col font-sans">
      {/* Hero Header */}
      <section className="bg-primary text-white py-16 md:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#d97706_1px,transparent_1px)] [background-size:24px_24px] opacity-10" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-accent font-semibold text-xs mb-4">
            <Calendar className="w-3.5 h-3.5" />
            {language === 'fr' ? 'Session Stratégique Directe' : 'Direct Strategy Session'}
          </div>

          <h1 className="font-heading font-bold text-3xl sm:text-4xl md:text-5xl text-white mb-4">
            {language === 'fr' ? 'Réservez Votre Consultation Gratuite' : 'Book Your Free Consultation'}
          </h1>
          <p className="text-slate-300 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            {language === 'fr'
              ? 'Échangez directement avec Ndah Gilgar M. pour structurer votre dossier CFC, vérifier vos titres fonciers et sécuriser votre investissement au Cameroun.'
              : 'Speak directly with Ndah Gilgar M. to structure your CFC mortgage file, verify land titles, and safeguard your property acquisition in Cameroon.'}
          </p>

          {score && (
            <div className="mt-4 inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-4 py-1.5 rounded-full text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              {language === 'fr' ? `Éligibilité validée : score ${score}/100` : `Eligibility Confirmed: Score ${score}/100`}
            </div>
          )}
        </div>
      </section>

      {/* Main Booking Container */}
      <section className="py-12 md:py-16 -mt-8 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Trust & Preparation Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-5">
              <h2 className="font-heading font-bold text-lg text-primary flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-accent" />
                {language === 'fr' ? 'Ce que nous abordons' : 'What We Cover'}
              </h2>

              <ul className="space-y-3.5 text-sm text-slate-600">
                <li className="flex items-start gap-3">
                  <FileCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>
                    <strong>{language === 'fr' ? 'Montage de dossier CFC' : 'CFC Mortgage Structuring'}:</strong>{' '}
                    {language === 'fr' ? 'Examen de vos pièces et conformité de votre apport.' : 'Review of required documents, salary domiciliation & equity.'}
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <ShieldCheck className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                  <span>
                    <strong>{language === 'fr' ? 'Sécurité Foncière' : 'Title & Due Diligence'}:</strong>{' '}
                    {language === 'fr' ? 'Vérification du Titre Foncier et élimination des risques de double vente.' : 'Validation of land titles, certificates and fraud prevention.'}
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                  <span>
                    <strong>{language === 'fr' ? 'Format & Durée' : 'Format & Timing'}:</strong>{' '}
                    {language === 'fr' ? '30 minutes en visio (Google Meet/WhatsApp) ou en agence à Yaoundé.' : '30-minute private video call (Google Meet/WhatsApp) or in-person in Yaoundé.'}
                  </span>
                </li>
              </ul>

              <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-accent/10 text-accent flex items-center justify-center font-bold text-sm">
                  NG
                </div>
                <div>
                  <p className="text-xs font-bold text-primary">Ndah Gilgar M.</p>
                  <p className="text-[11px] text-slate-500">{language === 'fr' ? 'Fondateur & Consultant Foncier' : 'Founder & Lead Strategist'}</p>
                </div>
              </div>
            </div>

            {/* Quick Contact fallback */}
            <div className="bg-slate-900 text-white p-6 rounded-2xl space-y-3">
              <p className="text-xs uppercase tracking-wider text-accent font-bold">
                {language === 'fr' ? 'Besoin d\'un créneau urgent ?' : 'Need an immediate time?'}
              </p>
              <p className="text-xs text-slate-300 leading-relaxed">
                {language === 'fr'
                  ? 'Contactez directement notre cabinet par téléphone ou WhatsApp :'
                  : 'Contact our office directly via phone or WhatsApp:'}
              </p>
              <a
                href="https://wa.me/237681478111"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-bold text-white hover:text-accent transition-colors"
              >
                <Phone className="w-4 h-4 text-accent" />
                +237 681 478 111
              </a>
            </div>
          </div>

          {/* Calendly Inline Widget Embed */}
          <div className="lg:col-span-8">
            <CalendlyEmbed
              prefill={{
                name,
                email,
              }}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
