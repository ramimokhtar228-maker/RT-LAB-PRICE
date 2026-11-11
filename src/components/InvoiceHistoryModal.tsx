import React, { useState } from 'react';
import { InvoiceRecord, LabSettings } from '../types/lab';
import { openWhatsAppLink, generateWhatsAppMessage } from '../services/whatsappService';
import { FileText, Search, MessageCircle, RotateCcw, Trash2, X, CheckCircle2, Clock, Calendar, Phone } from 'lucide-react';

interface InvoiceHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoices: InvoiceRecord[];
  settings: LabSettings;
  onLoadInvoice: (invoice: InvoiceRecord) => void;
  onDeleteInvoice: (id: string) => void;
}

export const InvoiceHistoryModal: React.FC<InvoiceHistoryModalProps> = ({
  isOpen,
  onClose,
  invoices,
  settings,
  onLoadInvoice,
  onDeleteInvoice,
}) => {
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const filtered = invoices.filter(
    (inv) =>
      inv.patient.name.toLowerCase().includes(search.toLowerCase()) ||
      inv.patient.phone.includes(search) ||
      inv.invoiceNumber.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-5 overflow-y-auto">
      <div className="w-full max-w-4xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-emerald-950/60 via-slate-900 to-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/30 border border-emerald-500/50 flex items-center justify-center text-emerald-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                <span>سجل الفواتير وعروض الأسعار السابقة</span>
                <span className="text-xs bg-slate-800 text-emerald-400 px-2 py-0.5 rounded-full font-mono">
                  {invoices.length} حالة
                </span>
              </h2>
              <p className="text-xs text-slate-300">
                محفوظة محلياً على جهازك - يمكنك إعادة إرسالها لواتساب أو تعديلها
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

        {/* Search */}
        <div className="p-4 bg-slate-950 border-b border-slate-800">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ابحث باسم المريض أو رقم الهاتف أو رقم الفاتورة..."
              className="w-full bg-slate-900 border border-slate-700 rounded-xl pr-9 pl-3 py-1.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Invoices List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filtered.map((inv) => {
            const formattedDate = new Date(inv.createdAt).toLocaleDateString('ar-EG', {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <div
                key={inv.id}
                className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-right"
              >
                <div>
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="font-mono text-xs font-bold text-red-400 bg-red-950/60 px-2 py-0.5 rounded border border-red-800/40">
                      #{inv.invoiceNumber}
                    </span>
                    <h4 className="text-sm font-bold text-white">
                      {inv.patient.name || 'عميل بدون اسم'}
                    </h4>
                    {inv.patient.phone && (
                      <span className="text-xs text-emerald-400 font-mono flex items-center gap-1" dir="ltr">
                        <Phone className="w-3 h-3" />
                        {inv.patient.phone}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-400 flex-wrap">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      {formattedDate}
                    </span>
                    <span>•</span>
                    <span>{inv.items.length} تحاليل</span>
                    {inv.appliedPackage && (
                      <>
                        <span>•</span>
                        <span className="text-red-300">عرض: {inv.appliedPackage.nameAr}</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-850">
                  <div className="text-left">
                    <span className="block text-[11px] text-slate-500">الصافي</span>
                    <span className="text-base font-black text-emerald-400 font-mono">
                      {inv.netTotal} {settings.currency}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        const msg = generateWhatsAppMessage(inv, settings);
                        openWhatsAppLink(inv.patient.phone, msg);
                      }}
                      className="p-2 rounded-xl bg-emerald-950 hover:bg-emerald-900 border border-emerald-500/30 text-emerald-400 transition cursor-pointer"
                      title="إرسال واتساب مباشرة"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        onLoadInvoice(inv);
                        onClose();
                      }}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition cursor-pointer"
                      title="تحميل الحالة في الشاشة الرئيسية للتعديل"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>استرجاع</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`هل أنت متأكد من حذف فاتورة ${inv.patient.name}؟`)) {
                          onDeleteInvoice(inv.id);
                        }
                      }}
                      className="p-2 rounded-xl bg-slate-900 hover:bg-rose-950 text-slate-500 hover:text-rose-400 transition cursor-pointer"
                      title="حذف"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div className="py-12 text-center text-slate-500 text-xs">
              لا توجد فواتير سابقة مطابقة. الفواتير المحفوظة ستظهر هنا فورياً.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
