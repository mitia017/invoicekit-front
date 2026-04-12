export interface Client {
  id: number;
  user_id: number;
  name: string;
  email?: string;
  address?: string;
  vat_number?: string;
  phone?: string;
  created_at: string;
  updated_at: string;
}

export interface InvoiceItem {
  id?: number;
  description: string;
  quantity: number;
  unit_price: number;
  tax_rate: number;
  amount?: number;
}

export interface Invoice {
  id: number;
  user_id: number;
  client_id: number;
  client?: Client;
  invoice_number: string;
  issue_date: string;
  due_date: string;
  currency: string;
  subtotal: number;
  tax_rate: number;
  tax_amount: number;
  total: number;
  discount_type?: "fixed" | "percent";
  discount_value?: number;
  discount_amount?: number;
  notes?: string;
  status: "draft" | "sent" | "paid" | "overdue";
  items: InvoiceItem[];
  payments: Payment[];
  created_at: string;
  updated_at: string;
  remaining_amount?: number;
}

export interface InvoiceFormData {
  client_id: number;
  issue_date: string;
  due_date: string;
  currency: string;
  items: InvoiceItem[];
  discount_type?: string;
  discount_value?: number;
  notes?: string;
  tax_rate?: number;
}

export interface Payment {
  id: number;
  invoice_id: number;
  amount: number;
  payment_date: string;
  payment_method: string;
  transaction_id?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
}
