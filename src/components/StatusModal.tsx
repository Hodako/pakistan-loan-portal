import React, { useState } from 'react';
import { GovLogo } from './GovLogo';
import { X, Search, CheckCircle2, Clock, ShieldAlert, FileText, Printer, Building2, User, Phone, CreditCard } from 'lucide-react';
import { ApplicationData } from '../types';

interface StatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedApplications: ApplicationData[];
}

const DEMO_RECORDS: Record<string, any> = {
  'GOP-2026-179568-PK': {
    trackingId: 'GOP-2026-179568-PK',
    submittedAt: 'Today, 09:45 AM',
    personal: {
      fullName: 'Muhammad Usman Khan',
      cnic: '35202-1984729-1',
      mobileNo: '0346-7819254',
      gender: 'Male',
      dob: '14/08/1994',
      province: 'Punjab',
      address: 'House # 42, St 5, Gulberg III, Lahore',
    },
    bank: {
      loanAmount: '1,500,000',
      loanPurpose: 'New Business Setup',
      occupation: 'Business Owner / Trader',
      bankName: 'Habib Bank Limited (HBL)',
      accountNumber: '01234567890123',
      currentBalance: '85,000',
      monthlyIncome: '120,000',
    },
    status: 'Under Review',
    statusUrdu: 'درخواست زیرِ جائزہ ہے',
    officerRemarks: 'NADRA biometric and banking authorization verified. Application forwarded to HBL Regional Hub for credit appraisal.',
    assignedBranch: 'HBL Main Boulevard Gulberg, Lahore',
    stage: 2,
  },
  'GOP-2026-882194-PK': {
    trackingId: 'GOP-2026-882194-PK',
    submittedAt: '12/08/2026, 11:20 AM',
    personal: {
      fullName: 'Fatima Bibi',
      cnic: '37405-8910482-4',
      mobileNo: '0300-5192841',
      gender: 'Female',
      dob: '22/03/1998',
      province: 'Punjab',
      address: 'Street 4, Sector G-9/2, Islamabad',
    },
    bank: {
      loanAmount: '500,000',
      loanPurpose: 'Women Entrepreneurship',
      occupation: 'Self Employed / Freelancer',
      bankName: 'National Bank of Pakistan (NBP)',
      accountNumber: '09876543210987',
      currentBalance: '45,000',
      monthlyIncome: '75,000',
    },
    status: 'Approved',
    statusUrdu: 'درخواست منظور ہو چکی ہے',
    officerRemarks: 'Sanction letter issued under Tier-1 Zero Markup Women Entrepreneurship stream. Ready for disbursement.',
    assignedBranch: 'NBP Civic Centre, Islamabad',
    stage: 4,
  },
};

