import type { CurrencyCode, FontSizeId, InvoiceData, InvoiceItem, Totals } from '../types';

/* ------------------------------ helpers ------------------------------ */

export const uid = (): string =>
  Math.random().toString(36).slice(2, 9) + Date.now().toString(36).slice(-4);

export const round2 = (n: number): number => Math.round((n + Number.EPSILON) * 100) / 100;

export const clamp = (n: number, min: number, max: number): number =>
  Math.min(Math.max(n, min), max);

/* ------------------------------ currencies --------------------------- */

export const CURRENCIES: { code: CurrencyCode; label: string; symbol: string }[] = [
  { code: 'USD', label: 'USD ($)', symbol: '$' },
  { code: 'PKR', label: 'PKR (Rs)', symbol: 'Rs ' },
  { code: 'GBP', label: 'GBP (£)', symbol: '£' },
  { code: 'EUR', label: 'EUR (€)', symbol: '€' },
  { code: 'AED', label: 'AED (د.إ)', symbol: 'AED ' },
  { code: 'INR', label: 'INR (₹)', symbol: '₹' },
];

export const currencySymbol = (code: CurrencyCode): string =>
  CURRENCIES.find((c) => c.code === code)?.symbol ?? '$';

export function formatMoney(amount: number, code: CurrencyCode): string {
  const sym = currencySymbol(code);
  const str = round2(Math.abs(amount)).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `${amount < 0 ? '-' : ''}${sym}${str}`;
}

/* ---------------------------- customization -------------------------- */

export const ACCENT_COLORS: { name: string; value: string }[] = [
  { name: 'Blue', value: '#2563EB' },
  { name: 'Navy', value: '#1E3A8A' },
  { name: 'Slate', value: '#475569' },
  { name: 'Teal', value: '#0F766E' },
  { name: 'Green', value: '#15803D' },
  { name: 'Crimson', value: '#B91C1C' },
  { name: 'Charcoal', value: '#111827' },
];

export const FONT_SCALE: Record<FontSizeId, number> = {
  small: 0.92,
  medium: 1,
  large: 1.12,
};

/* -------------------------------- dates ------------------------------ */

const toISO = (d: Date): string =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

export const todayISO = (): string => toISO(new Date());

export function addDaysISO(days: number, from?: string): string {
  const base = from ? new Date(`${from}T00:00:00`) : new Date();
  if (Number.isNaN(base.getTime())) return todayISO();
  base.setDate(base.getDate() + days);
  return toISO(base);
}

export function formatDate(iso?: string): string {
  if (!iso) return '';
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

/* ---------------------------- calculations --------------------------- */

export const blankItem = (): InvoiceItem => ({ id: uid(), description: '', quantity: 1, rate: 0 });

export const itemAmount = (item: InvoiceItem): number => round2(item.quantity * item.rate);

export function computeTotals(d: InvoiceData): Totals {
  const subtotal = round2(d.items.reduce((s, i) => s + i.quantity * i.rate, 0));
  const discountValue = Math.max(0, d.discountValue || 0);
  const discountAmount =
    d.discountType === 'percentage'
      ? round2(subtotal * (clamp(discountValue, 0, 100) / 100))
      : round2(clamp(discountValue, 0, subtotal));
  const taxable = round2(subtotal - discountAmount);
  const taxAmount = round2(taxable * (clamp(Math.max(0, d.taxRate || 0), 0, 100) / 100));
  return { subtotal, discountAmount, taxAmount, total: round2(taxable + taxAmount) };
}

/* ------------------------------ defaults ----------------------------- */

export function blankInvoice(): InvoiceData {
  return {
    business: { businessName: '', name: '', email: '', phone: '', address: '', website: '', logo: null },
    client: { name: '', company: '', email: '', phone: '', address: '' },
    invoiceNumber: 'INV-001',
    issueDate: todayISO(),
    dueDate: addDaysISO(14),
    currency: 'USD',
    items: [blankItem()],
    discountType: 'percentage',
    discountValue: 0,
    taxRate: 0,
    notes: '',
    paymentTerms: '',
    template: 'modern',
    accentColor: '#2563EB',
    fontSize: 'medium',
  };
}

export function sampleInvoice(): InvoiceData {
  return {
    ...blankInvoice(),
    business: {
      businessName: 'Northwind Studio',
      name: 'Alex Morgan',
      email: 'hello@northwindstudio.com',
      phone: '+1 (555) 013-2048',
      address: '215 Harbor Lane, Suite 4\nPortland, OR 97205',
      website: 'northwindstudio.com',
      logo: null,
    },
    client: {
      name: 'Sarah Chen',
      company: 'Bloom & Co.',
      email: 'sarah@bloomandco.com',
      phone: '+1 (555) 908-1123',
      address: '48 Juniper Street\nSan Francisco, CA 94110',
    },
    items: [
      { id: uid(), description: 'Brand identity design', quantity: 1, rate: 1200 },
      { id: uid(), description: 'Website design & development', quantity: 1, rate: 2400 },
      { id: uid(), description: 'Monthly maintenance', quantity: 3, rate: 150 },
    ],
    discountType: 'percentage',
    discountValue: 5,
    taxRate: 10,
    notes: 'Thank you for your business.',
    paymentTerms: 'Please make payment within 14 days of the issue date.',
  };
}

export function nextInvoiceNumber(current: string): string {
  const m = current.trim().match(/^(.*?)(\d+)$/);
  if (!m) return `${current.trim() || 'INV'}-001`;
  const num = parseInt(m[2], 10) + 1;
  return `${m[1]}${String(num).padStart(m[2].length, '0')}`;
}

/* ----------------------------- local draft --------------------------- */

export const DRAFT_KEY = 'invoice-studio:draft:v1';

export interface DraftPayload {
  savedAt: number;
  data: InvoiceData;
}

export function loadDraft(): DraftPayload | null {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as DraftPayload;
    if (!parsed || typeof parsed !== 'object' || !parsed.data || !parsed.data.business) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveDraft(data: InvoiceData): DraftPayload {
  const payload: DraftPayload = { savedAt: Date.now(), data };
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(payload));
  } catch {
    /* storage full or unavailable — ignore */
  }
  return payload;
}

export function clearDraft(): void {
  try {
    localStorage.removeItem(DRAFT_KEY);
  } catch {
    /* ignore */
  }
}
