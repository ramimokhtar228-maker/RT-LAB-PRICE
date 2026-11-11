import React, { useState } from 'react';
import { SelectedTestItem, DiscountContract, OfferPackage, LabTest, DailyOffer } from '../types/lab';
import { Trash2, MessageCircle, Printer, Save, Gift, Percent, Tag, DollarSign, CheckCircle2, AlertTriangle, ChevronDown, ChevronUp, Edit3, Flame } from 'lucide-react';

interface PricingSummaryProps {
  selectedItems: SelectedTestItem[];
  currency: string;
  appliedPackage?: { id: string; nameAr: string; packagePrice: number };
  appliedDailyOffer?: DailyOffer | null;
  discountType: 'percentage' | 'fixed' | 'contract' | 'none';
  discountValue: number;
  contractName?: string;
  contracts: DiscountContract[];
  paidAmount: number;
  onRemoveItem: (testId: string) => void;
  onEditItem?: (test: LabTest) => void;
  onClearAll: () => void;
  onDetachPackage: () => void;
  onRemoveDailyOffer?: () => void;
  onSetDiscountType: (type: 'percentage' | 'fixed' | 'contract' | 'none') => void;
  onSetDiscountValue: (val: number) => void;
  onSetContract: (contract: DiscountContract | null) => void;
  onSetPaidAmount: (val: number) => void;
  onOpenWhatsApp: () => void;
  onPrint: () => void;
  onSaveInvoice: () => void;
}

