import {
  Calculator,
  Eye,
  FileDown,
  Globe,
  LayoutTemplate,
  Palette,
  Printer,
  Zap,
  type LucideIcon,
} from 'lucide-react';

interface Feature {
  icon: LucideIcon;
  title: string;
  desc: string;
}

const FEATURES: Feature[] = [
  { icon: LayoutTemplate, title: 'Professional Templates', desc: 'Three clean, business-ready invoice layouts.' },
  { icon: Eye, title: 'Real-Time Preview', desc: 'Every edit updates the invoice instantly.' },
  { icon: Calculator, title: 'Automatic Calculations', desc: 'Totals, discounts, and taxes handled for you.' },
  { icon: FileDown, title: 'PDF Downloads', desc: 'High-quality, A4-optimized PDF exports.' },
  { icon: Printer, title: 'Print Ready', desc: 'Clean print output with no page clutter.' },
  { icon: Globe, title: 'Multiple Currencies', desc: 'USD, PKR, GBP, EUR, AED, and INR supported.' },
  { icon: Palette, title: 'Custom Branding', desc: 'Add your logo, accent color, and font size.' },
  { icon: Zap, title: 'No Signup Required', desc: 'Open the tool and start invoicing right away.' },
];

export default function Features() {
  return (
    <section id="features" className="bg-white py-16 sm:py-20 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-500">Features</p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
            Everything you need, nothing you don't
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base dark:text-slate-400">
            A focused set of tools designed to get a polished invoice out the door as fast as possible.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="group rounded-lg border border-slate-200 bg-white p-5 transition-colors hover:border-slate-300 hover:bg-slate-50/60 dark:border-slate-800 dark:bg-slate-900/40 dark:hover:border-slate-700 dark:hover:bg-slate-900"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 bg-slate-50 text-blue-600 transition-colors group-hover:border-blue-200 group-hover:bg-blue-50 dark:border-slate-700 dark:bg-slate-900 dark:text-blue-500 dark:group-hover:border-blue-900 dark:group-hover:bg-blue-950/50">
                <f.icon size={16} strokeWidth={2} />
              </span>
              <h3 className="mt-3.5 text-sm font-semibold text-slate-900 dark:text-white">{f.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-slate-500 dark:text-slate-400">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
