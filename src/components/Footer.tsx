import React from 'react';
import { GovLogo } from './GovLogo';
import { Phone, MessageSquare, Mail, ShieldCheck } from 'lucide-react';

interface FooterProps {
  onApplyClick?: () => void;
  onTrackClick?: () => void;
  onCalculatorClick?: () => void;
  onTiersClick?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onApplyClick,
  onTrackClick,
  onCalculatorClick,
  onTiersClick,
}) => {
  return (
    <footer className="bg-[#051325] text-slate-300 text-xs border-t border-slate-800 mt-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10 grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Brand Column */}
        <div className="md:col-span-5 space-y-3">
          <div className="flex items-center gap-3">
            <GovLogo size={44} />
            <div>
              <div className="text-[11px] uppercase tracking-wider font-semibold text-emerald-400">
                GOVERNMENT OF PAKISTAN
              </div>
              <div className="text-base font-bold font-serif-display text-white">
                Ministry of Finance
              </div>
              <div className="font-urdu text-xs text-slate-400">
                حکومت پاکستان - وزارت خزانہ
              </div>
            </div>
          </div>
          <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
            Official digital financing portal providing subsidized business, youth, and agricultural assistance across all provinces of Pakistan.
          </p>
          <div className="flex items-center gap-2 text-emerald-400 text-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Encrypted NADRA & 1Link Switch Integration</span>
          </div>
        </div>

        {/* Contact / Helpline Column */}
        <div className="md:col-span-4 space-y-2.5">
          <div className="text-xs uppercase font-bold text-white tracking-wider border-b border-slate-800 pb-1.5">
            Helplines & Official Inquiries
          </div>
          <div className="flex items-center gap-2.5 text-slate-300">
            <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              <div className="text-[11px] text-slate-400">Toll Free Helpline:</div>
              <strong className="text-white font-mono text-sm">0800 114 400</strong> /{' '}
              <strong className="text-white font-mono">051-9208000</strong>
            </div>
          </div>
          <div className="flex items-center gap-2.5 text-slate-300">
            <MessageSquare className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              <div className="text-[11px] text-slate-400">Official WhatsApp Support:</div>
              <span className="font-mono text-emerald-300 font-semibold">0341-0779487</span> |{' '}
              <span className="font-mono text-emerald-300 font-semibold">0326-3492053</span>
            </div>
          </div>
          <div className="flex items-center gap-2.5 text-slate-300">
            <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              <div className="text-[11px] text-slate-400">Email Assistance:</div>
              <span className="text-slate-300 font-mono">support@finance.gov.pk</span>
            </div>
          </div>
        </div>

        {/* Quick Links Column */}
        <div className="md:col-span-3 space-y-2">
          <div className="text-xs uppercase font-bold text-white tracking-wider border-b border-slate-800 pb-1.5">
            Portal Navigation
          </div>
          <ul className="space-y-1.5 text-slate-400">
            {onApplyClick && (
              <li>
                <button
                  onClick={onApplyClick}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  → Apply for Loan
                </button>
              </li>
            )}
            {onTrackClick && (
              <li>
                <button
                  onClick={onTrackClick}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  → Track Application
                </button>
              </li>
            )}
            {onCalculatorClick && (
              <li>
                <button
                  onClick={onCalculatorClick}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  → Installment Calculator
                </button>
              </li>
            )}
            {onTiersClick && (
              <li>
                <button
                  onClick={onTiersClick}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  → Loan Tiers & Eligibility
                </button>
              </li>
            )}
          </ul>
        </div>

      </div>

      <div className="border-t border-slate-800/80 py-4 text-center text-[11px] text-slate-500 max-w-6xl mx-auto px-4">
        © {new Date().getFullYear()} Ministry of Finance, Government of Pakistan. All rights reserved. Secure SBP & NADRA Verified Portal.
      </div>
    </footer>
  );
};
