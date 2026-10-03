/**
 * Pure Calculation Engine for CFC Loan Simulation
 * Implements amortization formulas, fees, rental metrics, reverse mode, and schedule generation.
 * Follows the "Loan Simulation Tool - Build Plan: Logic, Data, and UI/UX" specifications.
 */

export interface LoanInput {
  propertyPrice: number; // in FCFA
  contributionPct: number; // e.g. 0.20 for 20%
  annualInterestRate: number; // e.g. 0.06 for 6%
  termYears: number; // e.g. 15
  insuranceAnnualPct?: number; // e.g. 0.003 (0.3%)
  upfrontFeeRate?: number; // setup fee rate e.g. 0.005 (0.5%)
  instructionFeeRate?: number; // appraisal fee rate e.g. 0.0005 (0.05%)
  notaryFeeRate?: number; // estimated notary/registration e.g. 0.015 (1.5%)
  // Rental specific
  expectedMonthlyRent?: number;
  vacancyRate?: number; // default 0.10 (10%)
  yearlyRunningCosts?: number; // maintenance, taxes, management
}

export interface AmortizationYear {
  year: number;
  principalPaid: number;
  interestPaid: number;
  insurancePaid: number;
  totalPaid: number;
  remainingBalance: number;
}

export interface LoanCalculationResult {
  propertyPrice: number;
  contributionPct: number;
  contributionAmount: number;
  loanAmount: number; // Principal P
  termYears: number;
  annualInterestRate: number;
  monthlyRepayment: number; // M (Principal + Interest)
  monthlyInsurance: number;
  totalMonthlyPayment: number; // M + Insurance
  upfrontCosts: {
    instructionFee: number;
    setupFee: number;
    notaryFee: number;
    total: number;
  };
  cashNeededAtSigning: number;
  totalRepaid: number;
  totalInterest: number;
  totalInsurance: number;
  totalCostOfCredit: number;
  costPer100Borrowed: number;
  amortizationSchedule: AmortizationYear[];
  // Rental metrics
  rentalMetrics?: {
    expectedMonthlyRent: number;
    effectiveRentPerYear: number;
    netOperatingIncome: number;
    grossYield: number; // percentage
    monthlyCashFlow: number; // net cash flow after loan repayment
    debtServiceCoverage: number; // DSCR
    breakEvenRent: number;
    paybackYears: number | null;
  };
}

export function formatFCFA(amount: number | null | undefined, language: 'en' | 'fr' | string = 'en'): string {
  if (amount === null || amount === undefined || isNaN(amount)) return '0 FCFA';
  const rounded = Math.round(amount);
  const separator = language === 'fr' ? ' ' : ',';
  return `${rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, separator)} FCFA`;
}

export function parseFormattedNumber(input: string | number): number {
  if (typeof input === 'number') return isNaN(input) ? 0 : input;
  if (!input) return 0;
  // Strip spaces, commas, letters, and special symbols
  const cleaned = input.toString().replace(/[^0-9.-]/g, '');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
}

export function formatNumberOnly(amount: number | null | undefined, language: 'en' | 'fr' | string = 'en'): string {
  if (amount === null || amount === undefined || isNaN(amount)) return '0';
  const rounded = Math.round(amount);
  const separator = language === 'fr' ? ' ' : ',';
  return rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, separator);
}

