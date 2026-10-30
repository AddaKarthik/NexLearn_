import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ message, type = 'success', onClose }) {
  if (!message) return null;

  const bgStyles = {
    success: 'bg-emerald-50 border-emerald-300 text-emerald-800 shadow-emerald-500/10',
    error: 'bg-rose-50 border-rose-300 text-rose-800 shadow-rose-500/10',
    info: 'bg-blue-50 border-blue-300 text-blue-800 shadow-blue-500/10',
  }[type] || 'bg-white border-slate-200 text-slate-800';

  const icons = {
    success: <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />,
    error: <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />,
    info: <Info className="w-4 h-4 text-[#2563EB] shrink-0" />,
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 duration-300">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl border shadow-xl ${bgStyles}`}>
        {icons[type]}
        <span className="text-xs sm:text-sm font-semibold">{message}</span>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 rounded-md hover:bg-black/5 transition-colors ml-2"
          >
            <X className="w-3.5 h-3.5 text-slate-500" />
          </button>
        )}
      </div>
    </div>
  );
}
