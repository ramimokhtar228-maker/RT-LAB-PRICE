import React, { useState } from 'react';
import { DailyOffer, OfferPackage } from '../types/lab';
import { Sparkles, Plus, Edit3, Trash2, Check, X, Flame, Tag, Percent, ArrowRight } from 'lucide-react';

interface DailyOffersModalProps {
  isOpen: boolean;
  onClose: () => void;
  offers: DailyOffer[];
  packages: OfferPackage[];
  currency: string;
  onUpdateOffer: (offer: DailyOffer) => void;
  onDeleteOffer: (id: string) => void;
  onApplyOfferToQuotation: (offer: DailyOffer) => void;
}

export const DailyOffersModal: React.FC<DailyOffersModalProps> = ({
  isOpen,
  onClose,
  offers,
  packages,
  currency,
  onUpdateOffer,
  onDeleteOffer,
  onApplyOfferToQuotation,
}) => {
  const [editingOffer, setEditingOffer] = useState<Partial<DailyOffer> | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  if (!isOpen) return null;

  const handleStartAdd = () => {
    setEditingOffer({
      id: 'do-' + Date.now(),
      title: '',
      description: '',
      discountPercentage: 20,
      specialPrice: undefined,
      badgeText: 'خصم خاص اليوم',
      isActive: true,
    });
    setIsAddingNew(true);
  };

  const handleStartEdit = (offer: DailyOffer) => {
    setEditingOffer({ ...offer });
    setIsAddingNew(false);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOffer?.title?.trim()) return;

    const saved: DailyOffer = {
      id: editingOffer.id || 'do-' + Date.now(),
      title: editingOffer.title.trim(),
      description: editingOffer.description?.trim() || '',
      discountPercentage: editingOffer.discountPercentage ? Number(editingOffer.discountPercentage) : undefined,
      specialPrice: editingOffer.specialPrice ? Number(editingOffer.specialPrice) : undefined,
      applicablePackageId: editingOffer.applicablePackageId || undefined,
      applicableTestIds: editingOffer.applicableTestIds || undefined,
      badgeText: editingOffer.badgeText?.trim() || 'عرض اليوم',
      isActive: editingOffer.isActive !== false,
    };

    onUpdateOffer(saved);
    setEditingOffer(null);
    setIsAddingNew(false);
  };

  const handleToggleActive = (offer: DailyOffer) => {
    onUpdateOffer({
      ...offer,
      isActive: !offer.isActive,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-5 overflow-y-auto">
      <div className="w-full max-w-3xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-red-950 via-rose-950 to-slate-900 border-b border-red-900/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-amber-600 flex items-center justify-center text-white shadow-lg shadow-red-950/60">
              <Flame className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                <span>إدارة العروض والخصومات اليومية</span>
                <span className="text-[10px] bg-red-600 text-white font-bold px-2 py-0.5 rounded-full">
                  DAILY OFFERS
                </span>
              </h2>
              <p className="text-xs text-red-200/80">
                إضافة وتعديل عروض اليوم وتطبيقها بضغطة زر واحدة على المريض
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
          {/* Add / Edit Form Modal Sub-panel */}
          {editingOffer ? (
            <form
              onSubmit={handleSaveForm}
              className="p-4 sm:p-5 rounded-2xl bg-slate-950 border border-red-500/40 shadow-xl space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Tag className="w-4 h-4 text-red-400" />
                  <span>{isAddingNew ? 'إضافة عرض يومي جديد' : 'تعديل بيانات العرض اليومي'}</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setEditingOffer(null)}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  إلغاء
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    عنوان العرض اليومي <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editingOffer.title || ''}
                    onChange={(e) => setEditingOffer({ ...editingOffer, title: e.target.value })}
                    placeholder="مثال: خصم الجمعة المباركة 25% على كافة التحاليل"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    نسبة الخصم المئوية (%)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={editingOffer.discountPercentage ?? ''}
                      onChange={(e) =>
                        setEditingOffer({
                          ...editingOffer,
                          discountPercentage: e.target.value ? Number(e.target.value) : undefined,
                        })
                      }
                      placeholder="مثال: 25"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-red-500 font-mono"
                    />
                    <Percent className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    أو سعر خاص محدد ({currency})
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={editingOffer.specialPrice ?? ''}
                    onChange={(e) =>
                      setEditingOffer({
                        ...editingOffer,
                        specialPrice: e.target.value ? Number(e.target.value) : undefined,
                      })
                    }
                    placeholder="مثال: 850 (اختياري لباقة محددة)"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-red-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    نص الشارة الترويجية (Badge)
                  </label>
                  <input
                    type="text"
                    value={editingOffer.badgeText || ''}
                    onChange={(e) => setEditingOffer({ ...editingOffer, badgeText: e.target.value })}
                    placeholder="مثال: خصم 25% اليوم, فلاش ديسكونت"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    تطبيق على باقة معينة (اختياري)
                  </label>
                  <select
                    value={editingOffer.applicablePackageId || ''}
                    onChange={(e) =>
                      setEditingOffer({
                        ...editingOffer,
                        applicablePackageId: e.target.value || undefined,
                      })
                    }
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-red-500"
                  >
                    <option value="">يطبق على كافة الفحوصات أو عام</option>
                    {packages.map((pkg) => (
                      <option key={pkg.id} value={pkg.id}>
                        {pkg.nameAr}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    تفاصيل ووصف العرض
                  </label>
                  <textarea
                    rows={2}
                    value={editingOffer.description || ''}
                    onChange={(e) => setEditingOffer({ ...editingOffer, description: e.target.value })}
                    placeholder="اكتب شرح العرض ومميزاته للظهور في رسالة الواتساب والفاتورة..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-red-500 resize-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingOffer(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md shadow-red-950"
                >
                  حفظ العرض
                </button>
              </div>
            </form>
          ) : (
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs text-slate-400">
                إجمالي العروض المسجلة: <strong className="text-white font-mono">{offers.length}</strong>
              </span>
              <button
                onClick={handleStartAdd}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 text-white text-xs font-bold shadow-md shadow-red-950 hover:brightness-110 active:scale-95 transition cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>إضافة عرض جديد +</span>
              </button>
            </div>
          )}

          {/* Offers List */}
          <div className="grid grid-cols-1 gap-3">
            {offers.map((offer) => {
              return (
                <div
                  key={offer.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    offer.isActive
                      ? 'bg-gradient-to-br from-red-950/30 via-slate-950 to-slate-900 border-red-500/40 shadow-lg shadow-black/40'
                      : 'bg-slate-950/60 border-slate-800/80 opacity-70'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="px-2 py-0.5 rounded-md bg-red-600 text-white text-[10px] font-black uppercase tracking-wider">
                          {offer.badgeText || 'عرض يومي'}
                        </span>
                        {offer.discountPercentage ? (
                          <span className="px-2 py-0.5 rounded-md bg-emerald-950 text-emerald-300 border border-emerald-500/30 text-xs font-bold font-mono">
                            خصم {offer.discountPercentage}%
                          </span>
                        ) : null}
                        {offer.specialPrice ? (
                          <span className="px-2 py-0.5 rounded-md bg-blue-950 text-blue-300 border border-blue-500/30 text-xs font-bold font-mono">
                            سعر خاص {offer.specialPrice} {currency}
                          </span>
                        ) : null}
                        <h3 className="text-sm sm:text-base font-bold text-white">
                          {offer.title}
                        </h3>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {offer.description}
                      </p>
                    </div>

                    {/* Offer Actions */}
                    <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                      {/* Apply Now */}
                      <button
                        onClick={() => {
                          onApplyOfferToQuotation(offer);
                          onClose();
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-md shadow-emerald-950 transition active:scale-95 cursor-pointer"
                        title="تطبيق هذا الخصم فوراً على الفاتورة الحالية للمريض"
                      >
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                        <span>تطبيق الآن على المريض</span>
                      </button>

                      {/* Edit Button */}
                      <button
                        onClick={() => handleStartEdit(offer)}
                        className="p-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition cursor-pointer"
                        title="زر التعديل للعرض"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      {/* Toggle Active */}
                      <button
                        onClick={() => handleToggleActive(offer)}
                        className={`px-2.5 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
                          offer.isActive
                            ? 'bg-amber-950/60 border border-amber-500/40 text-amber-300'
                            : 'bg-slate-800 text-slate-500'
                        }`}
                        title="تفعيل أو تعطيل العرض اليومي"
                      >
                        {offer.isActive ? 'مُفعّل' : 'معطّل'}
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => {
                          if (confirm(`هل أنت متأكد من حذف عرض "${offer.title}"؟`)) {
                            onDeleteOffer(offer.id);
                          }
                        }}
                        className="p-1.5 rounded-xl bg-slate-800/80 text-slate-500 hover:text-red-400 hover:bg-red-950/50 transition cursor-pointer"
                        title="حذف العرض"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
