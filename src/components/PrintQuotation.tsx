import React, { useState } from 'react';
import { InvoiceRecord, LabSettings } from '../types/lab';
import { Printer, X, FileText, CheckCircle, Clock, MapPin, Phone } from 'lucide-react';

interface PrintQuotationProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: InvoiceRecord;
  settings: LabSettings;
}

export const PrintQuotation: React.FC<PrintQuotationProps> = ({
  isOpen,
  onClose,
  invoice,
  settings,
}) => {
  const [paperFormat, setPaperFormat] = useState<'a4' | 'thermal'>('a4');

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const dateFormatted = new Date(invoice.createdAt).toLocaleDateString('ar-EG', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-5 overflow-y-auto">
      <div className="w-full max-w-4xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
        {/* Controls Bar (Not Printed) */}
        <div className="no-print px-5 py-3.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Printer className="w-5 h-5 text-red-500" />
            <h3 className="text-sm sm:text-base font-bold text-white">
              طباعة إيصال الفاتورة وعرض الأسعار
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1 text-xs">
              <button
                type="button"
                onClick={() => setPaperFormat('a4')}
                className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
                  paperFormat === 'a4'
                    ? 'bg-red-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                تقرير A4 رسمي
              </button>
              <button
                type="button"
                onClick={() => setPaperFormat('thermal')}
                className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
                  paperFormat === 'thermal'
                    ? 'bg-red-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                إيصال كاشير 80mm
              </button>
            </div>

            <button
              onClick={handlePrint}
              className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs sm:text-sm font-bold shadow-md transition flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة الآن</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Area */}
        <div className="p-4 sm:p-8 overflow-y-auto bg-slate-950 flex justify-center">
          <div
            id="printable-receipt"
            className={`bg-white text-slate-900 p-6 sm:p-8 rounded-xl shadow-xl transition-all ${
              paperFormat === 'thermal' ? 'w-[360px] text-xs' : 'w-full max-w-3xl text-sm'
            }`}
            style={{ direction: 'rtl' }}
          >
            {/* Header with Lab Logo */}
            <div className="flex items-center justify-between pb-4 border-b-2 border-red-700 mb-4">
              <div className="flex items-center gap-3">
                <img
                  src="/assets/aistudio/IMG_20261024_095049_855_cecabf0b.jpg"
                  alt="RT Labs"
                  className="w-16 h-16 rounded-xl object-cover border border-slate-300"
                />
                <div>
                  <h1 className="text-lg sm:text-xl font-black text-red-950 tracking-tight">
                    {settings.labName}
                  </h1>
                  <p className="text-xs sm:text-sm font-bold text-red-700">
                    {settings.doctorName}
                  </p>
                  <p className="text-[11px] text-slate-500">{settings.doctorTitle}</p>
                </div>
              </div>

              <div className="text-left font-mono">
                <span className="block text-xs font-bold text-slate-400">فاتورة / عرض سعر</span>
                <span className="text-base sm:text-lg font-black text-red-700">
                  #{invoice.invoiceNumber}
                </span>
                <span className="block text-[11px] text-slate-500">{dateFormatted}</span>
              </div>
            </div>

            {/* Patient Info Card */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 mb-4 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div>
                <span className="block text-slate-500 text-[10px]">اسم المريض:</span>
                <strong className="text-slate-900 text-xs sm:text-sm">
                  {invoice.patient.name || 'عميل نقدي'}
                </strong>
              </div>
              <div>
                <span className="block text-slate-500 text-[10px]">الهاتف / واتساب:</span>
                <strong className="text-slate-900 font-mono" dir="ltr">
                  {invoice.patient.phone || '-'}
                </strong>
              </div>
              <div>
                <span className="block text-slate-500 text-[10px]">السن / النوع:</span>
                <strong className="text-slate-900">
                  {invoice.patient.age ? `${invoice.patient.age} سنة` : '-'}{' '}
                  {invoice.patient.gender === 'female' ? '(أنثى)' : '(ذكر)'}
                </strong>
              </div>
              <div>
                <span className="block text-slate-500 text-[10px]">الطبيب المحول / الفرع:</span>
                <strong className="text-slate-900">
                  {invoice.patient.referringDoctor || invoice.patient.branch}
                </strong>
              </div>
            </div>

            {/* Applied Package Banner if any */}
            {invoice.appliedPackage && (
              <div className="bg-red-50 border border-red-200 text-red-900 p-2.5 rounded-lg mb-4 text-xs flex items-center justify-between">
                <span>
                  🎁 <strong>عرض باقة معتمدة:</strong> {invoice.appliedPackage.nameAr}
                </span>
                <span className="font-bold font-mono">
                  سعر الباقة: {invoice.appliedPackage.packagePrice} {settings.currency}
                </span>
              </div>
            )}

            {/* Itemized Tests Table */}
            <table className="w-full border-collapse mb-4 text-xs">
              <thead>
                <tr className="bg-slate-100 border-y border-slate-300 text-slate-700">
                  <th className="py-2 px-2 text-right">#</th>
                  <th className="py-2 px-2 text-right">الكود</th>
                  <th className="py-2 px-2 text-right">اسم التحليل والفحص</th>
                  <th className="py-2 px-2 text-right">نوع العينة</th>
                  <th className="py-2 px-2 text-left">السعر</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {invoice.items.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="py-2 px-2 text-slate-500 font-mono">{idx + 1}</td>
                    <td className="py-2 px-2 font-mono text-[11px] text-red-700 font-bold">
                      {item.testId}
                    </td>
                    <td className="py-2 px-2">
                      <strong className="text-slate-900 block">{item.testNameAr}</strong>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {item.testNameEn}
                      </span>
                    </td>
                    <td className="py-2 px-2 text-[11px] text-slate-600">
                      {item.sampleType}
                    </td>
                    <td className="py-2 px-2 text-left font-mono font-bold text-slate-900">
                      {item.price} {settings.currency}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Financial Summary Box */}
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
              {/* Preparation instructions */}
              <div className="flex-1 bg-amber-50/70 border border-amber-200 rounded-xl p-3 text-[11px] text-amber-900 leading-relaxed">
                <strong className="block mb-1 font-bold text-amber-950">
                  ⚠️ تعليمات وتحضير العينات:
                </strong>
                <ul className="list-disc list-inside space-y-0.5">
                  {invoice.items
                    .filter((i) => i.fasting && !i.fasting.includes('بدون صيام'))
                    .map((i, k) => (
                      <li key={k}>
                        <strong>{i.testNameAr}:</strong> {i.fasting}
                      </li>
                    ))}
                  {invoice.items.every((i) => !i.fasting || i.fasting.includes('بدون صيام')) && (
                    <li>لا تشترط هذه الفحوصات صياماً ويمكن إجراؤها فوراً.</li>
                  )}
                  <li>شرب الماء مسموح وموصى به قبل سحب العينات.</li>
                </ul>
              </div>

              {/* Total calculations */}
              <div className="w-full sm:w-64 bg-slate-100 rounded-xl p-3.5 border border-slate-200 space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>الإجمالي قبل الخصم:</span>
                  <span className="font-mono font-bold">{invoice.totalBeforeDiscount} {settings.currency}</span>
                </div>

                {invoice.discountAmount > 0 && (
                  <div className="flex justify-between text-red-700 font-bold">
                    <span>
                      الخصم {invoice.contractName ? `(${invoice.contractName})` : `(${invoice.discountValue}%)`}:
                    </span>
                    <span className="font-mono">- {invoice.discountAmount} {settings.currency}</span>
                  </div>
                )}

                <div className="flex justify-between text-sm sm:text-base font-black text-slate-900 pt-1.5 border-t border-slate-300">
                  <span>الصافي المطلوب:</span>
                  <span className="font-mono text-red-700">{invoice.netTotal} {settings.currency}</span>
                </div>

                <div className="flex justify-between text-slate-700 pt-1 text-[11px]">
                  <span>المبلغ المدفوع:</span>
                  <span className="font-mono">{invoice.paidAmount} {settings.currency}</span>
                </div>

                <div className="flex justify-between font-bold pt-1 border-t border-slate-200 text-xs">
                  <span>المتبقي:</span>
                  <span className={`font-mono ${invoice.remainingAmount > 0 ? 'text-amber-800' : 'text-emerald-700'}`}>
                    {invoice.remainingAmount > 0 ? `${invoice.remainingAmount} ${settings.currency}` : 'خالص بالكامل'}
                  </span>
                </div>
              </div>
            </div>

            {/* Footer and Signatures */}
            <div className="pt-4 border-t border-slate-200 text-center text-xs text-slate-500 space-y-1">
              <div className="flex items-center justify-between text-[11px] px-2 mb-2">
                <span>توقيع الطبيب / مسؤول الاستقبال: _________________</span>
                <span>ختم المعمل: [ RT LABS ]</span>
              </div>
              <p className="font-bold text-slate-700">
                {settings.address} • الخط الساخن: {settings.hotline}
              </p>
              <p className="text-[10px] text-slate-400">
                نسخة إلكترونية معتمدة صادرة من نظام معامل RT للتحاليل التشخيصية (د. رامي مختار)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
