import React, { useState } from 'react';
import { LabTest, TestCategory } from '../types/lab';
import { Database, Plus, Search, Edit3, Check, X, RotateCcw, Save, Trash2, Tag, SlidersHorizontal } from 'lucide-react';
import { EditTestModal } from './EditTestModal';

interface CatalogManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  tests: LabTest[];
  currency: string;
  onUpdateTest: (test: LabTest) => void;
  onDeleteTest?: (id: string) => void;
  onResetDefaults: () => void;
}

export const CatalogManagerModal: React.FC<CatalogManagerModalProps> = ({
  isOpen,
  onClose,
  tests,
  currency,
  onUpdateTest,
  onDeleteTest,
  onResetDefaults,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [editingModalTest, setEditingModalTest] = useState<LabTest | null>(null);
  const [quickEditId, setQuickEditId] = useState<string | null>(null);
  const [quickPrice, setQuickPrice] = useState<number>(0);
  const [showAddForm, setShowAddForm] = useState(false);

  // New test fields
  const [newTest, setNewTest] = useState<Partial<LabTest>>({
    code: 'RT-' + Math.floor(100 + Math.random() * 900),
    nameAr: '',
    nameEn: '',
    category: 'hematology',
    price: 120,
    sampleType: 'دم وريدي',
    fasting: 'بدون صيام',
    duration: 'خلال ساعتين',
    description: '',
  });

  if (!isOpen) return null;

  const filtered = tests.filter((t) => {
    const matchesCategory = selectedCategory === 'all' || t.category === selectedCategory;
    const matchesSearch =
      t.nameAr.toLowerCase().includes(search.toLowerCase()) ||
      t.nameEn.toLowerCase().includes(search.toLowerCase()) ||
      t.code.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const startQuickEdit = (t: LabTest) => {
    setQuickEditId(t.id);
    setQuickPrice(t.price);
  };

  const saveQuickEdit = (t: LabTest) => {
    onUpdateTest({
      ...t,
      price: Number(quickPrice) || t.price,
    });
    setQuickEditId(null);
  };

  const handleAddNewTest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTest.nameAr) return;

    const fullTest: LabTest = {
      id: 'custom-' + Date.now(),
      code: newTest.code || 'RT-CUSTOM',
      nameAr: newTest.nameAr.trim(),
      nameEn: newTest.nameEn?.trim() || newTest.nameAr.trim(),
      category: (newTest.category as TestCategory) || 'custom',
      price: Number(newTest.price) || 100,
      sampleType: newTest.sampleType || 'دم وريدي',
      fasting: newTest.fasting || 'بدون صيام',
      duration: newTest.duration || 'خلال ساعتين',
      description: newTest.description || '',
    };

    onUpdateTest(fullTest);
    setShowAddForm(false);
    setNewTest({
      code: 'RT-' + Math.floor(100 + Math.random() * 900),
      nameAr: '',
      nameEn: '',
      category: 'hematology',
      price: 120,
      sampleType: 'دم وريدي',
      fasting: 'بدون صيام',
      duration: 'خلال ساعتين',
      description: '',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-5 overflow-y-auto">
      <div className="w-full max-w-5xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-red-950 via-slate-900 to-blue-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/30 border border-blue-500/50 flex items-center justify-center text-blue-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                <span>فهرس ودليل كافة الفحوصات والأسعار</span>
                <span className="text-xs bg-red-950 border border-red-800 text-red-300 px-2 py-0.5 rounded-full font-mono font-bold">
                  {tests.length} فحص طبي
                </span>
              </h2>
              <p className="text-xs text-slate-300">
                تعديل وتحديث أي بند وسعر في كل الحقول الطبية وإضافة تحاليل جديدة
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Actions Bar */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ابحث بالاسم (عربي/إنجليزي) أو الكود لتعديل أي بند فوراً..."
              className="w-full bg-slate-900 border border-slate-700 rounded-xl pr-9 pl-3 py-1.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition cursor-pointer shadow-md shadow-red-950"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة فحص جديد</span>
            </button>

            <button
              onClick={() => {
                if (confirm('هل أنت متأكد من استعادة دليل التحاليل الافتراضي (+520 فحص طبي)؟')) {
                  onResetDefaults();
                }
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition cursor-pointer"
              title="إعادة ضبط لأسعار المعمل الأصلية"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
              <span>استعادة الافتراضي</span>
            </button>
          </div>
        </div>

        {/* Add New Test Form */}
        {showAddForm && (
          <form onSubmit={handleAddNewTest} className="p-4 bg-slate-850 border-b border-slate-700 animate-in fade-in space-y-3">
            <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
              <Plus className="w-3.5 h-3.5 text-red-400" />
              <span>إدراج تحليل جديد في قائمة المعمل (+520)</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">اسم التحليل (عربي) *</label>
                <input
                  type="text"
                  required
                  value={newTest.nameAr}
                  onChange={(e) => setNewTest({ ...newTest, nameAr: e.target.value })}
                  placeholder="مثال: تحليل حساسية الحليب"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">الاسم بالإنجليزي</label>
                <input
                  type="text"
                  value={newTest.nameEn}
                  onChange={(e) => setNewTest({ ...newTest, nameEn: e.target.value })}
                  placeholder="Milk Allergy Panel"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">السعر المعتمد ({currency}) *</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={newTest.price}
                  onChange={(e) => setNewTest({ ...newTest, price: Number(e.target.value) })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white font-mono text-emerald-400 font-bold"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">شروط الصيام</label>
                <input
                  type="text"
                  value={newTest.fasting}
                  onChange={(e) => setNewTest({ ...newTest, fasting: e.target.value })}
                  placeholder="بدون صيام"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-red-600 text-white text-xs font-bold shadow"
              >
                حفظ وإضافة التحليل
              </button>
            </div>
          </form>
        )}

        {/* Tests Table */}
        <div className="flex-1 overflow-y-auto">
          <table className="w-full text-right text-xs">
            <thead className="sticky top-0 bg-slate-950 border-b border-slate-800 text-slate-400 font-semibold z-10">
              <tr>
                <th className="p-3">الكود</th>
                <th className="p-3">اسم التحليل (عربي / إنجليزي)</th>
                <th className="p-3 hidden sm:table-cell">القسم الطبي</th>
                <th className="p-3 hidden sm:table-cell">شروط الصيام</th>
                <th className="p-3">السعر الحالي</th>
                <th className="p-3 text-center">زر التعديل الكامل</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.map((test) => {
                const isQuickEditing = quickEditId === test.id;

                return (
                  <tr key={test.id} className="hover:bg-slate-850/60 transition group">
                    <td className="p-3 font-mono font-bold text-red-400 whitespace-nowrap">
                      {test.code}
                    </td>

                    <td className="p-3">
                      <div className="font-bold text-white text-xs sm:text-sm">{test.nameAr}</div>
                      <div className="text-[11px] text-slate-400 font-mono mt-0.5">{test.nameEn}</div>
                    </td>

                    <td className="p-3 hidden sm:table-cell text-slate-300">
                      <span className="px-2 py-0.5 bg-slate-800 rounded text-[11px]">
                        {test.category}
                      </span>
                    </td>

                    <td className="p-3 hidden sm:table-cell text-slate-400 text-[11px]">
                      {test.fasting}
                    </td>

                    <td className="p-3">
                      {isQuickEditing ? (
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            min="0"
                            value={quickPrice}
                            onChange={(e) => setQuickPrice(Number(e.target.value))}
                            className="w-20 bg-slate-900 border border-red-500 rounded px-2 py-1 text-white font-mono font-bold"
                            autoFocus
                          />
                          <button
                            onClick={() => saveQuickEdit(test)}
                            className="p-1 rounded bg-emerald-600 text-white"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setQuickEditId(null)}
                            className="p-1 rounded bg-slate-800 text-slate-400"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div
                          onClick={() => startQuickEdit(test)}
                          className="flex items-center gap-1 cursor-pointer font-bold font-mono text-white text-xs sm:text-sm hover:text-emerald-400 transition"
                          title="انقر لتعديل السعر السريع"
                        >
                          <span>{test.price}</span>
                          <span className="text-[10px] text-slate-400">{currency}</span>
                        </div>
                      )}
                    </td>

                    <td className="p-3 text-center">
                      <button
                        onClick={() => setEditingModalTest(test)}
                        className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-red-600 hover:text-white text-slate-300 text-xs font-bold transition flex items-center justify-center gap-1 mx-auto cursor-pointer shadow-sm"
                        title="تعديل كافة حقول التحليل (الاسم، السعر، العينة، الصيام، الكود)"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>تعديل</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="px-5 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>يتم حفظ جميع التعديلات فورياً في الذاكرة المحلية وتعمل أوفلاين 100%</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold transition"
          >
            إغلاق الفهرس
          </button>
        </div>
      </div>

      {/* Full Edit Modal */}
      {editingModalTest && (
        <EditTestModal
          isOpen={true}
          onClose={() => setEditingModalTest(null)}
          test={editingModalTest}
          currency={currency}
          onSaveTest={(updated) => {
            onUpdateTest(updated);
            setEditingModalTest(null);
          }}
          onDeleteTest={(id) => {
            if (onDeleteTest) {
              onDeleteTest(id);
            }
            setEditingModalTest(null);
          }}
        />
      )}
    </div>
  );
};
