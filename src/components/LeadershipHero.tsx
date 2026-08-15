import React, { useState } from 'react';
import { Bookmark, ShieldCheck, ChevronLeft, ChevronRight, Calculator, ArrowRight } from 'lucide-react';

interface LeadershipHeroProps {
  onStartApplication: () => void;
  onOpenCalculator: () => void;
}

interface Leader {
  id: 'pm' | 'cm';
  title: string;
  titleUrdu: string;
  name: string;
  nameUrdu: string;
  quote: string;
  quoteUrdu: string;
  image: string;
  initiative: string;
}

const LEADERS: Leader[] = [
  {
    id: 'pm',
    title: 'PRIME MINISTER OF PAKISTAN',
    titleUrdu: 'وزیراعظم پاکستان',
    name: 'Muhammad Shehbaz Sharif',
    nameUrdu: 'محمد شہباز شریف',
    quote: '"Har Pakistani ko maaliyati azadi aur khud-mukhtari milni chahiye. Yeh program hamare awam ke liye umeed ki kiran hai."',
    quoteUrdu: '”ہر پاکستانی کو مالیاتی آزادی اور خود مختاری ملنی چاہیے، یہ پروگرام ہمارے عوام کے لیے امید کی کرن ہے۔“',
    image: '/pm_shehbaz_sharif.jpg',
    initiative: 'Prime Minister National Youth Business & Agriculture Loan Scheme',
  },
  {
    id: 'cm',
    title: 'CHIEF MINISTER • PUNJAB',
    titleUrdu: 'وزیر اعلیٰ پنجاب',
    name: 'Maryam Nawaz Sharif',
    nameUrdu: 'مریم نواز شریف',
    quote: '"Khawateen, naujawan aur chote karobari hazraat ki maali madad hamari hukoomat ki sab se badi tarjeeh hai."',
    quoteUrdu: '”خواتین، نوجوان اور چھوٹے کاروباری حضرات کی مالی مدد ہماری حکومت کی سب سے بڑی ترجیح ہے۔“',
    image: '/cm_maryam_nawaz.jpg',
    initiative: 'Maryam Nawaz Honahar & Apni Chhat Apna Ghar Financial Assistance',
  },
];

