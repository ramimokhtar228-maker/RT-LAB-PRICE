import React, { useState } from 'react';
import { OfferPackage, LabTest } from '../types/lab';
import { Gift, X, Check, Plus, ShieldCheck, Sparkles, HeartPulse, Zap, Activity, UserCheck, Smile, HeartHandshake, Dumbbell, Tag, ArrowLeft, Edit3, Trash2 } from 'lucide-react';
import { EditPackageModal } from './EditPackageModal';

interface PackagesOffersModalProps {
  isOpen: boolean;
  onClose: () => void;
  packages: OfferPackage[];
  allTests: LabTest[];
  currency: string;
  onApplyPackage: (pkg: OfferPackage, selectedTestIds: string[], finalPackagePrice: number) => void;
  onUpdatePackage?: (pkg: OfferPackage) => void;
  onDeletePackage?: (id: string) => void;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  ShieldCheck: <ShieldCheck className="w-5 h-5 text-red-400" />,
  Sparkles: <Sparkles className="w-5 h-5 text-amber-400" />,
  HeartPulse: <HeartPulse className="w-5 h-5 text-rose-400" />,
  Zap: <Zap className="w-5 h-5 text-yellow-400" />,
  Activity: <Activity className="w-5 h-5 text-blue-400" />,
  UserCheck: <UserCheck className="w-5 h-5 text-emerald-400" />,
  Smile: <Smile className="w-5 h-5 text-pink-400" />,
  HeartHandshake: <HeartHandshake className="w-5 h-5 text-purple-400" />,
  Dumbbell: <Dumbbell className="w-5 h-5 text-orange-400" />,
};

