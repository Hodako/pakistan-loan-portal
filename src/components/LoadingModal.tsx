import React, { useEffect } from 'react';
import { GovLogo } from './GovLogo';

interface LoadingModalProps {
  onComplete: () => void;
  durationMs?: number;
}

export const LoadingModal: React.FC<LoadingModalProps> = ({
  onComplete,
  durationMs = 2800,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, durationMs);

    return () => clearTimeout(timer);
  }, [onComplete, durationMs]);

  return (
    <div className="fixed inset-0 z-50 bg-slate-100/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-fade-in">
      <div className="max-w-sm w-full bg-white border border-slate-200/80 rounded-2xl p-8 shadow-xl flex flex-col items-center">
        {/* Government Crest Logo */}
        <div className="mb-6 relative">
          <GovLogo size={72} />
        </div>

        {/* Loading Spinner Circle */}
        <div className="w-12 h-12 border-4 border-slate-200 border-t-[#0e5e38] rounded-full animate-spin mb-6" />

        {/* Searching Title */}
        <h3 className="text-2xl font-bold font-serif text-[#0b1c33] mb-2 tracking-tight">
          Searching...
        </h3>

        {/* Urdu & English Subtitle */}
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans mb-1">
          Please wait while we verify your information
        </p>
        <p className="text-xs sm:text-sm text-slate-700 font-serif leading-relaxed">
          براہ کرم انتظار کریں، آپ کی معلومات کی تصدیق ہو رہی ہے
        </p>
      </div>
    </div>
  );
};