export const LeadershipHero: React.FC<LeadershipHeroProps> = ({
  onStartApplication,
  onOpenCalculator,
}) => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const currentLeader = LEADERS[activeIndex];

  const handleNext = () => {
    setActiveIndex((prev) => (prev === 0 ? 1 : 0));
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? 1 : 0));
  };

  return (
    <div className="relative bg-linear-to-b from-[#071629] via-[#091e38] to-[#0c284b] text-white overflow-hidden border-b border-slate-700/60 shadow-xl">
      {/* Subtle Gold Matrix Background Overlay */}
      <div 
        className="absolute inset-0 opacity-10 bg-[radial-gradient(#C5A059_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" 
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Leader Portrait Card */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="relative w-full max-w-[340px] sm:max-w-[380px] aspect-3/4 rounded-xl overflow-hidden shadow-2xl border-2 border-slate-700/80 bg-slate-900 group">
              {/* Leader Image */}
              <img
                key={currentLeader.id}
                src={currentLeader.image}
                alt={currentLeader.name}
                className="w-full h-full object-cover object-top transition-opacity duration-300"
              />

              {/* Verified Portal Badge */}
              <div className="absolute top-3 left-3 bg-[#034423]/90 backdrop-blur-xs text-emerald-100 text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-md border border-emerald-500/40 flex items-center gap-1.5 shadow-md">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                <span>Verified Portal</span>
              </div>

              {/* Slider Pagination Controls */}
              <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-black/60 backdrop-blur-xs rounded-full p-1 border border-white/20">
                <button
                  onClick={handlePrev}
                  aria-label="Previous leader"
                  className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/20 transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-[11px] font-mono px-1.5 text-slate-300">
                  {activeIndex + 1}/{LEADERS.length}
                </span>
                <button
                  onClick={handleNext}
                  aria-label="Next leader"
                  className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/20 transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Pill Switcher Buttons below image */}
            <div className="flex gap-2 mt-3">
              {LEADERS.map((leader, idx) => (
                <button
                  key={leader.id}
                  onClick={() => setActiveIndex(idx)}
                  className={`text-xs px-3 py-1 rounded-full transition-all duration-150 cursor-pointer ${
                    activeIndex === idx
                      ? 'bg-emerald-600 text-white font-medium shadow-xs'
                      : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {leader.id === 'pm' ? 'PM Shehbaz Sharif' : 'CM Maryam Nawaz'}
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Quotes & Scheme Highlights */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-4 sm:space-y-6 text-left">
            
            {/* Title & Role */}
            <div>
              <div className="inline-flex items-center gap-2 text-emerald-400 text-xs sm:text-sm font-semibold tracking-widest uppercase mb-1">
                <Bookmark className="w-4 h-4" />
                <span>{currentLeader.title}</span>
                <span className="text-slate-400 font-urdu text-sm font-normal">
                  ({currentLeader.titleUrdu})
                </span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-bold font-serif-display text-white tracking-tight">
                {currentLeader.name}
              </h2>
              <div className="text-emerald-300 font-urdu text-lg sm:text-xl mt-1">
                {currentLeader.nameUrdu}
              </div>
            </div>

            {/* Quote Card */}
            <div className="border-l-4 border-emerald-400 pl-4 py-1.5 sm:py-2 bg-slate-800/40 rounded-r-lg">
              <p className="text-slate-200 italic font-serif-display text-base sm:text-lg leading-relaxed">
                {currentLeader.quote}
              </p>
              <p className="text-emerald-200/90 font-urdu text-sm sm:text-base mt-2 leading-loose text-right" dir="rtl">
                {currentLeader.quoteUrdu}
              </p>
            </div>

            {/* Key Scheme Metrics / Highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3 pt-2">
              <div className="bg-slate-800/60 border border-slate-700/70 rounded-lg p-2.5 sm:p-3 text-left">
                <div className="text-[11px] text-slate-400 uppercase font-medium">Loan Limit</div>
                <div className="text-base sm:text-lg font-bold text-emerald-400 font-mono">Up to 3 Crore</div>
                <div className="text-[10px] text-slate-300 font-urdu">3 کروڑ روپے تک</div>
              </div>

              <div className="bg-slate-800/60 border border-slate-700/70 rounded-lg p-2.5 sm:p-3 text-left">
                <div className="text-[11px] text-slate-400 uppercase font-medium">Subsidized Markup</div>
                <div className="text-base sm:text-lg font-bold text-emerald-400 font-mono">0% on Tier 1</div>
                <div className="text-[10px] text-slate-300 font-urdu">بغیر سود 5 لاکھ تک</div>
              </div>

              <div className="bg-slate-800/60 border border-slate-700/70 rounded-lg p-2.5 sm:p-3 text-left col-span-2 sm:col-span-1">
                <div className="text-[11px] text-slate-400 uppercase font-medium">Processing Time</div>
                <div className="text-base sm:text-lg font-bold text-emerald-400 font-mono">24-48 Hours</div>
                <div className="text-[10px] text-slate-300 font-urdu">فوری ڈیجیٹل جانچ</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onStartApplication}
                id="hero-start-apply-btn"
                className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white text-sm font-bold tracking-wide rounded-lg shadow-lg shadow-emerald-950/50 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5 cursor-pointer"
              >
                <span>APPLY FOR LOAN (درخواست دیں)</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenCalculator}
                id="hero-calculate-btn"
                className="w-full sm:w-auto px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium rounded-lg border border-slate-600 transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Calculator className="w-4 h-4 text-emerald-400" />
                <span>Calculate Installment</span>
              </button>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
