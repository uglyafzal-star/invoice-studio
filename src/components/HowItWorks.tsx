import { Building2, ListPlus, Send, type LucideIcon } from 'lucide-react';

interface Step {
  num: string;
  icon: LucideIcon;
  title: string;
  desc: string;
}

const STEPS: Step[] = [
  {
    num: '01',
    icon: Building2,
    title: 'Add Your Details',
    desc: 'Enter your business and client information in seconds.',
  },
  {
    num: '02',
    icon: ListPlus,
    title: 'Add Items',
    desc: 'Add products or services and let the totals calculate automatically.',
  },
  {
    num: '03',
    icon: Send,
    title: 'Download & Send',
    desc: 'Download your professional invoice as a PDF or print it instantly.',
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="border-y border-slate-100 bg-slate-50/70 py-16 sm:py-20 dark:border-slate-800/70 dark:bg-slate-900/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-500">
            How It Works
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
            From blank page to sent in three steps
          </h2>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-3 md:gap-6">
          {STEPS.map((s, i) => (
            <div key={s.num} className="relative">
              {i < STEPS.length - 1 ? (
                <div aria-hidden="true" className="absolute left-full top-7 hidden w-6 border-t border-dashed border-slate-300 md:block dark:border-slate-700" />
              ) : null}
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-lg border border-slate-200 bg-white text-blue-600 shadow-sm dark:border-slate-700 dark:bg-slate-950 dark:text-blue-500">
                  <s.icon size={18} strokeWidth={2} />
                </span>
                <span className="text-3xl font-extrabold tracking-tight text-slate-200 dark:text-slate-700">{s.num}</span>
              </div>
              <h3 className="mt-4 text-base font-semibold text-slate-900 dark:text-white">{s.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-500 dark:text-slate-400">{s.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <a
            href="#generator"
            className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
          >
            Start Your Invoice
          </a>
        </div>
      </div>
    </section>
  );
}
