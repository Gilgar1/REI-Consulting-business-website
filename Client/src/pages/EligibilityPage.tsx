import { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import {
  calculateEligibility,
  ScoreInput,
  EligibilityResult,
} from '../config/eligibilityScoring';
import {
  calculateLoan,
  formatFCFA,
  formatNumberOnly,
  parseFormattedNumber,
} from '../utils/loanEngine';
import { generateEligibilityReportPDF } from '../utils/pdfGenerator';
import { useLanguage } from '../i18n/LanguageContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Slider } from '../components/ui/slider';
import {
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Building,
  Home,
  Download,
  Calendar,
  Phone,
  FileCheck,
  TrendingUp,
  Percent,
  Sparkles,
  HelpCircle,
  Loader2,
  Lock,
  Hammer,
  MapPin,
  Globe,
  Search,
  ChevronDown
} from 'lucide-react';

export const COUNTRIES_LIST = [
  { code: 'CM', nameEn: 'Cameroon', nameFr: 'Cameroun', flag: '🇨🇲' },
  { code: 'FR', nameEn: 'France', nameFr: 'France', flag: '🇫🇷' },
  { code: 'US', nameEn: 'United States', nameFr: 'États-Unis', flag: '🇺🇸' },
  { code: 'CA', nameEn: 'Canada', nameFr: 'Canada', flag: '🇨🇦' },
  { code: 'GB', nameEn: 'United Kingdom', nameFr: 'Royaume-Uni', flag: '🇬🇧' },
  { code: 'BE', nameEn: 'Belgium', nameFr: 'Belgique', flag: '🇧🇪' },
  { code: 'DE', nameEn: 'Germany', nameFr: 'Allemagne', flag: '🇩🇪' },
  { code: 'IT', nameEn: 'Italy', nameFr: 'Italie', flag: '🇮🇹' },
  { code: 'CH', nameEn: 'Switzerland', nameFr: 'Suisse', flag: '🇨🇭' },
  { code: 'ES', nameEn: 'Spain', nameFr: 'Espagne', flag: '🇪🇸' },
  { code: 'AE', nameEn: 'United Arab Emirates', nameFr: 'Émirats Arabes Unis', flag: '🇦🇪' },
  { code: 'GA', nameEn: 'Gabon', nameFr: 'Gabon', flag: '🇬🇦' },
  { code: 'GQ', nameEn: 'Equatorial Guinea', nameFr: 'Guinée Équatoriale', flag: '🇬🇶' },
  { code: 'TD', nameEn: 'Chad', nameFr: 'Tchad', flag: '🇹🇩' },
  { code: 'CG', nameEn: 'Republic of the Congo', nameFr: 'Congo-Brazzaville', flag: '🇨🇬' },
  { code: 'CD', nameEn: 'DR Congo', nameFr: 'RD Congo', flag: '🇨🇩' },
  { code: 'CI', nameEn: 'Ivory Coast', nameFr: 'Côte d’Ivoire', flag: '🇨🇮' },
  { code: 'SN', nameEn: 'Senegal', nameFr: 'Sénégal', flag: '🇸🇳' },
  { code: 'NG', nameEn: 'Nigeria', nameFr: 'Nigéria', flag: '🇳🇬' },
  { code: 'ZA', nameEn: 'South Africa', nameFr: 'Afrique du Sud', flag: '🇿🇦' },
  { code: 'CN', nameEn: 'China', nameFr: 'Chine', flag: '🇨🇳' },
  { code: 'NL', nameEn: 'Netherlands', nameFr: 'Pays-Bas', flag: '🇳🇱' },
  { code: 'SE', nameEn: 'Sweden', nameFr: 'Suède', flag: '🇸🇪' },
  { code: 'NO', nameEn: 'Norway', nameFr: 'Norvège', flag: '🇳🇴' },
  { code: 'LU', nameEn: 'Luxembourg', nameFr: 'Luxembourg', flag: '🇱🇺' },
  { code: 'AU', nameEn: 'Australia', nameFr: 'Australie', flag: '🇦🇺' },
  { code: 'BR', nameEn: 'Brazil', nameFr: 'Brésil', flag: '🇧🇷' },
  { code: 'OTHER', nameEn: 'Other Country', nameFr: 'Autre pays', flag: '🌐' },
];

export const CAMEROON_REGIONS = [
  { id: 'Centre', en: 'Centre (Yaoundé, Mbalmayo...)', fr: 'Centre (Yaoundé, Mbalmayo...)' },
  { id: 'Littoral', en: 'Littoral (Douala, Edéa...)', fr: 'Littoral (Douala, Edéa...)' },
  { id: 'Ouest', en: 'West / Ouest (Bafoussam, Dschang...)', fr: 'Ouest (Bafoussam, Dschang...)' },
  { id: 'Sud-Ouest', en: 'South-West (Buea, Limbe, Kumba...)', fr: 'Sud-Ouest (Buea, Limbe, Kumba...)' },
  { id: 'Nord-Ouest', en: 'North-West (Bamenda...)', fr: 'Nord-Ouest (Bamenda...)' },
  { id: 'Sud', en: 'South / Sud (Kribi, Ebolowa...)', fr: 'Sud (Kribi, Ebolowa...)' },
  { id: 'Adamaoua', en: 'Adamawa / Adamaoua (Ngaoundéré...)', fr: 'Adamaoua (Ngaoundéré...)' },
  { id: 'Nord', en: 'North / Nord (Garoua...)', fr: 'Nord (Garoua...)' },
  { id: 'Extreme-Nord', en: 'Far North / Extrême-Nord (Maroua...)', fr: 'Extrême-Nord (Maroua...)' },
  { id: 'Est', en: 'East / Est (Bertoua...)', fr: 'Est (Bertoua...)' },
];

interface FormData {
  language: 'en' | 'fr';
  projectType: 'buy' | 'build' | 'buy_renovate';
  propertyPurpose: 'residential' | 'rental' | 'development';
  propertyRegion: string;
  hasTitle: boolean;
  projectCost: number;
  ownFunds: number;
  expectedMonthlyRent: number;
  totalSavings: number;
  age: number;
  employmentType: 'salaried' | 'self-employed';
  monthlyIncome: number;
  monthlyDebt: number;
  totalDebt: number;
  residenceType: 'cameroon' | 'diaspora';
  residenceCountry: string;
  location: string;
  // Contact & Unlock
  title: string;
  fullName: string;
  phone: string;
  email: string;
  consent: boolean;
}

export function EligibilityPage() {
  const { language, setLanguage } = useLanguage();

  const [step, setStep] = useState<number>(0); // 0: Landing, 1: Project, 2: Financials, 3: Profile & Debt, 4: Contact & Submit, 5: Results
  const [submitting, setSubmitting] = useState(false);
  const [downloadingPDF, setDownloadingPDF] = useState(false);

  // Country dropdown state for Diaspora selection
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [countrySearchQuery, setCountrySearchQuery] = useState('');

  // Region dropdown state for Cameroon property location selection
  const [isRegionDropdownOpen, setIsRegionDropdownOpen] = useState(false);
  const [regionSearchQuery, setRegionSearchQuery] = useState('');

  // Form State with sensible Cameroon real estate defaults
  const [formData, setFormData] = useState<FormData>({
    language: (language as 'en' | 'fr') || 'en',
    projectType: 'buy',
    propertyPurpose: 'residential',
    propertyRegion: 'Centre',
    hasTitle: true,
    projectCost: 35000000, // 35M FCFA
    ownFunds: 10000000, // 10M FCFA
    expectedMonthlyRent: 250000,
    totalSavings: 4000000,
    age: 34,
    employmentType: 'salaried',
    monthlyIncome: 0, // Starts at 0 per user requirement (no minimum floor)
    monthlyDebt: 0,
    totalDebt: 0,
    residenceType: 'cameroon',
    residenceCountry: 'Cameroon',
    location: 'In Cameroon (Resident)',
    title: 'Mr',
    fullName: '',
    phone: '',
    email: '',
    consent: true,
  });

  // Sync formData.language whenever global language changes
  useEffect(() => {
    setFormData((prev) => ({ ...prev, language: (language as 'en' | 'fr') || 'en' }));
  }, [language]);

  const [result, setResult] = useState<EligibilityResult | null>(null);

  // Interactive embedded simulator state on results screen
  const [simTerm, setSimTerm] = useState<number>(20);
  const [simContribution, setSimContribution] = useState<number>(10000000);

  const handleLangChange = (lang: 'en' | 'fr') => {
    setFormData((prev) => ({ ...prev, language: lang }));
    setLanguage(lang);
  };

  const updateField = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNextStep = () => {
    // Validation for Step 3: Monthly Income begins at 0 with no minimum floor
    if (step === 3) {
      if (
        formData.monthlyIncome === undefined ||
        formData.monthlyIncome === null ||
        formData.monthlyIncome < 0 ||
        Number.isNaN(formData.monthlyIncome)
      ) {
        alert(
          formData.language === 'fr'
            ? 'Veuillez renseigner votre revenu net mensuel (commence à 0 FCFA).'
            : 'Please enter your monthly net income (begins at 0 FCFA).'
        );
        return;
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setStep((prev) => prev + 1);
  };

  const handlePrevStep = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setStep((prev) => Math.max(0, prev - 1));
  };

  const handleSubmitAssessment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.phone.trim()) {
      alert(language === 'fr' ? 'Veuillez renseigner votre nom et votre numéro de téléphone.' : 'Please enter your name and phone number.');
      return;
    }

    if (!formData.consent) {
      alert(language === 'fr' ? 'Veuillez accepter les conditions de confidentialité.' : 'Please agree to the privacy and storage terms.');
      return;
    }

    setSubmitting(true);

    const formattedLocation =
      formData.residenceType === 'cameroon'
        ? (formData.language === 'fr' ? 'Au Cameroun (Résident)' : 'In Cameroon (Resident)')
        : `Diaspora - ${formData.residenceCountry || 'Abroad'}`;

    // Compute Eligibility Score & Matched Product
    const scoreInput: ScoreInput = {
      projectType: formData.projectType,
      propertyPurpose: formData.propertyPurpose,
      propertyRegion: formData.propertyRegion,
      hasTitle: formData.hasTitle,
      projectCost: formData.projectCost,
      ownFunds: formData.ownFunds,
      totalDebt: formData.monthlyDebt,
      totalSavings: formData.totalSavings,
      age: formData.age,
      monthlyIncome: formData.monthlyIncome,
      employmentType: formData.employmentType,
      location: formattedLocation,
      residenceType: formData.residenceType,
      residenceCountry: formData.residenceCountry,
    };

    const evalResult = calculateEligibility(scoreInput);
    setResult(evalResult);
    const maxRetireTerm = Math.min(evalResult.matchedProduct.maxTermYears, Math.max(1, 65 - formData.age));
    setSimTerm(maxRetireTerm);
    setSimContribution(formData.ownFunds);

    // Store Submission in Supabase eligibility_leads table
    try {
      const payload = {
        full_name: formData.fullName.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim() || null,
        language: formData.language,
        project_type: formData.projectType,
        property_purpose: formData.propertyPurpose,
        property_region: formData.propertyRegion,
        has_title: formData.hasTitle,
        project_cost: formData.projectCost,
        own_funds: formData.ownFunds,
        total_debt: formData.monthlyDebt,
        total_savings: formData.totalSavings,
        age: formData.age,
        monthly_income: formData.monthlyIncome,
        employment_type: formData.employmentType,
        location: formattedLocation,
        matched_loan_type: evalResult.matchedProduct.label.en,
        score: evalResult.score,
        band: evalResult.band,
        followed_up: false,
      };

      const { error } = await supabase.from('eligibility_leads').insert([payload]);
      if (error) {
        console.warn('Notice while storing lead in Supabase:', error.message);
      }
    } catch (err) {
      console.error('Lead storage error:', err);
    } finally {
      setSubmitting(false);
      setStep(5); // Go to results view
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleDownloadPDF = async () => {
    if (!result) return;
    try {
      setDownloadingPDF(true);
      await generateEligibilityReportPDF(
        {
          title: formData.title,
          name: formData.fullName,
          phone: formData.phone,
          email: formData.email,
        },
        result,
        formData.language
      );
    } catch (err) {
      console.error('Error generating PDF:', err);
    } finally {
      setDownloadingPDF(false);
    }
  };

  // Live embedded simulation on results screen
  const simResult = result
    ? calculateLoan({
        propertyPrice: formData.projectCost,
        contributionPct: formData.projectCost > 0 ? simContribution / formData.projectCost : 0.20,
        annualInterestRate: result.matchedProduct.annualInterestRate,
        termYears: simTerm,
        expectedMonthlyRent: formData.propertyPurpose === 'rental' ? formData.expectedMonthlyRent : undefined,
      })
    : null;

  return (
    <div className="min-h-screen bg-surface flex flex-col font-sans">
      {/* Top Header / Progress Bar */}
      <header className="bg-primary text-white py-4 px-4 sm:px-6 sticky top-0 z-40 shadow-md">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link to="/" className="text-white font-heading font-bold text-sm sm:text-base flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse" />
            REI Consulting
          </Link>

          {step > 0 && step < 5 && (
            <div className="flex items-center gap-2 text-xs text-slate-300 font-medium">
              <span>{language === 'fr' ? `Étape ${step} sur 4` : `Step ${step} of 4`}</span>
            </div>
          )}

          {/* Language Toggle */}
          <div className="flex items-center gap-1 bg-white/10 rounded-lg p-0.5 text-xs font-semibold">
            <button
              type="button"
              onClick={() => handleLangChange('en')}
              className={`px-2 py-1 rounded ${formData.language === 'en' ? 'bg-accent text-white' : 'text-slate-300'}`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => handleLangChange('fr')}
              className={`px-2 py-1 rounded ${formData.language === 'fr' ? 'bg-accent text-white' : 'text-slate-300'}`}
            >
              FR
            </button>
          </div>
        </div>

        {/* Progress Line */}
        {step > 0 && step < 5 && (
          <div className="max-w-4xl mx-auto mt-3 h-1 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-accent transition-all duration-300"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        )}
      </header>

      {/* Main Body */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-8 md:py-12">
        {/* ==================================================================== */}
        {/* STEP 0: LANDING SCREEN                                              */}
        {/* ==================================================================== */}
        {step === 0 && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-100 shadow-xl shadow-slate-200/50 space-y-8 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 text-accent font-semibold text-xs border border-amber-500/20">
              <Sparkles className="w-3.5 h-3.5" />
              {formData.language === 'fr' ? 'Évaluation Prêt CFC en 3 Minutes par REI Consulting' : '3-Minute CFC Mortgage Readiness Check by REI Consulting'}
            </div>

            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-extrabold text-primary leading-tight">
                {formData.language === 'fr' ? (
                  <>
                    Pouvez-vous financer un bien comme celui-ci avec un <span className="text-accent">prêt immobilier CFC</span> ?
                  </>
                ) : (
                  <>
                    Can you finance a property like this with a <span className="text-accent">CFC Mortgage</span>?
                  </>
                )}
              </h1>
              <p className="text-slate-600 text-base md:text-lg leading-relaxed">
                {formData.language === 'fr'
                  ? 'Découvrez comment votre profil et votre projet se comparent aux critères d\'octroi du Crédit Foncier du Cameroun. Obtenez une estimation de votre score d\'éligibilité, une estimation de votre mensualité et une feuille de route sur mesure.'
                  : 'Find out how your profile and project compare with Crédit Foncier du Cameroun lending criteria. Get an estimated eligibility score, estimated monthly payment, and a tailored roadmap.'}
              </p>
            </div>

            {/* What you will get */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-3.5">
              <h3 className="font-heading font-bold text-sm text-primary uppercase tracking-wider">
                {formData.language === 'fr' ? 'Ce que vous obtiendrez :' : 'What You Will Receive:'}
              </h3>
              <ul className="space-y-2.5 text-sm text-slate-700">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>
                    <strong>{formData.language === 'fr' ? 'Votre score d\'éligibilité estimé' : 'Your Estimated Eligibility Score'}</strong> :{' '}
                    {formData.language === 'fr' ? 'noté sur 100 points selon les ratios bancaires publiés.' : 'scored on 100 points against published lending ratios.'}
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>
                    <strong>{formData.language === 'fr' ? 'Produit de prêt CFC probable' : 'Likely CFC Loan Product'}</strong> :{' '}
                    {formData.language === 'fr' ? 'Jeune, Social, Acquéreur ou Locatif, selon votre projet.' : 'Youth, Social, Purchase, or Rental, based on your project.'}
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>
                    <strong>{formData.language === 'fr' ? 'Mensualité estimée' : 'Estimated Monthly Payment'}</strong> :{' '}
                    {formData.language === 'fr' ? 'simulateur interactif en direct avec flux de trésorerie net de location.' : 'interactive live simulator with net rental cash flow.'}
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>
                    <strong>{formData.language === 'fr' ? 'Rapport PDF personnel' : 'Personal PDF Report'}</strong> :{' '}
                    {formData.language === 'fr' ? 'synthèse téléchargeable avec recommandations pour atteindre 80%+.' : 'downloadable summary with recommendations to reach 80%+.'}
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                  <span>
                    <strong>{formData.language === 'fr' ? 'Prochaine étape' : 'Next Step'}</strong> :{' '}
                    {formData.language === 'fr' ? 'si vous êtes éligible, réservez une consultation avec Ndah Gilgar Mbuh pour planifier votre demande de prêt CFC.' : 'if you\'re eligible, book a consultation with Ndah Gilgar Mbuh to plan your CFC loan application.'}
                  </span>
                </li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Button
                onClick={() => setStep(1)}
                size="lg"
                className="w-full sm:w-auto px-8 py-6 text-base bg-accent hover:bg-accent/90 text-white rounded-full font-bold shadow-lg shadow-accent/25 flex items-center justify-center gap-2 group"
              >
                <span>{formData.language === 'fr' ? 'Commencer mon évaluation gratuite' : 'Start My Free Eligibility Check'}</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>

            <p className="text-xs text-slate-400 italic flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 shrink-0" />
              {formData.language === 'fr'
                ? 'Il s\'agit d\'un outil indépendant créé par REI Consulting et non d\'un outil officiel du CFC. Les résultats sont des estimations et non une décision de prêt. L\'éligibilité finale est décidée par le CFC.'
                : 'This is an independent tool by REI Consulting, not an official CFC tool. Results are estimates, not a loan decision. Final eligibility is decided by CFC.'}
            </p>
          </div>
        )}

        {/* ==================================================================== */}
        {/* STEP 1: PROJECT BASICS                                               */}
        {/* ==================================================================== */}
        {step === 1 && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-100 shadow-xl space-y-6 animate-fade-in-up">
            <div>
              <span className="text-xs uppercase font-bold text-accent tracking-wider">
                {formData.language === 'fr' ? 'Étape 1 : Votre Projet Foncier' : 'Step 1: Your Real Estate Project'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-heading font-bold text-primary mt-1">
                {formData.language === 'fr' ? 'Quelle est la nature de votre projet ?' : 'What type of project are you planning?'}
              </h2>
            </div>

            {/* Project Type: Buy vs Build vs Buy & Renovate */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                {formData.language === 'fr' ? '1. Type d\'opération' : '1. Project Type'}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => updateField('projectType', 'buy')}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    formData.projectType === 'buy'
                      ? 'border-accent bg-amber-50/40 ring-2 ring-accent text-primary'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  <Home className="w-6 h-6 text-accent mb-2" />
                  <p className="font-bold text-sm">{formData.language === 'fr' ? 'Acheter un bien' : 'Buy a Property'}</p>
                  <p className="text-xs text-slate-500 mt-1">{formData.language === 'fr' ? 'Terrain ou logement déjà construit' : 'Land or finished home'}</p>
                </button>

                <button
                  type="button"
                  onClick={() => updateField('projectType', 'build')}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    formData.projectType === 'build'
                      ? 'border-accent bg-amber-50/40 ring-2 ring-accent text-primary'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  <Building className="w-6 h-6 text-accent mb-2" />
                  <p className="font-bold text-sm">{formData.language === 'fr' ? 'Construire' : 'Build from Scratch'}</p>
                  <p className="text-xs text-slate-500 mt-1">{formData.language === 'fr' ? 'Chantier de construction neuve' : 'New build on raw land'}</p>
                </button>

                <button
                  type="button"
                  onClick={() => updateField('projectType', 'buy_renovate')}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    formData.projectType === 'buy_renovate'
                      ? 'border-accent bg-amber-50/40 ring-2 ring-accent text-primary'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  <Hammer className="w-6 h-6 text-accent mb-2" />
                  <p className="font-bold text-sm">{formData.language === 'fr' ? 'Acheter et Rénover' : 'Buy and Renovate'}</p>
                  <p className="text-xs text-slate-500 mt-1">{formData.language === 'fr' ? 'Acquisition + enveloppe de travaux' : 'Purchase + renovation budget'}</p>
                </button>
              </div>
            </div>

            {/* Property Purpose */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                {formData.language === 'fr' ? '2. Destination du bien' : '2. Property Purpose'}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: 'residential', en: 'Personal Home', fr: 'Résidence Personnelle', descEn: 'For you and your family', descFr: 'Habitation principale' },
                  { id: 'rental', en: 'Rental Property', fr: 'Investissement Locatif', descEn: 'Generate monthly rent', descFr: 'Immeuble de rapport' },
                  { id: 'development', en: 'Real Estate Development', fr: 'Promotion Immobilière', descEn: 'Commercial/lot sale', descFr: 'Aménagement pour revente' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => updateField('propertyPurpose', item.id)}
                    className={`p-3.5 rounded-xl border text-left transition-all ${
                      formData.propertyPurpose === item.id
                        ? 'border-accent bg-amber-50/40 ring-2 ring-accent text-primary'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <p className="font-bold text-sm">{formData.language === 'fr' ? item.fr : item.en}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{formData.language === 'fr' ? item.descFr : item.descEn}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Property Location: Region in Cameroon (Searchable) */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-accent" />
                <span>{formData.language === 'fr' ? '3. Localisation du bien (Région au Cameroun)' : '3. Property Location (Region in Cameroon)'}</span>
              </label>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsRegionDropdownOpen(!isRegionDropdownOpen)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold flex items-center justify-between text-left focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  <span className="text-slate-800">
                    {CAMEROON_REGIONS.find((r) => r.id === formData.propertyRegion)?.[formData.language === 'fr' ? 'fr' : 'en'] || formData.propertyRegion}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isRegionDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isRegionDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden animate-fade-in-up">
                    <div className="p-2 border-b border-slate-100 flex items-center gap-2 bg-slate-50">
                      <Search className="w-4 h-4 text-slate-400 shrink-0" />
                      <input
                        type="text"
                        value={regionSearchQuery}
                        onChange={(e) => setRegionSearchQuery(e.target.value)}
                        placeholder={formData.language === 'fr' ? 'Rechercher une région au Cameroun...' : 'Search a Cameroon region...'}
                        className="w-full bg-transparent text-xs text-slate-900 placeholder-slate-400 focus:outline-none"
                        autoFocus
                      />
                    </div>
                    <div className="max-h-48 overflow-y-auto divide-y divide-slate-100">
                      {CAMEROON_REGIONS.filter((r) => {
                        const q = regionSearchQuery.toLowerCase().trim();
                        if (!q) return true;
                        return r.en.toLowerCase().includes(q) || r.fr.toLowerCase().includes(q) || r.id.toLowerCase().includes(q);
                      }).map((reg) => (
                        <button
                          key={reg.id}
                          type="button"
                          onClick={() => {
                            updateField('propertyRegion', reg.id);
                            setIsRegionDropdownOpen(false);
                            setRegionSearchQuery('');
                          }}
                          className={`w-full px-3.5 py-2 text-left text-xs font-medium hover:bg-slate-50 flex items-center justify-between ${
                            formData.propertyRegion === reg.id ? 'bg-accent/10 text-accent font-bold' : 'text-slate-700'
                          }`}
                        >
                          <span>{formData.language === 'fr' ? reg.fr : reg.en}</span>
                          {formData.propertyRegion === reg.id && <CheckCircle2 className="w-3.5 h-3.5 text-accent" />}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Titled Land Gate (Mandatory Deal-Breaker for ALL projects) */}
            <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200/90 space-y-3">
              <div className="flex items-start gap-2.5">
                <ShieldCheck className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-amber-950 block">
                    {formData.language === 'fr'
                      ? '4. Le terrain / bien fait-il l\'objet d\'un Titre Foncier immatriculé ?'
                      : '4. Is the property / land covered by a registered Land Title (Titre Foncier)?'}
                  </label>
                  <span className="text-[11px] font-bold text-amber-800">
                    {formData.language === 'fr'
                      ? 'Obligation légale CFC — Condition éliminatoire'
                      : 'CFC Legal Obligation — Deal Breaker'}
                  </span>
                </div>
              </div>
              <p className="text-xs text-amber-900 leading-relaxed">
                {formData.language === 'fr'
                  ? 'Le Crédit Foncier du Cameroun exige impérativement un Titre Foncier en règle pour inscrire son hypothèque de premier rang. Le CFC ne finance aucun terrain coutumier ou sans titre.'
                  : 'Crédit Foncier du Cameroun legally requires a registered Land Title (Titre Foncier) to secure its mortgage. CFC cannot finance customary or untitled land.'}
              </p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => updateField('hasTitle', true)}
                  className={`py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm border transition-all flex items-center justify-center gap-2 ${
                    formData.hasTitle === true
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{formData.language === 'fr' ? 'Oui, Titre Foncier en règle' : 'Yes, Land is Titled'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => updateField('hasTitle', false)}
                  className={`py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm border transition-all flex items-center justify-center gap-2 ${
                    formData.hasTitle === false
                      ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formData.language === 'fr' ? 'Non / Pas de Titre Foncier' : 'No / Untitled Land'}</span>
                </button>
              </div>

              {formData.hasTitle === false && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-900 space-y-1 animate-fade-in">
                  <div className="font-bold flex items-center gap-1.5 text-rose-700">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{formData.language === 'fr' ? 'Condition bloquante pour l\'octroi du crédit' : 'Warning: Deal-Breaker for CFC Approval'}</span>
                  </div>
                  <p className="leading-relaxed text-[11.5px]">
                    {formData.language === 'fr'
                      ? 'Un terrain non titré ne peut recevoir aucun accord de financement du CFC. REI Consulting propose un accompagnement pour vous aider à auditer et régulariser votre titre foncier.'
                      : 'Untitled land cannot receive CFC mortgage approval. REI Consulting provides assistance to audit, verify, and regularize your land title beforehand.'}
                  </p>
                </div>
              )}
            </div>

            {/* Navigation buttons */}
            <div className="flex justify-between items-center pt-4 border-t border-slate-100">
              <Button variant="ghost" onClick={handlePrevStep} className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                {formData.language === 'fr' ? 'Retour' : 'Back'}
              </Button>
              <Button onClick={handleNextStep} className="bg-accent hover:bg-accent/90 text-white flex items-center gap-2">
                {formData.language === 'fr' ? 'Continuer' : 'Continue'}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* STEP 2: FINANCIAL SCOPE                                             */}
        {/* ==================================================================== */}
        {step === 2 && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-100 shadow-xl space-y-6 animate-fade-in-up">
            <div>
              <span className="text-xs uppercase font-bold text-accent tracking-wider">
                {formData.language === 'fr' ? 'Étape 2 : Budget & Fonds Disponibles' : 'Step 2: Project Scope & Funds'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-heading font-bold text-primary mt-1">
                {formData.language === 'fr' ? 'Quels montants envisagez-vous ?' : 'What are your estimated figures?'}
              </h2>
            </div>

            {/* Total Project Cost */}
            <div className="space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  {formData.language === 'fr' ? 'Coût total du projet (Terrain + Construction / Achat)' : 'Total Project Cost (XAF / FCFA)'}
                </label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={formatNumberOnly(formData.projectCost, formData.language)}
                    onChange={(e) => updateField('projectCost', parseFormattedNumber(e.target.value))}
                    className="w-44 px-3 py-1.5 text-right font-bold text-primary border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                  <span className="text-xs font-bold text-slate-500">FCFA</span>
                </div>
              </div>
              <Slider
                value={[formData.projectCost]}
                min={10000000}
                max={150000000}
                step={1000000}
                onValueChange={(val) => updateField('projectCost', val[0])}
              />
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>10 000 000 FCFA</span>
                <span className="font-bold text-slate-700">{formatFCFA(formData.projectCost, formData.language)}</span>
                <span>150 000 000 FCFA</span>
              </div>
            </div>

            {/* Own Funds Available */}
            <div className="space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  {formData.language === 'fr' ? 'Fonds propres mobilisables (Apport personnel)' : 'Own Funds Ready for this Project'}
                </label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={formatNumberOnly(formData.ownFunds, formData.language)}
                    onChange={(e) => updateField('ownFunds', parseFormattedNumber(e.target.value))}
                    className="w-44 px-3 py-1.5 text-right font-bold text-accent border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                  <span className="text-xs font-bold text-slate-500">FCFA</span>
                </div>
              </div>
              <Slider
                value={[formData.ownFunds]}
                min={0}
                max={formData.projectCost}
                step={500000}
                onValueChange={(val) => updateField('ownFunds', val[0])}
              />
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>0 FCFA</span>
                <span className="font-bold text-accent">
                  {formatFCFA(formData.ownFunds, formData.language)} ({formData.projectCost > 0 ? Math.round((formData.ownFunds / formData.projectCost) * 100) : 0}%)
                </span>
                <span>{formatFCFA(formData.projectCost, formData.language)}</span>
              </div>
            </div>

            {/* Expected Rent if Rental */}
            {formData.propertyPurpose === 'rental' && (
              <div className="space-y-2 p-4 rounded-xl bg-slate-50 border border-slate-200">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                  {formData.language === 'fr' ? 'Loyer mensuel prévisionnel attendu (FCFA)' : 'Expected Monthly Rental Income (FCFA)'}
                </label>
                <Input
                  type="number"
                  step="25000"
                  value={formData.expectedMonthlyRent}
                  onChange={(e) => updateField('expectedMonthlyRent', Math.max(0, Number(e.target.value)))}
                />
                <p className="text-[11px] text-slate-500">
                  {formData.language === 'fr'
                    ? 'Le CFC prend en compte les loyers prévisionnels pour calibrer le prêt locatif.'
                    : 'CFC factors verified expected rental income into repayment capacity.'}
                </p>
              </div>
            )}

            {/* Total Savings Buffer */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                {formData.language === 'fr' ? 'Épargne de réserve totale (Sécurité en dehors du projet)' : 'Total Remaining Savings (Safety Buffer)'}
              </label>
              <Input
                type="number"
                step="500000"
                value={formData.totalSavings}
                onChange={(e) => updateField('totalSavings', Math.max(0, Number(e.target.value)))}
              />
              <p className="text-[11px] text-slate-500">
                {formData.language === 'fr'
                  ? 'Avoir un matelas de sécurité après injection de l\'apport personnel rassure les analystes risques du CFC.'
                  : 'Having emergency liquidity left after paying equity significantly boosts lender confidence.'}
              </p>
            </div>

            {/* Navigation buttons */}
            <div className="flex justify-between items-center pt-4 border-t border-slate-100">
              <Button variant="ghost" onClick={handlePrevStep} className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                {formData.language === 'fr' ? 'Retour' : 'Back'}
              </Button>
              <Button onClick={handleNextStep} className="bg-accent hover:bg-accent/90 text-white flex items-center gap-2">
                {formData.language === 'fr' ? 'Continuer' : 'Continue'}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* STEP 3: BORROWER PROFILE & DEBT                                      */}
        {/* ==================================================================== */}
        {step === 3 && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-100 shadow-xl space-y-6 animate-fade-in-up">
            <div>
              <span className="text-xs uppercase font-bold text-accent tracking-wider">
                {formData.language === 'fr' ? 'Étape 3 : Revenus & Situation Emprunteur' : 'Step 3: Income & Debts'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-heading font-bold text-primary mt-1">
                {formData.language === 'fr' ? 'Votre situation financière' : 'Your Financial Profile'}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Age */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    {formData.language === 'fr' ? 'Âge de l\'emprunteur' : 'Age of Borrower'}
                  </label>
                  <span className="text-[11px] font-semibold text-accent">
                    {formData.age >= 65 ? (
                      formData.language === 'fr' ? '⚠️ Retraite atteinte (65 ans)' : '⚠️ Retirement reached (65 yrs)'
                    ) : (
                      formData.language === 'fr'
                        ? `Durée max : ${Math.max(1, 65 - formData.age)} ans (retraite à 65 ans)`
                        : `Max payoff: ${Math.max(1, 65 - formData.age)} yrs (retire at 65)`
                    )}
                  </span>
                </div>
                <Input
                  type="number"
                  min="18"
                  max="75"
                  value={formData.age}
                  onChange={(e) => updateField('age', Number(e.target.value))}
                />
                <span className="text-[11px] text-slate-400 block">
                  {formData.age < 35
                    ? (formData.language === 'fr' ? '✓ Éligible au Prêt Jeune CFC (< 35 ans)' : '✓ Eligible for CFC Youth Loan (< 35 yrs)')
                    : (formData.language === 'fr' ? 'Limite d\'âge à l\'échéance du prêt : 65 ans révolus' : 'Legal maturity age ceiling: 65 years')}
                </span>
              </div>

              {/* Employment Type */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  {formData.language === 'fr' ? 'Statut Professionnel' : 'Employment Type'}
                </label>
                <select
                  value={formData.employmentType}
                  onChange={(e) => updateField('employmentType', e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  <option value="salaried">{formData.language === 'fr' ? 'Salarié (Public ou Privé en CDI)' : 'Salaried (Permanent Contract / Public)'}</option>
                  <option value="self-employed">{formData.language === 'fr' ? 'Profession Libérale / Indépendant' : 'Self-Employed / Business Owner'}</option>
                </select>
              </div>
            </div>

            {/* Monthly Net Income */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                {formData.language === 'fr'
                  ? 'Revenu net mensuel moyen (Toutes sources, en FCFA) *'
                  : 'Average Monthly Net Income (All sources, in FCFA) *'}
              </label>
              <Input
                type="number"
                min="0"
                step="10000"
                value={formData.monthlyIncome === 0 ? '0' : formData.monthlyIncome || ''}
                onChange={(e) => updateField('monthlyIncome', Math.max(0, Number(e.target.value) || 0))}
                placeholder="0"
                required
              />
              <span className="text-[11px] text-slate-400">
                {formData.language === 'fr'
                  ? 'Commence à 0 FCFA — aucun montant minimum requis'
                  : 'Begins at 0 FCFA — no minimum floor required'}
              </span>
            </div>

            {/* Existing Debts */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                {formData.language === 'fr' ? 'Mensualités de dettes actuelles (FCFA/mois)' : 'Monthly Debt Payments (FCFA/mo)'}
              </label>
              <Input
                type="number"
                step="10000"
                value={formData.monthlyDebt}
                onChange={(e) => updateField('monthlyDebt', Math.max(0, Number(e.target.value)))}
              />
              <span className="text-[11px] text-slate-400">
                {formData.language === 'fr' ? 'Crédits en cours, tontines ou retenues sur salaire' : 'Ongoing loans, tontines, or payroll deductions'}
              </span>
            </div>

            {/* Residence Selection: In Cameroon vs Diaspora with Searchable Country Dropdown */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                {formData.language === 'fr' ? 'Lieu de résidence de l\'emprunteur' : 'Borrower Residence Location'}
              </label>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    updateField('residenceType', 'cameroon');
                    updateField('residenceCountry', 'Cameroon');
                    updateField('location', 'In Cameroon (Resident)');
                    setIsCountryDropdownOpen(false);
                  }}
                  className={`py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm border transition-all flex items-center justify-center gap-2 ${
                    formData.residenceType === 'cameroon'
                      ? 'bg-primary text-white border-primary shadow-sm'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <span className="text-base">🇨🇲</span>
                  <span>{formData.language === 'fr' ? 'Au Cameroun (Résident)' : 'In Cameroon (Resident)'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    updateField('residenceType', 'diaspora');
                    if (formData.residenceCountry === 'Cameroon') {
                      updateField('residenceCountry', 'France');
                    }
                    setIsCountryDropdownOpen(true);
                  }}
                  className={`py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm border transition-all flex items-center justify-center gap-2 ${
                    formData.residenceType === 'diaspora'
                      ? 'bg-accent text-white border-accent shadow-sm'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <Globe className="w-4 h-4 shrink-0" />
                  <span>{formData.language === 'fr' ? 'Diaspora (À l\'étranger)' : 'Diaspora (Abroad)'}</span>
                </button>
              </div>

              {formData.residenceType === 'diaspora' && (
                <div className="space-y-1.5 p-4 rounded-2xl bg-amber-50/50 border border-amber-200/70 animate-fade-in">
                  <label className="text-xs font-bold text-amber-950 block">
                    {formData.language === 'fr' ? 'Sélectionnez votre pays de résidence :' : 'Select your country of residence:'}
                  </label>

                  {/* Searchable Dropdown */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-semibold flex items-center justify-between text-left shadow-sm focus:outline-none focus:ring-2 focus:ring-accent"
                    >
                      <div className="flex items-center gap-2">
                        <span>{COUNTRIES_LIST.find((c) => c.nameEn === formData.residenceCountry || c.nameFr === formData.residenceCountry)?.flag || '🌍'}</span>
                        <span className="text-slate-900">
                          {formData.language === 'fr'
                            ? (COUNTRIES_LIST.find((c) => c.nameEn === formData.residenceCountry)?.nameFr || formData.residenceCountry)
                            : (COUNTRIES_LIST.find((c) => c.nameFr === formData.residenceCountry)?.nameEn || formData.residenceCountry)}
                        </span>
                      </div>
                      <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isCountryDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {isCountryDropdownOpen && (
                      <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden animate-fade-in-up">
                        <div className="p-2 border-b border-slate-100 flex items-center gap-2 bg-slate-50">
                          <Search className="w-4 h-4 text-slate-400 shrink-0" />
                          <input
                            type="text"
                            value={countrySearchQuery}
                            onChange={(e) => setCountrySearchQuery(e.target.value)}
                            placeholder={formData.language === 'fr' ? 'Rechercher un pays...' : 'Search a country...'}
                            className="w-full bg-transparent text-xs text-slate-900 placeholder-slate-400 focus:outline-none"
                            autoFocus
                          />
                        </div>
                        <div className="max-h-56 overflow-y-auto divide-y divide-slate-100">
                          {COUNTRIES_LIST.filter((c) => {
                            const q = countrySearchQuery.toLowerCase().trim();
                            if (!q) return true;
                            return (
                              c.nameEn.toLowerCase().includes(q) ||
                              c.nameFr.toLowerCase().includes(q) ||
                              c.code.toLowerCase().includes(q)
                            );
                          }).map((c) => (
                            <button
                              key={c.code}
                              type="button"
                              onClick={() => {
                                updateField('residenceCountry', c.nameEn);
                                updateField('location', `Diaspora - ${c.nameEn}`);
                                setIsCountryDropdownOpen(false);
                                setCountrySearchQuery('');
                              }}
                              className={`w-full px-3.5 py-2 text-xs flex items-center justify-between text-left transition-colors ${
                                formData.residenceCountry === c.nameEn
                                  ? 'bg-accent/10 font-bold text-accent'
                                  : 'text-slate-700 hover:bg-slate-50'
                              }`}
                            >
                              <div className="flex items-center gap-2.5">
                                <span className="text-base">{c.flag}</span>
                                <span>{formData.language === 'fr' ? c.nameFr : c.nameEn}</span>
                              </div>
                              {formData.residenceCountry === c.nameEn && (
                                <CheckCircle2 className="w-3.5 h-3.5 text-accent shrink-0" />
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Navigation buttons */}
            <div className="flex justify-between items-center pt-4 border-t border-slate-100">
              <Button variant="ghost" onClick={handlePrevStep} className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                {formData.language === 'fr' ? 'Retour' : 'Back'}
              </Button>
              <Button onClick={handleNextStep} className="bg-accent hover:bg-accent/90 text-white flex items-center gap-2">
                {formData.language === 'fr' ? 'Calculer mon score' : 'Calculate My Score'}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* STEP 4: CONTACT & IDENTITY UNLOCK                                    */}
        {/* ==================================================================== */}
        {step === 4 && (
          <form onSubmit={handleSubmitAssessment} className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-100 shadow-xl space-y-6 animate-fade-in-up">
            <div>
              <span className="text-xs uppercase font-bold text-accent tracking-wider">
                {formData.language === 'fr' ? 'Dernière étape : Débloquer votre rapport' : 'Final Step: Unlock Your Report'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-heading font-bold text-primary mt-1">
                {formData.language === 'fr' ? 'À qui devons-nous adresser le rapport ?' : 'Who should we address the report to?'}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                {formData.language === 'fr'
                  ? 'Vos données permettent d\'éditer votre synthèse personnalisée et de vous contacter en cas de dossier favorable.'
                  : 'Your contact details generate your personalized PDF summary and enable Gilgar to follow up on your file.'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              {/* Title */}
              <div className="space-y-1.5 sm:col-span-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  {formData.language === 'fr' ? 'Civilité' : 'Title'}
                </label>
                <select
                  value={formData.title}
                  onChange={(e) => updateField('title', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  <option value="Mr">Mr</option>
                  <option value="Mrs">Mrs / Mme</option>
                  <option value="Miss">Miss / Mlle</option>
                  <option value="Dr">Dr</option>
                </select>
              </div>

              {/* Full Name */}
              <div className="space-y-1.5 sm:col-span-3">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  {formData.language === 'fr' ? 'Nom et Prénom' : 'Full Name'} <span className="text-red-500">*</span>
                </label>
                <Input
                  required
                  placeholder="e.g. Jean Dupont"
                  value={formData.fullName}
                  onChange={(e) => updateField('fullName', e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Phone / WhatsApp */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  {formData.language === 'fr' ? 'Numéro Téléphone / WhatsApp' : 'Phone / WhatsApp'} <span className="text-red-500">*</span>
                </label>
                <Input
                  required
                  type="tel"
                  placeholder="+237 6xx xxx xxx"
                  value={formData.phone}
                  onChange={(e) => updateField('phone', e.target.value)}
                />
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  {formData.language === 'fr' ? 'Email (optionnel)' : 'Email (Optional)'}
                </label>
                <Input
                  type="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={(e) => updateField('email', e.target.value)}
                />
              </div>
            </div>

            {/* Consent Box */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
              <input
                id="consent-check"
                type="checkbox"
                checked={formData.consent}
                onChange={(e) => updateField('consent', e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-slate-300 text-accent focus:ring-accent"
              />
              <label htmlFor="consent-check" className="text-xs text-slate-600 leading-relaxed cursor-pointer">
                {formData.language === 'fr'
                  ? 'J\'accepte que REI Consulting conserve mes réponses pour évaluer mon projet et me contacter. Mes informations ne seront transmises au CFC ou à aucun tiers sans mon accord exprès.'
                  : 'I agree that REI Consulting may store my answers and contact me about my project. My information will not be shared with CFC or any third party without my separate agreement.'}
              </label>
            </div>

            {/* Submit Button */}
            <div className="flex justify-between items-center pt-4 border-t border-slate-100">
              <Button type="button" variant="ghost" onClick={handlePrevStep} className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                {formData.language === 'fr' ? 'Retour' : 'Back'}
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                className="bg-accent hover:bg-accent/90 text-white font-bold px-8 py-2.5 rounded-full shadow-lg shadow-accent/20 flex items-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{formData.language === 'fr' ? 'Analyse en cours...' : 'Analyzing Profile...'}</span>
                  </>
                ) : (
                  <>
                    <span>{formData.language === 'fr' ? 'Afficher mes Résultats' : 'Reveal My Results'}</span>
                    <Sparkles className="w-4 h-4" />
                  </>
                )}
              </Button>
            </div>
          </form>
        )}

        {/* ==================================================================== */}
        {/* STEP 5: RESULTS SCREEN & EMBEDDED SIMULATOR                          */}
        {/* ==================================================================== */}
        {step === 5 && result && (
          <div className="space-y-8 animate-fade-in-up">
            {/* Deal-Breaker Warning Alert if Land is Untitled */}
            {!formData.hasTitle && (
              <div className="p-5 rounded-2xl bg-rose-50 border-2 border-rose-300 text-rose-950 flex items-start gap-3.5 shadow-sm">
                <AlertCircle className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h3 className="font-heading font-bold text-sm sm:text-base text-rose-900">
                    {formData.language === 'fr'
                      ? 'Critère Éliminatoire : Titre Foncier Obligatoire pour le CFC'
                      : 'Regulatory Deal-Breaker: Titled Land (Titre Foncier) is Mandatory'}
                  </h3>
                  <p className="text-xs text-rose-800 leading-relaxed">
                    {formData.language === 'fr'
                      ? 'Le Crédit Foncier du Cameroun ne peut légalement accepter aucune demande de crédit immobilier sur terrain non titré. Tant que votre terrain n\'est pas immatriculé par un Titre Foncier en règle, votre dossier ne pourra aboutir. REI Consulting peut vous assister dans l\'audit, le bornage et la sécurisation foncière de votre parcelle.'
                      : 'Crédit Foncier du Cameroun legally cannot approve any mortgage application without an official registered Land Title (Titre Foncier). Until your land has a valid title, CFC will not disburse funds. REI Consulting can assist you with land due diligence and title regularization.'}
                  </p>
                </div>
              </div>
            )}

            {/* Score Banner Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-100 shadow-xl overflow-hidden relative">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
                    {formData.language === 'fr' ? 'Résultat de votre Éligibilité' : 'Your Eligibility Result'}
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-primary mt-1">
                    {formData.language === 'fr' ? 'Indice de Préparation CFC' : 'CFC Readiness Index'}
                  </h1>
                  <p className="text-xs text-slate-500 mt-1">
                    {formData.language === 'fr'
                      ? `Évaluation pour ${formData.title} ${formData.fullName} • Projet ${formatFCFA(formData.projectCost)}`
                      : `Prepared for ${formData.title} ${formData.fullName} • ${formatFCFA(formData.projectCost)} project`}
                  </p>
                </div>

                {/* Big Score Display */}
                <div className="flex items-center gap-4">
                  <div className={`w-24 h-24 rounded-2xl flex flex-col items-center justify-center font-heading font-extrabold text-3xl shadow-sm ${
                    result.score >= 80
                      ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                      : result.score >= 60
                      ? 'bg-amber-50 text-amber-600 border border-amber-200'
                      : 'bg-rose-50 text-rose-600 border border-rose-200'
                  }`}>
                    <span>{result.score}</span>
                    <span className="text-[10px] font-bold uppercase text-slate-400">/ 100</span>
                  </div>

                  <div>
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      result.score >= 80
                        ? 'bg-emerald-100 text-emerald-800'
                        : result.score >= 60
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}>
                      {result.score >= 80 && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                      {result.score >= 60 && result.score < 80 && <Clock className="w-3.5 h-3.5 text-amber-600" />}
                      {result.score < 60 && <AlertCircle className="w-3.5 h-3.5 text-rose-600" />}
                      {result.score >= 80
                        ? (formData.language === 'fr' ? 'Dossier Favorable' : 'Strong Candidate')
                        : result.score >= 60
                        ? (formData.language === 'fr' ? 'Dossier Prometteur' : 'Workable Candidate')
                        : (formData.language === 'fr' ? 'En Préparation' : 'Needs Preparation')}
                    </span>
                    <p className="text-xs font-semibold text-slate-700 mt-1.5">
                      {formData.language === 'fr' ? 'Produit conseillé :' : 'Best Match:'}
                    </p>
                    <p className="text-xs text-accent font-bold">
                      {formData.language === 'fr' ? result.matchedProduct.label.fr : result.matchedProduct.label.en}
                    </p>
                  </div>
                </div>
              </div>

              {/* Band-Specific Outcome & GATED CTA */}
              <div className="pt-6 space-y-4">
                {result.score >= 80 ? (
                  /* GATED CTA: Score >= 80 -> Book Consultation Button Enabled */
                  <div className="p-6 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="font-heading font-bold text-emerald-950 text-base flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        {formData.language === 'fr' ? 'Félicitations ! Vous êtes éligible' : 'Congratulations! You\'re Eligible'}
                      </h3>
                      <p className="text-xs text-emerald-800 mt-1 max-w-lg leading-relaxed">
                        {formData.language === 'fr'
                          ? 'Vous êtes éligible ! Réservez une consultation avec Ndah Gilgar Mbuh pour planifier votre demande de prêt CFC.'
                          : 'You\'re eligible! Book a consultation with Ndah Gilgar Mbuh to plan your CFC loan application.'}
                      </p>
                    </div>

                    <Button asChild size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold shrink-0 shadow-md">
                      <Link to={`/book?name=${encodeURIComponent(formData.fullName)}&email=${encodeURIComponent(formData.email)}&score=${result.score}`} className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{formData.language === 'fr' ? 'Réserver ma consultation' : 'Book Your Consultation'}</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </Button>
                  </div>
                ) : result.score >= 60 ? (
                  /* Workable (60-79) */
                  <div className="p-6 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-3">
                    <div className="flex items-center gap-2 text-amber-950 font-bold text-sm">
                      <Clock className="w-4 h-4 text-accent" />
                      <span>{formData.language === 'fr' ? 'Score inférieur au seuil requis (80+) pour la réservation directe' : 'Score below 80+ threshold for direct consultation booking'}</span>
                    </div>
                    <p className="text-xs text-amber-900 leading-relaxed">
                      {formData.language === 'fr'
                        ? 'La réservation directe d\'un créneau d\'instruction est réservée aux dossiers ayant un score ≥ 80%. Votre dossier est prometteur : consultez les leviers d\'ajustement ci-dessous pour atteindre 80%, ou un conseiller REI Consulting étudiera votre dossier manuellement.'
                        : 'Direct booking is gated for dossiers scoring 80%+. Your project is viable with minor adjustments: review the optimization levers below to reach 80%+, or an advisor will reach out to review your application.'}
                    </p>
                    <div className="pt-2">
                      <a
                        href="#optimization-levers"
                        className="inline-flex items-center gap-2 text-xs font-bold text-accent hover:text-accent/80 hover:underline"
                      >
                        <span>{formData.language === 'fr' ? 'Voir le plan d\'optimisation ci-dessous' : 'View Actionable Optimization Levers Below'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                ) : (
                  /* Needs Work (< 60): NO "Book consultation" button — Advisor outreach note */
                  <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
                      <FileCheck className="w-4 h-4 text-slate-500" />
                      <span>{formData.language === 'fr' ? 'Dossier nécessitant une phase de structuration préalable' : 'Pre-requisites needed before formal application'}</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {formData.language === 'fr'
                        ? 'Pour protéger votre temps et éviter un refus bancaire, un conseiller REI Consulting examinera personnellement votre situation et vous contactera par WhatsApp pour vous aider à consolider vos prérequis (titre, apport, capacité).'
                        : 'To protect your investment and avoid unnecessary bank refusal, a dedicated REI Consulting advisor will reach out to you personally to guide your preparation.'}
                    </p>
                  </div>
                )}
              </div>

              {/* PDF Report Download Button */}
              <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs text-slate-500">
                  {formData.language === 'fr' ? 'Synthèse personnalisée prête à imprimer ou partager' : 'Personalized summary ready to save or print'}
                </div>
                <Button
                  onClick={handleDownloadPDF}
                  disabled={downloadingPDF}
                  className="bg-primary hover:bg-primary/90 text-white flex items-center gap-2 text-xs"
                >
                  <Download className="w-4 h-4 text-accent" />
                  {downloadingPDF
                    ? (formData.language === 'fr' ? 'Téléchargement...' : 'Generating PDF...')
                    : (formData.language === 'fr' ? 'Télécharger le Rapport Personnalisé (PDF)' : 'Download Personalized PDF Report')}
                </Button>
              </div>
            </div>

            {/* 6-Factor Dimension Breakdown */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-4">
              <h3 className="font-heading font-bold text-lg text-primary">
                {formData.language === 'fr' ? 'Détail des 6 Piliers d\'Évaluation' : '6-Factor Assessment Breakdown'}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {/* 1. Contribution */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
                  <div className="flex justify-between font-semibold">
                    <span className="text-slate-700">{formData.language === 'fr' ? 'Apport Personnel' : 'Personal Contribution'}</span>
                    <span className="text-accent font-bold">{result.breakdown.contributionPts} / 25 pts</span>
                  </div>
                  <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-accent" style={{ width: `${(result.breakdown.contributionPts / 25) * 100}%` }} />
                  </div>
                </div>

                {/* 2. Titled Land */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
                  <div className="flex justify-between font-semibold">
                    <span className="text-slate-700">{formData.language === 'fr' ? 'Titre Foncier (Terrain)' : 'Land Title Status'}</span>
                    <span className="text-accent font-bold">{result.breakdown.titledLandPts} / 15 pts</span>
                  </div>
                  <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-accent" style={{ width: `${(result.breakdown.titledLandPts / 15) * 100}%` }} />
                  </div>
                </div>

                {/* 3. DTI */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
                  <div className="flex justify-between font-semibold">
                    <span className="text-slate-700">{formData.language === 'fr' ? 'Capacité d\'Endettement' : 'Debt-to-Income'}</span>
                    <span className="text-accent font-bold">{result.breakdown.dtiPts} / 20 pts</span>
                  </div>
                  <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-accent" style={{ width: `${(result.breakdown.dtiPts / 20) * 100}%` }} />
                  </div>
                </div>

                {/* 4. Employment */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
                  <div className="flex justify-between font-semibold">
                    <span className="text-slate-700">{formData.language === 'fr' ? 'Stabilité des Revenus' : 'Employment Stability'}</span>
                    <span className="text-accent font-bold">{result.breakdown.employmentPts} / 18 pts</span>
                  </div>
                  <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-accent" style={{ width: `${(result.breakdown.employmentPts / 18) * 100}%` }} />
                  </div>
                </div>

                {/* 5. Savings Buffer */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
                  <div className="flex justify-between font-semibold">
                    <span className="text-slate-700">{formData.language === 'fr' ? 'Épargne de Réserve' : 'Savings Buffer'}</span>
                    <span className="text-accent font-bold">{result.breakdown.savingsBufferPts} / 12 pts</span>
                  </div>
                  <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-accent" style={{ width: `${(result.breakdown.savingsBufferPts / 12) * 100}%` }} />
                  </div>
                </div>

                {/* 6. Age & Term */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
                  <div className="flex justify-between font-semibold">
                    <span className="text-slate-700">{formData.language === 'fr' ? 'Horizon Âge / Retraite' : 'Age to Term Headroom'}</span>
                    <span className="text-accent font-bold">{result.breakdown.ageTermPts} / 10 pts</span>
                  </div>
                  <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-accent" style={{ width: `${(result.breakdown.ageTermPts / 10) * 100}%` }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Actionable Levers to reach 80% */}
            {result.levers.length > 0 && (
              <div id="optimization-levers" className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-4 scroll-mt-24">
                <h3 className="font-heading font-bold text-lg text-primary flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-accent" />
                  {formData.language === 'fr' ? 'Comment Maximiser Votre Score (Plan d\'Action)' : 'What-If Optimization Levers to Reach 80%+'}
                </h3>
                <div className="space-y-3">
                  {result.levers.map((lever, i) => (
                    <div key={i} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-primary">
                          {formData.language === 'fr' ? lever.title.fr : lever.title.en}
                        </span>
                        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          +{lever.estimatedScoreIncrease} pts
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {formData.language === 'fr' ? lever.description.fr : lever.description.en}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Embedded Live Simulator */}
            {simResult && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-6">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <h3 className="font-heading font-bold text-lg text-primary flex items-center gap-2">
                      <Percent className="w-5 h-5 text-accent" />
                      {formData.language === 'fr' ? 'Simulation Directe de Vos Mensualités' : 'Interactive Repayment Simulator'}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {formData.language === 'fr'
                        ? 'Ajustez la durée et votre apport pour observer l\'impact direct sur votre mensualité CFC.'
                        : 'Adjust duration and contribution to test your monthly payment live.'}
                    </p>
                  </div>
                </div>

                {/* Big Monthly Repayment Spotlight */}
                <div className="p-6 rounded-2xl bg-primary text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-accent font-bold">
                      {formData.language === 'fr' ? 'Mensualité Totale (Prêt + Assurance)' : 'Estimated Monthly Repayment'}
                    </p>
                    <p className="text-3xl sm:text-4xl font-heading font-extrabold text-white mt-1">
                      {formatFCFA(simResult.totalMonthlyPayment, formData.language)}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      {formatFCFA(simResult.loanAmount, formData.language)} {formData.language === 'fr' ? 'empruntés à' : 'borrowed at'}{' '}
                      {(result.matchedProduct.annualInterestRate * 100).toFixed(2)}% TTC
                    </p>
                  </div>

                  <div className="text-left sm:text-right text-xs text-slate-300 space-y-1">
                    <p>
                      {formData.language === 'fr' ? 'Apport :' : 'Equity :'}{' '}
                      <strong className="text-white">{formatFCFA(simResult.contributionAmount, formData.language)}</strong>
                    </p>
                    <p>
                      {formData.language === 'fr' ? 'Frais & notaire :' : 'Signing Fees :'}{' '}
                      <strong className="text-white">{formatFCFA(simResult.upfrontCosts.total, formData.language)}</strong>
                    </p>
                    <p>
                      {formData.language === 'fr' ? 'Total à débourser :' : 'Cash Needed :'}{' '}
                      <strong className="text-accent">{formatFCFA(simResult.cashNeededAtSigning, formData.language)}</strong>
                    </p>
                  </div>
                </div>

                {/* Simulator Sliders + Manual Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                  {/* Loan Duration Slider & Input capped by Retirement Age 65 */}
                  {(() => {
                    const maxSimTerm = Math.min(result.matchedProduct.maxTermYears, Math.max(1, 65 - formData.age));
                    const minSimTerm = Math.min(5, maxSimTerm);
                    return (
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                          <div>
                            <span>{formData.language === 'fr' ? 'Durée du prêt' : 'Loan Duration'}</span>
                            <span className="text-[10px] text-slate-400 block font-normal">
                              {formData.language === 'fr'
                                ? `Plafonné à 65 ans (max ${maxSimTerm} ans pour ${formData.age} ans)`
                                : `Capped at age 65 (max ${maxSimTerm} yrs for age ${formData.age})`}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <input
                              type="number"
                              min={minSimTerm}
                              max={maxSimTerm}
                              value={simTerm}
                              onChange={(e) => setSimTerm(Math.min(maxSimTerm, Math.max(minSimTerm, Number(e.target.value) || minSimTerm)))}
                              className="w-16 px-2 py-0.5 text-right font-bold text-accent border border-slate-200 rounded-lg text-xs"
                            />
                            <span className="text-[11px] text-slate-500">{formData.language === 'fr' ? 'ans' : 'years'}</span>
                          </div>
                        </div>
                        <Slider
                          value={[simTerm]}
                          min={minSimTerm}
                          max={maxSimTerm}
                          step={1}
                          onValueChange={(val) => setSimTerm(val[0])}
                        />
                        <div className="flex justify-between text-[10px] text-slate-400">
                          <span>{minSimTerm} {formData.language === 'fr' ? 'ans min' : 'yrs min'}</span>
                          <span className="font-semibold text-slate-700">{simTerm} {formData.language === 'fr' ? 'ans' : 'yrs'}</span>
                          <span>{maxSimTerm} {formData.language === 'fr' ? 'ans max (retraite)' : 'yrs max (retire)'}</span>
                        </div>
                      </div>
                    );
                  })()}

                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                      <span>{formData.language === 'fr' ? 'Apport personnel' : 'Personal Contribution'}</span>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="text"
                          value={formatNumberOnly(simContribution, formData.language)}
                          onChange={(e) => setSimContribution(parseFormattedNumber(e.target.value))}
                          className="w-32 px-2 py-0.5 text-right font-bold text-accent border border-slate-200 rounded-lg text-xs"
                        />
                        <span className="text-[11px] text-slate-500">FCFA</span>
                      </div>
                    </div>
                    <Slider
                      value={[simContribution]}
                      min={Math.round(formData.projectCost * result.matchedProduct.minContributionPct)}
                      max={formData.projectCost * 0.75}
                      step={500000}
                      onValueChange={(val) => setSimContribution(val[0])}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Disclaimer */}
            <p className="text-xs text-slate-400 italic text-center px-4 pt-2">
              {formData.language === 'fr'
                ? 'Il s\'agit d\'un outil indépendant créé par REI Consulting et non d\'un outil officiel du CFC. Les résultats sont des estimations et non une décision de prêt. L\'éligibilité finale est décidée par le CFC.'
                : 'This is an independent tool by REI Consulting, not an official CFC tool. Results are estimates, not a loan decision. Final eligibility is decided by CFC.'}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
