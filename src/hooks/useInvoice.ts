import { useMemo, useState } from 'react';
import type {
  BusinessInfo,
  ClientInfo,
  DiscountType,
  InvoiceData,
  InvoiceItem,
  CurrencyCode,
  TemplateId,
  FontSizeId,
} from '../types';
import {
  blankInvoice,
  blankItem,
  clearDraft,
  computeTotals,
  loadDraft,
  nextInvoiceNumber,
  sampleInvoice,
  saveDraft,
  todayISO,
  addDaysISO,
  uid,
} from '../lib/invoice';

export function useInvoice() {
  const [initialDraft] = useState(() => loadDraft());
  const [data, setData] = useState<InvoiceData>(() => initialDraft?.data ?? sampleInvoice());
  const [draftSavedAt, setDraftSavedAt] = useState<number | null>(initialDraft?.savedAt ?? null);

  const totals = useMemo(() => computeTotals(data), [data]);

  const updateBusiness = (patch: Partial<BusinessInfo>) =>
    setData((d) => ({ ...d, business: { ...d.business, ...patch } }));

  const updateClient = (patch: Partial<ClientInfo>) =>
    setData((d) => ({ ...d, client: { ...d.client, ...patch } }));

  const setField = <K extends keyof InvoiceData>(key: K, value: InvoiceData[K]) =>
    setData((d) => ({ ...d, [key]: value }));

  const addItem = () => setData((d) => ({ ...d, items: [...d.items, blankItem()] }));

  const updateItem = (id: string, patch: Partial<InvoiceItem>) =>
    setData((d) => ({ ...d, items: d.items.map((it) => (it.id === id ? { ...it, ...patch } : it)) }));

  const removeItem = (id: string) =>
    setData((d) => {
      if (d.items.length <= 1) {
        // Keep one blank row so the table never breaks
        return { ...d, items: [{ ...blankItem(), id: d.items[0]?.id ?? uid() }] };
      }
      return { ...d, items: d.items.filter((it) => it.id !== id) };
    });

  /** New invoice: keep business + customization, clear client/items, increment number. */
  const newInvoice = () =>
    setData((d) => ({
      ...d,
      client: { name: '', company: '', email: '', phone: '', address: '' },
      items: [blankItem()],
      discountValue: 0,
      taxRate: 0,
      notes: 'Thank you for your business.',
      paymentTerms: 'Please make payment within 14 days of the issue date.',
      invoiceNumber: nextInvoiceNumber(d.invoiceNumber),
      issueDate: todayISO(),
      dueDate: addDaysISO(14),
    }));

  /** Full reset back to a blank invoice. */
  const resetInvoice = () => setData(blankInvoice());

  const saveDraftNow = (): number => {
    const payload = saveDraft(data);
    setDraftSavedAt(payload.savedAt);
    return payload.savedAt;
  };

  const clearDraftNow = () => {
    clearDraft();
    setDraftSavedAt(null);
  };

  return {
    data,
    totals,
    draftSavedAt,
    updateBusiness,
    updateClient,
    setField,
    addItem,
    updateItem,
    removeItem,
    newInvoice,
    resetInvoice,
    saveDraftNow,
    clearDraftNow,
    setTemplate: (t: TemplateId) => setField('template', t),
    setAccentColor: (c: string) => setField('accentColor', c),
    setFontSize: (s: FontSizeId) => setField('fontSize', s),
    setCurrency: (c: CurrencyCode) => setField('currency', c),
    setDiscountType: (t: DiscountType) => setField('discountType', t),
  };
}

export type InvoiceController = ReturnType<typeof useInvoice>;