export function calculateLoan(input: LoanInput): LoanCalculationResult {
  const price = Math.max(0, input.propertyPrice);
  const contributionPct = Math.min(1, Math.max(0, input.contributionPct));
  const contributionAmount = Math.round(price * contributionPct);
  const P = Math.max(0, price - contributionAmount);

  const r = input.annualInterestRate / 12;
  const n = Math.max(1, input.termYears * 12);
  const insuranceRate = input.insuranceAnnualPct ?? 0.003;

  // Monthly repayment M
  let M = 0;
  if (P <= 0) {
    M = 0;
  } else if (r <= 0) {
    M = Math.ceil(P / n);
  } else {
    const factor = Math.pow(1 + r, -n);
    M = Math.ceil((P * r) / (1 - factor));
  }

  // Monthly insurance
  const monthlyInsurance = P > 0 ? Math.ceil((P * insuranceRate) / 12) : 0;
  const totalMonthlyPayment = M + monthlyInsurance;

  // Upfront costs at signing
  const instructionFee = Math.round(P * (input.instructionFeeRate ?? 0.0005));
  const setupFee = Math.round(P * (input.upfrontFeeRate ?? 0.005));
  const notaryFee = Math.round(P * (input.notaryFeeRate ?? 0.015));
  const totalUpfrontCosts = instructionFee + setupFee + notaryFee;
  const cashNeededAtSigning = contributionAmount + totalUpfrontCosts;

  // Amortization Schedule & Totals
  const amortizationSchedule: AmortizationYear[] = [];
  let balance = P;
  let totalInterest = 0;
  let totalInsurance = 0;

  for (let y = 1; y <= input.termYears; y++) {
    let yearPrincipal = 0;
    let yearInterest = 0;
    let yearInsurance = 0;

    for (let m = 1; m <= 12; m++) {
      if (balance <= 0) break;
      const monthInterest = balance * r;
      let monthPrincipal = M - monthInterest;

      if (monthPrincipal > balance || (y === input.termYears && m === 12)) {
        monthPrincipal = balance;
      }

      balance = Math.max(0, balance - monthPrincipal);
      yearInterest += monthInterest;
      yearPrincipal += monthPrincipal;
      yearInsurance += monthlyInsurance;
    }

    totalInterest += yearInterest;
    totalInsurance += yearInsurance;

    amortizationSchedule.push({
      year: y,
      principalPaid: Math.round(yearPrincipal),
      interestPaid: Math.round(yearInterest),
      insurancePaid: Math.round(yearInsurance),
      totalPaid: Math.round(yearPrincipal + yearInterest + yearInsurance),
      remainingBalance: Math.round(balance),
    });
  }

  const totalRepaid = Math.round(P + totalInterest + totalInsurance);
  const totalCostOfCredit = Math.round(totalInterest + totalInsurance + totalUpfrontCosts);
  const costPer100Borrowed = P > 0 ? Math.round((totalCostOfCredit / P) * 100 * 10) / 10 : 0;

  // Rental Metrics
  let rentalMetrics: LoanCalculationResult['rentalMetrics'];
  if (input.expectedMonthlyRent && input.expectedMonthlyRent > 0) {
    const rent = input.expectedMonthlyRent;
    const vacancy = input.vacancyRate ?? 0.10;
    const effectiveRentPerYear = rent * 12 * (1 - vacancy);
    const runningCosts = input.yearlyRunningCosts ?? Math.round(effectiveRentPerYear * 0.15); // default 15% operating cost
    const netOperatingIncome = effectiveRentPerYear - runningCosts;
    const grossYield = price > 0 ? ((rent * 12) / price) * 100 : 0;
    const monthlyCashFlow = Math.round(netOperatingIncome / 12 - totalMonthlyPayment);
    const debtServiceCoverage = totalMonthlyPayment > 0 ? Math.round((netOperatingIncome / (totalMonthlyPayment * 12)) * 100) / 100 : 0;
    const breakEvenRent = Math.round((totalMonthlyPayment * 12 + runningCosts) / (12 * (1 - vacancy)));
    const paybackYears = monthlyCashFlow > 0 ? Math.round((contributionAmount / (monthlyCashFlow * 12)) * 10) / 10 : null;

    rentalMetrics = {
      expectedMonthlyRent: rent,
      effectiveRentPerYear: Math.round(effectiveRentPerYear),
      netOperatingIncome: Math.round(netOperatingIncome),
      grossYield: Math.round(grossYield * 10) / 10,
      monthlyCashFlow,
      debtServiceCoverage,
      breakEvenRent,
      paybackYears,
    };
  }

  return {
    propertyPrice: price,
    contributionPct,
    contributionAmount,
    loanAmount: P,
    termYears: input.termYears,
    annualInterestRate: input.annualInterestRate,
    monthlyRepayment: M,
    monthlyInsurance,
    totalMonthlyPayment,
    upfrontCosts: {
      instructionFee,
      setupFee,
      notaryFee,
      total: totalUpfrontCosts,
    },
    cashNeededAtSigning,
    totalRepaid,
    totalInterest: Math.round(totalInterest),
    totalInsurance: Math.round(totalInsurance),
    totalCostOfCredit,
    costPer100Borrowed,
    amortizationSchedule,
    rentalMetrics,
  };
}

/**
 * Reverse Mode: Calculate maximum loan amount and maximum affordable property price
 * given a targeted monthly repayment budget and term.
 */
export function calculateReverseLoan({
  monthlyBudget,
  annualInterestRate,
  termYears,
  contributionPct,
  insuranceAnnualPct = 0.003,
}: {
  monthlyBudget: number;
  annualInterestRate: number;
  termYears: number;
  contributionPct: number;
  insuranceAnnualPct?: number;
}): {
  maxLoanAmount: number;
  maxPropertyPrice: number;
  monthlyPayment: number;
  estimatedContribution: number;
} {
  if (monthlyBudget <= 0) {
    return { maxLoanAmount: 0, maxPropertyPrice: 0, monthlyPayment: 0, estimatedContribution: 0 };
  }

  const r = annualInterestRate / 12;
  const n = termYears * 12;
  const insuranceMonthlyRate = insuranceAnnualPct / 12;

  // M = P * (annuityFactor + insuranceMonthlyRate)
  const annuityFactor = r > 0 ? r / (1 - Math.pow(1 + r, -n)) : 1 / n;
  const combinedFactor = annuityFactor + insuranceMonthlyRate;

  const maxLoanAmount = Math.floor(monthlyBudget / combinedFactor);
  const maxPropertyPrice = contributionPct < 1 ? Math.floor(maxLoanAmount / (1 - contributionPct)) : maxLoanAmount;
  const estimatedContribution = maxPropertyPrice - maxLoanAmount;

  return {
    maxLoanAmount,
    maxPropertyPrice,
    monthlyPayment: monthlyBudget,
    estimatedContribution,
  };
}
