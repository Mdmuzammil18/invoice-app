interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  price: number;
  amount: number;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  date: string;
  dueDate: string;
  status: 'draft' | 'pending' | 'paid' | 'overdue';
  billFrom: {
    name: string;
    email: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  billTo: {
    name: string;
    email: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  notes?: string;
  terms?: string;
  pdfUrl?: string;
  createdAt: string;
  updatedAt: string;
}

interface InvoiceFormValues extends Omit<Invoice, 'id' | 'createdAt' | 'updatedAt' | 'items'> {
  items: Array<Omit<InvoiceItem, 'id' | 'amount'>>;
}

// Default invoice values
const defaultInvoice: InvoiceFormValues = {
  invoiceNumber: '',
  date: new Date().toISOString().split('T')[0],
  dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  status: 'draft',
  billFrom: {
    name: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  },
  billTo: {
    name: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  },
  items: [
    {
      description: '',
      quantity: 1,
      price: 0,
    },
  ],
  subtotal: 0,
  tax: 0,
  discount: 0,
  total: 0,
  notes: '',
  terms: '',
};

// Generate a unique ID for new invoices
const generateId = (): string => {
  return Math.random().toString(36).substring(2, 11);
};

// Calculate invoice totals
const calculateInvoiceTotals = (items: InvoiceItem[]): { subtotal: number; total: number } => {
  const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  // For now, just return subtotal as total. Tax and discount can be added later
  return { subtotal, total: subtotal };
};

// Export all public types and values
export type { Invoice, InvoiceItem, InvoiceFormValues };
export { defaultInvoice, generateId, calculateInvoiceTotals };
