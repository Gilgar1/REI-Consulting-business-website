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
  Lock
} from 'lucide-react';

interface FormData {
  language: 'en' | 'fr';
  projectType: 'buy' | 'build';
  propertyPurpose: 'residential' | 'rental' | 'development';
  hasTitle: boolean | null;
  projectCost: number;
  ownFunds: number;
  expectedMonthlyRent: number;
  totalSavings: number;
  age: number;
  employmentType: 'salaried' | 'self-employed';
  monthlyIncome: number;
  monthlyDebt: number;
  totalDebt: number;
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

  // Form State with sensible Cameroon real estate defaults
  const [formData, setFormData] = useState<FormData>({
    language: (language as 'en' | 'fr') || 'en',
    projectType: 'buy',
    propertyPurpose: 'residential',
    hasTitle: true,
    projectCost: 35000000, // 35M FCFA
    ownFunds: 10000000, // 10M FCFA
    expectedMonthlyRent: 250000,
    totalSavings: 4000000,
    age: 34,
    employmentType: 'salaried',
    monthlyIncome: 850000,
    monthlyDebt: 50000,
    totalDebt: 1500000,
    location: 'In Cameroon (Yaoundé / Douala)',
    title: 'Mr',
    fullName: '',
    phone: '',
    email: '',
    consent: true,
  });

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

    // Compute Eligibility Score & Matched Product
    const scoreInput: ScoreInput = {
      projectType: formData.projectType,
      propertyPurpose: formData.propertyPurpose,
      projectCost: formData.projectCost,
      ownFunds: formData.ownFunds,
      totalDebt: formData.monthlyDebt,
      totalSavings: formData.totalSavings,
      age: formData.age,
      monthlyIncome: formData.monthlyIncome,
      employmentType: formData.employmentType,
      hasTitle: formData.projectType === 'build' ? formData.hasTitle : true,
      location: formData.location,
    };

    const evalResult = calculateEligibility(scoreInput);
    setResult(evalResult);
    setSimTerm(Math.min(evalResult.matchedProduct.maxTermYears, Math.max(5, 65 - formData.age)));
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
        has_title: formData.projectType === 'build' ? formData.hasTitle : true,
        project_cost: formData.projectCost,
        own_funds: formData.ownFunds,
        total_debt: formData.monthlyDebt,
        total_savings: formData.totalSavings,
        age: formData.age,
        monthly_income: formData.monthlyIncome,
        employment_type: formData.employmentType,
        location: formData.location,
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
              {formData.language === 'fr' ? 'Évaluation Prêt CFC en 3 Minutes' : '3-Minute CFC Mortgage Readiness Check'}
            </div>

            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-extrabold text-primary leading-tight">
                {formData.language === 'fr' ? (
                  <>
                    Pouvez-vous financer votre projet avec le <span className="text-accent">Crédit Foncier</span> ?
                  </>
                ) : (
                  <>
                    Can you finance a property like this with <span className="text-accent">CFC Mortgage</span>?
                  </>
                )}
              </h1>
              <p className="text-slate-600 text-base md:text-lg leading-relaxed">
                {formData.language === 'fr'
                  ? 'Découvrez si votre profil et votre projet répondent aux critères d\'octroi du Crédit Foncier du Cameroun. Obtenez votre score, votre mensualité réelle et votre plan d\'action personnalisé.'
                  : 'Find out whether your profile and project match Crédit Foncier du Cameroun underwriting standards. Get your eligibility score, exact monthly payment, and tailored roadmap.'}
              </p>
            </div>

            {/* What you will get */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-3.5">
              <h3 className="font-heading font-bold text-sm text-primary uppercase tracking-wider">
                {formData.language === 'fr' ? 'Ce que vous obtiendrez instantanément :' : 'What You Will Receive Instantly:'}
              </h3>
              <ul className="space-y-2.5 text-sm text-slate-700">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>
                    <strong>{formData.language === 'fr' ? 'Votre Score d\'Éligibilité' : 'Your Eligibility Score'}</strong> :{' '}
                    {formData.language === 'fr' ? 'Calculé sur 100 points selon les ratios bancaires du CFC.' : 'Scored on 100 points against official lending ratios.'}
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>
                    <strong>{formData.language === 'fr' ? 'Le Produit CFC Adapté' : 'Matched CFC Loan Product'}</strong> :{' '}
                    {formData.language === 'fr' ? 'Jeune, Social, Acquéreur ou Locatif selon votre profil.' : 'Youth, Social, Purchase, or Rental based on your project.'}
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>
                    <strong>{formData.language === 'fr' ? 'Votre Mensualité Réelle' : 'Exact Monthly Payment'}</strong> :{' '}
                    {formData.language === 'fr' ? 'Simulateur interactif intégré avec cash-flow locatif.' : 'Interactive live simulator with net rental cash flow.'}
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>
                    <strong>{formData.language === 'fr' ? 'Rapport PDF Personnalisé' : 'Personal PDF Report'}</strong> :{' '}
                    {formData.language === 'fr' ? 'Téléchargeable avec vos chiffres et les leviers d\'optimisation.' : 'Downloadable summary with recommendations to reach 80%+.'}
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
                ? 'Conseil indépendant. Résultat indicatif confidentiel sans valeur de décision CFC. Vos données restent strictement privées.'
                : 'Independent advisory. Confidential indicative assessment, not a formal CFC decision. Your data stays private.'}
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

