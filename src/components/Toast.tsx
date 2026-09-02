import { AlertCircle, CheckCircle2 } from 'lucide-react';

export interface ToastMsg {
  id: number;
  text: string;
  kind: 'success' | 'error';
}

export default function ToastStack({ toasts }: { toasts: ToastMsg[] }) {
  if (toasts.length === 0) return null;
  return (
    <div className="pointer-events-none fixed bottom-24 right-1/2 z-[90] flex translate-x-1/2 flex-col items-center gap-2 lg:bottom-6 lg:right-6 lg:translate-x-0 lg:items-end">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="pointer-events-auto flex items-center gap-2.5 rounded-md bg-slate-900 px-4 py-2.5 text-sm font-medium text-white shadow-lg dark:bg-slate-100 dark:text-slate-900"
        >
          {t.kind === 'success' ? (
            <CheckCircle2 size={16} className="text-emerald-400 dark:text-emerald-600" />
          ) : (
            <AlertCircle size={16} className="text-red-400 dark:text-red-600" />
          )}
          {t.text}
        </div>
      ))}
    </div>
  );
}
