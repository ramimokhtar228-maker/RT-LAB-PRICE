import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Smartphone, CheckCircle, X } from 'lucide-react';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  if (isInstalled) {
    return (
      <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-xs font-medium">
        <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
        <span>تطبيق مثبت</span>
      </div>
    );
  }

  if (isInstallable) {
    return (
      <button
        onClick={install}
        className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-white shadow-lg shadow-red-950/50 transition-all active:scale-95 border border-red-500/40 cursor-pointer"
        title="تثبيت التطبيق على الموبايل أو اللابتوب للعمل أوفلاين"
      >
        <Download className="w-4 h-4 animate-bounce" />
        <span>تثبيت البرنامج</span>
      </button>
    );
  }

  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-1.5 rounded-xl bg-slate-800/90 border border-slate-700/80 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-slate-800 transition active:scale-95 cursor-pointer"
        >
          <Smartphone className="w-3.5 h-3.5 text-red-400" />
          <span>تثبيت على آيفون</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-700 p-6 shadow-2xl text-right">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                >
                  <X className="w-5 h-5" />
                </button>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span>تثبيت على iPhone / iPad</span>
                  <Smartphone className="w-4 h-4 text-red-400" />
                </h3>
              </div>
              <div className="mt-4 space-y-3 text-sm text-slate-300">
                <div className="flex items-start gap-3 bg-slate-800/50 p-2.5 rounded-xl border border-slate-700/50">
                  <span className="w-6 h-6 rounded-full bg-red-600/30 text-red-400 flex items-center justify-center text-xs font-bold shrink-0">
                    1
                  </span>
                  <p>
                    اضغط على زر <strong>المشاركة (Share)</strong> في شريط متصفح Safari السفلي.
                  </p>
                </div>
                <div className="flex items-start gap-3 bg-slate-800/50 p-2.5 rounded-xl border border-slate-700/50">
                  <span className="w-6 h-6 rounded-full bg-red-600/30 text-red-400 flex items-center justify-center text-xs font-bold shrink-0">
                    2
                  </span>
                  <p>
                    انزل للأسفل واضغط على <strong>إضافة إلى الشاشة الرئيسية (Add to Home Screen)</strong>.
                  </p>
                </div>
                <div className="flex items-start gap-3 bg-slate-800/50 p-2.5 rounded-xl border border-slate-700/50">
                  <span className="w-6 h-6 rounded-full bg-red-600/30 text-red-400 flex items-center justify-center text-xs font-bold shrink-0">
                    3
                  </span>
                  <p>
                    اضغط على <strong>إضافة (Add)</strong>، وسيصبح البرنامج كتطبيق مستقل يعمل بدون إنترنت!
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full rounded-xl bg-red-600 hover:bg-red-700 py-2.5 text-sm font-bold text-white transition active:scale-95"
              >
                فهمت ذلك
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  // Fallback desktop manual button to prompt user
  return (
    <button
      onClick={() => {
        alert('لتثبيت البرنامج: افتح قائمة خيارات المتصفح (⋮) واختر "تثبيت التطبيق" أو "Install app" أو اضغط على أيقونة التثبيت في شريط العنوان.');
      }}
      className="hidden md:flex items-center gap-1.5 rounded-xl bg-slate-800/80 border border-slate-700/80 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:bg-slate-700 transition cursor-pointer"
      title="تثبيت التطبيق على جهازك"
    >
      <Download className="w-3.5 h-3.5 text-red-400" />
      <span>تثبيت كبرنامج</span>
    </button>
  );
};
