import * as Yup from 'yup';

export const invoiceValidationSchema = Yup.object().shape({
  vendor: Yup.string().required('Vendor is required'),
  poNumber: Yup.string().required('Purchase Order Number is required'),
  invoiceNumber: Yup.string()
    .min(3, 'Invoice Number must be at least 3 characters')
    .required('Invoice Number is required'),
  invoiceDate: Yup.date()
    .required('Invoice Date is required')
    .max(new Date(), 'Invoice Date cannot be in the future'),
  totalAmount: Yup.number()
    .typeError('Total Amount must be a number')
    .positive('Total Amount must be positive')
    .required('Total Amount is required'),
  paymentTerms: Yup.string().required('Payment Terms is required'),
  invoiceDueDate: Yup.date()
    .required('Invoice Due Date is required')
    .min(
      Yup.ref('invoiceDate'),
      'Invoice Due Date must be after or equal to Invoice Date'
    ),
  glPostDate: Yup.date()
    .required('GL Post Date is required')
    .min(
      Yup.ref('invoiceDate'),
      'GL Post Date must be after or equal to Invoice Date'
    ),
  invoiceDescription: Yup.string()
    .min(5, 'Invoice Description must be at least 5 characters')
    .required('Invoice Description is required'),
  lineAmount: Yup.number()
    .typeError('Line Amount must be a number')
    .positive('Line Amount must be positive')
    .required('Line Amount is required')
    .test('lineAmountMax', 'Line Amount cannot exceed Total Amount', function (value) {
      const { totalAmount } = this.parent;
      return !totalAmount || !value || Number(value) <= Number(totalAmount);
    }),
  department: Yup.string().required('Department is required'),
  account: Yup.string().required('Account is required'),
  location: Yup.string().required('Location is required'),
  expenseDescription: Yup.string()
    .min(5, 'Expense Description must be at least 5 characters')
    .required('Expense Description is required'),
});
