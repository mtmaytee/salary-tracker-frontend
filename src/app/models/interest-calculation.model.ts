export interface InterestInterval {
  startDate: string;
  endDate: string;
  days: number;
  principal: number;
  interest: number;
}

export interface InterestCalculationResponse {
  incomeRecordId: string;
  principal: number; // ยอดคงเหลือปัจจุบัน
  dueDate: string;
  paymentDate: string | null;
  daysLate: number;
  interestRate: number;
  interestAmount: number; // ดอกเบี้ยสะสมทั้งหมด
  penaltyAmount?: number;
  totalAmount: number;
  status: 'PAID' | 'PENDING';
  intervals?: InterestInterval[]; // รายละเอียดแต่ละช่วง
}
