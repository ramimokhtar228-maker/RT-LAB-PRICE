import React, { useState, useMemo } from 'react';
import { LabTest, TestCategory, SelectedTestItem } from '../types/lab';
import { Search, Plus, Check, Clock, Droplet, Sparkles, Edit3, X, Zap } from 'lucide-react';

interface TestSelectorProps {
  tests: LabTest[];
  selectedItems: SelectedTestItem[];
  currency: string;
  isCompactMode: boolean;
  onToggleTest: (test: LabTest) => void;
  onEditTest: (test: LabTest) => void;
  onAddCustomTestPrompt: () => void;
}

const CATEGORIES: { key: TestCategory; label: string }[] = [
  { key: 'all', label: 'كافة الفحوصات (+520)' },
  { key: 'hematology', label: 'أمراض الدم (CBC)' },
  { key: 'coagulation', label: 'سيولة وتجلط' },
  { key: 'liver', label: 'وظائف كبد' },
  { key: 'kidney', label: 'وظائف كلى' },
  { key: 'lipids', label: 'دهون وكوليسترول' },
  { key: 'diabetes', label: 'السكري وتراكمي' },
  { key: 'thyroid', label: 'الغدة الدرقية' },
  { key: 'vitamins', label: 'فيتامينات ومعادن' },
  { key: 'hormones', label: 'الهرمونات والخصوبة' },
  { key: 'immunology', label: 'المناعة والروماتيزم' },
  { key: 'cardiac', label: 'القلب وإنزيماته' },
  { key: 'tumors', label: 'دلالات الأورام' },
  { key: 'microbiology', label: 'مزارع وبول وبراز' },
  { key: 'serology', label: 'فيروسات وأمصال' },
  { key: 'allergy', label: 'الحساسية' },
  { key: 'pcr', label: 'PCR وجزيئي' },
  { key: 'tdm', label: 'أدوية وسموم' },
  { key: 'custom', label: 'مخصص' },
];

