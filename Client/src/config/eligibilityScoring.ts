/**
 * Eligibility Scoring Engine & Weight Configurations
 * Implements the 100-point multi-factor model from the Master Implementation Prompt and Eligibility Tool Build Plan.
 * All magic numbers and thresholds are exported named constants for easy tuning.
 */

import { CFC_LOAN_PRODUCTS, LoanProduct } from './loanProducts';
import { calculateLoan } from '../utils/loanEngine';

// ============================================================================
// CONFIGURABLE WEIGHTS & THRESHOLDS (Tuneable by Gilgar)
// ============================================================================

export const WEIGHT_CONTRIBUTION = 25;
export const THRESHOLD_CONTRIBUTION_MAX_PCT = 0.30; // 30% contribution gets full 25 pts

export const WEIGHT_TITLED_LAND = 15; // Full 15 if titled or not a build project

export const WEIGHT_DTI = 20;
export const THRESHOLD_DTI_OPTIMAL = 0.20; // <= 20% DTI gets full 20 pts
export const THRESHOLD_DTI_MAX = 0.50; // >= 50% DTI gets 0 pts

export const WEIGHT_EMPLOYMENT = 18;
export const PTS_SALARIED = 18;
export const PTS_SELF_EMPLOYED = 12;

export const WEIGHT_SAVINGS_BUFFER = 12;
export const THRESHOLD_SAVINGS_BUFFER_MAX_PCT = 0.10; // >= 10% of project cost gets full 12 pts

export const WEIGHT_AGE_TERM = 10;
export const RETIREMENT_AGE = 65;

export const BAND_QUALIFIED_MIN = 80;
export const BAND_WORKABLE_MIN = 60;

// ============================================================================
// TYPES
// ============================================================================

export type ScoreBand = 'qualified' | 'workable' | 'needs_work';

export interface ScoreInput {
  projectType: 'buy' | 'build';
  propertyPurpose: 'residential' | 'rental' | 'development';
  projectCost: number; // in FCFA
  ownFunds: number; // in FCFA
  totalDebt: number; // in FCFA
  totalSavings: number; // in FCFA
  age: number;
  monthlyIncome: number; // in FCFA
  employmentType: 'salaried' | 'self-employed';
  hasTitle: boolean | null; // null if not build
  location: string;
}

export interface ScoreFactorBreakdown {
  contributionPts: number;
  titledLandPts: number;
  dtiPts: number;
  employmentPts: number;
  savingsBufferPts: number;
  ageTermPts: number;
}

export interface WhatIfLever {
  title: { en: string; fr: string };
  description: { en: string; fr: string };
  actionText: { en: string; fr: string };
  estimatedScoreIncrease: number;
}

export interface EligibilityResult {
  score: number; // 0 to 100
  band: ScoreBand;
  breakdown: ScoreFactorBreakdown;
  matchedProduct: LoanProduct;
  monthlyPaymentEstimate: number;
  dtiPct: number;
  contributionPct: number;
  levers: WhatIfLever[];
  isEligibleForConsultation: boolean; // true if score >= 80
}

// ============================================================================
// SCORING ENGINE
// ============================================================================

export function matchLoanProduct(input: ScoreInput): LoanProduct {
  if (input.propertyPurpose === 'rental') {
    return CFC_LOAN_PRODUCTS.find((p) => p.id === 'cfc-locatif-ordinaire') || CFC_LOAN_PRODUCTS[5];
  }

  if (input.age < 35 && input.projectCost <= 50000000 && input.employmentType === 'salaried') {
    return CFC_LOAN_PRODUCTS.find((p) => p.id === 'cfc-classique-jeune') || CFC_LOAN_PRODUCTS[0];
  }

  if (input.projectCost <= 30000000) {
    return CFC_LOAN_PRODUCTS.find((p) => p.id === 'cfc-classique-social') || CFC_LOAN_PRODUCTS[1];
  }

  return CFC_LOAN_PRODUCTS.find((p) => p.id === 'cfc-classique-ordinaire') || CFC_LOAN_PRODUCTS[3];
}

