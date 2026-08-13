import React from 'react';
import { GovLogo } from './GovLogo';
import { Phone, MessageSquare, Mail, MapPin, Shield, HelpCircle } from 'lucide-react';

interface FooterProps {
  onApplyClick?: () => void;
  onTrackClick?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onApplyClick, onTrackClick }) => {
  return (
    <footer className="bg-[#0b1c33] text-slate-200 mt-auto pt-10 pb-8 border-t border-slate-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Main Branding Section */}
        <div className="flex flex-col sm:flex-row items-start gap-4 mb-8">
          <GovLogo size={48} className="shrink-0" />
          <div>
            <h3 className="text-xl font-serif font-bold text-white tracking-wide">
              Pakistan Loan Portal
            </h3>
            <p className="text-xs uppercase tracking-widest text-slate-400 font-medium mb-2">
              MINISTRY OF FINANCE
            </p>
            <p className="text-sm text-slate-300 leading-relaxed max-w-xl">
              Official portal for loan assistance programme. All applications are processed through verified government channels.
            </p>
          </div>
        </div>

        {/* Contact Information */}
        <div className="border-t border-slate-800/80 pt-6 mb-8">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">
            CONTACT
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-slate-300">
            <div className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>0800 114 400 (Toll Free)</span>
            </div>
            <div className="flex items-center gap-2.5">
              <MessageSquare className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>0326-3492053 (WhatsApp)</span>
            </div>
            <div className="flex items-center gap-2.5">
              <MessageSquare className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>0325-7710820 (WhatsApp)</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>info@finance.gov.pk</span>
            </div>
            <div className="flex items-center gap-2.5 sm:col-span-2">
              <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Q-Block, Pak Secretariat, Islamabad</span>
            </div>
          </div>
        </div>

        {/* Official Banner Tag from Screenshots */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-3 text-center mb-6">
          <p className="text-xs text-slate-400 flex items-center justify-center gap-2 flex-wrap">
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span>Government of Pakistan – Official Loan Portal</span>
            <span className="text-slate-600">•</span>
            <span className="font-serif text-slate-300">حکومت پاکستان</span>
          </p>
        </div>

        {/* Copyright */}
        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-800/50">
          © {new Date().getFullYear()} Ministry of Finance, Government of Pakistan. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
