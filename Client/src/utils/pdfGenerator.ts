import { jsPDF } from 'jspdf';
import { LoanCalculationResult, formatFCFA } from './loanEngine';
import { EligibilityResult } from '../config/eligibilityScoring';
import logoUrl from '../assets/logo.png';

/**
 * Convert an image URL to a base64 data URI for jsPDF
 */
async function getBase64ImageFromUrl(imageUrl: string): Promise<string> {
  try {
    const res = await fetch(imageUrl);
    const blob = await res.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(blob);
    });
  } catch (e) {
    return '';
  }
}

/**
 * Generate a branded one-page Loan Simulation Summary PDF
 */
export async function generateLoanSummaryPDF(
  result: LoanCalculationResult,
  productName: string,
  language: 'en' | 'fr' = 'en'
): Promise<void> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Primary Header Bar (#0F172A)
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, pageWidth, 28, 'F');

  // Accent line (#D97706)
  doc.setFillColor(217, 119, 6);
  doc.rect(0, 28, pageWidth, 2, 'F');

  // Header Title
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('REI CONSULTING', 14, 12);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(
    language === 'fr'
      ? 'Cabinet de Conseil Foncier & Stratégie Immobilière'
      : 'Real Estate Intelligence & Loan Advisory',
    14,
    18
  );

  doc.setFontSize(8);
  doc.text('Tél / WhatsApp : +237 681 478 111  |  Email : reiconsultingcm@gmail.com', 14, 23);

  // Watermark (Faint text/branding)
  doc.setTextColor(240, 243, 246);
  doc.setFontSize(42);
  doc.setFont('helvetica', 'bold');
  doc.text('REI CONSULTING', pageWidth / 2, pageHeight / 2, {
    align: 'center',
    angle: 35,
  });

  // Document Title
  let y = 42;
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(15);
  doc.setFont('helvetica', 'bold');
  doc.text(
    language === 'fr'
      ? 'SIMULATION DE FINANCEMENT IMMOBILIER (CFC)'
      : 'REAL ESTATE LOAN SIMULATION SUMMARY',
    14,
    y
  );

  y += 6;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  const dateStr = new Date().toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  doc.text(
    language === 'fr'
      ? `Produit ciblé : ${productName}  •  Généré le : ${dateStr}`
      : `Target Loan: ${productName}  •  Generated: ${dateStr}`,
    14,
    y
  );

  // Headline Monthly Repayment Card
  y += 10;
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(14, y, pageWidth - 28, 26, 3, 3, 'FD');

  doc.setTextColor(100, 116, 139);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text(
    language === 'fr' ? 'MENSUALITÉ TOTALE ESTIMÉE' : 'ESTIMATED MONTHLY REPAYMENT',
    20,
    y + 8
  );

  doc.setTextColor(217, 119, 6);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text(formatFCFA(result.totalMonthlyPayment), 20, y + 18);

  doc.setTextColor(100, 116, 139);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text(
    language === 'fr'
      ? `(Principal + Intérêts : ${formatFCFA(result.monthlyRepayment)}  |  Assurance : ${formatFCFA(result.monthlyInsurance)})`
      : `(Principal + Interest: ${formatFCFA(result.monthlyRepayment)}  |  Insurance: ${formatFCFA(result.monthlyInsurance)})`,
    100,
    y + 18
  );

  // Key Financial Metrics Table
  y += 34;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(language === 'fr' ? 'Paramètres & Synthèse du Financement' : 'Loan Terms & Financial Breakdown', 14, y);

  y += 4;
  const rows = [
    [
      language === 'fr' ? 'Coût total du projet / Prix' : 'Total Project Cost / Price',
      formatFCFA(result.propertyPrice),
    ],
    [
      language === 'fr' ? 'Apport personnel requis' : 'Personal Contribution (Equity)',
      `${formatFCFA(result.contributionAmount)} (${Math.round(result.contributionPct * 100)}%)`,
    ],
    [
      language === 'fr' ? 'Montant emprunté (CFC)' : 'Loan Amount Borrowed',
      formatFCFA(result.loanAmount),
    ],
    [
      language === 'fr' ? 'Durée du remboursement' : 'Loan Duration',
      `${result.termYears} ${language === 'fr' ? 'ans' : 'years'} (${result.termYears * 12} ${language === 'fr' ? 'mensualités' : 'months'})`,
    ],
    [
      language === 'fr' ? 'Taux d’intérêt annuel (TTC)' : 'Annual Interest Rate (incl. tax)',
      `${(result.annualInterestRate * 100).toFixed(2)}%`,
    ],
    [
      language === 'fr' ? 'Total des intérêts sur la durée' : 'Total Interest over Loan',
      formatFCFA(result.totalInterest),
    ],
    [
      language === 'fr' ? 'Frais d\'instruction & mise en place' : 'Estimated Upfront Fees',
      formatFCFA(result.upfrontCosts.total),
    ],
    [
      language === 'fr' ? 'Fonds nécessaires à la signature' : 'Total Cash Needed at Signing',
      formatFCFA(result.cashNeededAtSigning),
    ],
    [
      language === 'fr' ? 'Coût total du crédit' : 'Total Cost of Credit',
      formatFCFA(result.totalCostOfCredit),
    ],
  ];

  if (result.rentalMetrics) {
    rows.push(
      [
        language === 'fr' ? 'Loyer mensuel prévisionnel' : 'Expected Monthly Rental Income',
        formatFCFA(result.rentalMetrics.expectedMonthlyRent),
      ],
      [
        language === 'fr' ? 'Cash-flow net mensuel' : 'Net Monthly Cash Flow after Repayment',
        formatFCFA(result.rentalMetrics.monthlyCashFlow),
      ],
      [
        language === 'fr' ? 'Loyer d\'équilibre (seuil de rentabilité)' : 'Break-Even Monthly Rent',
        formatFCFA(result.rentalMetrics.breakEvenRent),
      ]
    );
  }

  // Draw table
  doc.setFontSize(8.5);
  rows.forEach((row, i) => {
    const isEven = i % 2 === 0;
    if (isEven) {
      doc.setFillColor(248, 250, 252);
      doc.rect(14, y, pageWidth - 28, 6.5, 'F');
    }
    doc.setTextColor(71, 85, 105);
    doc.setFont('helvetica', 'normal');
    doc.text(row[0], 18, y + 4.5);

    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'bold');
    doc.text(row[1], pageWidth - 18, y + 4.5, { align: 'right' });

    y += 6.5;
  });

  // Next steps & Call to Action
  y += 10;
  doc.setFillColor(15, 23, 42);
  doc.roundedRect(14, y, pageWidth - 28, 24, 3, 3, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(
    language === 'fr' ? 'Prochaine étape : Préparez votre dossier avec REI Consulting' : 'Next Step: Prepare Your Application with REI Consulting',
    20,
    y + 7
  );

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(203, 213, 225);
  doc.text(
    language === 'fr'
      ? 'Nous vous accompagnons dans le montage technique, la vérification des titres fonciers et la négociation auprès du CFC.'
      : 'We guide you through file preparation, land title due diligence, and negotiation with Crédit Foncier du Cameroun.',
    20,
    y + 13
  );

  doc.setTextColor(217, 119, 6);
  doc.setFont('helvetica', 'bold');
  doc.text(
    language === 'fr' ? 'Prenez rendez-vous en ligne : reiconsulting.cm/book' : 'Book consultation online: reiconsulting.cm/book',
    20,
    y + 19
  );

  // Footer Disclaimer
  doc.setTextColor(148, 163, 184);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  const disclaimer =
    language === 'fr'
      ? 'Document indicatif sans valeur contractuelle. Ce document ne constitue ni une offre de prêt ni un accord de financement du Crédit Foncier du Cameroun. La décision finale et les conditions d\'octroi relèvent de la compétence exclusive de l\'organisme prêteur.'
      : 'Indicative simulation only. This document does not constitute a loan offer or a formal credit approval from Crédit Foncier du Cameroun. Final terms, rates, and decisions are subject to formal underwriting and approval by the lender.';
  doc.text(disclaimer, 14, pageHeight - 12, { maxWidth: pageWidth - 28 });

  doc.save(`REI-Loan-Simulation-${Date.now()}.pdf`);
}

