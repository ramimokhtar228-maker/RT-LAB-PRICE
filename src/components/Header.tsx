import React from 'react';
import { PWAInstallButton } from './PWAInstallButton';
import { OfflineIndicator } from './OfflineIndicator';
import { Gift, FileText, Database, Settings as SettingsIcon, PlusCircle, Flame, Minimize2, Maximize2, Tag } from 'lucide-react';
import { LabSettings } from '../types/lab';

interface HeaderProps {
  settings: LabSettings;
  packagesCount: number;
  invoicesCount: number;
  dailyOffersCount: number;
  isCompactMode: boolean;
  onToggleCompactMode: () => void;
  onOpenDailyOffers: () => void;
  onOpenPackages: () => void;
  onOpenCatalog: () => void;
  onOpenInvoices: () => void;
  onOpenSettings: () => void;
  onNewInvoice: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  settings,
  packagesCount,
  invoicesCount,
  dailyOffersCount,
  isCompactMode,
  onToggleCompactMode,
  onOpenDailyOffers,
  onOpenPackages,
  onOpenCatalog,
  onOpenInvoices,
  onOpenSettings,
  onNewInvoice,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-md border-b border-slate-800 shadow-xl shadow-black/50">
      {/* Top micro bar for hotline, offline, PWA, and quick shortcuts */}
      <div className="bg-gradient-to-r from-red-950 via-slate-900 to-blue-950 px-3 sm:px-4 py-1 border-b border-red-900/30 text-xs text-slate-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-red-400 font-bold">
              <span className="inline-block w-2 h-2 rounded-full bg-red-500 animate-ping" />
              نظام التسعير الآلي والعروض الذكية (+520 تحليل طبي)
            </span>
            <span className="hidden md:inline text-slate-500">|</span>
            <span className="hidden md:inline text-slate-300">
              الخط الساخن: <strong className="text-white font-mono">{settings.hotline}</strong>
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Compact mode toggle */}
            <button
              onClick={onToggleCompactMode}
              className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold transition cursor-pointer border ${
                isCompactMode
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-sm'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
              }`}
              title="تصغير وتكبير نمط العرض للعمل السريع"
            >
              {isCompactMode ? <Maximize2 className="w-3 h-3" /> : <Minimize2 className="w-3 h-3" />}
              <span>{isCompactMode ? 'النمط العادي' : 'النمط المصغر'}</span>
            </button>

            <OfflineIndicator />
            <PWAInstallButton />
          </div>
        </div>
      </div>

      {/* Main Branding & Navigation bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <div className="relative group cursor-pointer" onClick={onNewInvoice}>
            <div className="absolute -inset-1 bg-gradient-to-r from-red-600 via-rose-500 to-blue-600 rounded-2xl blur-sm opacity-60 group-hover:opacity-90 transition duration-300" />
            <img
              src="/assets/aistudio/IMG_20261024_095049_855_cecabf0b.jpg"
              alt="RT Labs Logo"
              className="relative w-11 h-11 sm:w-13 sm:h-13 rounded-xl object-cover border-2 border-red-500/50 shadow-md bg-black"
            />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-1.5">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-rose-300 to-white">
                  معامل RT
                </span>
                <span className="text-slate-300">للتحاليل التشخيصية</span>
              </h1>
              <span className="hidden sm:inline-block px-1.5 py-0.5 rounded-md bg-blue-950/80 border border-blue-500/40 text-blue-300 text-[10px] font-bold">
                RT LABS
              </span>
            </div>
            <p className="text-xs text-red-300/90 font-medium flex items-center gap-1.5 mt-0.5">
              <span>{settings.doctorName}</span>
              <span className="text-slate-600 hidden sm:inline">•</span>
              <span className="text-slate-400 text-[11px] hidden sm:inline">{settings.doctorTitle}</span>
            </p>
          </div>
        </div>

        {/* Action navigation toolbar */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={onNewInvoice}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 text-white text-xs sm:text-sm font-bold shadow-md shadow-red-950/50 hover:brightness-110 active:scale-95 transition cursor-pointer"
            title="بدء فاتورة / عرض سعر جديد لمريض"
          >
            <PlusCircle className="w-4 h-4" />
            <span className="whitespace-nowrap">حالة جديدة</span>
          </button>

          {/* Daily Offers Button */}
          <button
            onClick={onOpenDailyOffers}
            className="relative flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl bg-gradient-to-r from-rose-950/80 to-red-950/80 border border-red-500/40 text-red-200 text-xs sm:text-sm font-bold hover:brightness-110 transition active:scale-95 cursor-pointer shadow-sm shadow-red-950"
            title="عروض وخصومات اليوم الحصرية"
          >
            <Flame className="w-4 h-4 text-amber-400 animate-pulse" />
            <span className="whitespace-nowrap">عروض اليوم</span>
            <span className="px-1.5 py-0.2 rounded-full bg-red-600 text-white text-[10px] font-mono font-bold">
              {dailyOffersCount}
            </span>
          </button>

          {/* Packages Button */}
          <button
            onClick={onOpenPackages}
            className="relative flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700/80 text-slate-200 text-xs sm:text-sm font-semibold hover:bg-slate-800 hover:border-red-500/50 transition active:scale-95 cursor-pointer"
            title="باقات الفحص الشامل"
          >
            <Gift className="w-4 h-4 text-red-400" />
            <span className="whitespace-nowrap">باقات وعروض</span>
            <span className="px-1.5 py-0.2 rounded-full bg-blue-600 text-white text-[10px] font-mono font-bold">
              {packagesCount}
            </span>
          </button>

          {/* Tests Catalog & Price Manager Button */}
          <button
            onClick={onOpenCatalog}
            className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700/80 text-slate-300 text-xs sm:text-sm font-semibold hover:bg-slate-800 hover:text-white transition active:scale-95 cursor-pointer"
            title="تعديل الأسعار وإضافة وتعديل كافة الفحوصات (+520 فحص)"
          >
            <Database className="w-4 h-4 text-blue-400" />
            <span className="whitespace-nowrap hidden sm:inline">دليل الأسعار</span>
          </button>

          {/* Invoices Archive Button */}
          <button
            onClick={onOpenInvoices}
            className="relative flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700/80 text-slate-300 text-xs sm:text-sm font-semibold hover:bg-slate-800 hover:text-white transition active:scale-95 cursor-pointer"
            title="أرشيف الفواتير وعروض الأسعار السابقة"
          >
            <FileText className="w-4 h-4 text-emerald-400" />
            <span className="whitespace-nowrap hidden sm:inline">الأرشيف</span>
            {invoicesCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-emerald-700 text-white text-[10px] font-mono font-bold">
                {invoicesCount}
              </span>
            )}
          </button>

          {/* Settings Button */}
          <button
            onClick={onOpenSettings}
            className="p-2 rounded-xl bg-slate-900 border border-slate-700/80 text-slate-400 hover:text-white hover:bg-slate-800 transition active:scale-95 cursor-pointer"
            title="إعدادات المعمل، اللوجو، الفروع، وأرقام الواتساب"
          >
            <SettingsIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
