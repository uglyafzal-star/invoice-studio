import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  Check,
  Eye,
  FileDown,
  FilePlus2,
  Loader2,
  Lock,
  Palette,
  Printer,
  RotateCcw,
  Save,
  SlidersHorizontal,
  Trash2,
} from 'lucide-react';
import { useInvoice } from '../hooks/useInvoice';
import { ACCENT_COLORS } from '../lib/invoice';
import { downloadElementAsPdf } from '../lib/pdf';
import type { FontSizeId, InvoiceData, TemplateId, Totals } from '../types';
import InvoiceDocument from './InvoiceDocument';
import InvoiceEditor from './InvoiceEditor';
import ConfirmDialog from './ConfirmDialog';
import ToastStack, { type ToastMsg } from './Toast';
import { btnPrimary, btnSecondary } from './ui';

/* ------------------------- scaled live preview ------------------------ */

function ScaledPreview({ data, totals }: { data: InvoiceData; totals: Totals }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const docRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.68);
  const [docH, setDocH] = useState(1122);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const ro = new ResizeObserver(() => {
      const w = wrap.clientWidth;
      if (w > 0) setScale(Math.min(1, w / 794));
      if (docRef.current) setDocH(docRef.current.offsetHeight);
    });
    ro.observe(wrap);
    if (docRef.current) ro.observe(docRef.current);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={wrapRef} className="w-full overflow-hidden" style={{ height: Math.round(docH * scale) }}>
      <div
        ref={docRef}
        style={{ width: 794, transform: `scale(${scale})`, transformOrigin: 'top left' }}
      >
        <InvoiceDocument data={data} totals={totals} variant="preview" />
      </div>
    </div>
  );
}

/* --------------------------- template motif --------------------------- */

function TemplateMotif({ id, accent }: { id: TemplateId; accent: string }) {
  const line = 'h-1 rounded-full bg-slate-200 dark:bg-slate-700';
  if (id === 'modern') {
    return (
      <div className="w-full overflow-hidden rounded-sm border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
        <div className="h-1.5 w-full" style={{ backgroundColor: accent }} />
        <div className="space-y-1 p-1.5">
          <div className={line} style={{ width: '55%' }} />
          <div className={line} style={{ width: '80%' }} />
          <div className={line} style={{ width: '40%' }} />
        </div>
      </div>
    );
  }
  if (id === 'classic') {
    return (
      <div className="flex w-full flex-col items-center justify-center gap-1 rounded-sm border border-slate-200 bg-white p-1.5 dark:border-slate-700 dark:bg-slate-900">
        <div className="h-1.5 w-1/2 rounded-full bg-slate-300 dark:bg-slate-600" />
        <div className="h-px w-full bg-slate-300 dark:bg-slate-600" />
        <div className={line} style={{ width: '80%' }} />
        <div className={line} style={{ width: '65%' }} />
      </div>
    );
  }
  return (
    <div className="w-full rounded-sm border border-slate-200 bg-white p-1.5 dark:border-slate-700 dark:bg-slate-900">
      <div className="flex justify-between">
        <div className="h-1.5 w-1/3 rounded-full bg-slate-800 dark:bg-slate-300" />
        <div className="h-1.5 w-1/6 rounded-full bg-slate-300 dark:bg-slate-600" />
      </div>
      <div className="mt-1.5 space-y-1">
        <div className={line} style={{ width: '90%' }} />
        <div className={line} style={{ width: '70%' }} />
      </div>
    </div>
  );
}

const TEMPLATES: { id: TemplateId; label: string; desc: string }[] = [
  { id: 'minimal', label: 'Minimal', desc: 'Clean and understated' },
  { id: 'modern', label: 'Modern', desc: 'Accent-driven layout' },
  { id: 'classic', label: 'Classic', desc: 'Traditional serif style' },
];

const FONT_OPTIONS: { id: FontSizeId; label: string }[] = [
  { id: 'small', label: 'Small' },
  { id: 'medium', label: 'Medium' },
  { id: 'large', label: 'Large' },
];

/* ------------------------------ generator ----------------------------- */

