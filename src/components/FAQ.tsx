import { useState } from 'react';
import { Plus } from 'lucide-react';

const FAQS: { q: string; a: string }[] = [
  {
    q: 'Is Invoice Studio free?',
    a: 'Yes — completely free. Create, customize, download, and print as many invoices as you like. There are no hidden charges, trials, or locked features.',
  },
  {
    q: 'Do I need to create an account?',
    a: 'No. Invoice Studio works instantly in your browser with no signup, no email, and no password — ever.',
  },
  {
    q: 'Can I download invoices as PDFs?',
    a: 'Yes. One click generates a high-quality, A4-optimized PDF that preserves your exact layout, template, colors, and logo.',
  },
  {
    q: 'Can I add my business logo?',
    a: 'Absolutely. Upload a PNG, JPG, or JPEG (up to 2 MB) and it will appear in the header of your invoice, in the preview, PDF, and print output.',
  },
  {
    q: 'Are my invoices stored online?',
    a: 'No. Everything runs entirely in your browser. Nothing is uploaded to any server, and the optional draft is saved only in your own browser\u2019s local storage.',
  },
  {
    q: 'Can I use different currencies?',
    a: 'Yes. Invoice Studio supports USD ($), PKR (Rs), GBP (£), EUR (€), AED, and INR (₹) — switch anytime and amounts update instantly.',
  },
  {
    q: 'Can I print my invoice?',
    a: 'Yes. The Print button produces a clean, print-ready A4 invoice with no website UI, navigation, or buttons included.',
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="bg-white py-16 sm:py-20 dark:bg-slate-950">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-500">FAQ</p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
            Frequently asked questions
          </h2>
        </div>

        <div className="mt-10 rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/40">
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            const last = i === FAQS.length - 1;
            return (
              <div key={f.q} className={last ? '' : 'border-b border-slate-100 dark:border-slate-800/70'}>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-slate-50/70 dark:hover:bg-slate-900/70"
                >
                  <span className="text-sm font-medium text-slate-900 dark:text-white">{f.q}</span>
                  <Plus
                    size={16}
                    className={`shrink-0 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-45' : ''}`}
                  />
                </button>
                <div
                  className={`grid transition-all duration-200 ease-out ${
                    isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-5 pb-5 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{f.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
