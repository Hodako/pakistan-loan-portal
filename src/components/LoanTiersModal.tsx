import React from 'react';
import { GovLogo } from './GovLogo';
import { X, Layers, ArrowRight, CheckCircle2 } from 'lucide-react';

interface LoanTiersModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTier: (amount: string) => void;
}

export const LOAN_TIERS = [
  {
    tier: 'Tier 1 (مرحلہ ۱)',
    amountRange: 'PKR 100,000 to PKR 500,000',
    markup: '0% Subsidized Markup (بغیر سود)',
    security: 'Personal Guarantee Only (شخصی ضمانت)',
    tenure: 'Up to 5 Years',
    repayment: 'Grace period 6 months',
    defaultAmount: '500000',
  },
  {
    tier: 'Tier 2 (مرحلہ ۲)',
    amountRange: 'PKR 500,000 to PKR 15,000,000 (1.5 Crore)',
    markup: '5% Fixed Subsidized Markup (5 فیصد مارک اپ)',
    security: 'Hypothecation of assets / personal security',
    tenure: 'Up to 8 Years',
    repayment: 'Grace period 6 months',
    defaultAmount: '1500000',
  },
  {
    tier: 'Tier 3 (مرحلہ ۳)',
    amountRange: 'PKR 15,000,000 to PKR 30,000,000 (3 Crore)',
    markup: '7% Fixed Subsidized Markup (7 فیصد مارک اپ)',
    security: 'Mortgage / asset collateral',
    tenure: 'Up to 8 Years',
    repayment: 'Grace period 1 year',
    defaultAmount: '15000000',
  },
];

export const LoanTiersModal: React.FC<LoanTiersModalProps> = ({
  isOpen,
  onClose,
  onSelectTier,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="bg-[#091e38] text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <GovLogo size={38} />
            <div>
              <h3 className="font-serif-display font-bold text-base sm:text-lg">
                Prime Minister Youth & Agriculture Loan Tiers
              </h3>
              <p className="text-xs text-emerald-300 font-urdu" dir="rtl">
                حکومتی قرضہ اسکیم کے مراحل اور مراعات
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

        {/* Body */}
        <div className="p-5 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          <p className="text-xs sm:text-sm text-slate-600">
            The Government of Pakistan, under the leadership of Prime Minister Muhammad Shehbaz Sharif and Chief Minister Maryam Nawaz, provides subsidized financing through all commercial and microfinance banks.
          </p>

          <div className="space-y-3">
            {LOAN_TIERS.map((tier, idx) => (
              <div
                key={idx}
                className="border border-slate-200 hover:border-emerald-500 rounded-xl p-4 transition-all bg-slate-50/50 hover:bg-emerald-50/20"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="font-bold text-sm sm:text-base text-[#091e38]">
                    {tier.tier}
                  </div>
                  <span className="text-xs font-mono font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded border border-emerald-300">
                    {tier.markup.split(' ')[0]} Markup
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 mb-3">
                  <div>
                    <span className="text-slate-400">Limit:</span>{' '}
                    <strong className="text-slate-800 font-mono">{tier.amountRange}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400">Markup:</span>{' '}
                    <strong className="text-emerald-700">{tier.markup}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400">Security:</span>{' '}
                    <strong className="text-slate-800">{tier.security}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400">Tenure:</span>{' '}
                    <strong className="text-slate-800">
                      {tier.tenure} ({tier.repayment})
                    </strong>
                  </div>
                </div>

                <button
                  onClick={() => {
                    onSelectTier(tier.defaultAmount);
                    onClose();
                  }}
                  className="w-full sm:w-auto px-4 py-1.5 bg-[#0f2f57] hover:bg-[#18467d] text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Apply for {tier.tier.split(' ')[0]}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          {/* Eligibility checklist */}
          <div className="bg-slate-100 rounded-xl p-4 text-xs space-y-2 text-slate-700 border border-slate-200">
            <div className="font-bold text-slate-900 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-emerald-700" />
              <span>Eligibility & Required Documents:</span>
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 list-disc pl-4 text-slate-600">
              <li>Pakistani Citizen with valid CNIC (Age: 21–45 years)</li>
              <li>Active bank account with any 1Link commercial bank</li>
              <li>Basic business idea / expansion plan</li>
              <li>No default history in State Bank of Pakistan eCIB</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