export const StatusModal: React.FC<StatusModalProps> = ({
  isOpen,
  onClose,
  savedApplications,
}) => {
  const [query, setQuery] = useState('');
  const [searchResult, setSearchResult] = useState<any | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  if (!isOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setHasSearched(true);
    const cleaned = query.trim().toUpperCase();
    const cnicCleaned = query.trim().replace(/\D/g, '');

    // 1. Check in DEMO_RECORDS
    if (DEMO_RECORDS[cleaned]) {
      setSearchResult(DEMO_RECORDS[cleaned]);
      return;
    }

    // 2. Check savedApplications
    const matched = savedApplications.find(
      (app) =>
        app.trackingId.toUpperCase() === cleaned ||
        (app.personal.cnic && app.personal.cnic.replace(/\D/g, '') === cnicCleaned)
    );

    if (matched) {
      setSearchResult({
        trackingId: matched.trackingId,
        submittedAt: matched.submittedAt || 'Recent',
        personal: matched.personal,
        bank: matched.bank,
        status: matched.status || 'Under Review',
        statusUrdu: 'درخواست زیرِ جائزہ ہے',
        officerRemarks: 'NADRA biometric and banking authorization verified. Application in process.',
        assignedBranch: `${matched.bank.bankName || 'Partner Bank'} Main Branch`,
        stage: 2,
      });
      return;
    }

    // 3. If query has length or starts with GOP, simulate a found application
    if (cleaned.startsWith('GOP-') || cnicCleaned.length >= 10) {
      setSearchResult({
        trackingId: cleaned.startsWith('GOP-') ? cleaned : `GOP-2026-${Math.floor(100000 + Math.random() * 900000)}-PK`,
        submittedAt: 'Today',
        personal: {
          fullName: 'Applicant Verified',
          cnic: query.includes('-') ? query : '35202-XXXXXXX-1',
          mobileNo: '0300-XXXXXXX',
          gender: 'Male',
          dob: '01/01/1992',
          province: 'Punjab',
          address: 'Lahore, Pakistan',
        },
        bank: {
          loanAmount: '500,000',
          loanPurpose: 'Business Expansion',
          occupation: 'Self Employed',
          bankName: 'National Bank of Pakistan (NBP)',
          accountNumber: '0123456789',
          currentBalance: '50,000',
          monthlyIncome: '85,000',
        },
        status: 'Under Review',
        statusUrdu: 'درخواست زیرِ جائزہ ہے',
        officerRemarks: 'NADRA biometric verified. Application forwarded for bank appraisal.',
        assignedBranch: 'NBP Regional Office',
        stage: 2,
      });
    } else {
      setSearchResult(null);
    }
  };

  const stages = [
    { num: 1, label: 'Submitted', desc: 'درخواست موصول' },
    { num: 2, label: 'NADRA & 1Link Verified', desc: 'بائیومیٹرک تصدیق' },
    { num: 3, label: 'Bank Appraisal', desc: 'بینک کریڈٹ جانچ' },
    { num: 4, label: 'Approved & Disbursed', desc: 'منظوری و ادائیگی' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="bg-[#091e38] text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <GovLogo size={40} />
            <div>
              <div className="text-[10px] tracking-wider uppercase font-semibold text-emerald-400">
                GOVERNMENT OF PAKISTAN
              </div>
              <h3 className="text-base sm:text-lg font-bold font-serif-display text-white">
                Track Application Status
              </h3>
              <p className="text-xs text-emerald-300 font-urdu" dir="rtl">
                درخواست کی صورتحال معلوم کریں
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
        <div className="p-5 sm:p-6 space-y-5 max-h-[78vh] overflow-y-auto">
          {/* Quick Demo ID pills */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-slate-500 font-medium">Quick Demo IDs:</span>
            {Object.keys(DEMO_RECORDS).map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => {
                  setQuery(id);
                  setSearchResult(DEMO_RECORDS[id]);
                  setHasSearched(true);
                }}
                className="font-mono text-[11px] bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-emerald-900 px-2 py-0.5 rounded border border-slate-200 cursor-pointer transition-colors"
              >
                {id}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <form onSubmit={handleSearch} className="space-y-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Enter Tracking ID (e.g. GOP-2026-179568-PK) or CNIC"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setHasSearched(false);
                }}
                className="w-full pl-3.5 pr-12 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#091e38]/30 font-mono"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-[#091e38] hover:bg-[#0e2c4f] text-white p-2 rounded-lg transition-colors cursor-pointer"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Not Found State */}
          {hasSearched && !searchResult && (
            <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 text-center text-xs text-rose-800">
              <ShieldAlert className="w-6 h-6 text-rose-600 mx-auto mb-1.5" />
              <p className="font-bold">No Record Found</p>
              <p className="text-[11px] text-rose-700 mt-0.5">
                Please verify your Tracking ID or CNIC format, or click a Quick Demo ID above.
              </p>
            </div>
          )}

          {/* Search Result Card */}
          {searchResult && (
            <div className="space-y-4">
              
              {/* Top summary box */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">
                      Tracking ID
                    </span>
                    <div className="font-mono font-bold text-sm sm:text-base text-[#091e38] flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-emerald-700" />
                      {searchResult.trackingId}
                    </div>
                  </div>
                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 ${
                      searchResult.status === 'Approved'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-amber-100 text-amber-800 border border-amber-300'
                    }`}
                  >
                    {searchResult.status === 'Approved' ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                    )}
                    {searchResult.status}
                  </span>
                </div>

                {/* Grid details */}
                <div className="grid grid-cols-2 gap-2.5 text-xs text-slate-600">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Applicant:</span>
                    <strong className="text-slate-900">{searchResult.personal.fullName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">CNIC:</span>
                    <span className="font-mono font-semibold text-slate-800">
                      {searchResult.personal.cnic}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Bank / Branch:</span>
                    <span className="font-medium text-slate-800">
                      {searchResult.bank.bankName}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Loan Amount:</span>
                    <span className="font-mono font-bold text-emerald-700">
                      PKR {searchResult.bank.loanAmount}
                    </span>
                  </div>
                </div>

                {/* Officer remarks */}
                <div className="bg-white border border-slate-200 rounded-lg p-2.5 text-[11px] text-slate-700">
                  <span className="font-bold text-slate-900 block mb-0.5">
                    Official Appraisal Remarks:
                  </span>
                  <p className="text-slate-600">{searchResult.officerRemarks}</p>
                </div>
              </div>

              {/* Progress Stage Steps */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <div className="text-xs font-bold text-[#091e38] mb-3">
                  Application Timeline & Verification Progress
                </div>
                <div className="space-y-3">
                  {stages.map((st) => {
                    const isDone = (searchResult.stage || 2) >= st.num;
                    const isCurrent = (searchResult.stage || 2) === st.num;
                    return (
                      <div key={st.num} className="flex items-center gap-3">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                            isDone
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-200 text-slate-500'
                          }`}
                        >
                          {isDone ? '✓' : st.num}
                        </div>
                        <div className="flex-1 flex items-center justify-between text-xs">
                          <div>
                            <span className={`font-semibold ${isDone ? 'text-slate-900' : 'text-slate-400'}`}>
                              {st.label}
                            </span>
                          </div>
                          <span className="font-urdu text-slate-400 text-[11px]">
                            {st.desc}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Print Acknowledgment button */}
              <button
                onClick={() => window.print()}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg border border-slate-300 flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <Printer className="w-4 h-4 text-slate-500" />
                <span>Print Official Acknowledgment Slip</span>
              </button>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
