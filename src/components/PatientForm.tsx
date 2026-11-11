import React from 'react';
import { PatientInfo } from '../types/lab';
import { User, Phone, Calendar, Stethoscope, MapPin, Home, Building2, FileEdit } from 'lucide-react';

interface PatientFormProps {
  patient: PatientInfo;
  branches: string[];
  onChange: (updated: Partial<PatientInfo>) => void;
}

export const PatientForm: React.FC<PatientFormProps> = ({ patient, branches, onChange }) => {
  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg relative overflow-hidden">
      {/* Decorative gradient corner */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-600/10 via-blue-600/5 to-transparent pointer-events-none rounded-tr-2xl" />

      <div className="flex items-center justify-between mb-4 border-b border-slate-800/80 pb-3">
        <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
          <User className="w-4 h-4 text-red-500" />
          <span>بيانات المريض والحالة</span>
        </h2>
        <span className="text-[11px] text-slate-400">
          مطلوب لإرسال تقرير الفاتورة عبر واتساب
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {/* Patient Name */}
        <div className="sm:col-span-2 lg:col-span-1">
          <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-slate-400" />
            <span>اسم المريض الثلاثي</span>
            <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={patient.name}
            onChange={(e) => onChange({ name: e.target.value })}
            placeholder="مثال: أحمد محمد علي"
            className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition"
          />
        </div>

        {/* WhatsApp / Phone */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-emerald-400" />
            <span>رقم هاتف / واتساب المريض</span>
            <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <input
              type="tel"
              dir="ltr"
              value={patient.phone}
              onChange={(e) => onChange({ phone: e.target.value })}
              placeholder="01012345678"
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2 text-sm text-left text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-mono transition"
            />
            <span className="absolute right-3 top-2.5 text-[11px] text-emerald-400 font-medium pointer-events-none">
              واتساب
            </span>
          </div>
        </div>

        {/* Age & Gender */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>السن (العمر)</span>
            </label>
            <input
              type="text"
              value={patient.age}
              onChange={(e) => onChange({ age: e.target.value })}
              placeholder="مثال: 35"
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">النوع</label>
            <select
              value={patient.gender}
              onChange={(e) => onChange({ gender: e.target.value as 'male' | 'female' | 'other' })}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-2.5 py-2 text-sm text-white focus:outline-none focus:border-red-500 transition cursor-pointer"
            >
              <option value="male">ذكر</option>
              <option value="female">أنثى</option>
              <option value="other">طفل / رضيع</option>
            </select>
          </div>
        </div>

        {/* Referring Doctor */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
            <Stethoscope className="w-3.5 h-3.5 text-blue-400" />
            <span>الطبيب المعالج / العيادة</span>
          </label>
          <input
            type="text"
            value={patient.referringDoctor}
            onChange={(e) => onChange({ referringDoctor: e.target.value })}
            placeholder="مثال: د. حسام فتحي (باطنة)"
            className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
          />
        </div>

        {/* Branch selection */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-red-400" />
            <span>فرع المعمل</span>
          </label>
          <select
            value={patient.branch}
            onChange={(e) => onChange({ branch: e.target.value })}
            className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-red-500 transition cursor-pointer"
          >
            {branches.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>

        {/* Sample Collection Mode (Lab vs Home) */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">مكان السحب</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => onChange({ sampleCollectionType: 'lab' })}
              className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition border cursor-pointer ${
                patient.sampleCollectionType === 'lab'
                  ? 'bg-blue-600/30 text-blue-300 border-blue-500'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>داخل الفرع</span>
            </button>
            <button
              type="button"
              onClick={() => onChange({ sampleCollectionType: 'home' })}
              className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition border cursor-pointer ${
                patient.sampleCollectionType === 'home'
                  ? 'bg-red-600/30 text-red-300 border-red-500'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span>سحب منزلي</span>
            </button>
          </div>
        </div>

        {/* Clinical notes */}
        <div className="sm:col-span-2 lg:col-span-3">
          <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
            <FileEdit className="w-3.5 h-3.5 text-slate-400" />
            <span>ملاحظات طبية / حالة الصيام / أدوية منتظمة (اختياري)</span>
          </label>
          <input
            type="text"
            value={patient.notes}
            onChange={(e) => onChange({ notes: e.target.value })}
            placeholder="مثال: المريض صائم 10 ساعات، يتناول أدوية سيولة، النتيجة مطلوبة بصورة عاجلة..."
            className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-slate-500 transition"
          />
        </div>
      </div>
    </div>
  );
};
