import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Smartphone, Laptop, CheckCircle, X, Info, MonitorCheck } from 'lucide-react';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showGuide, setShowGuide] = useState(false);

  if (isInstalled) {
    return (
      <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 text-xs font-medium shadow-sm">
        <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
        <span className="hidden sm:inline">التطبيق مثبت وجاهز</span>
        <span className="sm:hidden">مثبت</span>
      </div>
    );
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      const installed = await install();
      if (!installed) {
        setShowGuide(true);
      }
    } else {
      setShowGuide(true);
    }
  };

  return (
    <>
      <button
        onClick={handleInstallClick}
        className="flex items-center gap-1.5 sm:gap-2 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-500 px-3 sm:px-3.5 py-1 sm:py-1.5 text-xs sm:text-sm font-bold text-white shadow-lg shadow-red-950/60 transition-all active:scale-95 border border-red-400/30 cursor-pointer animate-pulse hover:animate-none"
        title="تثبيت برنامج معامل RT كتطبيق على الموبايل واللابتوب للعمل أوفلاين وسريعاً"
      >
        <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        <span className="whitespace-nowrap">تثبيت التطبيق</span>
      </button>

      {showGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-700 p-5 sm:p-6 shadow-2xl text-right">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <button
                onClick={() => setShowGuide(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>تثبيت برنامج معامل RT</span>
                <MonitorCheck className="w-5 h-5 text-red-500" />
              </h3>
            </div>

            <p className="mt-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
              يمكنك تشغيل البرنامج كتطبيق مستقل على سطح المكتب في اللابتوب أو كأيقونة تطبيق على هاتفك المحمول للعمل بدون إنترنت وسرعة فائقة:
            </p>

            <div className="mt-4 space-y-3">
              {/* Laptop / PC Instruction */}
              <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3">
                <div className="flex items-center gap-2 text-white font-bold text-xs sm:text-sm mb-1.5 text-red-400">
                  <Laptop className="w-4 h-4" />
                  <span>للكمبيوتر واللابتوب (Chrome / Edge):</span>
                </div>
                <p className="text-xs text-slate-300 leading-normal">
                  اضغط على أيقونة التثبيت <span className="inline-block px-1.5 py-0.5 bg-slate-700 rounded text-slate-100 font-mono text-[11px]">⊕</span> في شريط عنوان المتصفح بالأعلى، أو افتح قائمة المتصفح <strong className="text-white">(⋮)</strong> واضغط على <strong className="text-white">&quot;تثبيت معامل RT&quot; (Install App)</strong>.
                </p>
              </div>

              {/* Mobile Phone Instruction */}
              <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3">
                <div className="flex items-center gap-2 text-white font-bold text-xs sm:text-sm mb-1.5 text-blue-400">
                  <Smartphone className="w-4 h-4" />
                  <span>لهواتف الأندرويد (Android):</span>
                </div>
                <p className="text-xs text-slate-300 leading-normal">
                  افتح قائمة خيارات متصفح كروم <strong className="text-white">(⋮)</strong> واضغط على <strong className="text-white">&quot;إضافة إلى الشاشة الرئيسية&quot; (Add to Home screen)</strong> أو &quot;تثبيت التطبيق&quot;.
                </p>
              </div>

              {/* iPhone / iPad Instruction */}
              <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3">
                <div className="flex items-center gap-2 text-white font-bold text-xs sm:text-sm mb-1.5 text-amber-400">
                  <Smartphone className="w-4 h-4" />
                  <span>لهواتف الآيفون والآيباد (iOS / Safari):</span>
                </div>
                <p className="text-xs text-slate-300 leading-normal">
                  اضغط على زر المشاركة <strong className="text-white">(Share)</strong> في شريط سفلي بسفاري، ثم اختر <strong className="text-white">&quot;إضافة إلى الشاشة الرئيسية&quot; (Add to Home Screen)</strong> ثم <strong className="text-white">إضافة</strong>.
                </p>
              </div>
            </div>

            <div className="mt-5 flex gap-2">
              {isInstallable && (
                <button
                  onClick={async () => {
                    await install();
                    setShowGuide(false);
                  }}
                  className="flex-1 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 py-2.5 text-xs sm:text-sm font-bold text-white transition active:scale-95 shadow-md shadow-red-950 cursor-pointer"
                >
                  بدء التثبيت الآن
                </button>
              )}
              <button
                onClick={() => setShowGuide(false)}
                className={`rounded-xl bg-slate-800 hover:bg-slate-700 py-2.5 text-xs sm:text-sm font-semibold text-slate-300 transition ${
                  isInstallable ? 'px-4' : 'w-full'
                }`}
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

