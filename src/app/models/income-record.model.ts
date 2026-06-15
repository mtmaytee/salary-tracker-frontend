export interface IncomeRecord {
  id?: string;
  companyId: string;
  incomeType: 'SALARY' | 'FREELANCE' | 'BONUS';
  periodMonth: string;
  installment?: number;
  grossIncome: number;
  taxDeduction: number;
  socialSecurity: number;
  otherDeductions: number;
  paymentDate?: string;
  dueDate?: string;
  netIncome?: number;
  paymentStatus?: 'PAID' | 'PENDING';
}
