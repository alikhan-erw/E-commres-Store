import React from 'react';
import { CheckCircle, Info, AlertCircle, X } from 'lucide-react';
import { useStore } from '../context/StoreContext.tsx';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map(toast => {
        const isSuccess = toast.type === 'success' || !toast.type;
        const isAlert = toast.type === 'alert';

        return (
          <div
            key={toast.id}
            className="pointer-events-auto flex items-center justify-between gap-3 p-4 rounded-2xl bg-[#090d0a]/95 border border-[#252D28] shadow-[0_10px_30px_rgba(0,0,0,0.8),0_0_15px_rgba(53,245,130,0.15)] backdrop-blur-md animate-fadeIn"
          >
            <div className="flex items-center gap-3">
              {isSuccess && <CheckCircle className="w-5 h-5 text-[#35F582] flex-shrink-0" />}
              {isAlert && <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />}
              {!isSuccess && !isAlert && <Info className="w-5 h-5 text-blue-400 flex-shrink-0" />}

              <div>
                <p className="text-xs font-bold text-white">{toast.title}</p>
                {toast.message && (
                  <p className="text-[11px] text-[#A5ADA8] mt-0.5">{toast.message}</p>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              className="text-[#A5ADA8] hover:text-white p-1 rounded-lg"
              aria-label="Dismiss toast"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
