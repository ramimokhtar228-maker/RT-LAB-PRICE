import React, { useState, useEffect } from 'react';
import { LabTest, TestCategory } from '../types/lab';
import { Edit3, Save, X, Trash2, Check, AlertCircle } from 'lucide-react';

interface EditTestModalProps {
  isOpen: boolean;
  onClose: () => void;
  test: LabTest | null;
  currency: string;
  onSaveTest: (test: LabTest) => void;
  onDeleteTest?: (id: string) => void;
}

const CATEGORIES: { key: TestCategory; label: string }[] = [
  { key: 'hematology', label: 'أمراض الدم (Hematology)' },
  { key: 'coagulation', label: 'سيولة وتجلط الدم (Coagulation)' },
  { key: 'liver', label: 'وظائف الكبد والصفراء (Liver)' },
  { key: 'kidney', label: 'وظائف الكلى والأملاح (Kidney)' },
  { key: 'lipids', label: 'الدهون والكوليسترول (Lipids)' },
  { key: 'cardiac', label: 'القلب وإنزيمات الطوارئ (Cardiac)' },
  { key: 'diabetes', label: 'السكري والسكر التراكمي (Diabetes)' },
  { key: 'thyroid', label: 'الغدة الدرقية (Thyroid)' },
  { key: 'hormones', label: 'الهرمونات والخصوبة (Hormones)' },
  { key: 'vitamins', label: 'الفيتامينات والمعادن (Vitamins)' },
  { key: 'immunology', label: 'المناعة والروماتيزم (Immunology)' },
  { key: 'allergy', label: 'الحساسية والمناعة (Allergy)' },
  { key: 'serology', label: 'الفيروسات والأمصال (Serology)' },
  { key: 'pcr', label: 'البيولوجيا الجزيئية (PCR)' },
  { key: 'tumors', label: 'دلالات الأورام (Tumors)' },
  { key: 'tdm', label: 'مستوى الأدوية بالدم (TDM)' },
  { key: 'microbiology', label: 'المزارع والطفيليات (Microbiology)' },
  { key: 'custom', label: 'تحاليل أخرى مخصصة (Custom)' },
];

export const EditTestModal: React.FC<EditTestModalProps> = ({
  isOpen,
  onClose,
  test,
  currency,
  onSaveTest,
  onDeleteTest,
}) => {
  const [formData, setFormData] = useState<Partial<LabTest>>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (test) {
      setFormData({ ...test });
      setError(null);
    }
  }, [test]);

  if (!isOpen || !test) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nameAr?.trim()) {
      setError('يرجى إدخال اسم التحليل باللغة العربية');
      return;
    }
    if (!formData.price || Number(formData.price) <= 0) {
      setError('يرجى تحديد سعر صحيح للتحليل');
      return;
    }

    const updatedTest: LabTest = {
      id: test.id,
      code: formData.code?.trim() || test.code,
      nameAr: formData.nameAr.trim(),
      nameEn: formData.nameEn?.trim() || formData.nameAr.trim(),
      category: (formData.category as TestCategory) || test.category,
      price: Number(formData.price),
      sampleType: formData.sampleType?.trim() || 'دم وريدي',
      fasting: formData.fasting?.trim() || 'بدون صيام',
      duration: formData.duration?.trim() || 'خلال ساعتين',
      description: formData.description?.trim() || '',
      isPopular: Boolean(formData.isPopular),
    };

    onSaveTest(updatedTest);
    onClose();
  };

  const handleDelete = () => {
    if (confirm(`هل أنت متأكد من حذف تحليل "${test.nameAr}" نهائياً من قاعدة البيانات؟`)) {
      if (onDeleteTest) {
        onDeleteTest(test.id);
      }
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-5 overflow-y-auto">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-red-950 via-slate-900 to-blue-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-400">
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>تعديل بيانات التحليل الطبي</span>
                <span className="text-xs bg-red-950/80 text-red-300 px-2 py-0.5 rounded font-mono border border-red-800/40">
                  {test.code}
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                تعديل السعر والاسم والشروط وجميع الحقول الطبية
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
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {error && (
            <div className="p-3 bg-red-950/60 border border-red-500/50 rounded-xl flex items-center gap-2 text-red-200 text-xs font-semibold">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Arabic Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                اسم التحليل (بالعربية) <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={formData.nameAr || ''}
                onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
                required
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-red-500 transition"
              />
            </div>

            {/* English Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                اسم التحليل (بالإنجليزية)
              </label>
              <input
                type="text"
                value={formData.nameEn || ''}
                onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white font-mono focus:outline-none focus:border-red-500 transition text-left"
              />
            </div>

            {/* Code */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                كود التحليل بالمعمل
              </label>
              <input
                type="text"
                value={formData.code || ''}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white font-mono focus:outline-none focus:border-red-500 transition"
              />
            </div>

            {/* Price */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                سعر التحليل ({currency}) <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  step="5"
                  value={formData.price || ''}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  required
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-emerald-400 font-extrabold focus:outline-none focus:border-red-500 transition"
                />
                <span className="absolute left-3 top-2.5 text-xs text-slate-500 font-bold">
                  {currency}
                </span>
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                قسم التحليل الطبي
              </label>
              <select
                value={formData.category || 'hematology'}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as TestCategory })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-red-500 transition"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.key} value={c.key}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Sample Type */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                نوع العينة المطلوبة
              </label>
              <input
                type="text"
                value={formData.sampleType || ''}
                onChange={(e) => setFormData({ ...formData, sampleType: e.target.value })}
                placeholder="مثال: دم وريدي (EDTA), مصل دم (Serum)..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-red-500 transition"
              />
            </div>

            {/* Fasting */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                شروط الصيام والتحضير
              </label>
              <input
                type="text"
                value={formData.fasting || ''}
                onChange={(e) => setFormData({ ...formData, fasting: e.target.value })}
                placeholder="مثال: صيام من 8 إلى 12 ساعة, بدون صيام..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-red-500 transition"
              />
            </div>

            {/* Duration */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                مدة ظهور النتيجة
              </label>
              <input
                type="text"
                value={formData.duration || ''}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                placeholder="مثال: خلال ساعتين, نفس اليوم, 24 ساعة..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-red-500 transition"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              الوصف الطبي والمؤشرات التشخيصية
            </label>
            <textarea
              rows={2}
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="وصف مختصر لأهمية التحليل والحالات التي يطلب فيها..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-red-500 transition resize-none"
            />
          </div>

          {/* Is Popular toggle */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="isPopular"
              checked={Boolean(formData.isPopular)}
              onChange={(e) => setFormData({ ...formData, isPopular: e.target.checked })}
              className="w-4 h-4 rounded text-red-600 focus:ring-red-500 bg-slate-950 border-slate-700 cursor-pointer"
            />
            <label htmlFor="isPopular" className="text-xs text-slate-300 cursor-pointer font-medium">
              إضافة التحليل إلى قائمة التحاليل الشائعة والأكثر طلباً
            </label>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
            {onDeleteTest ? (
              <button
                type="button"
                onClick={handleDelete}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-950/60 hover:bg-red-900 border border-red-800/60 text-red-300 text-xs font-bold transition cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>حذف التحليل</span>
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
                <span>حفظ التعديلات</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
