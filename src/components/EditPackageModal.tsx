import React, { useState, useEffect } from 'react';
import { OfferPackage, LabTest } from '../types/lab';
import { Gift, Edit3, Save, X, Trash2, Plus, Check } from 'lucide-react';

interface EditPackageModalProps {
  isOpen: boolean;
  onClose: () => void;
  pkg: OfferPackage | null;
  tests: LabTest[];
  currency: string;
  onSavePackage: (pkg: OfferPackage) => void;
  onDeletePackage?: (id: string) => void;
}

export const EditPackageModal: React.FC<EditPackageModalProps> = ({
  isOpen,
  onClose,
  pkg,
  tests,
  currency,
  onSavePackage,
  onDeletePackage,
}) => {
  const [formData, setFormData] = useState<Partial<OfferPackage>>({});
  const [selectedTestIds, setSelectedTestIds] = useState<string[]>([]);
  const [searchTest, setSearchTest] = useState('');

  useEffect(() => {
    if (pkg) {
      setFormData({ ...pkg });
      setSelectedTestIds(pkg.includedItems.map((item) => item.testId));
    }
  }, [pkg]);

  if (!isOpen || !pkg) return null;

  const handleToggleTestInPackage = (testId: string) => {
    setSelectedTestIds((prev) =>
      prev.includes(testId) ? prev.filter((id) => id !== testId) : [...prev, testId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nameAr?.trim()) return;

    // Calculate original price automatically from selected tests if desired
    const calculatedOriginalPrice = selectedTestIds.reduce((sum, tid) => {
      const found = tests.find((t) => t.id === tid);
      return sum + (found ? found.price : 0);
    }, 0);

    const updated: OfferPackage = {
      id: pkg.id,
      nameAr: formData.nameAr.trim(),
      nameEn: formData.nameEn?.trim() || formData.nameAr.trim(),
      tagline: formData.tagline?.trim() || '',
      category: formData.category || 'general',
      packagePrice: Number(formData.packagePrice) || 0,
      originalPrice: Number(formData.originalPrice) || calculatedOriginalPrice || 0,
      badge: formData.badge?.trim() || `وفّر ${Math.max(0, (Number(formData.originalPrice) || calculatedOriginalPrice) - (Number(formData.packagePrice) || 0))} ${currency}`,
      description: formData.description?.trim() || '',
      icon: formData.icon || 'ShieldCheck',
      includedItems: selectedTestIds.map((tid) => ({
        testId: tid,
        isRequired: true,
        isDefaultSelected: true,
      })),
    };

    onSavePackage(updated);
    onClose();
  };

  const filteredTests = tests.filter(
    (t) =>
      t.nameAr.toLowerCase().includes(searchTest.toLowerCase()) ||
      t.code.toLowerCase().includes(searchTest.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-5 overflow-y-auto">
      <div className="w-full max-w-3xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-red-950 via-slate-900 to-blue-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-400">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">
                تعديل باقة التحاليل والعرض
              </h2>
              <p className="text-xs text-slate-400">
                تعديل الاسم والأسعار والتحاليل المشمولة بالباقة
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                اسم الباقة (عربي) <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.nameAr || ''}
                onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                اسم الباقة (إنجليزي)
              </label>
              <input
                type="text"
                value={formData.nameEn || ''}
                onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white font-mono focus:outline-none focus:border-red-500 text-left"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                سعر الباقة المخفض ({currency}) <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                min="0"
                step="5"
                required
                value={formData.packagePrice || ''}
                onChange={(e) => setFormData({ ...formData, packagePrice: Number(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-emerald-400 font-extrabold focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                السعر الأصلي قبل الخصم ({currency})
              </label>
              <input
                type="number"
                min="0"
                step="5"
                value={formData.originalPrice || ''}
                onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-slate-400 font-bold focus:outline-none focus:border-red-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                الشعار التسويقي (Tagline)
              </label>
              <input
                type="text"
                value={formData.tagline || ''}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                placeholder="مثال: الفحص الشامل الأوسع نطاقاً للاطمئنان الدوري..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-red-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                الوصف التفصيلي للباقة
              </label>
              <textarea
                rows={2}
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-red-500 resize-none"
              />
            </div>
          </div>

          {/* Test picker for this package */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold text-slate-200">
                التحاليل المشمولة بالباقة ({selectedTestIds.length} فحص مختار)
              </label>
              <input
                type="text"
                value={searchTest}
                onChange={(e) => setSearchTest(e.target.value)}
                placeholder="بحث سريع لاختيار تحاليل..."
                className="bg-slate-950 border border-slate-700 text-xs px-2.5 py-1 rounded-lg text-white w-48"
              />
            </div>

            <div className="max-h-48 overflow-y-auto border border-slate-800 rounded-xl p-2 bg-slate-950/60 grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {filteredTests.slice(0, 100).map((t) => {
                const isChecked = selectedTestIds.includes(t.id);
                return (
                  <div
                    key={t.id}
                    onClick={() => handleToggleTestInPackage(t.id)}
                    className={`p-2 rounded-lg border text-right cursor-pointer flex items-center justify-between text-xs transition ${
                      isChecked
                        ? 'bg-red-950/40 border-red-500 text-white font-semibold'
                        : 'bg-slate-900/50 border-slate-800 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div className="truncate flex-1">
                      <span className="font-mono text-red-400 ml-1.5 text-[11px]">{t.code}</span>
                      <span>{t.nameAr}</span>
                    </div>
                    <div className="shrink-0 flex items-center gap-1.5 mr-2">
                      <span className="font-bold font-mono text-[11px]">{t.price} {currency}</span>
                      <div
                        className={`w-4 h-4 rounded flex items-center justify-center ${
                          isChecked ? 'bg-red-600 text-white' : 'border border-slate-700'
                        }`}
                      >
                        {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom actions */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
            {onDeletePackage ? (
              <button
                type="button"
                onClick={() => {
                  if (confirm(`هل أنت متأكد من حذف باقة "${pkg.nameAr}"؟`)) {
                    onDeletePackage(pkg.id);
                    onClose();
                  }
                }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-950/60 hover:bg-red-900 border border-red-800/60 text-red-300 text-xs font-bold transition cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>حذف الباقة</span>
              </button>
            ) : <div />}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition cursor-pointer"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:brightness-110 text-white text-xs sm:text-sm font-bold shadow-lg shadow-red-950/60 transition cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>حفظ الباقة</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
