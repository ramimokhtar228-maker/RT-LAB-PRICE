import React from 'react';
import { OfferPackage, SelectedTestItem } from '../types/lab';
import { Sparkles, ArrowLeft, Tag } from 'lucide-react';

interface BundleDetectorAlertProps {
  packages: OfferPackage[];
  selectedItems: SelectedTestItem[];
  currency: string;
  appliedPackage?: { id: string; nameAr: string };
  onApplyPackage: (pkg: OfferPackage, selectedTestIds: string[], price: number) => void;
}

export const BundleDetectorAlert: React.FC<BundleDetectorAlertProps> = ({
  packages,
  selectedItems,
  currency,
  appliedPackage,
  onApplyPackage,
}) => {
  if (appliedPackage || selectedItems.length < 3) {
    return null;
  }

  const selectedIds = new Set(selectedItems.map((item) => item.test.id));
  const currentTotal = selectedItems.reduce(
    (sum, item) => sum + (item.customPrice ?? item.test.price),
    0
  );

  // Find best matching package where selected tests contain at least 70% of package tests
  let bestMatch: {
    pkg: OfferPackage;
    matchingCount: number;
    savings: number;
    matchedTestIds: string[];
  } | null = null;

  for (const pkg of packages) {
    const requiredTestIds = pkg.includedItems
      .filter((i) => i.isRequired)
      .map((i) => i.testId);

    const matches = requiredTestIds.filter((id) => selectedIds.has(id));

    // If at least 70% of required tests are selected or 4+ tests match
    const matchRatio = matches.length / requiredTestIds.length;
    if (matchRatio >= 0.7 || matches.length >= 4) {
      const savings = currentTotal - pkg.packagePrice;
      if (savings > 50) {
        if (!bestMatch || savings > bestMatch.savings) {
          bestMatch = {
            pkg,
            matchingCount: matches.length,
            savings,
            matchedTestIds: Array.from(selectedIds),
          };
        }
      }
    }
  }

  if (!bestMatch) return null;

  const { pkg, savings } = bestMatch;

  return (
    <div className="bg-gradient-to-r from-amber-950/60 via-slate-900 to-red-950/60 border border-amber-500/50 rounded-2xl p-3.5 sm:p-4 shadow-lg mb-4 flex flex-col sm:flex-row items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0">
          <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
        </div>

        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded-full border border-amber-500/30">
              💡 اقتراح ذكي موفر للمريض
            </span>
            <span className="text-xs sm:text-sm font-extrabold text-white">
              التحاليل المحددة مطابقة لـ ({pkg.nameAr})
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-0.5">
            تفعيل هذه الباقة يمنح المريض سعراً خاصاً قدره{' '}
            <strong className="text-emerald-400 font-mono text-sm">{pkg.packagePrice} {currency}</strong>{' '}
            بدلاً من {currentTotal} {currency} (توفير{' '}
            <strong className="text-amber-300">{savings} {currency}</strong>!).
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => {
          // Combine package items + extra selected items
          const pkgTestIds = pkg.includedItems
            .filter((i) => i.isDefaultSelected)
            .map((i) => i.testId);
          const combined = Array.from(new Set([...pkgTestIds, ...Array.from(selectedIds)]));
          onApplyPackage(pkg, combined, pkg.packagePrice);
        }}
        className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs sm:text-sm font-black shadow-md shadow-amber-950/50 transition active:scale-95 flex items-center gap-1.5 shrink-0 cursor-pointer"
      >
        <span>تفعيل عرض الباقة الآن</span>
        <ArrowLeft className="w-4 h-4" />
      </button>
    </div>
  );
};