export default function Generator() {
  const controller = useInvoice();
  const { data, totals } = controller;

  const [toasts, setToasts] = useState<ToastMsg[]>([]);
  const [confirm, setConfirm] = useState<null | 'reset' | 'clearDraft'>(null);
  const [generating, setGenerating] = useState(false);

  const notify = useCallback((text: string, kind: 'success' | 'error' = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t.slice(-2), { id, text, kind }]);
    window.setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2800);
  }, []);

  const handleDownload = useCallback(async () => {
    if (generating) return;
    const el = document.getElementById('invoice-pdf-target') as HTMLElement | null;
    if (!el) {
      notify('Invoice preview is not ready yet.', 'error');
      return;
    }
    setGenerating(true);
    try {
      await document.fonts.ready;
      await new Promise((r) => setTimeout(r, 80));
      const base = (data.invoiceNumber || 'invoice').trim().replace(/[\\/:*?"<>|\s]+/g, '-') || 'invoice';
      await downloadElementAsPdf(el, `${base}.pdf`);
      notify('PDF downloaded.');
    } catch (err) {
      console.error(err);
      notify('PDF generation failed. Please try again.', 'error');
    } finally {
      setGenerating(false);
    }
  }, [generating, data.invoiceNumber, notify]);

  const handlePrint = useCallback(() => window.print(), []);

  const handleSaveDraft = () => {
    controller.saveDraftNow();
    notify('Draft saved in this browser.');
  };

  const handleNewInvoice = () => {
    controller.newInvoice();
    notify('New invoice created.');
  };

  return (
    <section id="generator" className="border-y border-slate-100 bg-slate-50/70 py-14 sm:py-16 dark:border-slate-800/70 dark:bg-slate-900/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-500">
            Invoice Generator
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
            Create your invoice
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600 sm:text-base dark:text-slate-400">
            Fill in the details below and watch the preview update instantly. Download as a PDF or print
            when you are ready — no account needed.
          </p>
        </div>

        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,7fr)_minmax(0,6fr)]">
          {/* left: editor */}
          <InvoiceEditor controller={controller} notify={notify} />

          {/* right: actions, customize, preview */}
          <div className="space-y-5">
            {/* actions */}
            <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950">
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                <button type="button" onClick={handleDownload} disabled={generating} className={btnPrimary}>
                  {generating ? <Loader2 size={16} className="animate-spin" /> : <FileDown size={16} />}
                  {generating ? 'Preparing PDF…' : 'Download PDF'}
                </button>
                <button type="button" onClick={handlePrint} className={btnSecondary}>
                  <Printer size={16} />
                  Print Invoice
                </button>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-1 border-t border-slate-100 pt-3 dark:border-slate-800/70">
                <button type="button" onClick={handleSaveDraft} className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-2 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white">
                  <Save size={14} />
                  Save Draft
                </button>
                <button type="button" onClick={handleNewInvoice} className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-2 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white">
                  <FilePlus2 size={14} />
                  New Invoice
                </button>
                <button type="button" onClick={() => setConfirm('reset')} className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-2 text-xs font-medium text-slate-600 transition-colors hover:bg-red-50 hover:text-red-600 dark:text-slate-300 dark:hover:bg-red-950/40 dark:hover:text-red-400">
                  <RotateCcw size={14} />
                  Reset
                </button>
                {controller.draftSavedAt !== null ? (
                  <button type="button" onClick={() => setConfirm('clearDraft')} className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-2 text-xs font-medium text-slate-600 transition-colors hover:bg-red-50 hover:text-red-600 dark:text-slate-300 dark:hover:bg-red-950/40 dark:hover:text-red-400">
                    <Trash2 size={14} />
                    Clear Draft
                  </button>
                ) : null}
              </div>
              <p className="mt-3 flex items-start gap-1.5 text-xs leading-relaxed text-slate-400 dark:text-slate-500">
                <Lock size={12} className="mt-0.5 shrink-0" />
                Drafts are stored only in your browser, never on a server.
                {controller.draftSavedAt !== null
                  ? ` Last saved ${new Date(controller.draftSavedAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}.`
                  : ''}
              </p>
            </div>

            {/* customize */}
            <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950">
              <div className="mb-3 flex items-center gap-2">
                <SlidersHorizontal size={14} className="text-slate-400" />
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Customize</h3>
              </div>

              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Template
              </p>
              <div className="grid grid-cols-3 gap-2">
                {TEMPLATES.map((t) => {
                  const active = data.template === t.id;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => controller.setTemplate(t.id)}
                      title={t.desc}
                      className={`rounded-md border p-2 text-left transition-colors ${
                        active
                          ? 'border-blue-600 ring-2 ring-blue-600/20 dark:border-blue-500 dark:ring-blue-500/20'
                          : 'border-slate-200 hover:border-slate-300 dark:border-slate-700 dark:hover:border-slate-600'
                      }`}
                    >
                      <TemplateMotif id={t.id} accent={data.accentColor} />
                      <span className={`mt-1.5 block text-center text-xs font-medium ${active ? 'text-blue-600 dark:text-blue-400' : 'text-slate-600 dark:text-slate-300'}`}>
                        {t.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              <p className="mb-2 mt-4 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                <Palette size={12} />
                Accent Color
              </p>
              <div className="flex flex-wrap gap-2">
                {ACCENT_COLORS.map((c) => {
                  const active = data.accentColor.toLowerCase() === c.value.toLowerCase();
                  return (
                    <button
                      key={c.value}
                      type="button"
                      title={c.name}
                      aria-label={`Accent color ${c.name}`}
                      onClick={() => controller.setAccentColor(c.value)}
                      className={`flex h-7 w-7 items-center justify-center rounded-full transition-transform hover:scale-110 ${
                        active ? 'ring-2 ring-slate-900/30 ring-offset-2 ring-offset-white dark:ring-slate-100/40 dark:ring-offset-slate-950' : ''
                      }`}
                      style={{ backgroundColor: c.value }}
                    >
                      {active ? <Check size={13} color="#ffffff" strokeWidth={3} /> : null}
                    </button>
                  );
                })}
              </div>

              <p className="mb-2 mt-4 text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Font Size
              </p>
              <div className="inline-flex rounded-md border border-slate-200 p-0.5 dark:border-slate-700">
                {FONT_OPTIONS.map((f) => {
                  const active = data.fontSize === f.id;
                  return (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => controller.setFontSize(f.id)}
                      className={`rounded px-3.5 py-1.5 text-xs font-medium transition-colors ${
                        active
                          ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                          : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                      }`}
                    >
                      {f.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* preview */}
            <div className="rounded-lg border border-slate-200 bg-slate-100/70 p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
              <div className="mb-3 flex items-center justify-between px-1 pt-1">
                <span className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
                  <Eye size={15} className="text-slate-400" />
                  Live Preview
                </span>
                <span className="rounded-full border border-slate-200 bg-white px-2.5 py-0.5 text-[11px] font-medium capitalize text-slate-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-400">
                  {data.template} · A4
                </span>
              </div>
              <ScaledPreview data={data} totals={totals} />
            </div>
          </div>
        </div>
      </div>

      {/* mobile sticky action bar */}
      <div
        className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white p-3 lg:hidden dark:border-slate-800 dark:bg-slate-950"
        style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
      >
        <div className="mx-auto flex max-w-7xl gap-2.5">
          <button type="button" onClick={handleDownload} disabled={generating} className={`${btnPrimary} flex-1`}>
            {generating ? <Loader2 size={16} className="animate-spin" /> : <FileDown size={16} />}
            Download PDF
          </button>
          <button type="button" onClick={handlePrint} className={btnSecondary}>
            <Printer size={16} />
            Print
          </button>
        </div>
      </div>

      {/* pdf generating overlay */}
      {generating ? (
        <div className="fixed inset-0 z-[85] flex items-center justify-center bg-slate-900/45 p-4">
          <div className="flex items-center gap-3 rounded-lg bg-white px-6 py-5 shadow-xl dark:bg-slate-950">
            <Loader2 size={20} className="animate-spin text-blue-600" />
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">Generating your PDF…</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">High-quality A4 export, just a moment.</p>
            </div>
          </div>
        </div>
      ) : null}

      {/* confirmations */}
      <ConfirmDialog
        open={confirm === 'reset'}
        title="Reset invoice?"
        message="This clears every field — business, client, items, notes and customization — back to a blank invoice. This cannot be undone. Your saved draft stays untouched."
        confirmLabel="Reset Invoice"
        onCancel={() => setConfirm(null)}
        onConfirm={() => {
          controller.resetInvoice();
          setConfirm(null);
          notify('Invoice reset.');
        }}
      />
      <ConfirmDialog
        open={confirm === 'clearDraft'}
        title="Clear saved draft?"
        message="This removes the draft currently stored in this browser. The invoice you are editing right now will not change."
        confirmLabel="Clear Draft"
        onCancel={() => setConfirm(null)}
        onConfirm={() => {
          controller.clearDraftNow();
          setConfirm(null);
          notify('Saved draft cleared.');
        }}
      />

      {/* toasts */}
      <ToastStack toasts={toasts} />

      {/* print + pdf render targets (outside #root so print CSS can isolate them) */}
      {createPortal(
        <>
          <div className="print-root" aria-hidden="true">
            <InvoiceDocument data={data} totals={totals} variant="print" />
          </div>
          <div className="pdf-root" style={{ position: 'fixed', left: -20000, top: 0 }} aria-hidden="true">
            <div id="invoice-pdf-target" style={{ width: 794 }}>
              <InvoiceDocument data={data} totals={totals} variant="pdf" />
            </div>
          </div>
        </>,
        document.body,
      )}
    </section>
  );
}
