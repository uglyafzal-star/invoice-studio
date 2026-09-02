import { useRef } from 'react';
import {
  Briefcase,
  Calculator,
  FileText,
  ImagePlus,
  ListOrdered,
  StickyNote,
  Trash2,
  Users,
} from 'lucide-react';
import type { InvoiceController } from '../hooks/useInvoice';
import { CURRENCIES, currencySymbol, formatMoney } from '../lib/invoice';
import type { CurrencyCode } from '../types';
import ItemsEditor from './ItemsEditor';
import { Field, NumberInput, SectionCard, SelectInput, TextArea, TextInput } from './ui';

interface Props {
  controller: InvoiceController;
  notify: (text: string, kind?: 'success' | 'error') => void;
}

const parseNum = (raw: string): number => {
  const n = parseFloat(raw);
  return Number.isNaN(n) ? 0 : Math.max(0, n);
};

export default function InvoiceEditor({ controller, notify }: Props) {
  const { data, totals } = controller;
  const fileRef = useRef<HTMLInputElement>(null);

  const handleLogoFile = (file: File | undefined) => {
    if (!file) return;
    const okTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    if (!okTypes.includes(file.type)) {
      notify('Please upload a PNG or JPG image.', 'error');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      notify('Logo must be smaller than 2 MB.', 'error');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      controller.updateBusiness({ logo: String(reader.result) });
      notify('Logo uploaded.');
    };
    reader.onerror = () => notify('Could not read that file.', 'error');
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-5">
      {/* -------------------------- business -------------------------- */}
      <SectionCard icon={Briefcase} title="Business Information" subtitle="Shown in the invoice header">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Business Name">
            <TextInput
              value={data.business.businessName}
              onChange={(e) => controller.updateBusiness({ businessName: e.target.value })}
              placeholder="Acme Studio"
            />
          </Field>
          <Field label="Your Name">
            <TextInput
              value={data.business.name}
              onChange={(e) => controller.updateBusiness({ name: e.target.value })}
              placeholder="Jane Doe"
            />
          </Field>
          <Field label="Email">
            <TextInput
              type="email"
              value={data.business.email}
              onChange={(e) => controller.updateBusiness({ email: e.target.value })}
              placeholder="hello@acme.com"
            />
          </Field>
          <Field label="Phone Number">
            <TextInput
              value={data.business.phone}
              onChange={(e) => controller.updateBusiness({ phone: e.target.value })}
              placeholder="+1 (555) 000-0000"
            />
          </Field>
          <Field label="Business Address" className="sm:col-span-2">
            <TextArea
              rows={2}
              value={data.business.address}
              onChange={(e) => controller.updateBusiness({ address: e.target.value })}
              placeholder={'123 Main Street\nCity, State, ZIP'}
            />
          </Field>
          <Field label="Website">
            <TextInput
              value={data.business.website}
              onChange={(e) => controller.updateBusiness({ website: e.target.value })}
              placeholder="www.acme.com"
            />
          </Field>
          <Field label="Business Logo">
            <input
              ref={fileRef}
              type="file"
              accept="image/png,image/jpeg,.png,.jpg,.jpeg"
              className="hidden"
              onChange={(e) => {
                handleLogoFile(e.target.files?.[0]);
                e.target.value = '';
              }}
            />
            {data.business.logo ? (
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-md border border-slate-200 bg-white p-1 dark:border-slate-700">
                  <img src={data.business.logo} alt="Logo preview" className="max-h-full max-w-full object-contain" />
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="rounded-md border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    Change
                  </button>
                  <button
                    type="button"
                    onClick={() => controller.updateBusiness({ logo: null })}
                    className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 transition-colors hover:bg-red-50 hover:text-red-600 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-red-950/40"
                  >
                    <Trash2 size={13} />
                    Remove
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="flex w-full items-center gap-3 rounded-md border border-dashed border-slate-300 px-3 py-2.5 text-left transition-colors hover:border-blue-400 hover:bg-blue-50/50 dark:border-slate-700 dark:hover:border-blue-500 dark:hover:bg-blue-950/20"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-md bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                  <ImagePlus size={16} />
                </span>
                <span>
                  <span className="block text-sm font-medium text-slate-700 dark:text-slate-200">Upload logo</span>
                  <span className="block text-xs text-slate-400">PNG, JPG or JPEG — up to 2 MB</span>
                </span>
              </button>
            )}
          </Field>
        </div>
      </SectionCard>

      {/* --------------------------- client --------------------------- */}
      <SectionCard icon={Users} title="Bill To" subtitle="Your client's information">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Client Name">
            <TextInput
              value={data.client.name}
              onChange={(e) => controller.updateClient({ name: e.target.value })}
              placeholder="John Smith"
            />
          </Field>
          <Field label="Client Company">
            <TextInput
              value={data.client.company}
              onChange={(e) => controller.updateClient({ company: e.target.value })}
              placeholder="Smith & Sons Ltd."
            />
          </Field>
          <Field label="Client Email">
            <TextInput
              type="email"
              value={data.client.email}
              onChange={(e) => controller.updateClient({ email: e.target.value })}
              placeholder="john@smith.com"
            />
          </Field>
          <Field label="Client Phone">
            <TextInput
              value={data.client.phone}
              onChange={(e) => controller.updateClient({ phone: e.target.value })}
              placeholder="+1 (555) 000-0000"
            />
          </Field>
          <Field label="Client Address" className="sm:col-span-2">
            <TextArea
              rows={2}
              value={data.client.address}
              onChange={(e) => controller.updateClient({ address: e.target.value })}
              placeholder={'456 Oak Avenue\nCity, State, ZIP'}
            />
          </Field>
        </div>
      </SectionCard>

      {/* -------------------------- details --------------------------- */}
      <SectionCard icon={FileText} title="Invoice Details" subtitle="Number, dates and currency">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Invoice Number">
            <TextInput
              value={data.invoiceNumber}
              onChange={(e) => controller.setField('invoiceNumber', e.target.value)}
              placeholder="INV-001"
            />
          </Field>
          <Field label="Currency">
            <SelectInput
              value={data.currency}
              onChange={(e) => controller.setCurrency(e.target.value as CurrencyCode)}
            >
              {CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.label}
                </option>
              ))}
            </SelectInput>
          </Field>
          <Field label="Issue Date">
            <TextInput
              type="date"
              value={data.issueDate}
              onChange={(e) => controller.setField('issueDate', e.target.value)}
            />
          </Field>
          <Field label="Due Date">
            <TextInput
              type="date"
              value={data.dueDate}
              onChange={(e) => controller.setField('dueDate', e.target.value)}
            />
          </Field>
        </div>
      </SectionCard>

      {/* ---------------------------- items ---------------------------- */}
      <SectionCard icon={ListOrdered} title="Invoice Items" subtitle="Amounts are calculated automatically">
        <ItemsEditor
          items={data.items}
          currency={data.currency}
          onAdd={controller.addItem}
          onUpdate={controller.updateItem}
          onRemove={controller.removeItem}
        />
      </SectionCard>

      {/* ------------------------- discount & tax ---------------------- */}
      <SectionCard icon={Calculator} title="Discount & Tax" subtitle="Applied in order: discount, then tax">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Field label="Discount Type">
            <SelectInput
              value={data.discountType}
              onChange={(e) => controller.setDiscountType(e.target.value as 'percentage' | 'fixed')}
            >
              <option value="percentage">Percentage (%)</option>
              <option value="fixed">Fixed Amount</option>
            </SelectInput>
          </Field>
          <Field label="Discount Value">
            <NumberInput
              min={0}
              max={data.discountType === 'percentage' ? 100 : undefined}
              step="0.01"
              value={data.discountValue === 0 ? '' : data.discountValue}
              onChange={(e) =>
                controller.setField(
                  'discountValue',
                  data.discountType === 'percentage' ? Math.min(100, parseNum(e.target.value)) : parseNum(e.target.value),
                )
              }
              placeholder="0"
              suffix={data.discountType === 'percentage' ? '%' : currencySymbol(data.currency).trim()}
            />
          </Field>
          <Field label="Tax Rate">
            <NumberInput
              min={0}
              max={100}
              step="0.01"
              value={data.taxRate === 0 ? '' : data.taxRate}
              onChange={(e) => controller.setField('taxRate', Math.min(100, parseNum(e.target.value)))}
              placeholder="0"
              suffix="%"
            />
          </Field>
        </div>

        <div className="mt-5 rounded-md border border-slate-200 bg-slate-50 px-4 py-3.5 dark:border-slate-800 dark:bg-slate-900/60">
          <dl className="space-y-1.5 text-sm">
            <div className="flex justify-between">
              <dt className="text-slate-500 dark:text-slate-400">Subtotal</dt>
              <dd className="font-medium text-slate-800 dark:text-slate-100">{formatMoney(totals.subtotal, data.currency)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500 dark:text-slate-400">
                Discount{data.discountType === 'percentage' && data.discountValue > 0 ? ` (${data.discountValue}%)` : ''}
              </dt>
              <dd className="font-medium text-slate-800 dark:text-slate-100">− {formatMoney(totals.discountAmount, data.currency)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500 dark:text-slate-400">Tax{data.taxRate > 0 ? ` (${data.taxRate}%)` : ''}</dt>
              <dd className="font-medium text-slate-800 dark:text-slate-100">{formatMoney(totals.taxAmount, data.currency)}</dd>
            </div>
            <div className="mt-2 flex justify-between border-t border-slate-200 pt-2.5 dark:border-slate-700">
              <dt className="font-semibold text-slate-900 dark:text-white">Total</dt>
              <dd className="text-base font-bold" style={{ color: data.accentColor }}>
                {formatMoney(totals.total, data.currency)}
              </dd>
            </div>
          </dl>
        </div>
      </SectionCard>

      {/* ------------------------- notes & terms ----------------------- */}
      <SectionCard icon={StickyNote} title="Notes & Payment Terms" subtitle="Optional — shown at the bottom of the invoice">
        <div className="grid grid-cols-1 gap-4">
          <Field label="Notes">
            <TextArea
              rows={3}
              value={data.notes}
              onChange={(e) => controller.setField('notes', e.target.value)}
              placeholder="Thank you for your business."
            />
          </Field>
          <Field label="Payment Terms">
            <TextArea
              rows={3}
              value={data.paymentTerms}
              onChange={(e) => controller.setField('paymentTerms', e.target.value)}
              placeholder="Please make payment within 7 days."
            />
          </Field>
        </div>
      </SectionCard>
    </div>
  );
}