export function calculateEligibility(input: ScoreInput): EligibilityResult {
  const matchedProduct = matchLoanProduct(input);
  const cost = Math.max(1, input.projectCost);
  const ownFunds = Math.max(0, input.ownFunds);
  const income = Math.max(1, input.monthlyIncome);
  const existingDebt = Math.max(0, input.totalDebt);
  const savings = Math.max(0, input.totalSavings);

  // 1. Contribution Ratio Score (Max 25)
  const contributionRatio = ownFunds / cost;
  let contributionPts = (contributionRatio / THRESHOLD_CONTRIBUTION_MAX_PCT) * WEIGHT_CONTRIBUTION;
  contributionPts = Math.max(0, Math.min(WEIGHT_CONTRIBUTION, contributionPts));

  // 2. Titled Land Ownership Score (Max 15)
  let titledLandPts = WEIGHT_TITLED_LAND;
  if (input.projectType === 'build') {
    titledLandPts = input.hasTitle ? WEIGHT_TITLED_LAND : 0;
  }

  // Calculate estimated monthly payment for matched product
  const defaultTerm = Math.min(
    matchedProduct.maxTermYears,
    Math.max(5, RETIREMENT_AGE - input.age)
  );
  const simResult = calculateLoan({
    propertyPrice: cost,
    contributionPct: Math.max(matchedProduct.minContributionPct, contributionRatio),
    annualInterestRate: matchedProduct.annualInterestRate,
    termYears: defaultTerm,
  });
  const estimatedMonthlyPayment = simResult.totalMonthlyPayment;

  // 3. Debt-to-Income (DTI) Score (Max 20)
  // Monthly debt obligations + estimated new payment divided by income
  const totalMonthlyObligations = existingDebt + estimatedMonthlyPayment;
  const dti = totalMonthlyObligations / income;

  let dtiPts = 0;
  if (dti <= THRESHOLD_DTI_OPTIMAL) {
    dtiPts = WEIGHT_DTI;
  } else if (dti >= THRESHOLD_DTI_MAX) {
    dtiPts = 0;
  } else {
    // Linear interpolation between 20% and 50%
    const ratio = (THRESHOLD_DTI_MAX - dti) / (THRESHOLD_DTI_MAX - THRESHOLD_DTI_OPTIMAL);
    dtiPts = Math.max(0, Math.min(WEIGHT_DTI, ratio * WEIGHT_DTI));
  }

  // 4. Employment Stability Score (Max 18)
  const employmentPts = input.employmentType === 'salaried' ? PTS_SALARIED : PTS_SELF_EMPLOYED;

  // 5. Savings Buffer Score (Max 12)
  const savingsRatio = savings / cost;
  let savingsBufferPts = (savingsRatio / THRESHOLD_SAVINGS_BUFFER_MAX_PCT) * WEIGHT_SAVINGS_BUFFER;
  savingsBufferPts = Math.max(0, Math.min(WEIGHT_SAVINGS_BUFFER, savingsBufferPts));

  // 6. Age to Term Fit Score (Max 10)
  const remainingWorkingYears = Math.max(0, RETIREMENT_AGE - input.age);
  let ageTermPts = 0;
  if (remainingWorkingYears >= matchedProduct.maxTermYears) {
    ageTermPts = WEIGHT_AGE_TERM;
  } else {
    ageTermPts = Math.max(0, Math.min(WEIGHT_AGE_TERM, (remainingWorkingYears / matchedProduct.maxTermYears) * WEIGHT_AGE_TERM));
  }

  // Total raw score (rounded to integer)
  let rawScore = Math.round(
    contributionPts +
    titledLandPts +
    dtiPts +
    employmentPts +
    savingsBufferPts +
    ageTermPts
  );

  // Hard Gates
  if (input.projectType === 'build' && !input.hasTitle) {
    rawScore = Math.min(rawScore, 69);
  }
  if (input.age >= 65 || remainingWorkingYears <= 3) {
    rawScore = Math.min(rawScore, 59);
  }

  const score = Math.max(0, Math.min(100, rawScore));

  // Determine Band
  let band: ScoreBand = 'needs_work';
  if (score >= BAND_QUALIFIED_MIN) {
    band = 'qualified';
  } else if (score >= BAND_WORKABLE_MIN) {
    band = 'workable';
  } else {
    band = 'needs_work';
  }

  // Generate actionable levers / recommendations
  const levers: WhatIfLever[] = [];

  if (contributionRatio < 0.30) {
    const targetContribution = Math.round(cost * 0.30);
    const neededMore = targetContribution - ownFunds;
    if (neededMore > 0) {
      levers.push({
        title: {
          en: 'Increase Personal Contribution',
          fr: 'Augmenter votre apport personnel',
        },
        description: {
          en: `Increasing your contribution by ${neededMore.toLocaleString()} FCFA brings your equity to 30%, adding up to ${Math.round(WEIGHT_CONTRIBUTION - contributionPts)} points.`,
          fr: `Ajouter ${neededMore.toLocaleString()} FCFA d'apport porte vos fonds à 30%, apportant jusqu'à ${Math.round(WEIGHT_CONTRIBUTION - contributionPts)} points supplémentaires.`,
        },
        actionText: {
          en: `Target 30% contribution (${targetContribution.toLocaleString()} FCFA)`,
          fr: `Viser 30% d'apport (${targetContribution.toLocaleString()} FCFA)`,
        },
        estimatedScoreIncrease: Math.round(WEIGHT_CONTRIBUTION - contributionPts),
      });
    }
  }

  if (input.projectType === 'build' && !input.hasTitle) {
    levers.push({
      title: {
        en: 'Secure Land Title Before Construction',
        fr: 'Régulariser le Titre Foncier du terrain',
      },
      description: {
        en: 'CFC requires a registered Land Title (Titre Foncier). Securing or purchasing titled land unlocks 15 full points and removes the 69-point gate.',
        fr: 'Le CFC exige un Titre Foncier valide. Obtenir un titre débloque 15 points et supprime le plafond de 69 points.',
      },
      actionText: {
        en: 'Explore Title Regularization / Land Acquisition',
        fr: 'Consulter notre service de régularisation foncière',
      },
      estimatedScoreIncrease: 15,
    });
  }

  if (dti > THRESHOLD_DTI_OPTIMAL && existingDebt > 0) {
    levers.push({
      title: {
        en: 'Consolidate or Pay Down Existing Debt',
        fr: 'Alléger ou solder vos dettes existantes',
      },
      description: {
        en: 'Reducing current monthly debt obligations lowers your debt-to-income ratio below 33%, significantly boosting lender approval probability.',
        fr: 'Réduire vos charges mensuelles actuelles améliore votre taux d\'endettement sous les 33% pour faciliter l\'accord bancaire.',
      },
      actionText: {
        en: 'Plan Debt Payoff',
        fr: 'Optimiser la capacité d\'emprunt',
      },
      estimatedScoreIncrease: Math.round(WEIGHT_DTI - dtiPts),
    });
  }

  return {
    score,
    band,
    breakdown: {
      contributionPts: Math.round(contributionPts),
      titledLandPts: Math.round(titledLandPts),
      dtiPts: Math.round(dtiPts),
      employmentPts: Math.round(employmentPts),
      savingsBufferPts: Math.round(savingsBufferPts),
      ageTermPts: Math.round(ageTermPts),
    },
    matchedProduct,
    monthlyPaymentEstimate: estimatedMonthlyPayment,
    dtiPct: Math.round(dti * 100),
    contributionPct: Math.round(contributionRatio * 100),
    levers,
    isEligibleForConsultation: score >= BAND_QUALIFIED_MIN, // GATED ON SCORE >= 80%
  };
}
