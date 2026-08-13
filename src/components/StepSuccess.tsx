import React, { useState } from 'react';
import { ApplicationData } from '../types';
import { CheckCircle2, Copy, Check, Printer, Phone, MessageSquare, ArrowRight, ShieldCheck } from 'lucide-react';
import { GovLogo } from './GovLogo';

interface SuccessProps {
  data: ApplicationData;
  onReset: () => void;
  onTrack: () => void;
}

export const StepSuccess: React.FC<SuccessProps> = ({
  data,
  onReset,
  onTrack,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(data.trackingId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-md max-w-lg mx-auto text-slate-800 my-4">
      {/* Top Animated Success Emblem */}
      <div className="flex flex-col items-center text-center mb-6">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-[#0e5e38] mb-3 animate-bounce">
          <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
        </div>
        <span className="text-[10px] font-bold tracking-widest uppercase bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full mb-2">
          APPLICATION SUBMITTED
        </span>
        <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#0b1c33] leading-tight mb-1">
          Your Loan Application Submitted Successfully!
        </h2>
        <p className="text-sm font-serif font-semibold text-[#0e5e38] mb-1">
          آپ کی قرض کی درخواست کامیابی سے جمع ہو گئی ہے
        </p>
        <p className="text-xs text-slate-500">
          Government of Pakistan – Ministry of Finance
        </p>
      </div>

      {/* Dashed Tracking ID Box */}
      <div className="bg-slate-50 border-2 border-dashed border-[#0e5e38]/40 rounded-xl p-5 text-center mb-6 relative">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
          YOUR TRACKING ID / ٹریکنگ آئی ڈی
        </span>
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="font-mono text-2xl sm:text-3xl font-extrabold text-[#0b1c33] tracking-wider select-all">
            {data.trackingId}
          </span>
          <button
            onClick={handleCopy}
            title="Copy Tracking ID"
            id="copy-tracking-id-btn"
            className="p-1.5 text-slate-600 hover:text-[#0e5e38] bg-white border border-slate-200 rounded-lg shadow-2xs hover:bg-slate-100 transition-all"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
        <p className="text-[11px] text-slate-500">
          Please save this ID for future reference / براہ کرم اس آئی ڈی کو محفوظ رکھیں
        </p>
      </div>

      {/* Application Details Summary */}
      <div className="bg-slate-50/80 border border-slate-200 rounded-xl p-4 text-xs space-y-2.5 mb-6">
        <div className="flex justify-between border-b border-slate-200/60 pb-2">
          <span className="text-slate-500">Applicant Name:</span>
          <span className="font-bold text-slate-900">{data.personal.fullName || 'N/A'}</span>
        </div>
        <div className="flex justify-between border-b border-slate-200/60 pb-2">
          <span className="text-slate-500">CNIC Number:</span>
          <span className="font-mono font-semibold text-slate-900">{data.personal.cnic || 'N/A'}</span>
        </div>
        <div className="flex justify-between border-b border-slate-200/60 pb-2">
          <span className="text-slate-500">Bank Name:</span>
          <span className="font-semibold text-slate-900">{data.bank.bankName || 'N/A'}</span>
        </div>
        <div className="flex justify-between border-b border-slate-200/60 pb-2">
          <span className="text-slate-500">Loan Amount Requested:</span>
          <span className="font-mono font-bold text-[#0e5e38]">PKR {data.bank.loanAmount || '0'}</span>
        </div>
        <div className="flex justify-between items-center pt-0.5">
          <span className="text-slate-500">Status:</span>
          <span className="bg-amber-100 text-amber-800 font-bold text-[10px] uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
            Verification In Progress
          </span>
        </div>
      </div>

      {/* Notice Banner */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 mb-6 text-xs text-emerald-900 flex items-start gap-2.5">
        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-bold text-emerald-900">
            Our verification team will contact you within 48 hours.
          </p>
          <p className="font-serif text-emerald-800 text-[11px] mt-0.5">
            ہماری ٹیم 48 گھنٹوں کے اندر آپ سے رابطہ کرے گی۔
          </p>
        </div>
      </div>

      {/* Support Contact Box */}
      <div className="bg-[#0b1c33] text-white rounded-xl p-4 mb-6 text-xs">
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
          FOR ANY QUERY, CONTACT US / کسی بھی سوال کے لیے رابطہ کریں
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-200">
          <div className="flex items-center gap-2">
            <Phone className="w-3.5 h-3.5 text-emerald-400" />
            <span>0800 114 400</span>
          </div>
          <div className="flex items-center gap-2">
            <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
            <span>0326-3492053</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2.5">
        <button
          onClick={handlePrint}
          id="print-receipt-btn"
          className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2"
        >
          <Printer className="w-4 h-4" />
          <span>Download / Print Official Receipt</span>
        </button>

        <div className="flex gap-2.5">
          <button
            onClick={onTrack}
            id="track-from-success-btn"
            className="flex-1 py-2.5 px-3 border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1"
          >
            <span>Track Application</span>
          </button>

          <button
            onClick={onReset}
            id="new-application-btn"
            className="flex-1 py-2.5 px-3 bg-[#0f2848] hover:bg-[#163a66] text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1"
          >
            <span>New Application</span>
          </button>
        </div>
      </div>
    </div>
  );
};