export const PackagesOffersModal: React.FC<PackagesOffersModalProps> = ({
  isOpen,
  onClose,
  packages,
  allTests,
  currency,
  onApplyPackage,
  onUpdatePackage,
  onDeletePackage,
}) => {
  const [activePackageId, setActivePackageId] = useState<string>(packages[0]?.id || '');
  const [editingPackage, setEditingPackage] = useState<OfferPackage | null>(null);

  // Map of packageId -> Set of included test IDs
  const [customizedPackageTests, setCustomizedPackageTests] = useState<Record<string, string[]>>(() => {
    const initial: Record<string, string[]> = {};
    packages.forEach((pkg) => {
      initial[pkg.id] = pkg.includedItems
        .filter((item) => item.isDefaultSelected)
        .map((item) => item.testId);
    });
    return initial;
  });

  if (!isOpen) return null;

  const currentPackage = packages.find((p) => p.id === activePackageId) || packages[0];
  const activeSelectedTestIds = customizedPackageTests[currentPackage?.id || ''] || [];

  // Toggle variable test inside the active package
  const handleTogglePackageTest = (testId: string, isRequired: boolean) => {
    if (isRequired) return;
    setCustomizedPackageTests((prev) => {
      const currentList = prev[currentPackage.id] || [];
      const updated = currentList.includes(testId)
        ? currentList.filter((id) => id !== testId)
        : [...currentList, testId];
      return {
        ...prev,
        [currentPackage.id]: updated,
      };
    });
  };

  // Calculate regular total of all currently selected tests in the package
  const currentTestsObjects = activeSelectedTestIds
    .map((id) => allTests.find((t) => t.id === id))
    .filter((t): t is LabTest => t !== undefined);

  const regularSum = currentTestsObjects.reduce((acc, t) => acc + t.price, 0);

  // Variable calculation: package base price + optional items at discounted package rate
  const optionalAddons = currentPackage ? currentPackage.includedItems
    .filter((item) => !item.isRequired && activeSelectedTestIds.includes(item.testId)) : [];

  const optionalExtraCost = optionalAddons.reduce((sum, item) => {
    const foundTest = allTests.find((t) => t.id === item.testId);
    return sum + (foundTest ? Math.round(foundTest.price * 0.7) : 0);
  }, 0);

  const finalPackagePrice = (currentPackage?.packagePrice || 0) + optionalExtraCost;
  const totalSavings = Math.max(0, regularSum - finalPackagePrice);

  const handleAddNewPackage = () => {
    const newPkg: OfferPackage = {
      id: 'pkg-custom-' + Date.now(),
      nameAr: 'باقة جديدة مخصصة',
      nameEn: 'Custom Health Panel',
      tagline: 'شعار الباقة التسويقي',
      category: 'general',
      packagePrice: 500,
      originalPrice: 850,
      badge: 'وفّر 350 ج.م',
      description: 'وصف تفصيلي لمحتويات الباقة الطبية',
      icon: 'ShieldCheck',
      includedItems: [
        { testId: 't-1', isRequired: true, isDefaultSelected: true },
        { testId: 't-91', isRequired: true, isDefaultSelected: true },
        { testId: 't-151', isRequired: true, isDefaultSelected: true },
      ],
    };
    setEditingPackage(newPkg);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-2 sm:p-5 overflow-y-auto">
      <div className="w-full max-w-5xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in">
        {/* Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-red-950 via-slate-900 to-blue-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-600/30 border border-red-500/50 flex items-center justify-center text-red-400">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                <span>باقات وعروض الفحص الشامل للمعامل</span>
                <span className="text-xs bg-red-600 text-white px-2 py-0.5 rounded-full font-bold">
                  {packages.length} باقة شاملة
                </span>
              </h2>
              <p className="text-xs text-red-200/80">
                اختيار باقات الفحص وتخصيص محتوياتها المتغيرة وتطبيق التخفيض فوراً
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleAddNewPackage}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition cursor-pointer shadow-md shadow-red-950"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>باقة جديدة +</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 flex-1 overflow-hidden">
          {/* Packages Nav List */}
          <div className="md:col-span-5 border-b md:border-b-0 md:border-l border-slate-800 bg-slate-950/70 p-3 sm:p-4 overflow-y-auto max-h-[40vh] md:max-h-full space-y-2">
            {packages.map((pkg) => {
              const isActive = pkg.id === currentPackage?.id;
              return (
                <div
                  key={pkg.id}
                  onClick={() => setActivePackageId(pkg.id)}
                  className={`p-3 rounded-2xl border text-right cursor-pointer transition flex items-center justify-between gap-3 ${
                    isActive
                      ? 'bg-gradient-to-r from-red-950/60 to-slate-900 border-red-500 shadow-md shadow-red-950/40'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center shrink-0 mt-0.5">
                      {ICON_MAP[pkg.icon || 'ShieldCheck'] || <ShieldCheck className="w-4 h-4 text-red-400" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h4 className="text-xs sm:text-sm font-bold text-white">{pkg.nameAr}</h4>
                        {pkg.badge && (
                          <span className="text-[10px] bg-red-600/90 text-white px-1.5 py-0.2 rounded font-semibold">
                            {pkg.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{pkg.tagline}</p>
                    </div>
                  </div>

                  <div className="text-left shrink-0">
                    <div className="text-xs sm:text-sm font-black text-emerald-400 font-mono">
                      {pkg.packagePrice} <span className="text-[10px] text-slate-400">{currency}</span>
                    </div>
                    <div className="text-[10px] text-slate-500 line-through font-mono">
                      {pkg.originalPrice} {currency}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Active Package Details & Variable Customization */}
          {currentPackage && (
            <div className="md:col-span-7 p-4 sm:p-6 overflow-y-auto flex flex-col justify-between space-y-4">
              <div>
                {/* Package Title Card */}
                <div className="p-4 rounded-2xl bg-gradient-to-br from-red-950/40 via-slate-900 to-blue-950/40 border border-slate-800 mb-4 flex items-start justify-between">
                  <div>
                    <span className="text-[11px] font-mono font-bold text-red-400 bg-red-950 px-2 py-0.5 rounded border border-red-900/40">
                      {currentPackage.nameEn}
                    </span>
                    <h3 className="text-base sm:text-lg font-black text-white mt-1">
                      {currentPackage.nameAr}
                    </h3>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      {currentPackage.description}
                    </p>
                  </div>

                  {/* Edit Package Button */}
                  <button
                    onClick={() => setEditingPackage(currentPackage)}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-red-600 hover:text-white text-slate-300 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                    title="تعديل بيانات وسعر وتحاليل هذه الباقة"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>تعديل الباقة</span>
                  </button>
                </div>

                {/* Included Tests (with Variable Toggles) */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span>الفحوصات المتضمنة بالباقة ({activeSelectedTestIds.length} فحص)</span>
                    </h4>
                    <span className="text-[11px] text-slate-400">
                      (يمكنك تفعيل أو إلغاء التحاليل الإضافية الاختيارية)
                    </span>
                  </div>

                  <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                    {currentPackage.includedItems.map((item) => {
                      const testObj = allTests.find((t) => t.id === item.testId);
                      if (!testObj) return null;
                      const isChecked = activeSelectedTestIds.includes(item.testId);

                      return (
                        <div
                          key={item.testId}
                          onClick={() => handleTogglePackageTest(item.testId, item.isRequired)}
                          className={`p-2.5 rounded-xl border text-right transition flex items-center justify-between text-xs ${
                            isChecked
                              ? 'bg-slate-950/80 border-slate-700/80 text-white'
                              : 'bg-slate-900/40 border-slate-800 text-slate-500'
                          } ${item.isRequired ? 'cursor-default' : 'cursor-pointer hover:border-red-500/50'}`}
                        >
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-4 h-4 rounded flex items-center justify-center shrink-0 ${
                                isChecked ? 'bg-red-600 text-white' : 'border border-slate-700'
                              }`}
                            >
                              {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                            </div>
                            <div>
                              <span className="font-bold">{testObj.nameAr}</span>
                              <span className="text-[11px] text-slate-400 font-mono mr-2">
                                ({testObj.code})
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {item.isRequired ? (
                              <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded">
                                أساسي
                              </span>
                            ) : (
                              <span className="text-[10px] bg-blue-950 text-blue-300 border border-blue-800/40 px-1.5 py-0.5 rounded">
                                إضافي اختياري
                              </span>
                            )}
                            <span className="font-mono text-slate-300">{testObj.price} {currency}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Savings and Price Box */}
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-400 block">الإجمالي قبل العرض</span>
                    <span className="text-xs font-mono line-through text-slate-500">{regularSum} {currency}</span>
                    {totalSavings > 0 && (
                      <span className="text-xs text-red-400 font-bold block mt-0.5">
                        توفير للمريض: {totalSavings} {currency}
                      </span>
                    )}
                  </div>

                  <div className="text-left">
                    <span className="text-xs text-slate-400 block">السعر النهائي للباقة</span>
                    <span className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">
                      {finalPackagePrice} <span className="text-xs text-slate-400">{currency}</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2.5">
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
                >
                  إلغاء
                </button>
                <button
                  onClick={() => {
                    onApplyPackage(currentPackage, activeSelectedTestIds, finalPackagePrice);
                    onClose();
                  }}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:brightness-110 text-white text-xs sm:text-sm font-bold shadow-lg shadow-red-950 flex items-center gap-2 transition active:scale-95 cursor-pointer"
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>تطبيق هذه الباقة على الفاتورة</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Package Edit Modal */}
      {editingPackage && (
        <EditPackageModal
          isOpen={true}
          onClose={() => setEditingPackage(null)}
          pkg={editingPackage}
          tests={allTests}
          currency={currency}
          onSavePackage={(updatedPkg) => {
            if (onUpdatePackage) {
              onUpdatePackage(updatedPkg);
            }
            setEditingPackage(null);
          }}
          onDeletePackage={(id) => {
            if (onDeletePackage) {
              onDeletePackage(id);
            }
            setEditingPackage(null);
          }}
        />
      )}
    </div>
  );
};
