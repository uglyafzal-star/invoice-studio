export type CurrencyCode = 'USD' | 'PKR' | 'GBP' | 'EUR' | 'AED' | 'INR';
export type DiscountType = 'percentage' | 'fixed';
export type TemplateId = 'minimal' | 'modern' | 'classic';
export type FontSizeId = 'small' | 'medium' | 'large';

export interface BusinessInfo {
  businessName: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  website: string;
  logo: string | null; // data URL
}

export interface ClientInfo {
  name: string;
  company: string;
  email: string;
  phone: string;
  address: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
}

export interface InvoiceData {
  business: BusinessInfo;
  client: ClientInfo;
  invoiceNumber: string;
  issueDate: string; // ISO yyyy-mm-dd
  dueDate: string;
  currency: CurrencyCode;
  items: InvoiceItem[];
  discountType: DiscountType;
  discountValue: number;
  taxRate: number;
  notes: string;
  paymentTerms: string;
  template: TemplateId;
  accentColor: string;
  fontSize: FontSizeId;
}

export interface Totals {
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  total: number;
}
