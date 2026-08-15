import React, { useState } from 'react';
import { GovLogo } from './GovLogo';
import { X, Calculator, ArrowRight, CheckCircle2 } from 'lucide-react';

interface CalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAmount: (amount: string) => void;
}

export const CalculatorModal: React.FC<CalculatorModalProps> = ({
  isOpen,
  onClose,
  onSelectAmount,
}) => {
  const [loanAmount, setLoanAmount] = useState<number>(500000);
  const [tenureYears, setTenureYears] = useState<number>(3);

  if (!isOpen) return null;

  // Determine Tier & Markup rate
  let tierName = 'Tier 1 (مرحلہ ۱) - Interest Free';
  let markupRate = 0.0;
  let isZeroMarkup = true;

  if (loanAmount <= 500000) {
    tierName = 'Tier 1 (مرحلہ ۱) - Interest Free';
    markupRate = 0.0;
    isZeroMarkup = true;
  } else if (loanAmount <= 15000000) {
    tierName = 'Tier 2 (مرحلہ ۲) - 5% Fixed Subsidized';
    markupRate = 0.05;
    isZeroMarkup = false;
  } else {
    tierName = 'Tier 3 (مرحلہ ۳) - 7% Fixed Subsidized';
    markupRate = 0.07;
    isZeroMarkup = false;
  }

  const totalMonths = tenureYears * 12;
  const monthlyPrincipal = loanAmount / totalMonths;
  const monthlyMarkup = (loanAmount * markupRate) / 12;
  const monthlyInstallment = Math.round(monthlyPrincipal + monthlyMarkup);
  const totalMarkup = Math.round(monthlyMarkup * totalMonths);
  const totalRepayment = loanAmount + totalMarkup;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="bg-[#091e38] text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <GovLogo size={38} />
            <div>
              <h3 className="font-serif-display font-bold text-base sm:text-lg">
                Official Loan Installment Calculator
              </h3>
              <p className="text-xs text-emerald-300 font-urdu" dir="rtl">
                قسط اور مارک اپ کا درست تخمینہ
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-6">
          {/* Subsidized tier tag */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
              <div>
                <div className="text-xs sm:text-sm font-bold text-emerald-950">{tierName}</div>
                <div className="text-[11px] text-emerald-800">
                  {isZeroMarkup
                    ? 'Government subsidized 100% interest waiver'
                    : 'Highly subsidized preferential federal rate'}
                </div>
              </div>
            </div>
            <span className="text-xs font-mono font-bold px-2.5 py-1 bg-emerald-600 text-white rounded">
              {markupRate * 100}%
            </span>
          </div>

          {/* Amount Slider */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs sm:text-sm font-semibold text-slate-700">
                Loan Amount Required:
              </label>
              <span className="font-mono text-base sm:text-lg font-bold text-[#0f2f57]">
                PKR {loanAmount.toLocaleString('en-PK')}
              </span>
            </div>
            <input
              type="range"
              min={100000}
              max={30000000}
              step={100000}
              value={loanAmount}
              onChange={(e) => setLoanAmount(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-700"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
              <span>PKR 100,000 (1 Lakh)</span>
              <span className="text-emerald-700 font-bold">5 Lakh (0% Tier)</span>
              <span>PKR 30,000,000 (3 Crore)</span>
            </div>
          </div>

          {/* Tenure Slider */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs sm:text-sm font-semibold text-slate-700">
                Repayment Tenure:
              </label>
              <span className="font-mono text-base font-bold text-[#0f2f57]">
                {tenureYears} Years ({totalMonths} Months)
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={8}
              step={1}
              value={tenureYears}
              onChange={(e) => setTenureYears(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#0f2f57]"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
              <span>1 Year</span>
              <span>4 Years</span>
              <span>8 Years</span>
            </div>
          </div>

          {/* Calculation summary */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <div className="text-xs text-slate-500 uppercase font-semibold">
                  Estimated Monthly Installment
                </div>
                <div className="font-urdu text-xs text-emerald-800">
                  تخمینہ شدہ ماہانہ قسط
                </div>
              </div>
              <div className="font-mono text-xl sm:text-2xl font-black text-emerald-700">
                PKR {monthlyInstallment.toLocaleString('en-PK')}
                <span className="text-xs text-slate-500 font-normal"> / month</span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs pt-1">
              <div>
                <div className="text-slate-400">Principal Amount:</div>
                <div className="font-mono font-semibold text-slate-800">
                  PKR {loanAmount.toLocaleString('en-PK')}
                </div>
              </div>
              <div>
                <div className="text-slate-400">Total Markup:</div>
                <div className="font-mono font-semibold text-slate-800">
                  {totalMarkup === 0 ? 'PKR 0 (Free)' : `PKR ${totalMarkup.toLocaleString('en-PK')}`}
                </div>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <div className="text-slate-400">Total Repayment:</div>
                <div className="font-mono font-bold text-[#0f2f57]">
                  PKR {totalRepayment.toLocaleString('en-PK')}
                </div>
              </div>
            </div>
          </div>

          {/* Apply with amount button */}
          <button
            onClick={() => {
              onSelectAmount(String(loanAmount));
              onClose();
            }}
            className="w-full py-3 bg-[#0f2f57] hover:bg-[#163e70] active:bg-[#0a203c] text-white text-xs sm:text-sm font-bold rounded-lg shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <span>Proceed to Apply with PKR {loanAmount.toLocaleString('en-PK')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
