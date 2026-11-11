import React, { useState } from 'react';
import { InvoiceRecord, LabSettings } from '../types/lab';
import { generateWhatsAppMessage, openWhatsAppLink, shareOrCopyMessage, formatPhoneNumberForWhatsApp } from '../services/whatsappService';
import { MessageCircle, Copy, Share2, Check, X, Phone, ExternalLink, Send } from 'lucide-react';

interface WhatsAppPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: InvoiceRecord;
  settings: LabSettings;
  onUpdatePhone: (phone: string) => void;
  onMarkSent: () => void;
}

export const WhatsAppPreviewModal: React.FC<WhatsAppPreviewModalProps> = ({
  isOpen,
  onClose,
  invoice,
  settings,
  onUpdatePhone,
  onMarkSent,
}) => {
  const [copied, setCopied] = useState(false);
  const [customMessage, setCustomMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentMessage = customMessage ?? generateWhatsAppMessage(invoice, settings);
  const formattedPhone = formatPhoneNumberForWhatsApp(invoice.patient.phone);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentMessage);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      console.error(e);
    }
  };

  const handleShare = async () => {
    const res = await shareOrCopyMessage(currentMessage, `عرض أسعار معامل RT - ${invoice.patient.name}`);
    if (res.copied) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
    onMarkSent();
  };

  const handleSendDirect = () => {
    openWhatsAppLink(invoice.patient.phone, currentMessage);
    onMarkSent();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-5 overflow-y-auto">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-emerald-950 via-slate-900 to-green-950/80 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/30 border border-emerald-500/50 flex items-center justify-center text-emerald-400">
              <MessageCircle className="w-5 h-5 fill-emerald-400/20" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                <span>إرسال تفاصيل الفاتورة عبر واتساب</span>
              </h2>
              <p className="text-xs text-slate-300">
                رسالة مفصلة بأسعار التحاليل وشروط الصيام وعناوين المعمل
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

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
          {/* Patient Phone Input & Validation Box */}
          <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="w-full sm:w-auto flex-1">
              <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>رقم هاتف / واتساب المريض المستلم:</span>
              </label>
              <input
                type="tel"
                dir="ltr"
                value={invoice.patient.phone}
                onChange={(e) => onUpdatePhone(e.target.value)}
                placeholder="01012345678"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-left text-white font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="text-right text-xs text-slate-400 shrink-0">
              <span className="block text-[11px] text-slate-500">الصيغة الدولية لواتساب:</span>
              <span className="font-mono text-emerald-400 font-bold">
                {formattedPhone ? `+${formattedPhone}` : 'يرجى إدخال الرقم'}
              </span>
            </div>
          </div>

          {/* WhatsApp Chat Simulation Container */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-300">
                معاينة نص الرسالة كما ستصل للمريض:
              </span>
              <button
                type="button"
                onClick={handleCopy}
                className="flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 transition cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'تم النسخ!' : 'نسخ النص'}</span>
              </button>
            </div>

            <div className="bg-[#0b141a] p-4 rounded-2xl border border-emerald-950 shadow-inner relative max-h-[340px] overflow-y-auto font-sans">
              {/* WhatsApp Message Bubble */}
              <div className="bg-[#005c4b] text-[#e9edef] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap select-text shadow-md">
                {currentMessage}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 sm:p-5 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition flex-1 sm:flex-none cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'تم النسخ بنجاح' : 'نسخ الرسالة'}</span>
            </button>

            <button
              type="button"
              onClick={handleShare}
              className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition flex-1 sm:flex-none cursor-pointer"
              title="مشاركة الرسالة عبر تطبيقات الهاتف"
            >
              <Share2 className="w-4 h-4 text-blue-400" />
              <span>مشاركة</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleSendDirect}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white text-xs sm:text-sm font-extrabold shadow-lg shadow-emerald-950/60 transition active:scale-95 cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>فتح واتساب والإرسال الآن</span>
          </button>
        </div>
      </div>
    </div>
  );
};