/**
 * Generate a personalized Eligibility Report PDF
 */
export async function generateEligibilityReportPDF(
  applicant: { title: string; name: string; phone: string; email?: string },
  result: EligibilityResult,
  language: 'en' | 'fr' = 'en'
): Promise<void> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Header Bar (#0F172A)
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, pageWidth, 28, 'F');
  doc.setFillColor(217, 119, 6);
  doc.rect(0, 28, pageWidth, 2, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('REI CONSULTING', 14, 12);

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.text(
    language === 'fr'
      ? 'Cabinet de Conseil Foncier & Intelligence Immobilière  •  Yaoundé, Cameroun'
      : 'Real Estate Intelligence & Loan Advisory  •  Yaoundé, Cameroon',
    14,
    18
  );
  doc.text('Tél / WhatsApp : +237 681 478 111  |  reiconsultingcm@gmail.com', 14, 23);

  // Background Watermark
  doc.setTextColor(245, 247, 250);
  doc.setFontSize(38);
  doc.setFont('helvetica', 'bold');
  doc.text('REI CONSULTING', pageWidth / 2, pageHeight / 2, {
    align: 'center',
    angle: 35,
  });

  let y = 40;
  // Prepared For banner
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(14, y, pageWidth - 28, 20, 2, 2, 'FD');

  doc.setTextColor(15, 23, 42);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  const titleDisplay = applicant.title || (language === 'fr' ? 'M./Mme' : 'Mr/Mrs');
  doc.text(
    language === 'fr'
      ? `Rapport d'Éligibilité Foncier — Préparé pour ${titleDisplay} ${applicant.name}`
      : `Personal Eligibility Report — Prepared for ${titleDisplay} ${applicant.name}`,
    18,
    y + 8
  );

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text(
    language === 'fr'
      ? `Contact : ${applicant.phone}  •  Date : ${new Date().toLocaleDateString('fr-FR')}  •  Réf : REI-ELG-${Date.now().toString().slice(-6)}`
      : `Contact: ${applicant.phone}  •  Date: ${new Date().toLocaleDateString('en-US')}  •  Ref: REI-ELG-${Date.now().toString().slice(-6)}`,
    18,
    y + 14
  );

  // Score & Verdict Section
  y += 28;
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(language === 'fr' ? '1. Verdict d’Éligibilité & Produit CFC Conseillé' : '1. Eligibility Verdict & Recommended CFC Product', 14, y);

  y += 6;
  const isStrong = result.score >= 80;
  const isWorkable = result.score >= 60 && result.score < 80;

  // Box showing score
  const boxColor = isStrong ? [236, 253, 245] : isWorkable ? [254, 243, 199] : [255, 241, 242];
  doc.setFillColor(boxColor[0], boxColor[1], boxColor[2]);
  doc.roundedRect(14, y, pageWidth - 28, 24, 2, 2, 'F');

  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(isStrong ? 5 : isWorkable ? 180 : 225, isStrong ? 150 : isWorkable ? 83 : 29, isStrong ? 105 : 9);
  doc.text(`${result.score} / 100`, 20, y + 16);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  const bandLabel = isStrong
    ? (language === 'fr' ? 'CANDIDAT TRÈS FAVORABLE' : 'STRONG CANDIDATE (QUALIFIED)')
    : isWorkable
    ? (language === 'fr' ? 'DOSSIER PROMETTEUR (À STRUCTURER)' : 'WORKABLE CANDIDATE')
    : (language === 'fr' ? 'EN COURS DE PRÉPARATION' : 'NEEDS PREPARATION');
  doc.text(bandLabel, 65, y + 10);

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  const matchedText = language === 'fr'
    ? `Produit recommandé : ${result.matchedProduct.label.fr}`
    : `Recommended Product: ${result.matchedProduct.label.en}`;
  doc.text(matchedText, 65, y + 17);

  // Score Factor Breakdown Table
  y += 32;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(language === 'fr' ? '2. Détail des 6 Critères d\'Évaluation' : '2. 6-Factor Assessment Breakdown', 14, y);

  y += 4;
  const breakdownRows = [
    [
      language === 'fr' ? 'Apport personnel (Fonds propres)' : 'Personal Contribution Ratio',
      `${result.breakdown.contributionPts} / 25 pts`,
      language === 'fr' ? 'Niveau d\'épargne directe mobilisée pour le projet' : 'Direct equity committed to the project',
    ],
    [
      language === 'fr' ? 'Propriété du Titre Foncier' : 'Land Title Ownership',
      `${result.breakdown.titledLandPts} / 15 pts`,
      language === 'fr' ? 'Sécurité juridique indispensable pour le financement CFC' : 'Mandatory legal requirement for mortgage lending',
    ],
    [
      language === 'fr' ? 'Capacité d’endettement (DTI)' : 'Debt-to-Income Capacity',
      `${result.breakdown.dtiPts} / 20 pts`,
      language === 'fr' ? `Quotité cessible (Taux actuel estimé : ${result.dtiPct}%)` : `Monthly debt burden vs monthly income (${result.dtiPct}%)`,
    ],
    [
      language === 'fr' ? 'Stabilité professionnelle' : 'Employment & Revenue Stability',
      `${result.breakdown.employmentPts} / 18 pts`,
      language === 'fr' ? 'Ancienneté et domiciliation bancaire des revenus' : 'Job tenure and verifiable banking revenue track record',
    ],
    [
      language === 'fr' ? 'Épargne de réserve (Buffer)' : 'Savings Buffer Safety Net',
      `${result.breakdown.savingsBufferPts} / 12 pts`,
      language === 'fr' ? 'Sécurité financière disponible après paiement de l\'apport' : 'Emergency liquidity remaining after project contribution',
    ],
    [
      language === 'fr' ? 'Adéquation âge et durée' : 'Age to Loan Term Headroom',
      `${result.breakdown.ageTermPts} / 10 pts`,
      language === 'fr' ? 'Horizon d\'activité professionnelle restant avant la retraite' : 'Remaining working years before typical retirement',
    ],
  ];

  doc.setFontSize(8);
  breakdownRows.forEach((row, i) => {
    if (i % 2 === 0) {
      doc.setFillColor(248, 250, 252);
      doc.rect(14, y, pageWidth - 28, 6, 'F');
    }
    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'bold');
    doc.text(row[0], 18, y + 4.2);

    doc.setTextColor(217, 119, 6);
    doc.text(row[1], 100, y + 4.2);

    doc.setTextColor(100, 116, 139);
    doc.setFont('helvetica', 'normal');
    doc.text(row[2], 130, y + 4.2);

    y += 6;
  });

  // Action Plan / Levers
  y += 8;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(language === 'fr' ? '3. Plan d’Action pour Maximiser l\'Accord Bancaire' : '3. Optimization Plan & Required Steps', 14, y);

  y += 5;
  if (result.levers.length > 0) {
    result.levers.slice(0, 3).forEach((lever) => {
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(14, y, pageWidth - 28, 14, 1.5, 1.5, 'FD');

      doc.setTextColor(15, 23, 42);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.text(`• ${language === 'fr' ? lever.title.fr : lever.title.en}`, 18, y + 5);

      doc.setTextColor(71, 85, 105);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.text(language === 'fr' ? lever.description.fr : lever.description.en, 18, y + 10, {
        maxWidth: pageWidth - 36,
      });

      y += 16;
    });
  } else {
    doc.setTextColor(16, 185, 129);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text(
      language === 'fr'
        ? 'Votre profil remplit les conditions requises. Vous pouvez immédiatement entamer la constitution du dossier.'
        : 'Your profile satisfies the key underwriting standards. You are ready to start official file preparation.',
      14,
      y + 4
    );
    y += 10;
  }

  // Footer CTA
  y = Math.min(y + 4, pageHeight - 34);
  doc.setFillColor(15, 23, 42);
  doc.roundedRect(14, y, pageWidth - 28, 20, 2, 2, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text(
    language === 'fr'
      ? 'Contactez Gilgar (REI Consulting) pour démarrer votre dossier CFC :'
      : 'Contact Gilgar (REI Consulting) to initiate your CFC application:',
    20,
    y + 7
  );

  doc.setTextColor(217, 119, 6);
  doc.setFontSize(8.5);
  doc.text('WhatsApp / Téléphone : +237 681 478 111  |  Rendez-vous : reiconsulting.cm/book', 20, y + 14);

  // Disclaimer
  doc.setTextColor(148, 163, 184);
  doc.setFontSize(6.5);
  doc.setFont('helvetica', 'normal');
  doc.text(
    language === 'fr'
      ? 'Avertissement : Cette évaluation est indicative et élaborée par REI Consulting d\'après les renseignements déclarés. Elle ne constitue ni une offre de prêt ni une décision du Crédit Foncier du Cameroun.'
      : 'Disclaimer: This indicative assessment was prepared by REI Consulting based on applicant-provided data. It does not constitute a formal loan offer or approval by Crédit Foncier du Cameroun.',
    14,
    pageHeight - 8,
    { maxWidth: pageWidth - 28 }
  );

  doc.save(`REI-Eligibility-Report-${applicant.name.replace(/\s+/g, '_')}.pdf`);
}
