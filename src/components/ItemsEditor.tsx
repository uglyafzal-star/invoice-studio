import { Plus, Trash2 } from 'lucide-react';
import type { CurrencyCode, InvoiceItem } from '../types';
import { currencySymbol, formatMoney, itemAmount } from '../lib/invoice';
import { NumberInput, TextInput } from './ui';

interface Props {
  items: InvoiceItem[];
  currency: CurrencyCode;
  onAdd: () => void;
  onUpdate: (id: string, patch: Partial<InvoiceItem>) => void;
  onRemove: (id: string) => void;
}

function parseNum(raw: string): number {
  const n = parseFloat(raw);
  return Number.isNaN(n) ? 0 : Math.max(0, n);
}

export default function ItemsEditor({ items, currency, onAdd, onUpdate, onRemove }: Props) {
  const sym = currencySymbol(currency).trim();

  return (
    <div>
      {/* ------- desktop table ------- */}
      <div className="hidden md:block">
        <div className="mb-2 grid grid-cols-[minmax(0,1fr)_80px_120px_116px_36px] gap-2 px-1">
          {['Item / Description', 'Quantity', 'Rate', 'Amount', ''].map((h, i) => (
            <span
              key={h || 'actions'}
              className={`text-[11px] font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500 ${
                i >= 2 ? 'text-right' : ''
              }`}
            >
              {h}
            </span>
          ))}
        </div>
        <div className="space-y-2">
          {items.map((item) => (
            <div key={item.id} className="grid grid-cols-[minmax(0,1fr)_80px_120px_116px_36px] items-center gap-2">
              <TextInput
                value={item.description}
                onChange={(e) => onUpdate(item.id, { description: e.target.value })}
                placeholder="e.g. Website design"
                aria-label="Item description"
              />
              <NumberInput
                min={0}
                step="1"
                value={item.quantity === 0 ? '' : item.quantity}
                onChange={(e) => onUpdate(item.id, { quantity: parseNum(e.target.value) })}
                placeholder="0"
                aria-label="Quantity"
              />
              <NumberInput
                min={0}
                step="0.01"
                value={item.rate === 0 ? '' : item.rate}
                onChange={(e) => onUpdate(item.id, { rate: parseNum(e.target.value) })}
                placeholder="0.00"
                suffix={sym}
                aria-label="Rate"
              />
              <div className="rounded-md border border-slate-100 bg-slate-50 px-3 py-2.5 text-right text-sm font-medium text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
                {formatMoney(itemAmount(item), currency)}
              </div>
              <button
                type="button"
                onClick={() => onRemove(item.id)}
                title="Remove item"
                aria-label="Remove item"
                className="flex h-9 w-9 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/40"
              >
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ------- mobile cards ------- */}
      <div className="space-y-3 md:hidden">
        {items.map((item, index) => (
          <div
            key={item.id}
            className="rounded-md border border-slate-200 bg-slate-50/60 p-3 dark:border-slate-800 dark:bg-slate-900/50"
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                Item {index + 1}
              </span>
              <button
                type="button"
                onClick={() => onRemove(item.id)}
                title="Remove item"
                aria-label="Remove item"
                className="flex h-8 w-8 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/40"
              >
                <Trash2 size={15} />
              </button>
            </div>
            <TextInput
              value={item.description}
              onChange={(e) => onUpdate(item.id, { description: e.target.value })}
              placeholder="Item / Description"
              aria-label="Item description"
            />
            <div className="mt-2 grid grid-cols-2 gap-2">
              <div>
                <span className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-slate-400">
                  Quantity
                </span>
                <NumberInput
                  min={0}
                  step="1"
                  value={item.quantity === 0 ? '' : item.quantity}
                  onChange={(e) => onUpdate(item.id, { quantity: parseNum(e.target.value) })}
                  placeholder="0"
                />
              </div>
              <div>
                <span className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-slate-400">
                  Rate
                </span>
                <NumberInput
                  min={0}
                  step="0.01"
                  value={item.rate === 0 ? '' : item.rate}
                  onChange={(e) => onUpdate(item.id, { rate: parseNum(e.target.value) })}
                  placeholder="0.00"
                  suffix={sym}
                />
              </div>
            </div>
            <div className="mt-2 flex items-center justify-between rounded-md border border-slate-100 bg-white px-3 py-2 dark:border-slate-800 dark:bg-slate-950">
              <span className="text-[11px] font-medium uppercase tracking-wide text-slate-400">Amount</span>
              <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                {formatMoney(itemAmount(item), currency)}
              </span>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={onAdd}
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-md border border-dashed border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:border-blue-400 hover:bg-blue-50/60 hover:text-blue-600 dark:border-slate-700 dark:text-slate-300 dark:hover:border-blue-500 dark:hover:bg-blue-950/30 dark:hover:text-blue-400"
      >
        <Plus size={15} />
        Add Item
      </button>
    </div>
  );
}
