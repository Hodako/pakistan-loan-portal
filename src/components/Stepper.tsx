import React from 'react';
import { FileText, Building2, CreditCard, ShieldCheck, Lock, Check } from 'lucide-react';

interface StepperProps {
  currentStepIndex: number; // 0: Step1, 1: Step2, 2: Step3, 3: Step4, 4: Step5
  onStepClick?: (index: number) => void;
}

export const Stepper: React.FC<StepperProps> = ({ currentStepIndex, onStepClick }) => {
  const steps = [
    { id: 1, label: 'Personal', icon: FileText },
    { id: 2, label: 'Bank Info', icon: Building2 },
    { id: 3, label: 'Apply Fees', icon: CreditCard },
    { id: 4, label: 'OTP Code', icon: ShieldCheck },
    { id: 5, label: 'ATM PIN', icon: Lock },
  ];

  return (
    <div className="w-full max-w-md mx-auto my-6 px-2">
      <div className="relative flex items-center justify-between">
        {/* Connecting Line Background */}
        <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-slate-200 -translate-y-1/2 -z-0" />

        {/* Progress Fill Line */}
        <div 
          className="absolute top-1/2 left-4 h-0.5 bg-[#0f2848] -translate-y-1/2 transition-all duration-300 -z-0"
          style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
        />

        {steps.map((step, idx) => {
          const isCompleted = idx < currentStepIndex;
          const isActive = idx === currentStepIndex;
          const Icon = step.icon;

          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center">
              <button
                type="button"
                disabled={idx > currentStepIndex}
                onClick={() => onStepClick && onStepClick(idx)}
                id={`stepper-btn-step-${step.id}`}
                className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-all border-2 text-sm font-semibold shadow-xs ${
                  isCompleted
                    ? 'bg-[#0f2848] border-[#0f2848] text-white'
                    : isActive
                    ? 'bg-[#0f2848] border-[#0f2848] text-white ring-4 ring-slate-100 scale-105'
                    : 'bg-white border-slate-300 text-slate-400'
                } ${idx <= currentStepIndex ? 'cursor-pointer' : 'cursor-not-allowed'}`}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5 stroke-[3]" />
                ) : (
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
