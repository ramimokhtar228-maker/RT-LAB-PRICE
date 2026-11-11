import React, { useState } from 'react';
import { LabSettings } from '../types/lab';
import { Settings, Save, X, Plus, Trash2, Building, Phone, MapPin } from 'lucide-react';

interface LabSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: LabSettings;
  onSave: (settings: LabSettings) => void;
}

export const LabSettingsModal: React.FC<LabSettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSave,
}) => {
  const [formData, setFormData] = useState<LabSettings>(settings);
  const [newBranch, setNewBranch] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const handleAddBranch = () => {
    if (newBranch.trim()) {
      setFormData({
        ...formData,
        branches: [...formData.branches, newBranch.trim()],
      });
      setNewBranch('');
    }
  };

  const handleRemoveBranch = (index: number) => {
    setFormData({
      ...formData,
      branches: formData.branches.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-5 overflow-y-auto">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-5 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white">
                إعدادات المعمل وهوية الفواتير
              </h2>
              <p className="text-xs text-slate-400">
                تعديل اسم المعمل، هاتف الواتساب، الفروع والخط الساخن
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block font-bold text-slate-300 mb-1">اسم المعمل الرسمي</label>
              <input
                type="text"
                value={formData.labName}
                onChange={(e) => setFormData({ ...formData, labName: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">اسم الطبيب الاستشاري</label>
              <input
                type="text"
                value={formData.doctorName}
                onChange={(e) => setFormData({ ...formData, doctorName: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-300 mb-1">اللقب والصفة الطبية</label>
              <input
                type="text"
                value={formData.doctorTitle}
                onChange={(e) => setFormData({ ...formData, doctorTitle: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>رقم هاتف / الخط الساخن للمعمل</span>
              </label>
              <input
                type="text"
                dir="ltr"
                value={formData.hotline}
                onChange={(e) => setFormData({ ...formData, hotline: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white font-mono text-left"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>رقم واتساب المعمل الرسمي للردود</span>
              </label>
              <input
                type="text"
                dir="ltr"
                value={formData.whatsappNumber}
                onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                placeholder="201099887766"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white font-mono text-left"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-300 mb-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-red-400" />
                <span>عنوان المقر الرئيسي للمعمل</span>
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
              />
            </div>
          </div>

          {/* Branches Manager */}
          <div className="pt-3 border-t border-slate-800">
            <label className="block font-bold text-slate-300 mb-2 flex items-center gap-1.5">
              <Building className="w-4 h-4 text-blue-400" />
              <span>فروع المعمل المسجلة بالنظام:</span>
            </label>

            <div className="space-y-1.5 mb-2.5">
              {formData.branches.map((b, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-xl"
                >
                  <span className="text-slate-200">{b}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveBranch(idx)}
                    className="text-slate-500 hover:text-rose-400 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newBranch}
                onChange={(e) => setNewBranch(e.target.value)}
                placeholder="اسم فرع جديد وعنوانه..."
                className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-white"
              />
              <button
                type="button"
                onClick={handleAddBranch}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>إضافة</span>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-800">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.homeVisitAvailable}
                onChange={(e) =>
                  setFormData({ ...formData, homeVisitAvailable: e.target.checked })
                }
                className="w-4 h-4 rounded text-red-600 focus:ring-0"
              />
              <span className="text-slate-300 font-bold">
                تفعيل إشعار خدمة السحب المنزلي في رسائل الواتساب
              </span>
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold cursor-pointer"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>حفظ الإعدادات</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
