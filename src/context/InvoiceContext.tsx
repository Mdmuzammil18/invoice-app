import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Invoice } from '../types/invoice';
import { generateId, calculateInvoiceTotals } from '../types/invoice';

interface InvoiceContextType {
  invoices: Invoice[];
  currentInvoice: Invoice | null;
  createInvoice: (invoice: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateInvoice: (id: string, updates: Partial<Invoice>) => void;
  deleteInvoice: (id: string) => void;
  getInvoice: (id: string) => Invoice | undefined;
  setCurrentInvoice: (invoice: Invoice | null) => void;
  clearCurrentInvoice: () => void;
}

const InvoiceContext = createContext<InvoiceContextType | undefined>(undefined);

const STORAGE_KEY = 'invoices';

export const InvoiceProvider = ({ children }: { children: ReactNode }) => {
  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    // Load invoices from localStorage on initial render
    const savedInvoices = localStorage.getItem(STORAGE_KEY);
    return savedInvoices ? JSON.parse(savedInvoices) : [];
  });
  
  const [currentInvoice, setCurrentInvoiceState] = useState<Invoice | null>(null);

  // Save to localStorage whenever invoices change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(invoices));
  }, [invoices]);

  const createInvoice = (invoiceData: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newInvoice: Invoice = {
      ...invoiceData,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    };
    
    setInvoices(prevInvoices => [newInvoice, ...prevInvoices]);
    return newInvoice;
  };

  const updateInvoice = (id: string, updates: Partial<Invoice>) => {
    setInvoices(prevInvoices => 
      prevInvoices.map(invoice => 
        invoice.id === id 
          ? { 
              ...invoice, 
              ...updates, 
              updatedAt: new Date().toISOString(),
              // Recalculate totals if items were updated
              ...(updates.items ? calculateInvoiceTotals(updates.items) : {})
            } 
          : invoice
      )
    );
    
    // Update current invoice if it's the one being updated
    if (currentInvoice && currentInvoice.id === id) {
      setCurrentInvoiceState(prev => prev ? { ...prev, ...updates } : null);
    }
  };

  const deleteInvoice = (id: string) => {
    setInvoices(prevInvoices => prevInvoices.filter(invoice => invoice.id !== id));
    
    // Clear current invoice if it's the one being deleted
    if (currentInvoice && currentInvoice.id === id) {
      setCurrentInvoiceState(null);
    }
  };

  const getInvoice = (id: string) => {
    return invoices.find(invoice => invoice.id === id);
  };

  const setCurrentInvoice = (invoice: Invoice | null) => {
    setCurrentInvoiceState(invoice);
  };

  const clearCurrentInvoice = () => {
    setCurrentInvoiceState(null);
  };

  return (
    <InvoiceContext.Provider 
      value={{
        invoices,
        currentInvoice,
        createInvoice,
        updateInvoice,
        deleteInvoice,
        getInvoice,
        setCurrentInvoice,
        clearCurrentInvoice,
      }}
    >
      {children}
    </InvoiceContext.Provider>
  );
};

export const useInvoices = (): InvoiceContextType => {
  const context = useContext(InvoiceContext);
  if (context === undefined) {
    throw new Error('useInvoices must be used within an InvoiceProvider');
  }
  return context;
};
