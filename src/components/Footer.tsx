import { useState } from 'react';
import { FileText, Lock } from 'lucide-react';
import Modal from './Modal';

type Legal = 'privacy' | 'terms' | null;

const LEGAL_CONTENT: Record<Exclude<Legal, null>, { title: string; body: string[] }> = {
  privacy: {
    title: 'Privacy Policy',
    body: [
      'Invoice Studio runs entirely in your web browser. Your invoice data — business details, client information, items, and logo — is never transmitted to, or stored on, any server.',
      'If you use Save Draft, the invoice is stored only in your own browser\u2019s local storage on your device. You can remove it at any time with the Clear Draft button or by clearing your browser data.',
      'We collect no personal information, use no analytics trackers, and set no advertising cookies.',
    ],
  },
  terms: {
    title: 'Terms of Use',
    body: [
      'Invoice Studio is provided free of charge for personal and commercial use. You may create, download, print, and send as many invoices as you like.',
      'Invoices you generate are yours. You are responsible for the accuracy of the information and figures they contain.',
      'The service is provided \u201cas is\u201d without warranties of any kind. Because data lives only in your browser, clearing your browser storage will permanently remove saved drafts.',
    ],
  },
};

export default function Footer() {
  const [legal, setLegal] = useState<Legal>(null);

  const scrollLinks = [
    { label: 'Features', href: '#features' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'FAQ', href: '#faq' },
    { label: 'Create Invoice', href: '#generator' },
  ];

  return (
    <footer className="border-t border-slate-100 bg-white pb-24 pt-12 lg:pb-8 dark:border-slate-800/70 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)_minmax(0,1fr)]">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-600 text-white">
                <FileText size={16} strokeWidth={2.2} />
              </span>
              <span className="text-[15px] font-semibold tracking-tight text-slate-900 dark:text-white">
                Invoice Studio
              </span>
            </div>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              Create professional invoices in seconds. Free, simple, and no signup required.
            </p>
            <p className="mt-4 flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500">
              <Lock size={12} />
              Your data stays in your browser — always.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
              Product
            </h4>
            <ul className="mt-3 space-y-2">
              {scrollLinks.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    className="text-sm text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
              Legal
            </h4>
            <ul className="mt-3 space-y-2">
              <li>
                <button
                  type="button"
                  onClick={() => setLegal('privacy')}
                  className="text-sm text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
                >
                  Privacy
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setLegal('terms')}
                  className="text-sm text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
                >
                  Terms
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-2 border-t border-slate-100 pt-6 sm:flex-row dark:border-slate-800/70">
          <p className="text-xs text-slate-400 dark:text-slate-500">
            © 2026 Invoice Studio. All rights reserved.
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-500">Made for freelancers and small businesses.</p>
        </div>
      </div>

      <Modal open={legal !== null} onClose={() => setLegal(null)} title={legal ? LEGAL_CONTENT[legal].title : ''}>
        <div className="space-y-3">
          {legal
            ? LEGAL_CONTENT[legal].body.map((p) => (
                <p key={p.slice(0, 24)} className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  {p}
                </p>
              ))
            : null}
        </div>
      </Modal>
    </footer>
  );
}
