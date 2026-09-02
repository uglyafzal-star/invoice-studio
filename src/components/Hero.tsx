import { ArrowRight, CheckCircle2, FileDown } from 'lucide-react';

function HeroMock() {
  const row = (desc: string, amount: string, bold = false) => (
    <div className="flex items-center justify-between border-b border-slate-100 py-2">
      <div className="flex items-center gap-2">
        <span className="h-1 w-1 rounded-full bg-slate-300" />
        <span className={`text-[11px] ${bold ? 'font-semibold text-slate-800' : 'text-slate-500'}`}>{desc}</span>
      </div>
      <span className={`text-[11px] ${bold ? 'font-semibold text-slate-800' : 'text-slate-500'}`}>{amount}</span>
    </div>
  );

  return (
    <div className="relative">
      {/* document */}
      <div className="relative mx-auto w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-[0_20px_50px_rgba(15,23,42,0.12)] sm:p-7">
        <div className="absolute inset-x-0 top-0 h-1.5 rounded-t-lg bg-blue-600" />
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded bg-slate-900 text-[9px] font-bold text-white">N</span>
              <span className="text-xs font-bold tracking-tight text-slate-900">Northwind Studio</span>
            </div>
            <div className="mt-2 space-y-1">
              <div className="h-1.5 w-24 rounded-full bg-slate-100" />
              <div className="h-1.5 w-32 rounded-full bg-slate-100" />
            </div>
          </div>
          <div className="text-right">
            <span className="text-lg font-extrabold tracking-wide text-blue-600">INVOICE</span>
            <div className="mt-1 space-y-1">
              <div className="ml-auto h-1.5 w-16 rounded-full bg-slate-100" />
              <div className="ml-auto h-1.5 w-20 rounded-full bg-slate-100" />
            </div>
          </div>
        </div>

        <div className="mt-5 rounded-md bg-slate-50 px-3 py-2.5">
          <span className="text-[9px] font-bold uppercase tracking-widest text-blue-600">Bill To</span>
          <div className="mt-1.5 space-y-1">
            <div className="h-1.5 w-28 rounded-full bg-slate-200" />
            <div className="h-1.5 w-36 rounded-full bg-slate-200/70" />
          </div>
        </div>

        <div className="mt-4">
          {row('Brand identity design', '$1,200.00')}
          {row('Website design & development', '$2,400.00')}
          {row('Monthly maintenance', '$450.00')}
        </div>

        <div className="mt-4 flex justify-end">
          <div className="w-40 space-y-1.5">
            <div className="flex justify-between">
              <span className="text-[10px] text-slate-400">Subtotal</span>
              <span className="text-[10px] font-medium text-slate-600">$4,050.00</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[10px] text-slate-400">Tax (10%)</span>
              <span className="text-[10px] font-medium text-slate-600">$384.75</span>
            </div>
            <div className="flex items-center justify-between border-t-2 border-blue-600 pt-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wide text-slate-500">Total</span>
              <span className="text-sm font-extrabold text-blue-600">$4,232.25</span>
            </div>
          </div>
        </div>
      </div>

      {/* floating chips */}
      <div className="absolute -right-3 -top-3 hidden items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-2 shadow-lg sm:flex dark:border-slate-700 dark:bg-slate-900">
        <FileDown size={13} className="text-blue-600" />
        <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-200">PDF Ready</span>
      </div>
      <div className="absolute -bottom-3 -left-3 hidden items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-2 shadow-lg sm:flex dark:border-slate-700 dark:bg-slate-900">
        <CheckCircle2 size={13} className="text-emerald-500" />
        <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-200">Totals calculated</span>
      </div>
    </div>
  );
}

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden bg-white dark:bg-slate-950">
      {/* subtle dot pattern */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.5] dark:opacity-[0.15]"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, #e2e8f0 1px, transparent 0)',
          backgroundSize: '28px 28px',
        }}
      />
      <div className="relative mx-auto max-w-7xl px-4 pb-14 pt-14 sm:px-6 sm:pb-16 sm:pt-16 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Free Invoice Generator
            </span>
            <h1 className="mt-5 text-4xl font-extrabold leading-[1.08] tracking-tight text-slate-900 sm:text-5xl dark:text-white">
              Create Professional Invoices in Minutes.
            </h1>
            <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg dark:text-slate-400">
              Create, customize, and download beautiful professional invoices instantly. Free, simple,
              and no signup required.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <a
                href="#generator"
                className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 active:bg-blue-800"
              >
                Create Your Invoice
                <ArrowRight size={16} />
              </a>
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-500 dark:text-slate-400">
              {['Free to use', 'No signup', 'Instant download'].map((t) => (
                <span key={t} className="inline-flex items-center gap-1.5">
                  <CheckCircle2 size={13} className="text-emerald-500" />
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div className="lg:pl-6">
            <HeroMock />
          </div>
        </div>
      </div>
    </section>
  );
}
