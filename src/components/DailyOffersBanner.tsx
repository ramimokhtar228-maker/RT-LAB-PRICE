import React from 'react';
import { DailyOffer } from '../types/lab';
import { Flame, Sparkles, Check, ChevronRight, Tag, Settings2 } from 'lucide-react';

interface DailyOffersBannerProps {
  offers: DailyOffer[];
  currency: string;
  onApplyOffer: (offer: DailyOffer) => void;
  onOpenManageModal: () => void;
}

export const DailyOffersBanner: React.FC<DailyOffersBannerProps> = ({
  offers,
  currency,
  onApplyOffer,
  onOpenManageModal,
}) => {
  const activeOffers = offers.filter((o) => o.isActive);

  if (activeOffers.length === 0) return null;

  const primaryOffer = activeOffers[0];

  return (
    <div className="bg-gradient-to-r from-red-950 via-rose-950 to-slate-950 border-y border-red-500/30 px-3 sm:px-4 py-2.5 shadow-md">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2.5">
        {/* Banner content */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="w-8 h-8 rounded-lg bg-red-600/30 border border-red-500/50 flex items-center justify-center text-red-400 shrink-0 shadow-inner">
            <Flame className="w-4 h-4 animate-bounce" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2 py-0.5 rounded-md bg-red-600 text-white text-[10px] font-black uppercase tracking-wider animate-pulse">
                {primaryOffer.badgeText || 'عرض اليوم الحصري'}
              </span>
              <h3 className="text-xs sm:text-sm font-bold text-white truncate">
                {primaryOffer.title}
              </h3>
            </div>
            <p className="text-[11px] text-slate-300 truncate hidden sm:block mt-0.5">
              {primaryOffer.description}
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
          <button
            onClick={() => onApplyOffer(primaryOffer)}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-md shadow-emerald-950/60 active:scale-95 transition cursor-pointer"
            title="تطبيق خصم العرض اليومي فوراً على الفاتورة الحالية"
          >
            <Check className="w-3.5 h-3.5 stroke-[3]" />
            <span>تطبيق العرض اليومي فوراً</span>
          </button>

          <button
            onClick={onOpenManageModal}
            className="flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-900/90 border border-red-500/30 text-red-300 hover:bg-slate-800 text-xs font-semibold transition active:scale-95 cursor-pointer"
            title="إدارة وتعديل عروض اليوم وإضافة عروض جديدة"
          >
            <Settings2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">إدارة العروض ({activeOffers.length})</span>
            <span className="sm:hidden">العروض ({activeOffers.length})</span>
          </button>
        </div>
      </div>
    </div>
  );
};