export const TestSelector: React.FC<TestSelectorProps> = ({
  tests,
  selectedItems,
  currency,
  isCompactMode,
  onToggleTest,
  onEditTest,
  onAddCustomTestPrompt,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<TestCategory>('all');
  const [popularOnly, setPopularOnly] = useState(false);

  // Selected test IDs set for instant O(1) lookup
  const selectedIds = useMemo(
    () => new Set(selectedItems.map((item) => item.test.id)),
    [selectedItems]
  );

  // Filtered tests
  const filteredTests = useMemo(() => {
    let result = tests;

    if (popularOnly) {
      result = result.filter((t) => t.isPopular);
    }

    if (selectedCategory !== 'all') {
      result = result.filter((t) => t.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (t) =>
          t.nameAr.toLowerCase().includes(q) ||
          t.nameEn.toLowerCase().includes(q) ||
          t.code.toLowerCase().includes(q) ||
          t.description?.toLowerCase().includes(q)
      );
    }

    return result;
  }, [tests, selectedCategory, searchQuery, popularOnly]);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 sm:p-4 shadow-lg flex flex-col h-full">
      {/* Header and Search */}
      <div className="flex flex-col gap-2.5 mb-3 border-b border-slate-800/80 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Droplet className="w-4 h-4 text-red-500" />
            <h2 className="text-sm sm:text-base font-bold text-white">
              قائمة الفحوصات والتحاليل الطبية
            </h2>
            <span className="text-xs bg-red-950/70 border border-red-800/40 text-red-300 px-2 py-0.5 rounded-full font-mono font-bold">
              {filteredTests.length} فحص
            </span>
          </div>

          <button
            onClick={onAddCustomTestPrompt}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-blue-950/80 hover:bg-blue-900 border border-blue-500/40 text-blue-300 text-xs font-semibold transition active:scale-95 cursor-pointer"
            title="إضافة تحليل جديد غير موجود بالقائمة"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>تحليل جديد +</span>
          </button>
        </div>

        {/* Search input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث باسم التحليل (عربي أو إنجليزي) أو الكود (مثال: CBC, سكر, كبد, D3)..."
            className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pr-10 pl-9 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute left-3 top-2.5 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Department / Category tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin text-xs">
          <button
            onClick={() => setPopularOnly(!popularOnly)}
            className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 whitespace-nowrap transition cursor-pointer ${
              popularOnly
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'bg-slate-800/80 text-amber-300 hover:bg-slate-700'
            }`}
          >
            <Sparkles className="w-3 h-3" />
            <span>الأكثر طلباً</span>
          </button>

          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => {
                  setSelectedCategory(cat.key);
                  setPopularOnly(false);
                }}
                className={`px-2.5 py-1 rounded-lg whitespace-nowrap transition cursor-pointer font-medium ${
                  isActive
                    ? 'bg-red-600 text-white font-bold shadow-sm shadow-red-950'
                    : 'bg-slate-950/80 text-slate-300 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tests Listing: Compact Mode vs Regular Mode */}
      {isCompactMode ? (
        /* COMPACT TABLE MODE - Ultra fast for clinics & reception */
        <div className="overflow-y-auto max-h-[580px] border border-slate-800/80 rounded-xl bg-slate-950/80">
          <table className="w-full text-right text-xs">
            <thead className="sticky top-0 bg-slate-900 border-b border-slate-800 text-slate-400 font-semibold z-10">
              <tr>
                <th className="p-2 w-10 text-center">اختيار</th>
                <th className="p-2">الكود</th>
                <th className="p-2">اسم الفحص الطبي</th>
                <th className="p-2 hidden sm:table-cell">شروط الصيام</th>
                <th className="p-2">السعر</th>
                <th className="p-2 text-center w-14">تعديل</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredTests.map((test) => {
                const isSelected = selectedIds.has(test.id);
                return (
                  <tr
                    key={test.id}
                    className={`transition cursor-pointer ${
                      isSelected
                        ? 'bg-red-950/30 text-white font-semibold'
                        : 'hover:bg-slate-900/60 text-slate-300'
                    }`}
                    onClick={() => onToggleTest(test)}
                  >
                    <td className="p-2 text-center" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onToggleTest(test)}
                        className="w-4 h-4 rounded text-red-600 focus:ring-red-500 bg-slate-950 border-slate-700 cursor-pointer"
                      />
                    </td>
                    <td className="p-2 font-mono text-red-400 font-bold whitespace-nowrap text-[11px]">
                      {test.code}
                    </td>
                    <td className="p-2">
                      <div className="font-bold text-white text-xs leading-tight">{test.nameAr}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{test.nameEn}</div>
                    </td>
                    <td className="p-2 hidden sm:table-cell text-[11px] text-slate-400">
                      {test.fasting}
                    </td>
                    <td className="p-2 font-bold font-mono text-white whitespace-nowrap text-xs">
                      {test.price} <span className="text-[10px] text-slate-400">{currency}</span>
                    </td>
                    <td className="p-2 text-center" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => onEditTest(test)}
                        className="p-1 rounded-lg bg-slate-800 hover:bg-red-600 hover:text-white text-slate-400 transition cursor-pointer"
                        title="زر التعديل الفوري لهذا التحليل"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        /* REGULAR CARD GRID MODE */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 overflow-y-auto max-h-[540px] pr-1">
          {filteredTests.map((test) => {
            const isSelected = selectedIds.has(test.id);

            return (
              <div
                key={test.id}
                onClick={() => onToggleTest(test)}
                className={`p-3 rounded-xl border text-right transition-all cursor-pointer relative group flex flex-col justify-between ${
                  isSelected
                    ? 'bg-gradient-to-br from-red-950/40 via-slate-900 to-blue-950/40 border-red-500 shadow-md shadow-red-950/30'
                    : 'bg-slate-950/70 border-slate-800/90 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-xs font-mono font-bold text-red-400 bg-red-950/60 px-1.5 py-0.5 rounded border border-red-800/40">
                          {test.code}
                        </span>
                        <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-red-300 transition">
                          {test.nameAr}
                        </h3>
                      </div>
                      <p className="text-[10px] sm:text-[11px] text-slate-400 font-mono mt-0.5">
                        {test.nameEn}
                      </p>
                    </div>

                    <div className="text-left shrink-0">
                      <span className="text-sm sm:text-base font-extrabold text-white">
                        {test.price}
                      </span>
                      <span className="text-[10px] text-slate-400 mr-1">{currency}</span>
                    </div>
                  </div>

                  {test.description && (
                    <p className="text-[11px] text-slate-400 line-clamp-1 mb-2">
                      {test.description}
                    </p>
                  )}
                </div>

                {/* Sample type and Fasting badges + Edit button */}
                <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-800/60 mt-1">
                  <div className="flex items-center gap-1.5 flex-wrap text-[10px]">
                    <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700/60">
                      {test.sampleType}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-md border flex items-center gap-1 ${
                        test.fasting.includes('بدون صيام')
                          ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500/20'
                          : 'bg-amber-950/40 text-amber-300 border-amber-500/20'
                      }`}
                    >
                      <Clock className="w-2.5 h-2.5" />
                      <span>{test.fasting.length > 20 ? test.fasting.slice(0, 18) + '...' : test.fasting}</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                    {/* Inline Edit Button */}
                    <button
                      onClick={() => onEditTest(test)}
                      className="p-1.5 rounded-lg bg-slate-800/90 text-slate-400 hover:text-white hover:bg-red-600 transition cursor-pointer"
                      title="زر التعديل الفوري لبيانات وسعر هذا التحليل"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>

                    {/* Toggle check */}
                    <div
                      onClick={() => onToggleTest(test)}
                      className={`w-6 h-6 rounded-lg flex items-center justify-center transition cursor-pointer ${
                        isSelected
                          ? 'bg-red-600 text-white shadow-sm shadow-red-600/50'
                          : 'bg-slate-800 text-slate-400 group-hover:bg-slate-700 group-hover:text-white'
                      }`}
                    >
                      {isSelected ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <Plus className="w-3.5 h-3.5" />}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {filteredTests.length === 0 && (
        <div className="py-12 text-center text-slate-400 flex flex-col items-center justify-center">
          <p className="text-sm font-semibold">لم يتم العثور على تحاليل تطابق بحثك</p>
          <button
            onClick={onAddCustomTestPrompt}
            className="mt-3 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition cursor-pointer"
          >
            إضافة تحليل جديد الآن
          </button>
        </div>
      )}
    </div>
  );
};
