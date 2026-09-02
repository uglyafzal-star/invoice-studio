import type { CSSProperties, ReactNode } from 'react';
import type { InvoiceData, Totals } from '../types';
import { FONT_SCALE, formatDate, formatMoney, itemAmount } from '../lib/invoice';

interface Props {
  data: InvoiceData;
  totals: Totals;
  variant?: 'preview' | 'print' | 'pdf';
}

const DOC_WIDTH = 794; // A4 width at 96dpi
const PLACEHOLDER = '#a8b0bc';
const INK = '#111827';
const GRAY = '#6b7280';
const LIGHT = '#e5e7eb';

const Ph = ({ text }: { text: string }) => <span style={{ color: PLACEHOLDER }}>{text}</span>;

const val = (v: string, fallback: string): ReactNode =>
  v.trim() ? v : <Ph text={fallback} />;

export default function InvoiceDocument({ data, totals, variant = 'preview' }: Props) {
  const { business: b, client: c, template, accentColor: accent, currency } = data;
  const scale = FONT_SCALE[data.fontSize] ?? 1;
  const fs = (n: number) => Math.round(n * scale * 10) / 10;
  const money = (n: number) => formatMoney(n, currency);

  const isModern = template === 'modern';
  const isClassic = template === 'classic';

  const serif = "'Source Serif 4', Georgia, 'Times New Roman', serif";
  const sans = "'Inter', -apple-system, 'Segoe UI', Roboto, sans-serif";
  const fontFamily = isClassic ? serif : sans;

  const docStyle: CSSProperties = {
    width: DOC_WIDTH,
    minHeight: variant === 'preview' ? 1122 : undefined,
    backgroundColor: '#ffffff',
    color: INK,
    fontFamily,
    fontSize: fs(13),
    lineHeight: 1.5,
    position: 'relative',
    boxSizing: 'border-box',
    ...(variant === 'preview'
      ? {
          boxShadow: '0 1px 2px rgba(15, 23, 42, 0.05), 0 16px 40px rgba(15, 23, 42, 0.10)',
          border: '1px solid #e5e7eb',
          borderRadius: 4,
        }
      : {}),
    ...(variant === 'print'
      ? ({ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' } as CSSProperties)
      : {}),
  };

  const pad = variant === 'pdf' ? 44 : 48;

  /* ------------------------------ header blocks ------------------------------ */

  const businessBlock = (align: 'left' | 'center' | 'right' = 'left') => (
    <div style={{ textAlign: align }}>
      {b.logo ? (
        // eslint-disable-next-line jsx-a11y/alt-text
        <img
          src={b.logo}
          alt="Business logo"
          style={{
            maxHeight: isClassic ? 52 : 56,
            maxWidth: 180,
            objectFit: 'contain',
            marginBottom: 10,
            marginLeft: align === 'center' ? 'auto' : undefined,
            marginRight: align === 'center' ? 'auto' : undefined,
            display: align === 'center' ? 'block' : 'inline-block',
          }}
        />
      ) : null}
      <div
        style={{
          fontSize: fs(isClassic ? 21 : 19),
          fontWeight: 700,
          color: INK,
          letterSpacing: isClassic ? '0.02em' : '-0.01em',
        }}
      >
        {val(b.businessName, 'Your Business Name')}
      </div>
      <div style={{ marginTop: 6, fontSize: fs(11.5), color: GRAY, lineHeight: 1.65 }}>
        {b.name.trim() ? <div>{b.name}</div> : null}
        <div style={{ whiteSpace: 'pre-line' }}>{val(b.address, 'Business address')}</div>
        <div>
          {[b.email, b.phone, b.website].filter((x) => x.trim()).join(isClassic ? '  •  ' : '   ') || (
            <Ph text="email@business.com" />
          )}
        </div>
      </div>
    </div>
  );

  const metaBlock = (align: 'left' | 'right' = 'right') => {
    const rows: [string, ReactNode][] = [
      ['Invoice No.', val(data.invoiceNumber, 'INV-001')],
      ['Issue Date', val(formatDate(data.issueDate), 'Issue date')],
      ['Due Date', val(formatDate(data.dueDate), 'Due date')],
      ['Currency', currency],
    ];
    return (
      <div style={{ textAlign: align }}>
        <div
          style={{
            fontSize: fs(isClassic ? 27 : isModern ? 32 : 26),
            fontWeight: isModern ? 800 : 700,
            letterSpacing: isClassic ? '0.32em' : isModern ? '0.06em' : '0.16em',
            color: isModern ? accent : INK,
            textTransform: 'uppercase',
            lineHeight: 1.1,
            fontFamily: isClassic ? serif : sans,
            paddingLeft: isClassic ? '0.32em' : 0,
          }}
        >
          Invoice
        </div>
        <div style={{ marginTop: 14 }}>
          {rows.map(([label, value]) => (
            <div
              key={label}
              style={{
                display: 'flex',
                justifyContent: align === 'right' ? 'flex-end' : 'flex-start',
                gap: 16,
                padding: '2.5px 0',
                fontSize: fs(12),
              }}
            >
              <span
                style={{
                  color: GRAY,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  fontSize: fs(10),
                  paddingTop: 2,
                  minWidth: 78,
                  textAlign: align,
                  fontFamily: sans,
                }}
              >
                {label}
              </span>
              <span style={{ fontWeight: 600, color: INK, minWidth: 92, textAlign: align }}>{value}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const billToBlock = (
    <div>
      <div
        style={{
          fontSize: fs(10.5),
          fontWeight: 700,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: isModern ? accent : GRAY,
          marginBottom: 8,
          fontFamily: sans,
        }}
      >
        Bill To
      </div>
      <div style={{ fontSize: fs(14.5), fontWeight: 700, color: INK }}>{val(c.name, 'Client Name')}</div>
      <div style={{ marginTop: 3, fontSize: fs(12), color: GRAY, lineHeight: 1.65 }}>
        {c.company.trim() ? <div style={{ fontWeight: 600, color: '#374151' }}>{c.company}</div> : null}
        <div style={{ whiteSpace: 'pre-line' }}>{val(c.address, 'Client address')}</div>
        {c.email.trim() ? <div>{c.email}</div> : null}
        {c.phone.trim() ? <div>{c.phone}</div> : null}
      </div>
    </div>
  );

  /* -------------------------------- items table ------------------------------ */

  const headerCellStyle: CSSProperties = {
    fontSize: fs(10.5),
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    color: isModern ? '#334155' : GRAY,
    padding: '10px 12px',
    fontFamily: sans,
    ...(isModern
      ? { backgroundColor: `${accent}14`, borderBottom: `1px solid ${accent}33` }
      : isClassic
        ? { borderTop: `2px solid ${INK}`, borderBottom: `1px solid ${INK}` }
        : { borderBottom: `1.5px solid ${INK}` }),
  };

  const bodyCellStyle: CSSProperties = {
    padding: '11px 12px',
    fontSize: fs(13),
    borderBottom: `1px solid #f1f3f5`,
    verticalAlign: 'top',
  };

  const itemsTable = (
    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 8 }}>
      <thead>
        <tr>
          <th style={{ ...headerCellStyle, textAlign: 'left', width: '52%' }}>Description</th>
          <th style={{ ...headerCellStyle, textAlign: 'right', width: '12%' }}>Qty</th>
          <th style={{ ...headerCellStyle, textAlign: 'right', width: '16%' }}>Rate</th>
          <th style={{ ...headerCellStyle, textAlign: 'right', width: '20%' }}>Amount</th>
        </tr>
      </thead>
      <tbody>
        {data.items.map((item) => (
          <tr key={item.id}>
            <td style={{ ...bodyCellStyle, color: item.description.trim() ? '#1f2937' : PLACEHOLDER }}>
              {item.description.trim() || 'Item description'}
            </td>
            <td style={{ ...bodyCellStyle, textAlign: 'right', color: GRAY }}>{item.quantity}</td>
            <td style={{ ...bodyCellStyle, textAlign: 'right', color: GRAY }}>{money(item.rate)}</td>
            <td style={{ ...bodyCellStyle, textAlign: 'right', fontWeight: 600, color: INK }}>
              {money(itemAmount(item))}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  /* --------------------------------- totals ---------------------------------- */

  const discountLabel =
    data.discountType === 'percentage' && data.discountValue > 0
      ? `Discount (${data.discountValue}%)`
      : 'Discount';
  const taxLabel = data.taxRate > 0 ? `Tax (${data.taxRate}%)` : 'Tax';

  const totalRow = (label: string, value: ReactNode, bold = false): ReactNode => (
    <div
      key={label}
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        padding: '4.5px 0',
        fontSize: fs(12.5),
        color: bold ? INK : GRAY,
        fontWeight: bold ? 700 : 500,
      }}
    >
      <span>{label}</span>
      <span style={{ color: bold ? INK : '#374151', fontWeight: bold ? 700 : 600 }}>{value}</span>
    </div>
  );

  const totalsBlock = (
    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 18 }}>
      <div style={{ width: 270 }}>
        {totalRow('Subtotal', money(totals.subtotal))}
        {totalRow(discountLabel, <>− {money(totals.discountAmount)}</>)}
        {totalRow(taxLabel, money(totals.taxAmount))}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 8,
            paddingTop: 10,
            borderTop: isClassic ? `2px solid ${INK}` : `2px solid ${isModern ? accent : INK}`,
          }}
        >
          <span
            style={{
              fontSize: fs(11),
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: GRAY,
              fontFamily: sans,
            }}
          >
            Total Due
          </span>
          <span style={{ fontSize: fs(17), fontWeight: 800, color: isModern ? accent : INK }}>
            {money(totals.total)}
          </span>
        </div>
      </div>
    </div>
  );

  /* ------------------------------ notes & terms ------------------------------ */

  const noteBlock = (label: string, value: string, fallback: string) => (
    <div>
      <div
        style={{
          fontSize: fs(10.5),
          fontWeight: 700,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: GRAY,
          marginBottom: 6,
          fontFamily: sans,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: fs(12.5),
          color: value.trim() ? '#4b5563' : PLACEHOLDER,
          lineHeight: 1.65,
          whiteSpace: 'pre-line',
        }}
      >
        {value.trim() || fallback}
      </div>
    </div>
  );

  const notesBlock = (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 40,
        marginTop: 40,
        paddingTop: 24,
        borderTop: `1px solid ${LIGHT}`,
      }}
    >
      {noteBlock('Notes', data.notes, 'Add a note for your client')}
      {noteBlock('Payment Terms', data.paymentTerms, 'Payment terms and instructions')}
    </div>
  );

  /* -------------------------------- templates -------------------------------- */

  const header = isClassic ? (
    <>
      {businessBlock('center')}
      <div
        style={{
          marginTop: 26,
          paddingTop: 18,
          borderTop: `1px solid ${INK}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: 40,
        }}
      >
        <div style={{ flex: 1 }}>{billToBlock}</div>
        <div style={{ width: 270 }}>{metaBlock('right')}</div>
      </div>
      <div style={{ borderBottom: `1px solid ${INK}`, marginTop: 18 }} />
    </>
  ) : (
    <>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: 40,
          paddingBottom: 28,
          borderBottom: isModern ? `1px solid ${LIGHT}` : `1.5px solid ${INK}`,
        }}
      >
        <div style={{ maxWidth: 400 }}>{businessBlock('left')}</div>
        <div style={{ flexShrink: 0 }}>{metaBlock('right')}</div>
      </div>
      <div style={{ marginTop: 26 }}>{billToBlock}</div>
    </>
  );

  return (
    <div style={docStyle}>
      {isModern ? (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 6,
            backgroundColor: accent,
            borderRadius: variant === 'preview' ? '4px 4px 0 0' : 0,
          }}
        />
      ) : null}
      <div style={{ padding: pad, paddingTop: isModern ? pad + 6 : pad }}>
        {header}
        <div style={{ marginTop: 30 }}>{itemsTable}</div>
        {totalsBlock}
        {notesBlock}
      </div>
    </div>
  );
}
