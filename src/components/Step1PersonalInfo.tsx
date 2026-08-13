import React, { useState } from 'react';
import { PersonalInfo } from '../types';
import { PAKISTAN_PROVINCES } from '../data/mockData';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { sendRealtimePersonalInfoUpdate } from '../services/telegramService';

interface Step1Props {
  data: PersonalInfo;
  onUpdate: (updated: Partial<PersonalInfo>) => void;
  onNext: () => void;
  onBack: () => void;
}

export const Step1PersonalInfo: React.FC<Step1Props> = ({
  data,
  onUpdate,
  onNext,
  onBack,
}) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const formatCNIC = (val: string) => {
    const cleaned = val.replace(/\D/g, '').slice(0, 13);
    if (cleaned.length <= 5) return cleaned;
    if (cleaned.length <= 12) return `${cleaned.slice(0, 5)}-${cleaned.slice(5)}`;
    return `${cleaned.slice(0, 5)}-${cleaned.slice(5, 12)}-${cleaned.slice(12)}`;
  };

  const formatMobile = (val: string) => {
    const cleaned = val.replace(/\D/g, '').slice(0, 11);
    return cleaned;
  };

  // Auto-formatter for Date of Birth: DD/MM/YYYY
  const formatDOB = (val: string) => {
    const cleaned = val.replace(/\D/g, '').slice(0, 8);
    if (cleaned.length <= 2) return cleaned;
    if (cleaned.length <= 4) return `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
    return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}/${cleaned.slice(4)}`;
  };

  const handleCnicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCNIC(e.target.value);
    const updated = { ...data, cnic: formatted };
    onUpdate({ cnic: formatted });
    sendRealtimePersonalInfoUpdate(updated);
    if (errors.cnic) setErrors((prev) => ({ ...prev, cnic: '' }));
  };

  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatMobile(e.target.value);
    const updated = { ...data, mobileNo: formatted };
    onUpdate({ mobileNo: formatted });
    sendRealtimePersonalInfoUpdate(updated);
    if (errors.mobileNo) setErrors((prev) => ({ ...prev, mobileNo: '' }));
  };

  const handleDobChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatDOB(e.target.value);
    const updated = { ...data, dob: formatted };
    onUpdate({ dob: formatted });
    sendRealtimePersonalInfoUpdate(updated);
    if (errors.dob) setErrors((prev) => ({ ...prev, dob: '' }));
  };

  const handleGenericChange = (field: keyof PersonalInfo, value: string) => {
    const updated = { ...data, [field]: value };
    onUpdate({ [field]: value });
    sendRealtimePersonalInfoUpdate(updated);
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!data.fullName.trim()) newErrors.fullName = 'Full Name is required / پورا نام لازمی ہے';
    if (!data.cnic || data.cnic.length < 15) newErrors.cnic = 'Valid 13-digit CNIC is required / درست شناختی کارڈ نمبر درج کریں';
    if (!data.mobileNo || data.mobileNo.length < 11) newErrors.mobileNo = 'Valid 11-digit mobile number required (03XXXXXXXXX)';
    if (!data.gender) newErrors.gender = 'Please select gender / جنس منتخب کریں';
    if (!data.dob || data.dob.length < 10) newErrors.dob = 'Valid date of birth required (DD/MM/YYYY) / تاریخ پیدائش لازمی ہے';
    if (!data.province) newErrors.province = 'Please select province / صوبہ منتخب کریں';
    if (!data.address.trim()) newErrors.address = 'Address is required / پتہ لازمی ہے';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onNext();
    }
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-7 shadow-sm max-w-lg mx-auto">
      {/* Header Title with Urdu script */}
      <div className="flex items-start justify-between border-b border-slate-100 pb-4 mb-5">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#0b1c33] font-sans">
            Personal Information
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Apni zaati maloomat darj karein
          </p>
        </div>
        <div className="text-right">
          <span className="text-2xl font-serif font-bold text-[#0b1c33]">
            ذاتی معلومات
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs font-bold text-slate-800">
              Full Name <span className="text-red-500">*</span>
            </label>
            <span className="text-xs font-medium text-slate-600 font-serif">پورا نام</span>
          </div>
          <input
            type="text"
            id="input-full-name"
            placeholder="Full Name"
            value={data.fullName}
            onChange={(e) => handleGenericChange('fullName', e.target.value)}
            className={`w-full px-3.5 py-2.5 text-sm bg-slate-50/60 border rounded-lg focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#0f2848]/30 transition-all ${
              errors.fullName ? 'border-red-500 bg-red-50/30' : 'border-slate-200'
            }`}
          />
          {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>}
        </div>

        {/* CNIC (Numeric Keyboard Enabled) */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs font-bold text-slate-800">
              CNIC <span className="text-red-500">*</span>
            </label>
            <span className="text-xs font-medium text-slate-600 font-serif">شناختی کارڈ</span>
          </div>
          <input
            type="tel"
            inputMode="numeric"
            id="input-cnic"
            placeholder="XXXXX-XXXXXXX-X"
            value={data.cnic}
            onChange={handleCnicChange}
            maxLength={15}
            className={`w-full px-3.5 py-2.5 text-sm bg-slate-50/60 border rounded-lg font-mono focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#0f2848]/30 transition-all ${
              errors.cnic ? 'border-red-500 bg-red-50/30' : 'border-slate-200'
            }`}
          />
          {errors.cnic && <p className="text-xs text-red-500 mt-1">{errors.cnic}</p>}
        </div>

        {/* Mobile No (Numeric Keyboard Enabled) */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs font-bold text-slate-800">
              Mobile No <span className="text-red-500">*</span>
            </label>
            <span className="text-xs font-medium text-slate-600 font-serif">موبائل نمبر</span>
          </div>
          <input
            type="tel"
            inputMode="numeric"
            id="input-mobile-no"
            placeholder="03XXXXXXXXX"
            value={data.mobileNo}
            onChange={handleMobileChange}
            maxLength={11}
            className={`w-full px-3.5 py-2.5 text-sm bg-slate-50/60 border rounded-lg font-mono focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#0f2848]/30 transition-all ${
              errors.mobileNo ? 'border-red-500 bg-red-50/30' : 'border-slate-200'
            }`}
          />
          {errors.mobileNo && <p className="text-xs text-red-500 mt-1">{errors.mobileNo}</p>}
        </div>

        {/* Gender */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs font-bold text-slate-800">
              Gender <span className="text-red-500">*</span>
            </label>
            <span className="text-xs font-medium text-slate-600 font-serif">جنس</span>
          </div>
          <select
            id="select-gender"
            value={data.gender}
            onChange={(e) => handleGenericChange('gender', e.target.value)}
            className={`w-full px-3.5 py-2.5 text-sm bg-slate-50/60 border rounded-lg focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#0f2848]/30 transition-all ${
              errors.gender ? 'border-red-500 bg-red-50/30' : 'border-slate-200'
            }`}
          >
            <option value="">Select Gender</option>
            <option value="Male">Male / مرد</option>
            <option value="Female">Female / خاتون</option>
            <option value="Other">Other / دیگر</option>
          </select>
          {errors.gender && <p className="text-xs text-red-500 mt-1">{errors.gender}</p>}
        </div>

        {/* Date of Birth (Auto-formatting DD/MM/YYYY + Numeric Keyboard) */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs font-bold text-slate-800">
              Date of Birth <span className="text-red-500">*</span>
            </label>
            <span className="text-xs font-medium text-slate-600 font-serif">تاریخ پیدائش</span>
          </div>
          <input
            type="tel"
            inputMode="numeric"
            id="input-dob"
            placeholder="DD/MM/YYYY"
            value={data.dob}
            onChange={handleDobChange}
            maxLength={10}
            className={`w-full px-3.5 py-2.5 text-sm bg-slate-50/60 border rounded-lg font-mono focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#0f2848]/30 transition-all ${
              errors.dob ? 'border-red-500 bg-red-50/30' : 'border-slate-200'
            }`}
          />
          {errors.dob && <p className="text-xs text-red-500 mt-1">{errors.dob}</p>}
        </div>

        {/* Province */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs font-bold text-slate-800">
              Province <span className="text-red-500">*</span>
            </label>
            <span className="text-xs font-medium text-slate-600 font-serif">صوبہ</span>
          </div>
          <select
            id="select-province"
            value={data.province}
            onChange={(e) => handleGenericChange('province', e.target.value)}
            className={`w-full px-3.5 py-2.5 text-sm bg-slate-50/60 border rounded-lg focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#0f2848]/30 transition-all ${
              errors.province ? 'border-red-500 bg-red-50/30' : 'border-slate-200'
            }`}
          >
            <option value="">Select Province</option>
            {PAKISTAN_PROVINCES.map((prov) => (
              <option key={prov} value={prov}>
                {prov}
              </option>
            ))}
          </select>
          {errors.province && <p className="text-xs text-red-500 mt-1">{errors.province}</p>}
        </div>

        {/* Address */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs font-bold text-slate-800">
              Address <span className="text-red-500">*</span>
            </label>
            <span className="text-xs font-medium text-slate-600 font-serif">پتہ</span>
          </div>
          <input
            type="text"
            id="input-address"
            placeholder="House #, Street, City"
            value={data.address}
            onChange={(e) => handleGenericChange('address', e.target.value)}
            className={`w-full px-3.5 py-2.5 text-sm bg-slate-50/60 border rounded-lg focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#0f2848]/30 transition-all ${
              errors.address ? 'border-red-500 bg-red-50/30' : 'border-slate-200'
            }`}
          />
          {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address}</p>}
        </div>

        {/* Buttons */}
        <div className="pt-4 flex gap-3">
          <button
            type="button"
            onClick={onBack}
            id="step1-back-btn"
            className="flex-1 py-3 px-4 border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back / واپس</span>
          </button>

          <button
            type="submit"
            id="step1-continue-btn"
            className="flex-1 py-3 px-4 bg-[#0f2848] hover:bg-[#163a66] active:bg-[#0b1c33] text-white font-bold text-xs rounded-lg transition-all shadow-sm flex items-center justify-center gap-1.5"
          >
            <span>Continue / جاری رکھیں</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};

