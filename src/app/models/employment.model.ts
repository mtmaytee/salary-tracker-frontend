export interface Employment {
  id?: string;
  companyId: string;
  companyName?: string;
  baseSalary: number;
  expectedSso: number;
  expectedTax: number;
  salaryPaymentDay?: number;
  startDate?: string;
  endDate?: string;
  status?: 'ACTIVE' | 'INACTIVE';
}
