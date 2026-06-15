export interface MonthlySummary {
  periodMonth: string;
  totalGrossIncome?: number; // Backend might send totalGross
  grossIncome?: number;
  totalGross?: number;
  totalTaxDeduction?: number;
  totalSocialSecurity?: number;
  totalOtherDeductions?: number;
  totalNetIncome?: number; // Backend might send totalNet
  netIncome?: number;
  totalNet?: number;
  totalPending?: number;
  recordCount: number;
}
