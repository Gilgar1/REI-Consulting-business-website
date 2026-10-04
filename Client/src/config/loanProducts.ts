/**
 * Crédit Foncier du Cameroun (CFC) Loan Products Catalogue
 * Compiled from official CFC documentation and bilingual loan product specifications.
 */

export interface LoanProduct {
  id: string;
  category: 'home' | 'rental';
  label: { en: string; fr: string };
  description: { en: string; fr: string };
  annualInterestRate: number; // e.g. 0.06 for 6% TTC
  minContributionPct: number; // e.g. 0.20 for 20%
  maxTermYears: number;
  minTermYears: number;
  maxLoanAmount: number; // in FCFA (XAF)
  minLoanAmount: number; // in FCFA (XAF)
  maxAge?: number; // e.g. 35 for Youth product
  gracePeriodMonths: number;
  insuranceAnnualPct: number; // typically 0.30%
  upfrontFeeRate: number; // e.g. 0.005 (0.50% setup fee)
  instructionsFeeRate: number; // e.g. 0.0005 (0.05% instruction fee)
  dtiCap: number; // 0.33 standard
  eligibleOperations: string[];
}

export const CFC_LOAN_PRODUCTS: LoanProduct[] = [
  {
    id: 'cfc-classique-jeune',
    category: 'home',
    label: {
      en: 'Youth Classic Loan (Prêt Foncier Classique Jeune)',
      fr: 'Prêt Foncier Classique Jeune',
    },
    description: {
      en: 'Preferred terms for young professionals under 35 with at least 2 years tenure.',
      fr: 'Conditions préférentielles pour les jeunes de moins de 35 ans en CDI depuis au moins 2 ans.',
    },
    annualInterestRate: 0.0375, // 3.75% TTC (or 4.0% if salary > 300k)
    minContributionPct: 0.0, // 0% up to 10%
    maxTermYears: 30,
    minTermYears: 5,
    maxLoanAmount: 50000000, // 50M FCFA
    minLoanAmount: 5000000,
    maxAge: 35,
    gracePeriodMonths: 12,
    insuranceAnnualPct: 0.003,
    upfrontFeeRate: 0.005,
    instructionsFeeRate: 0.0005,
    dtiCap: 0.33,
    eligibleOperations: ['land', 'land_construction', 'construction', 'acquisition', 'acquisition_works'],
  },
  {
    id: 'cfc-classique-social',
    category: 'home',
    label: {
      en: 'Social Classic Loan (Prêt Foncier Classique Social)',
      fr: 'Prêt Foncier Classique Social',
    },
    description: {
      en: 'Subsidized rate for affordable housing and economic residential projects.',
      fr: 'Taux subventionné pour le logement social et économique avec plafonds de coût.',
    },
    annualInterestRate: 0.05, // 5% TTC
    minContributionPct: 0.10, // 10%
    maxTermYears: 25,
    minTermYears: 5,
    maxLoanAmount: 30000000, // 30M FCFA
    minLoanAmount: 3000000,
    gracePeriodMonths: 12,
    insuranceAnnualPct: 0.003,
    upfrontFeeRate: 0.005,
    instructionsFeeRate: 0.0005,
    dtiCap: 0.33,
    eligibleOperations: ['land', 'land_construction', 'construction', 'acquisition', 'refinancing'],
  },
  {
    id: 'cfc-classique-acquereur',
    category: 'home',
    label: {
      en: 'Purchase Classic Loan (Prêt Foncier Classique Acquéreur)',
      fr: 'Prêt Foncier Classique Acquéreur',
    },
    description: {
      en: 'For buyers purchasing from accredited real estate developers partnered with CFC.',
      fr: 'Pour les acquéreurs de programmes initiés par des promoteurs conventionnés CFC.',
    },
    annualInterestRate: 0.06, // 6% TTC
    minContributionPct: 0.10, // 10%
    maxTermYears: 25,
    minTermYears: 5,
    maxLoanAmount: 150000000, // 150M FCFA
    minLoanAmount: 10000000,
    gracePeriodMonths: 12,
    insuranceAnnualPct: 0.003,
    upfrontFeeRate: 0.005,
    instructionsFeeRate: 0.0005,
    dtiCap: 0.33,
    eligibleOperations: ['land', 'acquisition', 'acquisition_works'],
  },
  {
    id: 'cfc-classique-ordinaire',
    category: 'home',
    label: {
      en: 'Ordinary Classic Loan (Prêt Foncier Classique Ordinaire)',
      fr: 'Prêt Foncier Classique Ordinaire',
    },
    description: {
      en: 'Standard residential mortgage for medium and high-standing private homes.',
      fr: 'Financement standard pour projets résidentiels de moyen et haut standing.',
    },
    annualInterestRate: 0.06, // 6% TTC
    minContributionPct: 0.20, // 20%
    maxTermYears: 25,
    minTermYears: 5,
    maxLoanAmount: 150000000, // 150M FCFA
    minLoanAmount: 10000000,
    gracePeriodMonths: 12,
    insuranceAnnualPct: 0.003,
    upfrontFeeRate: 0.005,
    instructionsFeeRate: 0.0005,
    dtiCap: 0.33,
    eligibleOperations: ['land', 'land_construction', 'construction', 'acquisition', 'refinancing', 'finishing'],
  },
  {
    id: 'cfc-locatif-social',
    category: 'rental',
    label: {
      en: 'Social Rental Loan (Prêt Foncier Locatif Social)',
      fr: 'Prêt Foncier Locatif Social',
    },
    description: {
      en: 'Financing for rental buildings with moderate rents, like student residences.',
      fr: 'Formule pour projets locatifs à loyers modérés, ex. cités universitaires.',
    },
    annualInterestRate: 0.05, // 5% TTC
    minContributionPct: 0.50, // 50%
    maxTermYears: 25, // 25 yrs individuals, 30 yrs entities
    minTermYears: 5,
    maxLoanAmount: 125000000, // 125M individuals (250M entities)
    minLoanAmount: 20000000,
    gracePeriodMonths: 36,
    insuranceAnnualPct: 0.0035,
    upfrontFeeRate: 0.005,
    instructionsFeeRate: 0.0005,
    dtiCap: 0.40,
    eligibleOperations: ['rental_building', 'student_housing', 'renovation', 'finishing'],
  },
  {
    id: 'cfc-locatif-ordinaire',
    category: 'rental',
    label: {
      en: 'Ordinary Rental Loan (Prêt Foncier Locatif Ordinaire)',
      fr: 'Prêt Foncier Locatif Ordinaire',
    },
    description: {
      en: 'Income-generating residential buildings with repayment structured on expected rents.',
      fr: 'Immeubles de rapport de moyen/haut standing remboursés principalement par les loyers.',
    },
    annualInterestRate: 0.07, // 7% TTC
    minContributionPct: 0.50, // 50%
    maxTermYears: 25,
    minTermYears: 5,
    maxLoanAmount: 250000000, // 250M individuals (500M entities)
    minLoanAmount: 25000000,
    gracePeriodMonths: 36,
    insuranceAnnualPct: 0.0035,
    upfrontFeeRate: 0.005,
    instructionsFeeRate: 0.0005,
    dtiCap: 0.40,
    eligibleOperations: ['rental_building', 'renovation', 'finishing'],
  },
];

export const DEFAULT_HOME_PRODUCT = CFC_LOAN_PRODUCTS[3]; // Ordinary Classic
export const DEFAULT_RENTAL_PRODUCT = CFC_LOAN_PRODUCTS[5]; // Ordinary Rental