export const PricingSummary: React.FC<PricingSummaryProps> = ({
  selectedItems,
  currency,
  appliedPackage,
  appliedDailyOffer,
  discountType,
  discountValue,
  contractName,
  contracts,
  paidAmount,
  onRemoveItem,
  onEditItem,
  onClearAll,
  onDetachPackage,
  onRemoveDailyOffer,
  onSetDiscountType,
  onSetDiscountValue,
  onSetContract,
  onSetPaidAmount,
  onOpenWhatsApp,
  onPrint,
  onSaveInvoice,
}) => {
  const [showContractsList, setShowContractsList] = useState(false);

  // Subtotal calculation
  const subtotal = selectedItems.reduce(
    (sum, item) => sum + (item.customPrice ?? item.test.price),
    0
  );

  // If a package is active, the baseline is either the package price or subtotal
  const basePrice = appliedPackage ? appliedPackage.packagePrice : subtotal;

  // Calculate discount amount
  let discountAmount = 0;
  if (discountType === 'percentage' || discountType === 'contract') {
    discountAmount = Math.round((basePrice * discountValue) / 100);
  } else if (discountType === 'fixed') {
    discountAmount = Math.min(basePrice, discountValue);
  }

  const netTotal = Math.max(0, basePrice - discountAmount);
  const remaining = Math.max(0, netTotal - paidAmount);

  const quickDiscountPercentages = [0, 10, 15, 20, 25, 30, 35, 50];

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col justify-between h-full">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-emerald-400" />
            <h2 className="text-sm sm:text-base font-bold text-white">
              الفاتورة وحساب السعر النهائي
            </h2>
            <span className="text-xs bg-red-950/80 border border-red-800/50 text-red-300 px-2 py-0.5 rounded-full font-mono font-bold">
              {selectedItems.length} فحص
            </span>
          </div>

          {selectedItems.length > 0 && (
            <button
              onClick={onClearAll}
              className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 transition cursor-pointer"
              title="تفريغ جميع التحاليل المختارة"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>تفريغ</span>
            </button>
          )}
        </div>

        {/* Applied Daily Offer Notice Banner */}
        {appliedDailyOffer && (
          <div className="mt-3 p-2.5 rounded-xl bg-gradient-to-r from-red-950 via-rose-950 to-slate-900 border border-red-500/50 flex items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-400 animate-pulse shrink-0" />
              <div>
                <span className="text-white font-bold">{appliedDailyOffer.title}</span>
                <span className="text-red-200 block text-[11px] font-mono">
                  {appliedDailyOffer.discountPercentage ? `خصم فلاش ${appliedDailyOffer.discountPercentage}% مفعّل تلقائياً` : 'عرض اليوم المعتمد'}
                </span>
              </div>
            </div>
            {onRemoveDailyOffer && (
              <button
                onClick={onRemoveDailyOffer}
                className="text-[10px] text-red-300 hover:text-white px-2 py-0.5 rounded bg-slate-900 border border-red-800 cursor-pointer"
              >
                إلغاء
              </button>
            )}
          </div>
        )}

        {/* Applied Package Notice Banner */}
        {appliedPackage && (
          <div className="mt-3 p-3 rounded-xl bg-gradient-to-r from-red-950/60 via-slate-850 to-blue-950/50 border border-red-500/40 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Gift className="w-4 h-4 text-red-400 shrink-0" />
              <div>
                <span className="text-xs font-bold text-white block">
                  مطبّق: {appliedPackage.nameAr}
                </span>
                <span className="text-[11px] text-emerald-400 font-mono">
                  سعر العرض: {appliedPackage.packagePrice} {currency}
                </span>
              </div>
            </div>

            <button
              onClick={onDetachPackage}
              className="text-[11px] text-slate-400 hover:text-rose-400 transition cursor-pointer px-2 py-1 rounded bg-slate-900 border border-slate-700"
            >
              فك الباقة
            </button>
          </div>
        )}

        {/* Selected Items Scrollable List */}
        <div className="mt-3 space-y-2 max-h-[200px] overflow-y-auto pr-1">
          {selectedItems.map((item) => (
            <div
              key={item.test.id}
              className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between gap-2 text-right group hover:border-slate-700 transition"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono text-red-400 bg-red-950/60 px-1 rounded border border-red-900/40 font-bold">
                    {item.test.code}
                  </span>
                  <span className="text-xs font-bold text-white truncate">
                    {item.test.nameAr}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                  <span>{item.test.sampleType}</span>
                  <span>•</span>
                  <span className={item.test.fasting.includes('بدون صيام') ? 'text-slate-400' : 'text-amber-400'}>
                    {item.test.fasting}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <span className="text-xs font-black text-white font-mono">
                  {item.customPrice ?? item.test.price} {currency}
                </span>

                {/* Edit Item Button */}
                {onEditItem && (
                  <button
                    onClick={() => onEditItem(item.test)}
                    className="p-1 rounded text-slate-500 hover:text-white hover:bg-slate-800 transition cursor-pointer"
                    title="زر التعديل لبيانات أو سعر هذا التحليل"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                )}

                <button
                  onClick={() => onRemoveItem(item.test.id)}
                  className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-slate-900 transition cursor-pointer"
                  title="حذف الفحص"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}

          {selectedItems.length === 0 && (
            <div className="py-8 text-center text-slate-500 text-xs">
              لم يتم اختيار أي تحليل بعد. اضغط على أي تحليل من القائمة على اليمين أو اختر باقة عروض.
            </div>
          )}
        </div>

        {/* Discount Engine */}
        <div className="mt-4 pt-3 border-t border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Percent className="w-3.5 h-3.5 text-red-400" />
              <span>نسبة الخصم والعروض والجهات المتعاقدة</span>
            </span>

            {discountType !== 'none' && (
              <button
                onClick={() => {
                  onSetDiscountType('none');
                  onSetDiscountValue(0);
                  onSetContract(null);
                }}
                className="text-[11px] text-slate-400 hover:text-rose-300"
              >
                إلغاء الخصم
              </button>
            )}
          </div>

          {/* Quick Percentage Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {quickDiscountPercentages.map((pct) => {
              const isSelected =
                discountType === 'percentage' && discountValue === pct;
              return (
                <button
                  key={pct}
                  type="button"
                  onClick={() => {
                    if (pct === 0) {
                      onSetDiscountType('none');
                      onSetDiscountValue(0);
                      onSetContract(null);
                    } else {
                      onSetDiscountType('percentage');
                      onSetDiscountValue(pct);
                      onSetContract(null);
                    }
                  }}
                  className={`px-2 py-1 rounded-lg font-bold shrink-0 transition border cursor-pointer ${
                    isSelected
                      ? 'bg-red-600 text-white border-red-500 shadow-sm'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {pct === 0 ? 'بدون' : `${pct}%`}
                </button>
              );
            })}
          </div>

          {/* Syndicate / Contracts Dropdown */}
          <div className="mt-2.5">
            <button
              type="button"
              onClick={() => setShowContractsList(!showContractsList)}
              className="w-full bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-300 flex items-center justify-between transition cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <Gift className="w-3.5 h-3.5 text-blue-400" />
                <span>
                  {contractName
                    ? `جهة متعاقدة: ${contractName} (${discountValue}%)`
                    : 'اختيار جهة متعاقدة (نقابات، شركات، بطاقات رعاية...)'}
                </span>
              </span>
              {showContractsList ? (
                <ChevronUp className="w-4 h-4 text-slate-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-400" />
              )}
            </button>

            {showContractsList && (
              <div className="mt-1 bg-slate-950 border border-slate-800 rounded-xl p-2 max-h-40 overflow-y-auto space-y-1">
                {contracts.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => {
                      onSetContract(c);
                      setShowContractsList(false);
                    }}
                    className={`p-2 rounded-lg text-xs flex items-center justify-between cursor-pointer transition ${
                      contractName === c.name
                        ? 'bg-red-950/60 border border-red-500/50 text-white font-bold'
                        : 'hover:bg-slate-900 text-slate-300'
                    }`}
                  >
                    <span>{c.name}</span>
                    <span className="font-mono font-bold text-red-400">%{c.percentage}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Financial Calculation Breakdown */}
      <div className="mt-4 pt-3 border-t border-slate-800 space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>إجمالي الفحوصات:</span>
          <span className="font-mono font-bold text-slate-300">{basePrice} {currency}</span>
        </div>

        {discountAmount > 0 && (
          <div className="flex items-center justify-between text-xs text-red-400 font-semibold">
            <span>
              قيمة الخصم{' '}
              {discountType === 'percentage' || discountType === 'contract'
                ? `(${discountValue}%)`
                : ''}
              :
            </span>
            <span className="font-mono">- {discountAmount} {currency}</span>
          </div>
        )}

        <div className="flex items-center justify-between text-base sm:text-lg font-black text-white pt-2 border-t border-slate-800">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-rose-200">
            المبلغ المستحق النهائي:
          </span>
          <span className="text-emerald-400 font-mono text-xl sm:text-2xl">
            {netTotal} {currency}
          </span>
        </div>

        {/* Paid and Remaining */}
        <div className="grid grid-cols-2 gap-2 pt-2">
          <div>
            <label className="block text-[11px] text-slate-400 mb-1">المدفوع مقدماً</label>
            <input
              type="number"
              min="0"
              value={paidAmount || ''}
              onChange={(e) => onSetPaidAmount(Number(e.target.value))}
              placeholder="0"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-white font-mono font-bold focus:border-red-500"
            />
          </div>

          <div>
            <label className="block text-[11px] text-slate-400 mb-1">المتبقي على المريض</label>
            <div className="w-full bg-slate-950/80 border border-slate-800/80 rounded-xl px-2.5 py-1.5 text-xs font-mono font-extrabold text-amber-400">
              {remaining} {currency}
            </div>
          </div>
        </div>

        {/* Action Buttons: WhatsApp, Print, Save */}
        <div className="pt-3 grid grid-cols-3 gap-2">
          {/* WhatsApp Button */}
          <button
            onClick={onOpenWhatsApp}
            disabled={selectedItems.length === 0}
            className="flex flex-col items-center justify-center p-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:hover:bg-emerald-600 text-white text-xs font-bold shadow-md shadow-emerald-950 transition active:scale-95 cursor-pointer"
            title="إرسال رسالة واتساب رسمية للمريض بتفاصيل التحاليل والأسعار وشروط الصيام"
          >
            <MessageCircle className="w-4 h-4 mb-0.5" />
            <span className="text-[11px]">واتساب المريض</span>
          </button>

          {/* Print Quotation */}
          <button
            onClick={onPrint}
            disabled={selectedItems.length === 0}
            className="flex flex-col items-center justify-center p-2 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:hover:bg-blue-600 text-white text-xs font-bold shadow-md shadow-blue-950 transition active:scale-95 cursor-pointer"
            title="طباعة عرض سعر أو فاتورة رسمية بلوجو المعمل"
          >
            <Printer className="w-4 h-4 mb-0.5" />
            <span className="text-[11px]">طباعة الفاتورة</span>
          </button>

          {/* Save to History */}
          <button
            onClick={onSaveInvoice}
            disabled={selectedItems.length === 0}
            className="flex flex-col items-center justify-center p-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:brightness-110 disabled:opacity-40 text-white text-xs font-bold shadow-md shadow-red-950 transition active:scale-95 cursor-pointer"
            title="حفظ الفاتورة بالأرشيف المحلي"
          >
            <Save className="w-4 h-4 mb-0.5" />
            <span className="text-[11px]">حفظ بالأرشيف</span>
          </button>
        </div>
      </div>
    </div>
  );
};
