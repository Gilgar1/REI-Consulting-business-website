import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CFC_LOAN_PRODUCTS, LoanProduct } from '../config/loanProducts';
import {
  calculateLoan,
  calculateReverseLoan,
  formatFCFA,
  formatNumberOnly,
  parseFormattedNumber,
  LoanCalculationResult,
} from '../utils/loanEngine';
import { generateLoanSummaryPDF } from '../utils/pdfGenerator';
import { useLanguage } from '../i18n/LanguageContext';
import { Slider } from '../components/ui/slider';
import { Button } from '../components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../components/ui/dialog';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';
import {
  Calculator,
  Download,
  Building,
  Home,
  ArrowRight,
  TrendingUp,
  Percent,
  Calendar,
  AlertCircle,
  HelpCircle,
  CheckCircle2,
  FileText,
  ChevronDown,
  ChevronUp,
  Info,
  ExternalLink,
  MapPin,
  ShieldCheck,
  Search,
} from 'lucide-react';
import { CAMEROON_REGIONS } from '../utils/constants';

export function LoanSimulatorPage() {
  const { language } = useLanguage();

  // Mode: Home vs Rental
  const [category, setCategory] = useState<'home' | 'rental'>('home');
  // Calculation direction: forward (from price) vs reverse (from monthly payment budget)
  const [calcDirection, setCalcDirection] = useState<'forward' | 'reverse'>('forward');

  // Filter products by selected category
  const availableProducts = useMemo(() => {
    return CFC_LOAN_PRODUCTS.filter((p) => p.category === category);
  }, [category]);

  // Selected product
  const [selectedProductId, setSelectedProductId] = useState<string>(
    category === 'home' ? 'cfc-classique-ordinaire' : 'cfc-locatif-ordinaire'
  );

  const activeProduct = useMemo(() => {
    return (
      availableProducts.find((p) => p.id === selectedProductId) ||
      availableProducts[0] ||
      CFC_LOAN_PRODUCTS[3]
    );
  }, [availableProducts, selectedProductId]);

  // Learn More Product Modal State
  const [learnMoreProduct, setLearnMoreProduct] = useState<LoanProduct | null>(null);

  // Property Location & Titled Land Question (CFC Requirement)
  const [hasTitle, setHasTitle] = useState<boolean>(true);
  const [propertyRegion, setPropertyRegion] = useState<string>('Centre');
  const [isRegionDropdownOpen, setIsRegionDropdownOpen] = useState<boolean>(false);
  const [regionSearchQuery, setRegionSearchQuery] = useState<string>('');

  // Forward Mode State (Default balance everywhere as 0 per user requirement!)
  const [propertyPrice, setPropertyPrice] = useState<number>(0);
  const [contributionPct, setContributionPct] = useState<number>(
    category === 'rental' ? 0.50 : 0.20
  );
  const [termYears, setTermYears] = useState<number>(15);

  // Borrower Age State (Max retirement age is 65 years)
  const [clientAge, setClientAge] = useState<number>(35);

  // Maximum repayment term capped by retirement at 65 (e.g. 35yo => max 30y, 40yo => max 25y, 50yo => max 15y)
  const maxAllowedTerm = useMemo(() => {
    const yearsUntilRetirement = Math.max(1, 65 - clientAge);
    return Math.min(activeProduct.maxTermYears, yearsUntilRetirement);
  }, [activeProduct.maxTermYears, clientAge]);

  const minAllowedTerm = useMemo(() => {
    return Math.min(activeProduct.minTermYears, maxAllowedTerm);
  }, [activeProduct.minTermYears, maxAllowedTerm]);

  // Automatically clamp termYears if clientAge changes or product changes
  useEffect(() => {
    if (termYears > maxAllowedTerm) {
      setTermYears(maxAllowedTerm);
    } else if (termYears < minAllowedTerm) {
      setTermYears(minAllowedTerm);
    }
  }, [maxAllowedTerm, minAllowedTerm, termYears]);

  // Rental specific State (Default 0)
  const [expectedMonthlyRent, setExpectedMonthlyRent] = useState<number>(0);
  const [vacancyPct, setVacancyPct] = useState<number>(0.10);

  // Reverse Mode State (Default 0)
  const [monthlyBudget, setMonthlyBudget] = useState<number>(0);

  // Schedule toggle
  const [showSchedule, setShowSchedule] = useState(false);
  const [generatingPDF, setGeneratingPDF] = useState(false);

  // Youth Loan Tiered Rate state (<300,000 => 3.75%, >=300,000 => 4.00%)
  const [youthIncomeBracket, setYouthIncomeBracket] = useState<'<300k' | '>=300k'>('<300k');

  const effectiveInterestRate = useMemo(() => {
    if (activeProduct.id === 'cfc-classique-jeune') {
      return youthIncomeBracket === '<300k' ? 0.0375 : 0.0400;
    }
    return activeProduct.annualInterestRate;
  }, [activeProduct, youthIncomeBracket]);

  // Forward calculation result
  const calculationResult: LoanCalculationResult = useMemo(() => {
    return calculateLoan({
      propertyPrice,
      contributionPct,
      annualInterestRate: effectiveInterestRate,
      termYears,
      insuranceAnnualPct: activeProduct.insuranceAnnualPct,
      expectedMonthlyRent: category === 'rental' && expectedMonthlyRent > 0 ? expectedMonthlyRent : undefined,
      vacancyRate: vacancyPct,
    });
  }, [propertyPrice, contributionPct, activeProduct, effectiveInterestRate, termYears, category, expectedMonthlyRent, vacancyPct]);

  // Reverse calculation result
  const reverseResult = useMemo(() => {
    return calculateReverseLoan({
      monthlyBudget,
      annualInterestRate: effectiveInterestRate,
      termYears,
      contributionPct,
      insuranceAnnualPct: activeProduct.insuranceAnnualPct,
    });
  }, [monthlyBudget, activeProduct, effectiveInterestRate, termYears, contributionPct]);

  // Chart data
  const chartData = useMemo(() => {
    if (calculationResult.loanAmount === 0 && calculationResult.totalInterest === 0) {
      return [
        { name: language === 'fr' ? 'En attente de saisie' : 'Awaiting Input', value: 1, color: '#E2E8F0' },
      ];
    }
    return [
      { name: language === 'fr' ? 'Capital emprunté' : 'Principal Loan', value: calculationResult.loanAmount, color: '#0F172A' },
      { name: language === 'fr' ? 'Intérêts totaux' : 'Total Interest', value: calculationResult.totalInterest, color: '#D97706' },
      { name: language === 'fr' ? 'Assurance' : 'Insurance', value: calculationResult.totalInsurance, color: '#3B82F6' },
    ];
  }, [calculationResult, language]);

  const handleDownloadPDF = async () => {
    if (propertyPrice === 0 && monthlyBudget === 0) {
      alert(language === 'fr' ? 'Veuillez saisir un montant de projet pour exporter la synthèse.' : 'Please enter a project price before generating the PDF summary.');
      return;
    }
    try {
      setGeneratingPDF(true);
      await generateLoanSummaryPDF(
        calculationResult,
        language === 'fr' ? activeProduct.label.fr : activeProduct.label.en,
        language
      );
    } catch (err) {
      console.error('PDF error:', err);
    } finally {
      setGeneratingPDF(false);
    }
  };

  const handleCategorySwitch = (newCategory: 'home' | 'rental') => {
    setCategory(newCategory);
    const newProds = CFC_LOAN_PRODUCTS.filter((p) => p.category === newCategory);
    if (newProds.length > 0) {
      setSelectedProductId(newProds[0].id);
      setContributionPct(newProds[0].minContributionPct);
    }
  };

  const handleProductChange = (prodId: string) => {
    setSelectedProductId(prodId);
    const prod = CFC_LOAN_PRODUCTS.find((p) => p.id === prodId);
    if (prod && contributionPct < prod.minContributionPct) {
      setContributionPct(prod.minContributionPct);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col font-sans">
      {/* Top Banner Header */}
      <section className="bg-primary text-white py-12 md:py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#d97706_1px,transparent_1px)] [background-size:24px_24px] opacity-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-accent font-semibold text-xs mb-3">
            <Calculator className="w-3.5 h-3.5" />
            {language === 'fr' ? 'Estimateur de Prêt Indépendant par REI Consulting' : 'Independent Loan Estimator by REI Consulting'}
          </div>
          <h1 className="font-heading font-bold text-3xl md:text-5xl text-white mb-3">
            {language === 'fr' ? 'Simulateur de Prêt Immobilier' : 'Real Estate Loan Simulator'}
          </h1>
          <p className="text-slate-300 text-sm md:text-base max-w-2xl mx-auto">
            {language === 'fr'
              ? 'Estimez vos mensualités, l\'apport personnel requis et les flux de trésorerie de votre investissement d\'après les conditions de prêt publiées du Crédit Foncier du Cameroun.'
              : 'Estimate your monthly payments, required down payment, and investment cash flows based on published Crédit Foncier du Cameroun loan terms.'}
          </p>
          <div className="mt-4 inline-flex items-center justify-center gap-2 text-xs text-amber-200/90 bg-white/10 backdrop-blur-md border border-amber-400/30 px-4 py-2 rounded-xl max-w-2xl mx-auto text-left sm:text-center">
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
            <span>
              {language === 'fr'
                ? 'Ce simulateur n\'est pas l\'outil officiel du CFC. Il s\'agit d\'un outil indépendant créé par REI Consulting pour vous donner une estimation approximative. Les conditions finales, les taux et l\'approbation sont déterminés exclusivement par le CFC.'
                : 'This is not the official CFC loan simulator. It is an independent tool created by REI Consulting to give you a rough estimate. Final terms, rates, and approval are determined solely by CFC.'}
            </span>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full -mt-6 relative z-20">
        {/* Purpose / Simulator Category Tabs */}
        <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-100 flex flex-col sm:flex-row gap-2 mb-8">
          <button
            onClick={() => handleCategorySwitch('home')}
            className={`flex-1 py-3 px-6 rounded-xl font-bold text-sm flex items-center justify-center gap-2.5 transition-all ${
              category === 'home'
                ? 'bg-primary text-white shadow-md'
                : 'text-slate-600 hover:text-primary hover:bg-slate-50'
            }`}
          >
            <Home className="w-4 h-4 text-accent" />
            <span>{language === 'fr' ? 'Habitation Personnelle' : 'Personal Residence'}</span>
            <span className="text-[11px] font-normal opacity-80 hidden md:inline">
              ({language === 'fr' ? 'Achat ou construction pour soi' : 'Buy or build to live in'})
            </span>
          </button>

          <button
            onClick={() => handleCategorySwitch('rental')}
            className={`flex-1 py-3 px-6 rounded-xl font-bold text-sm flex items-center justify-center gap-2.5 transition-all ${
              category === 'rental'
                ? 'bg-primary text-white shadow-md'
                : 'text-slate-600 hover:text-primary hover:bg-slate-50'
            }`}
          >
            <Building className="w-4 h-4 text-accent" />
            <span>{language === 'fr' ? 'Investissement Locatif' : 'Rental Investment'}</span>
            <span className="text-[11px] font-normal opacity-80 hidden md:inline">
              ({language === 'fr' ? 'Immeubles de rapport remboursés par les loyers' : 'Income properties paid by rent'})
            </span>
          </button>
        </div>

        {/* Direction Switcher (Forward vs Reverse) */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setCalcDirection('forward')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                calcDirection === 'forward' ? 'bg-white text-primary shadow-sm' : 'text-slate-600 hover:text-primary'
              }`}
            >
              {language === 'fr' ? 'Je connais le prix du projet' : 'I know the project price'}
            </button>
            <button
              onClick={() => setCalcDirection('reverse')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                calcDirection === 'reverse' ? 'bg-white text-primary shadow-sm' : 'text-slate-600 hover:text-primary'
              }`}
            >
              {language === 'fr' ? 'Je pars de mon budget mensuel (Mode Inversé)' : 'Calculate from my monthly budget'}
            </button>
          </div>

          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            {language === 'fr' ? 'Calcul en direct, sans rechargement' : 'Live recalculation enabled'}
          </div>
        </div>

        {/* 2-Column Desktop Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN: Inputs & Configuration */}
          <div className="lg:col-span-6 space-y-6">
            {/* 1. Loan Product Card Selection */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                  {language === 'fr' ? 'Formule de Crédit CFC' : 'CFC Loan Product'}
                </label>
                <span className="text-[11px] text-slate-500">
                  {availableProducts.length} {language === 'fr' ? 'variantes disponibles' : 'options available'}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {availableProducts.map((prod) => {
                  const isSelected = prod.id === selectedProductId;
                  return (
                    <div
                      key={prod.id}
                      onClick={() => handleProductChange(prod.id)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all relative ${
                        isSelected
                          ? 'border-accent bg-amber-50/40 shadow-sm ring-1 ring-accent'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <span className="font-bold text-sm text-primary pr-2">
                          {language === 'fr' ? prod.label.fr : prod.label.en}
                        </span>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-900 whitespace-nowrap">
                            {prod.id === 'cfc-classique-jeune'
                              ? `${(isSelected ? effectiveInterestRate : prod.annualInterestRate) * 100}% TTC`
                              : `${(prod.annualInterestRate * 100).toFixed(2)}% TTC`}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700 whitespace-nowrap">
                            {Math.round(prod.minContributionPct * 100)}% min
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-500 leading-relaxed mb-3">
                        {language === 'fr' ? prod.description.fr : prod.description.en}
                      </p>

                      {/* Warning if borrower is 35 or older for youth loan */}
                      {prod.id === 'cfc-classique-jeune' && clientAge >= 35 && (
                        <div className="mb-3 px-2.5 py-1.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-[11px] flex items-center gap-1.5">
                          <span>⚠️</span>
                          <span>{language === 'fr' ? `Votre âge (${clientAge} ans) dépasse le plafond du Prêt Jeune (< 35 ans). Optez pour le Prêt Ordinaire ou Social.` : `Your age (${clientAge} yrs) exceeds the Youth Loan limit (< 35 yrs). Consider the Ordinary or Social Loan.`}</span>
                        </div>
                      )}

                      {/* Youth Loan Tier Selector if Selected */}
                      {isSelected && prod.id === 'cfc-classique-jeune' && (
                        <div className="mb-3 p-3 rounded-xl bg-amber-100/70 border border-amber-300/80 space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-amber-950">
                              {language === 'fr' ? 'Revenu mensuel de l\'emprunteur :' : 'Borrower monthly income:'}
                            </span>
                            <span className="text-[11px] font-extrabold text-accent">
                              {youthIncomeBracket === '<300k' ? '3.75% TTC' : '4.00% TTC'}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setYouthIncomeBracket('<300k');
                              }}
                              className={`py-1.5 px-2 rounded-lg font-bold transition-all text-center ${
                                youthIncomeBracket === '<300k'
                                  ? 'bg-primary text-white shadow-sm'
                                  : 'bg-white text-slate-700 hover:bg-amber-50 border border-amber-200'
                              }`}
                            >
                              {language === 'fr' ? '< 300 000 FCFA (3,75%)' : '< 300,000 FCFA (3.75%)'}
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setYouthIncomeBracket('>=300k');
                              }}
                              className={`py-1.5 px-2 rounded-lg font-bold transition-all text-center ${
                                youthIncomeBracket === '>=300k'
                                  ? 'bg-primary text-white shadow-sm'
                                  : 'bg-white text-slate-700 hover:bg-amber-50 border border-amber-200'
                              }`}
                            >
                              {language === 'fr' ? '≥ 300 000 FCFA (4,00%)' : '≥ 300,000 FCFA (4.00%)'}
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Bottom row with Learn More button on bottom right */}
                      <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                        <span className="text-[11px] text-slate-400">
                          {language === 'fr' ? `Plafond : ${formatFCFA(prod.maxLoanAmount, language)}` : `Cap: ${formatFCFA(prod.maxLoanAmount, language)}`}
                        </span>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setLearnMoreProduct(prod);
                          }}
                          className="inline-flex items-center gap-1 text-xs font-bold text-accent hover:text-accent/80 hover:underline"
                        >
                          <span>{language === 'fr' ? 'En savoir plus' : 'Learn More'}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Property Location & Titled Land Question (CFC Deal-Breaker) */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-5">
              <h3 className="text-sm font-bold uppercase tracking-wider text-primary flex items-center gap-2">
                <MapPin className="w-4 h-4 text-accent" />
                <span>{language === 'fr' ? 'Localisation & Sécurité Foncière du Bien' : 'Property Location & Land Title Status'}</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Searchable Region in Cameroon */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                    {language === 'fr' ? 'Région au Cameroun' : 'Region in Cameroon'}
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsRegionDropdownOpen(!isRegionDropdownOpen)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold flex items-center justify-between text-left focus:outline-none focus:ring-2 focus:ring-accent"
                    >
                      <span className="text-slate-800">
                        {CAMEROON_REGIONS.find((r) => r.id === propertyRegion)?.[language === 'fr' ? 'fr' : 'en'] || propertyRegion}
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
                            placeholder={language === 'fr' ? 'Rechercher une région...' : 'Search a region...'}
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
                                setPropertyRegion(reg.id);
                                setIsRegionDropdownOpen(false);
                                setRegionSearchQuery('');
                              }}
                              className={`w-full px-3.5 py-2 text-left text-xs font-medium hover:bg-slate-50 flex items-center justify-between ${
                                propertyRegion === reg.id ? 'bg-accent/10 text-accent font-bold' : 'text-slate-700'
                              }`}
                            >
                              <span>{language === 'fr' ? reg.fr : reg.en}</span>
                              {propertyRegion === reg.id && <CheckCircle2 className="w-3.5 h-3.5 text-accent" />}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Titled Land Question */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                    {language === 'fr' ? 'Le bien a-t-il un Titre Foncier ?' : 'Is the property covered by a Land Title?'}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setHasTitle(true)}
                      className={`py-2.5 px-3 rounded-xl font-bold text-xs border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        hasTitle
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      <span>{language === 'fr' ? 'Oui (Titré)' : 'Yes (Titled)'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setHasTitle(false)}
                      className={`py-2.5 px-3 rounded-xl font-bold text-xs border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        !hasTitle
                          ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{language === 'fr' ? 'Non (Non titré)' : 'No (Untitled)'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {!hasTitle && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-900 space-y-1 animate-fade-in">
                  <div className="font-bold flex items-center gap-1.5 text-rose-700">
                    <ShieldCheck className="w-4 h-4 shrink-0" />
                    <span>
                      {language === 'fr'
                        ? 'Condition bloquante CFC : Titre Foncier obligatoire'
                        : 'CFC Deal-Breaker: Registered Land Title (Titre Foncier) is Mandatory'}
                    </span>
                  </div>
                  <p className="leading-relaxed text-[11.5px] text-rose-800">
                    {language === 'fr'
                      ? 'Le Crédit Foncier du Cameroun (CFC) exige impérativement un Titre Foncier pour toute hypothèque. Les terrains non titrés ne peuvent pas obtenir de financement. REI Consulting vous accompagne dans la vérification et la régularisation de votre titre.'
                      : 'Crédit Foncier du Cameroun strictly requires a legally registered Land Title (Titre Foncier) to approve mortgage loans. Untitled land cannot be financed. REI Consulting can assist you with title search, verification, and regularization.'}
                  </p>
                </div>
              )}
            </div>

            {/* 2. Numerical Inputs (Sliders + Linked Exact Number Boxes) */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
              {calcDirection === 'forward' ? (
                <>
                  {/* Property Price Slider + Text Input */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                        {language === 'fr' ? 'Coût total du projet / Prix' : 'Total Project Cost / Price'}
                      </label>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="text"
                          value={propertyPrice === 0 ? '' : formatNumberOnly(propertyPrice, language)}
                          placeholder="0"
                          onChange={(e) => {
                            const parsed = parseFormattedNumber(e.target.value);
                            setPropertyPrice(parsed);
                          }}
                          className="w-40 px-3 py-1.5 text-right font-bold text-primary border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                        />
                        <span className="text-xs font-bold text-slate-500">FCFA</span>
                      </div>
                    </div>
                    <Slider
                      value={[propertyPrice]}
                      min={0}
                      max={activeProduct.maxLoanAmount * 1.5}
                      step={500000}
                      onValueChange={(val) => setPropertyPrice(val[0])}
                    />
                    <div className="flex justify-between text-[11px] text-slate-400">
                      <span>0 FCFA</span>
                      <span className="font-semibold text-slate-700">{formatFCFA(propertyPrice, language)}</span>
                      <span>{formatFCFA(activeProduct.maxLoanAmount * 1.5, language)}</span>
                    </div>
                  </div>

                  {/* Contribution Percentage Slider + Manual Inputs (FCFA & %) */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                        {language === 'fr' ? 'Apport personnel (Fonds propres)' : 'Personal Contribution (Equity)'}
                      </label>
                      <div className="flex items-center gap-2">
                        {/* Amount in FCFA */}
                        <div className="flex items-center gap-1">
                          <input
                            type="text"
                            value={formatNumberOnly(propertyPrice * contributionPct, language)}
                            onChange={(e) => {
                              const amount = parseFormattedNumber(e.target.value);
                              if (propertyPrice > 0) {
                                setContributionPct(Math.min(1, Math.max(0, amount / propertyPrice)));
                              }
                            }}
                            className="w-32 px-2.5 py-1 text-right font-bold text-accent border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-accent"
                          />
                          <span className="text-[11px] text-slate-500 font-semibold">FCFA</span>
                        </div>
                        {/* Pct in % */}
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            min={Math.round(activeProduct.minContributionPct * 100)}
                            max={100}
                            value={Math.round(contributionPct * 100)}
                            onChange={(e) => {
                              const pct = Math.min(100, Math.max(0, Number(e.target.value)));
                              setContributionPct(pct / 100);
                            }}
                            className="w-16 px-2 py-1 text-right font-bold text-accent border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-accent"
                          />
                          <span className="text-xs font-bold text-slate-500">%</span>
                        </div>
                      </div>
                    </div>
                    <Slider
                      value={[Math.round(contributionPct * 100)]}
                      min={Math.round(activeProduct.minContributionPct * 100)}
                      max={80}
                      step={1}
                      onValueChange={(val) => setContributionPct(val[0] / 100)}
                    />
                    <div className="flex justify-between text-[11px] text-slate-400">
                      <span>Min: {Math.round(activeProduct.minContributionPct * 100)}%</span>
                      <span>80%</span>
                    </div>
                  </div>
                </>
              ) : (
                /* Reverse Mode: Monthly Budget Slider + Text Input */
                <div className="space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      {language === 'fr' ? 'Votre capacité de remboursement mensuelle' : 'Target Monthly Repayment Budget'}
                    </label>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="text"
                        value={monthlyBudget === 0 ? '' : formatNumberOnly(monthlyBudget, language)}
                        placeholder="0"
                        onChange={(e) => {
                          const parsed = parseFormattedNumber(e.target.value);
                          setMonthlyBudget(parsed);
                        }}
                        className="w-36 px-3 py-1.5 text-right font-bold text-accent border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                      />
                      <span className="text-xs font-bold text-slate-500">FCFA</span>
                    </div>
                  </div>
                  <Slider
                    value={[monthlyBudget]}
                    min={0}
                    max={2500000}
                    step={10000}
                    onValueChange={(val) => setMonthlyBudget(val[0])}
                  />
                  <div className="p-3 bg-amber-50 rounded-xl text-xs text-amber-900 border border-amber-200">
                    <p className="font-semibold">
                      {language === 'fr' ? 'Projection Mode Inversé :' : 'Reverse Mode Projection:'}
                    </p>
                    <p className="mt-1">
                      {monthlyBudget === 0 ? (
                        <span>{language === 'fr' ? 'Saisissez votre budget mensuel pour voir le capital empruntable.' : 'Enter your monthly budget to see maximum borrowable capital.'}</span>
                      ) : (
                        <>
                          {language === 'fr'
                            ? `Avec ${formatFCFA(monthlyBudget, language)}/mois sur ${termYears} ans, vous pouvez emprunter jusqu'à `
                            : `With ${formatFCFA(monthlyBudget, language)}/mo over ${termYears} yrs, you can borrow up to `}
                          <strong className="text-primary">{formatFCFA(reverseResult.maxLoanAmount, language)}</strong>
                          {language === 'fr' ? ' pour un projet d\'une valeur de ' : ' for a project worth '}
                          <strong className="text-primary">{formatFCFA(reverseResult.maxPropertyPrice, language)}</strong>.
                        </>
                      )}
                    </p>
                  </div>
                </div>
              )}

              {/* Borrower Age Question (Retirement ceiling: 65 years) */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                      {language === 'fr' ? 'Âge de l\'emprunteur' : 'Borrower Age'}
                    </label>
                    <span className="text-[11px] text-slate-400">
                      {language === 'fr' ? 'Plafond retraite CFC : 65 ans' : 'CFC retirement payoff ceiling: 65 yrs'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      min={18}
                      max={75}
                      value={clientAge}
                      onChange={(e) => {
                        const val = Math.min(75, Math.max(18, Number(e.target.value) || 18));
                        setClientAge(val);
                      }}
                      className="w-20 px-2 py-1 text-right font-bold text-primary border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                    <span className="text-xs font-bold text-slate-500">{language === 'fr' ? 'ans' : 'years'}</span>
                  </div>
                </div>
                <Slider
                  value={[clientAge]}
                  min={18}
                  max={65}
                  step={1}
                  onValueChange={(val) => setClientAge(val[0])}
                />
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-slate-400">18 {language === 'fr' ? 'ans' : 'yrs'}</span>
                  <span className="font-semibold text-accent">
                    {clientAge >= 65 ? (
                      language === 'fr' ? '⚠️ Retraite atteinte (65 ans)' : '⚠️ Retirement reached (65 yrs)'
                    ) : (
                      language === 'fr'
                        ? `Durée max : ${maxAllowedTerm} ans (65 - ${clientAge} ans)`
                        : `Max payoff: ${maxAllowedTerm} yrs (65 - ${clientAge} yrs)`
                    )}
                  </span>
                  <span className="text-slate-400">65 {language === 'fr' ? 'ans (retraite)' : 'yrs (retire)'}</span>
                </div>
              </div>

              {/* Term Duration Slider + Text Input */}
              <div className="space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                      {language === 'fr' ? 'Durée de remboursement' : 'Loan Duration'}
                    </label>
                    <span className="text-[11px] text-slate-400">
                      {language === 'fr'
                        ? `Plafonné à 65 ans (max ${maxAllowedTerm} ans pour votre profil)`
                        : `Capped at age 65 (max ${maxAllowedTerm} yrs for your age)`}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      min={minAllowedTerm}
                      max={maxAllowedTerm}
                      value={termYears}
                      onChange={(e) => {
                        const val = Math.min(maxAllowedTerm, Math.max(minAllowedTerm, Number(e.target.value) || minAllowedTerm));
                        setTermYears(val);
                      }}
                      className="w-20 px-2 py-1 text-right font-bold text-primary border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                    <span className="text-xs font-bold text-slate-500">{language === 'fr' ? 'ans' : 'years'}</span>
                  </div>
                </div>
                <Slider
                  value={[termYears]}
                  min={minAllowedTerm}
                  max={maxAllowedTerm}
                  step={1}
                  onValueChange={(val) => setTermYears(val[0])}
                />
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>{minAllowedTerm} {language === 'fr' ? 'ans min' : 'yrs min'}</span>
                  <span className="font-semibold text-slate-700">{termYears} {language === 'fr' ? 'ans' : 'yrs'}</span>
                  <span>{maxAllowedTerm} {language === 'fr' ? 'ans max (retraite)' : 'yrs max (retire)'}</span>
                </div>
              </div>

              {/* Rental Specific Inputs (with Slider + Text Input) */}
              {category === 'rental' && (
                <div className="pt-4 border-t border-slate-100 space-y-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-accent">
                    {language === 'fr' ? 'Paramètres Locatifs' : 'Rental Yield Parameters'}
                  </p>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <label className="text-xs text-slate-600 font-medium">
                        {language === 'fr' ? 'Loyer mensuel espéré' : 'Expected Monthly Rent'}
                      </label>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="text"
                          value={expectedMonthlyRent === 0 ? '' : formatNumberOnly(expectedMonthlyRent, language)}
                          placeholder="0"
                          onChange={(e) => {
                            const parsed = parseFormattedNumber(e.target.value);
                            setExpectedMonthlyRent(parsed);
                          }}
                          className="w-36 px-2.5 py-1 text-right font-bold text-primary border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-accent"
                        />
                        <span className="text-xs font-bold text-slate-500">FCFA</span>
                      </div>
                    </div>
                    <Slider
                      value={[expectedMonthlyRent]}
                      min={0}
                      max={2000000}
                      step={25000}
                      onValueChange={(val) => setExpectedMonthlyRent(val[0])}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs text-slate-600 font-medium">
                      {language === 'fr' ? 'Taux de vacance locative' : 'Vacancy Allowance (%)'}
                    </label>
                    <select
                      value={vacancyPct}
                      onChange={(e) => setVacancyPct(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                    >
                      <option value={0.05}>5% ({language === 'fr' ? 'Zone très tendue' : 'High demand'})</option>
                      <option value={0.10}>10% ({language === 'fr' ? 'Standard CFC' : 'Standard 10%'})</option>
                      <option value={0.15}>15% ({language === 'fr' ? 'Prudent' : 'Conservative'})</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: Live Results & Visual Breakdown */}
          <div className="lg:col-span-6 space-y-6">
            {/* The Hero Number: Monthly Repayment Card */}
            <div className="bg-primary text-white p-6 sm:p-8 rounded-3xl shadow-xl shadow-slate-900/10 relative overflow-hidden">
              <div className="absolute right-0 top-0 w-36 h-36 bg-accent/20 rounded-full blur-3xl pointer-events-none" />

              <span className="text-xs uppercase tracking-widest font-bold text-accent block mb-1">
                {language === 'fr' ? 'Mensualité Totale Estimée' : 'Estimated Monthly Repayment'}
              </span>

              <div className="flex items-baseline gap-2">
                <span className="text-3xl sm:text-5xl font-heading font-extrabold text-white tracking-tight">
                  {formatFCFA(calculationResult.totalMonthlyPayment, language)}
                </span>
                <span className="text-slate-400 text-sm font-medium">/ {language === 'fr' ? 'mois' : 'mo'}</span>
              </div>

              {propertyPrice === 0 && monthlyBudget === 0 ? (
                <div className="mt-4 pt-4 border-t border-white/10 text-xs text-slate-300">
                  {language === 'fr'
                    ? 'Saisissez votre montant de projet ou utilisez le curseur pour voir le calcul en direct.'
                    : 'Enter your project amount or move the slider above to see live calculations.'}
                </div>
              ) : (
                <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-slate-300">
                  <div>
                    <span className="text-slate-400 block">{language === 'fr' ? 'Principal + Intérêts' : 'Principal + Int.'}</span>
                    <strong className="text-white text-sm">{formatFCFA(calculationResult.monthlyRepayment, language)}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">{language === 'fr' ? 'Assurance emprunteur' : 'Insurance'}</span>
                    <strong className="text-white text-sm">{formatFCFA(calculationResult.monthlyInsurance, language)}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">{language === 'fr' ? 'Montant emprunté' : 'Loan Borrowed'}</span>
                    <strong className="text-accent text-sm">{formatFCFA(calculationResult.loanAmount, language)}</strong>
                  </div>
                </div>
              )}
            </div>

            {/* Rental Cash-Flow Spotlight (If rental mode) */}
            {category === 'rental' && calculationResult.rentalMetrics && (
              <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-heading font-bold text-base text-primary flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-accent" />
                    {language === 'fr' ? 'Rentabilité & Cash-Flow Locatif' : 'Rental Yield & Cash-Flow'}
                  </h3>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-800">
                    Rendement Brut: {calculationResult.rentalMetrics.grossYield}%
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div className="p-3 rounded-xl bg-slate-50">
                    <p className="text-[11px] text-slate-500 font-medium">{language === 'fr' ? 'Cash-Flow Net Mensuel' : 'Net Monthly Cash-Flow'}</p>
                    <p className={`text-base font-extrabold mt-0.5 ${
                      calculationResult.rentalMetrics.monthlyCashFlow >= 0 ? 'text-emerald-600' : 'text-rose-600'
                    }`}>
                      {calculationResult.rentalMetrics.monthlyCashFlow >= 0 ? '+' : ''}
                      {formatFCFA(calculationResult.rentalMetrics.monthlyCashFlow, language)}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50">
                    <p className="text-[11px] text-slate-500 font-medium">{language === 'fr' ? 'Loyer d\'Équilibre' : 'Break-Even Rent'}</p>
                    <p className="text-base font-extrabold text-primary mt-0.5">
                      {formatFCFA(calculationResult.rentalMetrics.breakEvenRent, language)}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50">
                    <p className="text-[11px] text-slate-500 font-medium">{language === 'fr' ? 'Couverture dette (DSCR)' : 'Debt Coverage'}</p>
                    <p className={`text-base font-extrabold mt-0.5 ${
                      calculationResult.rentalMetrics.debtServiceCoverage >= 1.2 ? 'text-emerald-600' : 'text-amber-600'
                    }`}>
                      {calculationResult.rentalMetrics.debtServiceCoverage}x
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Visual Recharts Donut & Financial Breakdown */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-5">
              <h3 className="font-heading font-bold text-base text-primary">
                {language === 'fr' ? 'Répartition du Coût Total du Crédit' : 'Total Credit Cost Breakdown'}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                {/* Visual Donut Chart */}
                <div className="md:col-span-6 h-52 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={75}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(val: number) => formatFCFA(val, language)}
                        contentStyle={{ borderRadius: '8px', fontSize: '12px' }}
                      />
                      <Legend wrapperStyle={{ fontSize: '11px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Total Amount Paid Summary Card Beside Chart */}
                <div className="md:col-span-6 p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
                  <div>
                    <span className="text-[11px] uppercase tracking-wider font-bold text-slate-500">
                      {language === 'fr' ? 'Total remboursé au CFC' : 'Total Amount Paid for Loan'}
                    </span>
                    <div className="text-xl font-heading font-extrabold text-primary mt-0.5">
                      {formatFCFA(calculationResult.totalRepaid, language)}
                    </div>
                    <span className="text-[11px] text-slate-500 block">
                      {language === 'fr'
                        ? 'Capital emprunté + Intérêts + Assurance'
                        : 'Principal + Total Interest + Insurance'}
                    </span>
                  </div>

                  <div className="space-y-1.5 pt-2 border-t border-slate-200 text-xs text-slate-600">
                    <div className="flex justify-between">
                      <span>{language === 'fr' ? 'Capital emprunté :' : 'Principal Loan :'}</span>
                      <strong className="text-slate-900">{formatFCFA(calculationResult.loanAmount, language)}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>{language === 'fr' ? 'Intérêts totaux :' : 'Total Interest :'}</span>
                      <strong className="text-amber-700">{formatFCFA(calculationResult.totalInterest, language)}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>{language === 'fr' ? 'Assurance totale :' : 'Total Insurance :'}</span>
                      <strong className="text-blue-700">{formatFCFA(calculationResult.totalInsurance, language)}</strong>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200/80">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-700">
                        {language === 'fr' ? 'Total déboursé projet :' : 'Total Outlay Altogether :'}
                      </span>
                      <strong className="text-accent font-extrabold text-sm">
                        {formatFCFA(calculationResult.totalRepaid + calculationResult.cashNeededAtSigning, language)}
                      </strong>
                    </div>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      {language === 'fr'
                        ? '(Apport + Frais notariés & dossier + Total remboursé)'
                        : '(Equity + Signing fees + Total loan repaid)'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Cash Needed at Signing row */}
              <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200/60 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-amber-900">
                    {language === 'fr' ? 'Liquidités nécessaires à la signature' : 'Total Cash Needed at Signing'}
                  </p>
                  <p className="text-[11px] text-amber-700">
                    {language === 'fr' ? 'Apport + frais d\'instruction et notariés' : 'Equity + appraisal, setup & notary fees'}
                  </p>
                </div>
                <strong className="text-base font-extrabold text-amber-950">
                  {formatFCFA(calculationResult.cashNeededAtSigning, language)}
                </strong>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <Button
                  onClick={handleDownloadPDF}
                  disabled={generatingPDF}
                  variant="outline"
                  className="w-full sm:flex-1 border-slate-300 text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4 text-accent" />
                  {generatingPDF
                    ? (language === 'fr' ? 'Génération du PDF...' : 'Generating PDF...')
                    : (language === 'fr' ? 'Télécharger la Synthèse (PDF)' : 'Download PDF Summary')}
                </Button>

                <Button asChild className="w-full sm:flex-1 bg-accent hover:bg-accent/90 text-white shadow-sm">
                  <Link to="/eligibility" className="flex items-center justify-center gap-2">
                    <span>{language === 'fr' ? 'Tester mon Éligibilité' : 'Check My Eligibility'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </div>

              {/* CTA below results */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-amber-500/10 via-amber-50/60 to-primary/5 border border-amber-200/90 mt-2">
                <div className="flex flex-col gap-2.5">
                  <div className="flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-accent/15 flex items-center justify-center shrink-0 mt-0.5">
                      <Calendar className="w-3.5 h-3.5 text-accent" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-primary">
                        {language === 'fr'
                          ? 'Éligible et prêt à aller de l\'avant ?'
                          : 'Eligible and ready to move forward?'}
                      </h4>
                      <p className="text-[11.5px] text-slate-600 leading-relaxed mt-1">
                        {language === 'fr'
                          ? 'Réservez une consultation avec Ndah Gilgar Mbuh. REI Consulting aide ses clients à préparer et soumettre leurs dossiers de prêt CFC, et Gilgar possède une connaissance approfondie de la procédure du CFC.'
                          : 'Book a consultation with Ndah Gilgar Mbuh. REI Consulting helps clients prepare and submit CFC loan applications, and Gilgar has in-depth knowledge of the CFC loan process.'}
                      </p>
                    </div>
                  </div>
                  <Button asChild size="sm" className="w-full bg-primary hover:bg-primary/90 text-white text-xs font-bold shadow-sm">
                    <Link to="/book" className="flex items-center justify-center gap-2">
                      <span>{language === 'fr' ? 'Réserver une consultation' : 'Book a Consultation'}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-accent" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>

            {/* Toggleable Amortization Schedule */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <button
                onClick={() => setShowSchedule(!showSchedule)}
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-slate-50/80 transition-colors"
              >
                <div className="flex items-center gap-2 text-sm font-bold text-primary">
                  <Calendar className="w-4 h-4 text-accent" />
                  <span>{language === 'fr' ? 'Tableau d\'amortissement annuel' : 'Annual Amortization Table'}</span>
                </div>
                {showSchedule ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </button>

              {showSchedule && (
                <div className="p-4 border-t border-slate-100 overflow-x-auto max-h-72">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="border-b text-slate-400 uppercase font-semibold">
                        <th className="pb-2">{language === 'fr' ? 'Année' : 'Year'}</th>
                        <th className="pb-2">{language === 'fr' ? 'Capital remboursé' : 'Principal Repaid'}</th>
                        <th className="pb-2">{language === 'fr' ? 'Intérêts payés' : 'Interest Paid'}</th>
                        <th className="pb-2 text-right">{language === 'fr' ? 'Capital restant dû' : 'Remaining Balance'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {calculationResult.amortizationSchedule.map((row) => (
                        <tr key={row.year} className="hover:bg-slate-50/60">
                          <td className="py-2 font-bold text-primary">{language === 'fr' ? `An ${row.year}` : `Yr ${row.year}`}</td>
                          <td className="py-2 text-slate-700">{formatFCFA(row.principalPaid, language)}</td>
                          <td className="py-2 text-slate-600">{formatFCFA(row.interestPaid, language)}</td>
                          <td className="py-2 text-right font-medium text-slate-900">{formatFCFA(row.remainingBalance, language)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Disclaimer */}
            <p className="text-[11px] text-slate-400 leading-relaxed italic px-2">
              {language === 'fr'
                ? 'Ce simulateur n\'est pas l\'outil officiel du CFC. Il s\'agit d\'un outil indépendant créé par REI Consulting pour vous donner une estimation approximative. Les conditions finales, les taux et l\'approbation sont déterminés exclusivement par le CFC.'
                : 'This is not the official CFC loan simulator. It is an independent tool created by REI Consulting to give you a rough estimate. Final terms, rates, and approval are determined solely by CFC.'}
            </p>
          </div>
        </div>
      </div>

      {/* Learn More Product Detail Dialog */}
      <Dialog open={learnMoreProduct !== null} onOpenChange={(open) => !open && setLearnMoreProduct(null)}>
        {learnMoreProduct && (
          <DialogContent className="max-w-xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-accent text-xs font-bold w-fit mb-2">
                {(learnMoreProduct.annualInterestRate * 100).toFixed(2)}% TTC • {Math.round(learnMoreProduct.minContributionPct * 100)}% {language === 'fr' ? 'Apport min' : 'Min down payment'}
              </div>
              <DialogTitle className="text-xl font-heading font-bold text-primary">
                {language === 'fr' ? learnMoreProduct.label.fr : learnMoreProduct.label.en}
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500">
                {language === 'fr' ? learnMoreProduct.description.fr : learnMoreProduct.description.en}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-3 text-xs text-slate-700">
              <div className="grid grid-cols-2 gap-3 p-3.5 bg-slate-50 rounded-xl">
                <div>
                  <span className="text-slate-400 block font-medium">{language === 'fr' ? 'Plafond Empruntable' : 'Loan Ceiling'}</span>
                  <strong className="text-primary text-sm">{formatFCFA(learnMoreProduct.maxLoanAmount, language)}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">{language === 'fr' ? 'Durée Maximale' : 'Maximum Term'}</span>
                  <strong className="text-primary text-sm">{learnMoreProduct.maxTermYears} {language === 'fr' ? 'ans' : 'years'}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">{language === 'fr' ? 'Différé d\'Amortissement' : 'Grace Period'}</span>
                  <strong className="text-primary text-sm">{learnMoreProduct.gracePeriodMonths} {language === 'fr' ? 'mois' : 'months'}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">{language === 'fr' ? 'Assurance Annuelle' : 'Annual Insurance'}</span>
                  <strong className="text-primary text-sm">{(learnMoreProduct.insuranceAnnualPct * 100).toFixed(2)}%</strong>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-primary mb-2 text-sm">
                  {language === 'fr' ? 'Opérations et Projets Financés' : 'Eligible Projects & Operations'}
                </h4>
                <ul className="space-y-1.5 list-disc pl-4 text-slate-600">
                  {learnMoreProduct.eligibleOperations.map((op, i) => (
                    <li key={i} className="capitalize">
                      {op.replace(/_/g, ' ')}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200/60">
                <p className="font-bold text-amber-950 mb-1">
                  {language === 'fr' ? 'Conseil REI Consulting :' : 'REI Consulting Advisory Note:'}
                </p>
                <p className="text-amber-900 leading-relaxed text-[11px]">
                  {language === 'fr'
                    ? 'Le CFC exige la justification d\'un revenu régulier et la domiciliation bancaire irrévocable du salaire ou des loyers. Pour les chantiers de construction, un Titre Foncier et un devis quantitatif BET agréé sont impératifs.'
                    : 'Crédit Foncier du Cameroun requires proof of regular income and irrevocable domiciliation of salary or rental proceeds. For construction, a registered land title and certified bill of quantities are mandatory.'}
                </p>
              </div>
            </div>

            <DialogFooter className="flex items-center justify-between sm:justify-between pt-2 border-t">
              <Button variant="ghost" size="sm" onClick={() => setLearnMoreProduct(null)}>
                {language === 'fr' ? 'Fermer' : 'Close'}
              </Button>
              <Button asChild size="sm" className="bg-accent hover:bg-accent/90 text-white">
                <Link to="/book" onClick={() => setLearnMoreProduct(null)}>
                  {language === 'fr' ? 'Consulter un expert' : 'Book a Consultation'}
                </Link>
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
