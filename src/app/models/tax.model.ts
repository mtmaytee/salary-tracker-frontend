// สำหรับตั้งค่าค่าลดหย่อนมาตรฐาน
export interface TaxMasterData {
  id?: string;
  maxPersonalExpenses: number; // เช่น 100000
  personalAllowance: number;   // เช่น 60000
  maxSocialSecurity: number;   // เช่น 9000
  active: boolean;
}

// สำหรับตั้งค่าขั้นบันไดภาษี
export interface TaxBracket {
  id?: string;
  minIncome: number;      // รายได้เริ่มต้นของขั้น
  maxIncome?: number;     // รายได้สูงสุด (ถ้าไม่มีคือขั้นสูงสุด)
  taxRate: number;        // อัตราภาษี (%) เช่น 5.00, 10.00
  sequence: number;       // ลำดับของขั้น (1, 2, 3...)
}

export interface TaxCalculationResult {
  monthlyWithholdingTax: number;
}
