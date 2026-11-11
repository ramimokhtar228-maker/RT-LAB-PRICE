import React from 'react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { Wifi, WifiOff } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
        isOnline
          ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-500/20'
          : 'bg-amber-950/60 text-amber-300 border border-amber-500/30 animate-pulse'
      }`}
      title={isOnline ? 'النظام متصل بالإنترنت ومزامن' : 'أنت الآن تعمل في وضع عدم الاتصال (أوفلاين) - جميع البيانات محفوظة محلياً'}
    >
      {isOnline ? (
        <>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <Wifi className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">أونلاين</span>
        </>
      ) : (
        <>
          <span className="w-2 h-2 rounded-full bg-amber-400" />
          <WifiOff className="w-3.5 h-3.5" />
          <span>أوفلاين (شغال بدون نت)</span>
        </>
      )}
    </div>
  );
};
