import React, { useState, useRef } from 'react';
import { 
  X, 
  Download, 
  Upload, 
  FileSpreadsheet, 
  FileJson, 
  CheckCircle2, 
  AlertTriangle, 
  Database, 
  RotateCcw, 
  Save, 
  ShieldCheck, 
  Sparkles,
  ArrowDownToLine,
  ArrowUpFromLine,
  Check,
  Layers,
  Flame,
  Tag
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { LabTest, OfferPackage, DailyOffer, LabSettings, InvoiceRecord } from '../types/lab';
import { storageService } from '../services/storageService';

interface BackupManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  tests: LabTest[];
  packages: OfferPackage[];
  dailyOffers: DailyOffer[];
  settings: LabSettings;
  invoices: InvoiceRecord[];
  onDataRestored: (
    newTests: LabTest[],
    newPackages: OfferPackage[],
    newDailyOffers: DailyOffer[],
    newSettings: LabSettings
  ) => void;
}

export const BackupManagerModal: React.FC<BackupManagerModalProps> = ({
  isOpen,
  onClose,
  tests,
  packages,
  dailyOffers,
  settings,
  invoices,
  onDataRestored,
}) => {
  if (!isOpen) return null;

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importMode, setImportMode] = useState<'merge' | 'replace'>('merge');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<{
    name: string;
    sizeKb: number;
    type: 'json' | 'csv' | 'unknown';
    content: string;
    testsCount?: number;
    packagesCount?: number;
    hasSettings?: boolean;
  } | null>(null);

  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | 'info';
    text: string;
  } | null>(null);

  const [isPersisting, setIsPersisting] = useState(false);
  const [hasPersisted, setHasPersisted] = useState(false);

  // Statistics
  const totalTests = tests.length;
  const totalPackages = packages.length;
  const totalOffers = dailyOffers.length;
  const totalInvoices = invoices.length;

  // Handle Export Full JSON Backup
  const handleExportJSON = () => {
    try {
      const filename = storageService.downloadFullBackupJSON(
        tests,
        packages,
        dailyOffers,
        settings,
        invoices
      );
      setNotification({
        type: 'success',
        text: `تم تصدير ملف النسخة الاحتياطية الشاملة بنجاح (${filename})!`,
      });
      confetti({ particleCount: 40, spread: 50, origin: { y: 0.6 } });
    } catch {
      setNotification({
        type: 'error',
        text: 'حدث خطأ أثناء تصدير ملف النسخة الاحتياطية.',
      });
    }
  };

  // Handle Export Tests CSV
  const handleExportTestsCSV = () => {
    try {
      const filename = storageService.exportTestsCSV(tests);
      setNotification({
        type: 'success',
        text: `تم تصدير كشف أسعار الفحوصات كملف Excel (CSV) بنجاح (${filename})!`,
      });
    } catch {
      setNotification({
        type: 'error',
        text: 'حدث خطأ أثناء تصدير ملف CSV.',
      });
    }
  };

  // Handle Export Packages CSV
  const handleExportPackagesCSV = () => {
    try {
      const filename = storageService.exportPackagesCSV(packages);
      setNotification({
        type: 'success',
        text: `تم تصدير كشف باقات وعروض المعمل (${filename}) بنجاح!`,
      });
    } catch {
      setNotification({
        type: 'error',
        text: 'حدث خطأ أثناء تصدير باقات المعمل.',
      });
    }
  };

  // Immediate Data Persistence
  const handleForcePersist = () => {
    setIsPersisting(true);
    const result = storageService.persistAllData(
      tests,
      packages,
      dailyOffers,
      settings,
      invoices
    );
    setTimeout(() => {
      setIsPersisting(false);
      if (result.success) {
        setHasPersisted(true);
        setNotification({
          type: 'success',
          text: 'تم تثبيت وحفظ كافة البيانات والأسعار المعدلة بنجاح في ذاكرة النظام!',
        });
        setTimeout(() => setHasPersisted(false), 3000);
      } else {
        setNotification({
          type: 'error',
          text: 'حدث خطأ أثناء محاولة حفظ وتثبيت البيانات.',
        });
      }
    }, 400);
  };

  // Handle File Selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    const isJson = file.name.endsWith('.json') || file.type.includes('json');
    const isCsv = file.name.endsWith('.csv') || file.type.includes('csv');

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (!text) return;

      let testsCount = 0;
      let packagesCount = 0;
      let hasSettings = false;

      if (isJson) {
        try {
          const parsed = JSON.parse(text);
          if (Array.isArray(parsed)) {
            testsCount = parsed.length;
          } else if (parsed && typeof parsed === 'object') {
            if (Array.isArray(parsed.tests)) testsCount = parsed.tests.length;
            if (Array.isArray(parsed.packages)) packagesCount = parsed.packages.length;
            hasSettings = !!parsed.settings;
          }
        } catch {
          // invalid json
        }
      } else if (isCsv) {
        const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
        testsCount = Math.max(0, lines.length - 1);
      }

      setFilePreview({
        name: file.name,
        sizeKb: Math.round(file.size / 1024),
        type: isJson ? 'json' : isCsv ? 'csv' : 'unknown',
        content: text,
        testsCount,
        packagesCount,
        hasSettings,
      });
      setNotification(null);
    };

    reader.readAsText(file);
  };

  // Execute Import
  const handleExecuteImport = () => {
    if (!filePreview || !filePreview.content) {
      setNotification({
        type: 'error',
        text: 'يرجى اختيار ملف نسخة احتياطية أولاً.',
      });
      return;
    }

    if (importMode === 'replace') {
      const confirmed = window.confirm(
        'تنبيه مهم: أنت على وشك استبدال جميع البيانات الحالية بالكامل بالملف المرفوع. هل ترغب في المتابعة؟'
      );
      if (!confirmed) return;
    }

    if (filePreview.type === 'json') {
      const result = storageService.importBackupData(filePreview.content, importMode);
      if (result.success) {
        onDataRestored(result.tests, result.packages, result.dailyOffers, result.settings);
        setNotification({
          type: 'success',
          text: result.message,
        });
        setSelectedFile(null);
        setFilePreview(null);
        confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
      } else {
        setNotification({
          type: 'error',
          text: result.message,
        });
      }
    } else if (filePreview.type === 'csv') {
      const result = storageService.importTestsFromCSV(filePreview.content, importMode);
      if (result.success) {
        onDataRestored(result.tests, packages, dailyOffers, settings);
        setNotification({
          type: 'success',
          text: result.message,
        });
        setSelectedFile(null);
        setFilePreview(null);
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
      } else {
        setNotification({
          type: 'error',
          text: result.message,
        });
      }
    } else {
      setNotification({
        type: 'error',
        text: 'صيغة الملف غير مدعومة. يرجى اختيار ملف بتنسيق .json أو .csv',
      });
    }
  };

  // Reset to Defaults
  const handleResetToDefaults = () => {
    if (confirm('هل ترغب في إعادة ضبط الفحوصات والباقات إلى القائمة الافتراضية الرسمية لمعامل RT؟')) {
      const defaultTests = storageService.resetTestsToDefault();
      const defaultPackages = storageService.resetPackagesToDefault();
      const defaultOffers = storageService.resetDailyOffers();
      const defaultSettings = storageService.getSettings();

      onDataRestored(defaultTests, defaultPackages, defaultOffers, defaultSettings);
      setNotification({
        type: 'info',
        text: 'تمت استعادة القوائم والأسعار الافتراضية بنجاح.',
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden border border-slate-700/80 my-8 text-slate-100">
        
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-red-950 via-slate-900 to-blue-950 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-700 text-white flex items-center justify-center shadow-sm">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white flex items-center gap-2">
                <span>تثبيت واستيراد وتصدير بيانات النسخة للحفظ</span>
                <span className="text-[10px] bg-red-600/80 px-2 py-0.5 rounded-full font-mono">v2.1</span>
              </h2>
              <p className="text-xs text-red-200">
                حفظ وتثبيت كافة تعديلات الأسعار والفحوصات، تصدير ملفات النسخ الاحتياطية، واسترجاعها بسهولة
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 text-xs text-slate-300 max-h-[75vh] overflow-y-auto">

          {/* Quick Notification Alert */}
          {notification && (
            <div
              className={`p-4 rounded-xl border text-xs flex items-center gap-3 transition-all ${
                notification.type === 'success'
                  ? 'bg-emerald-950/80 border-emerald-500/60 text-emerald-200'
                  : notification.type === 'error'
                  ? 'bg-rose-950/80 border-rose-500/60 text-rose-200'
                  : 'bg-blue-950/80 border-blue-500/60 text-blue-200'
              }`}
            >
              {notification.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              ) : notification.type === 'error' ? (
                <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
              ) : (
                <ShieldCheck className="w-5 h-5 text-blue-400 shrink-0" />
              )}
              <span className="font-bold text-sm">{notification.text}</span>
            </div>
          )}

          {/* Live Data KPI Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl">
              <div className="text-[11px] text-slate-400 font-medium">الفحوصات الطبية</div>
              <div className="text-xl font-bold font-mono text-white mt-1">{totalTests}</div>
              <div className="text-[10px] text-slate-500 mt-0.5">فحص متاح بالقائمة</div>
            </div>

            <div className="p-3 bg-red-950/40 border border-red-900/60 rounded-xl">
              <div className="text-[11px] text-red-300 font-medium">باقات العروض</div>
              <div className="text-xl font-bold font-mono text-red-200 mt-1">{totalPackages}</div>
              <div className="text-[10px] text-red-400 mt-0.5">باقة فحص دوري</div>
            </div>

            <div className="p-3 bg-amber-950/40 border border-amber-900/60 rounded-xl">
              <div className="text-[11px] text-amber-300 font-medium">عروض اليوم</div>
              <div className="text-xl font-bold font-mono text-amber-200 mt-1">{totalOffers}</div>
              <div className="text-[10px] text-amber-400 mt-0.5">خصومات سريعة</div>
            </div>

            <div className="p-3 bg-blue-950/40 border border-blue-900/60 rounded-xl">
              <div className="text-[11px] text-blue-300 font-medium">أرشيف الفواتير</div>
              <div className="text-xl font-bold font-mono text-blue-200 mt-1">{totalInvoices}</div>
              <div className="text-[10px] text-blue-400 mt-0.5">فاتورة محفوظة</div>
            </div>
          </div>

          {/* SECTION 1: Fixation & Instant Persistence */}
          <div className="p-4 bg-gradient-to-r from-red-950/60 via-slate-950 to-blue-950/60 border border-red-900/80 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 font-bold text-sm text-white">
                <ShieldCheck className="w-4 h-4 text-red-400" />
                <span>تثبيت البيانات والأسعار المعدلة فوراً</span>
              </div>
              <p className="text-[11px] text-slate-400">
                يقوم بتثبيت كافة تعديلات الأسعار والفحوصات في الذاكرة مع إنشاء نقطة استرجاع وحفظ فوري.
              </p>
            </div>
            <button
              type="button"
              onClick={handleForcePersist}
              disabled={isPersisting}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer shadow-sm whitespace-nowrap shrink-0 ${
                hasPersisted
                  ? 'bg-emerald-600 text-white'
                  : 'bg-red-700 hover:bg-red-800 text-white'
              }`}
            >
              {hasPersisted ? (
                <>
                  <Check className="w-4 h-4 text-emerald-200" />
                  <span>تم التثبيت والحفظ بنجاح!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>تثبيت وحفظ البيانات الآن</span>
                </>
              )}
            </button>
          </div>

          {/* SECTION 2: Export Section */}
          <div className="space-y-3 p-4 bg-slate-950/60 border border-slate-800 rounded-xl">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white text-xs flex items-center gap-1.5">
                <ArrowDownToLine className="w-4 h-4 text-blue-400" />
                <span>تصدير نسخة للحفظ (Export Backup):</span>
              </h3>
              <span className="text-[11px] text-slate-400">حفظ ملف على جهازك</span>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed">
              يمكنك تصدير قاعدة البيانات بالكامل كملف JSON شامل (يحتوي كافة الفحوصات والأسعار والباقات والعروض والإعدادات) لتخزينه في مكان آمن، أو تصدير ملف Excel (CSV) لقائمة الأسعار للمراجعة والطباعة.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              {/* Export Full JSON Backup */}
              <button
                type="button"
                onClick={handleExportJSON}
                className="flex items-center justify-between p-3.5 bg-slate-900 border border-slate-800 hover:border-red-500 hover:bg-slate-850 rounded-xl transition-all cursor-pointer shadow-xs group text-right"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-red-900/60 text-red-200 flex items-center justify-center shrink-0 group-hover:bg-red-700 group-hover:text-white transition-colors">
                    <FileJson className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-white text-[11px]">نسخة كاملة (JSON)</div>
                    <div className="text-[10px] text-slate-400">الفحوصات + الباقات + الإعدادات</div>
                  </div>
                </div>
                <Download className="w-4 h-4 text-slate-500 group-hover:text-red-400 transition-colors" />
              </button>

              {/* Export Tests CSV */}
              <button
                type="button"
                onClick={handleExportTestsCSV}
                className="flex items-center justify-between p-3.5 bg-slate-900 border border-slate-800 hover:border-emerald-500 hover:bg-slate-850 rounded-xl transition-all cursor-pointer shadow-xs group text-right"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-900/60 text-emerald-200 flex items-center justify-center shrink-0 group-hover:bg-emerald-700 group-hover:text-white transition-colors">
                    <FileSpreadsheet className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-white text-[11px]">كشف الأسعار (CSV)</div>
                    <div className="text-[10px] text-slate-400">متوافق مع Microsoft Excel</div>
                  </div>
                </div>
                <Download className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-colors" />
              </button>

              {/* Export Packages CSV */}
              <button
                type="button"
                onClick={handleExportPackagesCSV}
                className="flex items-center justify-between p-3.5 bg-slate-900 border border-slate-800 hover:border-blue-500 hover:bg-slate-850 rounded-xl transition-all cursor-pointer shadow-xs group text-right"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-900/60 text-blue-200 flex items-center justify-center shrink-0 group-hover:bg-blue-700 group-hover:text-white transition-colors">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-white text-[11px]">باقات العروض (CSV)</div>
                    <div className="text-[10px] text-slate-400">أسعار الباقات والوفر للمريض</div>
                  </div>
                </div>
                <Download className="w-4 h-4 text-slate-500 group-hover:text-blue-400 transition-colors" />
              </button>
            </div>
          </div>

          {/* SECTION 3: Import Section */}
          <div className="space-y-3 p-4 bg-slate-950/60 border border-slate-800 rounded-xl">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white text-xs flex items-center gap-1.5">
                <ArrowUpFromLine className="w-4 h-4 text-emerald-400" />
                <span>استيراد نسخة سابقة أو كشف أسعار (Import Backup):</span>
              </h3>
              <span className="text-[11px] text-emerald-400 font-semibold">استرجاع ودمج البيانات</span>
            </div>

            {/* Import Mode Radio Switch */}
            <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 space-y-2">
              <label className="block text-[11px] font-bold text-slate-300">
                اختر طريقة الاستيراد:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <label
                  className={`flex items-start gap-2.5 p-2 rounded-lg border cursor-pointer transition-colors ${
                    importMode === 'merge'
                      ? 'bg-blue-950/50 border-blue-500 text-white'
                      : 'border-slate-800 hover:bg-slate-800 text-slate-400'
                  }`}
                >
                  <input
                    type="radio"
                    name="importMode"
                    value="merge"
                    checked={importMode === 'merge'}
                    onChange={() => setImportMode('merge')}
                    className="mt-0.5"
                  />
                  <div>
                    <div className="font-bold text-[11px]">دمج وتحديث البيانات والأسعار (موصى به)</div>
                    <div className="text-[10px] text-slate-400">
                      يحدث الأسعار المعدلة ويضيف الفحوصات الجديدة ويحافظ على القائمة الحالية
                    </div>
                  </div>
                </label>

                <label
                  className={`flex items-start gap-2.5 p-2 rounded-lg border cursor-pointer transition-colors ${
                    importMode === 'replace'
                      ? 'bg-red-950/50 border-red-500 text-white'
                      : 'border-slate-800 hover:bg-slate-800 text-slate-400'
                  }`}
                >
                  <input
                    type="radio"
                    name="importMode"
                    value="replace"
                    checked={importMode === 'replace'}
                    onChange={() => setImportMode('replace')}
                    className="mt-0.5"
                  />
                  <div>
                    <div className="font-bold text-[11px]">استبدال كامل شامل للبيانات</div>
                    <div className="text-[10px] text-slate-400">
                      استبدال كافة الفحوصات والأسعار بالكامل بالنسخة المرفوعة
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* File Upload Drop Area */}
            <div className="p-4 bg-slate-900 border-2 border-dashed border-slate-700 hover:border-red-500 rounded-xl text-center space-y-3 transition-colors">
              <input
                ref={fileInputRef}
                type="file"
                accept=".json,.csv,application/json,text/csv"
                onChange={handleFileChange}
                className="hidden"
              />

              <div
                className="flex flex-col items-center justify-center gap-1.5 cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="w-10 h-10 rounded-full bg-slate-800 text-red-400 flex items-center justify-center">
                  <Upload className="w-5 h-5" />
                </div>
                <div className="font-bold text-white text-xs">
                  {selectedFile ? selectedFile.name : 'اضغط لاختيار ملف نسخة احتياطية (.json أو .csv)'}
                </div>
                <p className="text-[10px] text-slate-400">
                  يدعم ملفات JSON للنسخ الاحتياطي الشامل وكشوفات Excel CSV
                </p>
              </div>

              {/* Preview info if file chosen */}
              {filePreview && (
                <div className="mt-3 p-3 bg-slate-950 rounded-lg border border-slate-800 text-right space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white">{filePreview.name}</span>
                    <span className="font-mono text-slate-400 text-[10px]">{filePreview.sizeKb} KB</span>
                  </div>
                  <div className="flex items-center gap-4 text-[11px] text-slate-300">
                    <span>
                      الفحوصات المكتشفة: <strong className="text-red-400 font-mono">{filePreview.testsCount || 0}</strong>
                    </span>
                    {filePreview.packagesCount ? (
                      <span>
                        الباقات: <strong className="text-blue-400 font-mono">{filePreview.packagesCount}</strong>
                      </span>
                    ) : null}
                    {filePreview.hasSettings && (
                      <span className="text-emerald-400 font-semibold">✓ تم العثور على إعدادات المعمل</span>
                    )}
                  </div>
                  <div className="pt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={handleExecuteImport}
                      className="inline-flex items-center gap-2 px-5 py-2 bg-emerald-700 hover:bg-emerald-600 text-white font-bold rounded-lg text-xs cursor-pointer shadow-sm transition-colors"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>بدء الاستيراد وتثبيت الأسعار الآن</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Reset Defaults Area */}
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
            <span>هل ترغب في العودة إلى القوائم والأسعار الافتراضية؟</span>
            <button
              type="button"
              onClick={handleResetToDefaults}
              className="inline-flex items-center gap-1 text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>استعادة القوائم الافتراضية للمعمل</span>
            </button>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer text-xs font-semibold"
          >
            إغلاق
          </button>

          <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>يتم التخزين بأعلى درجات الأمان والسرية في جهازك</span>
          </div>
        </div>

      </div>
    </div>
  );
};