            {/* Project Type: Buy vs Build */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                {formData.language === 'fr' ? '1. Type d\'opération' : '1. Project Type'}
              </label>
              <div className="grid grid-cols-2 gap-4">
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
                  <p className="text-xs text-slate-500 mt-1">{formData.language === 'fr' ? 'Terrain ou logement déjà construit' : 'Land or finished dwelling'}</p>
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
                  <p className="text-xs text-slate-500 mt-1">{formData.language === 'fr' ? 'Chantier de construction neuve' : 'New construction project'}</p>
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

            {/* Titled Land Gate (Only shown if Build) */}
            {formData.projectType === 'build' && (
              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-accent" />
                  <label className="text-xs font-bold uppercase tracking-wider text-amber-950">
                    {formData.language === 'fr' ? 'Possédez-vous déjà un Titre Foncier pour ce terrain ?' : 'Do you already own titled land for this build?'}
                  </label>
                </div>
                <p className="text-xs text-amber-900 leading-relaxed">
                  {formData.language === 'fr'
                    ? 'Le CFC exige obligatoirement une hypothèque sur Titre Foncier immatriculé pour débloquer un crédit de construction.'
                    : 'CFC legally requires a registered land title (Titre Foncier) to mortgage before disbursing construction funds.'}
                </p>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => updateField('hasTitle', true)}
                    className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-sm border transition-all ${
                      formData.hasTitle === true
                        ? 'bg-accent text-white border-accent'
                        : 'bg-white text-slate-700 border-slate-300'
                    }`}
                  >
                    {formData.language === 'fr' ? 'Oui, Titre Foncier en règle' : 'Yes, Land is Titled'}
                  </button>
                  <button
                    type="button"
                    onClick={() => updateField('hasTitle', false)}
                    className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-sm border transition-all ${
                      formData.hasTitle === false
                        ? 'bg-accent text-white border-accent'
                        : 'bg-white text-slate-700 border-slate-300'
                    }`}
                  >
                    {formData.language === 'fr' ? 'Non / Pas encore de titre' : 'No / Not yet titled'}
                  </button>
                </div>
              </div>
            )}

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
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  {formData.language === 'fr' ? 'Âge de l\'emprunteur' : 'Age of Borrower'}
                </label>
                <Input
                  type="number"
                  min="18"
                  max="70"
                  value={formData.age}
                  onChange={(e) => updateField('age', Number(e.target.value))}
                />
                <span className="text-[11px] text-slate-400">
                  {formData.age < 35
                    ? (formData.language === 'fr' ? '✓ Éligible au Prêt Jeune CFC (< 35 ans)' : '✓ Eligible for CFC Youth Loan (< 35 yrs)')
                    : ''}
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
                {formData.language === 'fr' ? 'Revenu net mensuel moyen (Toutes sources, en FCFA)' : 'Average Monthly Net Income (FCFA)'}
              </label>
              <Input
                type="number"
                step="50000"
                value={formData.monthlyIncome}
                onChange={(e) => updateField('monthlyIncome', Math.max(100000, Number(e.target.value)))}
              />
            </div>

            {/* Existing Debts */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  {formData.language === 'fr' ? 'Crédits en cours, tontines ou retenues' : 'Ongoing loans or payroll deductions'}
                </span>
              </div>

              {/* Location / Diaspora */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  {formData.language === 'fr' ? 'Lieu de résidence' : 'Current Residence'}
                </label>
                <select
                  value={formData.location}
                  onChange={(e) => updateField('location', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  <option value="In Cameroon (Yaoundé / Douala)">{formData.language === 'fr' ? 'Au Cameroun (Résident)' : 'In Cameroon (Resident)'}</option>
                  <option value="Abroad (Diaspora - Europe)">{formData.language === 'fr' ? 'Diaspora (Europe)' : 'Diaspora (Europe)'}</option>
                  <option value="Abroad (Diaspora - North America)">{formData.language === 'fr' ? 'Diaspora (Amérique du Nord)' : 'Diaspora (North America)'}</option>
                  <option value="Abroad (Diaspora - Other)">{formData.language === 'fr' ? 'Diaspora (Autre pays)' : 'Diaspora (Other)'}</option>
                </select>
              </div>
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
                        {formData.language === 'fr' ? 'Félicitations ! Votre profil est éligible' : 'Congratulations! Your file is qualified'}
                      </h3>
                      <p className="text-xs text-emerald-800 mt-1 max-w-lg leading-relaxed">
                        {formData.language === 'fr'
                          ? 'Votre dossier présente tous les signaux favorables pour un accord bancaire CFC. Réservez votre consultation stratégique gratuite avec Gilgar pour lancer le montage.'
                          : 'Your answers align solidly with CFC underwriting rules. Book your free strategy session with Gilgar now to initiate official file preparation.'}
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
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                      <span>{formData.language === 'fr' ? 'Durée du prêt' : 'Loan Duration'}</span>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          min={5}
                          max={result.matchedProduct.maxTermYears}
                          value={simTerm}
                          onChange={(e) => setSimTerm(Math.min(result.matchedProduct.maxTermYears, Math.max(5, Number(e.target.value))))}
                          className="w-16 px-2 py-0.5 text-right font-bold text-accent border border-slate-200 rounded-lg text-xs"
                        />
                        <span className="text-[11px] text-slate-500">{formData.language === 'fr' ? 'ans' : 'years'}</span>
                      </div>
                    </div>
                    <Slider
                      value={[simTerm]}
                      min={5}
                      max={result.matchedProduct.maxTermYears}
                      step={1}
                      onValueChange={(val) => setSimTerm(val[0])}
                    />
                  </div>

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
          </div>
        )}
      </main>
    </div>
  );
}
