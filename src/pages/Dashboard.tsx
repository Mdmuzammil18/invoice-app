import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { clearAuthData } from '../components/ProtectedRoute';
import { FiUpload } from 'react-icons/fi';
// import { clearAuthData } from '../utils/auth'; // Removed if not used
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { invoiceValidationSchema } from './Dashboard.validation';

const ErrorText = styled.div`
  color: #e53935;
  font-size: 0.95em;
  margin-top: 0.25em;
`;

// --- Styled Components for Dashboard Layout ---

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const FormLabel = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #333;
`;

const FormInput = styled.input`
  width: 100%;
  padding: 0.85rem 1.1rem;
  border: 1.5px solid #dbeafe;
  border-radius: 8px;
  font-size: 1.05rem;
  background: #f9fbfd;
  color: #222b45;
  transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
  box-shadow: 0 1px 2px rgba(25, 118, 210, 0.04);
  &::placeholder {
    color: #b0b8c9;
    opacity: 1;
  }
  &:hover {
    border-color: #1976d2;
    background: #f4f8fd;
  }
  &:focus {
    outline: none;
    border-color: #1976d2;
    background: #f0f7ff;
    box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.08);
  }
  @media (max-width: 600px) {
    font-size: 0.98rem;
    padding: 0.7rem 0.8rem;
  }
`;



const FormSelect = styled.select`
  width: 100%;
  padding: 0.85rem 1.1rem;
  border: 1.5px solid #dbeafe;
  border-radius: 8px;
  font-size: 1.05rem;
  background: #f9fbfd;
  color: #222b45;
  cursor: pointer;
  transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
  box-shadow: 0 1px 2px rgba(25, 118, 210, 0.04);
  &::placeholder {
    color: #b0b8c9;
    opacity: 1;
  }
  &:hover {
    border-color: #1976d2;
    background: #f4f8fd;
  }
  &:focus {
    outline: none;
    border-color: #1976d2;
    background: #f0f7ff;
    box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.08);
  }
  @media (max-width: 600px) {
    font-size: 0.98rem;
    padding: 0.7rem 0.8rem;
  }
`;



// --- End styled-components ---

// --- Duplicates removed below this line ---

const SectionTitle = styled.h2`
  font-size: 1.3rem;
  font-weight: 600;
  color: #222b45;
  margin-bottom: 0.3rem;
  @media (max-width: 600px) {
    font-size: 1.05rem;
  }
`;

const SubSectionTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: #222b45;
  margin-bottom: 0.3rem;
  @media (max-width: 600px) {
    font-size: 0.98rem;
  }
`;

const MainWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 2.5rem;
  width: 100%;
  min-height: 100vh;
  background: #f6f8fb;
  padding: 2.5rem 2.5rem 3rem 2.5rem;
  box-sizing: border-box;

  @media (max-width: 900px) {
    flex-direction: column;
    gap: 1.2rem;
    padding: 1rem 0.5rem 2rem 0.5rem;
  }
`;

const UploadColumn = styled.div`
  flex: 1.2;
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
`;

const UploadBox = styled.div`
  width: 100%;
  max-width: 440px;
  min-height: 500px;
  background: #fff;
  border: 2px dashed #dbeafe;
  border-radius: 14px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2.5rem 1.5rem 2rem 1.5rem;
  cursor: pointer;
  transition: border-color 0.2s;
  &:hover {
    border-color: #1976d2;
  }
  @media (max-width: 900px) {
    min-height: 320px;
    padding: 1.2rem 0.5rem 1rem 0.5rem;
    max-width: 100%;
  }
`;
const UploadIllustration = styled.div`
  margin-bottom: 1.2rem;
`;
const UploadTitle = styled.h2`
  font-size: 1.3rem;
  font-weight: 600;
  color: #222b45;
  margin-bottom: 0.3rem;
`;
const UploadSubtitle = styled.div`
  color: #64748b;
  font-size: 1rem;
  margin-bottom: 1.5rem;
`;
const UploadButton = styled.button`
  background: #1976d2;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.7rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  box-shadow: 0 1px 2px rgba(25, 118, 210, 0.06);
  &:hover {
    background: #1256a3;
  }
`;
const UploadHint = styled.div`
  font-size: 0.97rem;
  color: #64748b;
  margin-top: 0.5rem;
`;

const FormColumn = styled.div`
  flex: 2.2;
  display: flex;
  align-items: flex-start;
  /* Remove margin or padding here to avoid double spacing */
`;

const FormCard = styled.div`
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(80, 112, 180, 0.08);
  width: 100%;
  min-width: 320px;
  max-width: 720px;
  margin-left: 0;
  display: flex;
  flex-direction: column;
  padding: 2rem 2.5rem 1.5rem 2.5rem;

  @media (max-width: 900px) {
    min-width: 0;
    max-width: 100%;
    padding: 1rem 0.7rem 1.2rem 0.7rem;
  }
`;

// --- Modern Header Styled Components ---
const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1.2rem;
  margin-bottom: 0.7rem;
`;

const BackArrow = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 0;
`;

const HeaderTitle = styled.h1`
  font-size: 1.15rem;
  font-weight: 700;
  color: #222b45;
  margin: 0;
`;

const TabsRow = styled.div`
  display: flex;
  gap: 2.5rem;
  align-items: center;
  border-bottom: 2px solid #e5eaf2;
  margin-bottom: 1.5rem;
`;

const TabButton = styled.button<{ $active?: boolean }>`
  background: none;
  border: none;
  outline: none;
  font-size: 1rem;
  font-weight: 600;
  color: ${({ $active }) => ($active ? '#1976d2' : '#222b45')};
  padding: 0.9rem 0 0.7rem 0;
  border-bottom: 3px solid ${({ $active }) => ($active ? '#1976d2' : 'transparent')};
  cursor: pointer;
  transition: color 0.2s, border-bottom 0.2s;
`;

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Tab state
  const [activeTab, setActiveTab] = useState<'vendor' | 'invoice' | 'comments'>('vendor');



  // File upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Comments state
  const [commentInput, setCommentInput] = useState('');
  const [comments, setComments] = useState<string[]>([]);

  // Handlers
  const handleTabClick = (tab: 'vendor' | 'invoice' | 'comments') => setActiveTab(tab);

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleAddComment = () => {
    if (commentInput.trim()) {
      setComments((prev: string[]) => [...prev, commentInput.trim()]);
      setCommentInput('');
    }
  };

  const handleCommentInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddComment();
    }
  };

  const handleBack = () => navigate(-1);

  return (
    <MainWrapper>
      <UploadColumn>
        <UploadBox onClick={() => fileInputRef.current?.click()}>
          <UploadIllustration>
            <svg width="90" height="90" viewBox="0 0 90 90" fill="none"><circle cx="45" cy="45" r="45" fill="#EEF4FF" /><rect x="25" y="30" width="40" height="30" rx="4" fill="#fff" stroke="#1976d2" strokeWidth="2" /><rect x="33" y="38" width="24" height="4" rx="2" fill="#E0E7EF" /><rect x="33" y="46" width="24" height="4" rx="2" fill="#E0E7EF" /><path d="M45 43v10M45 53l-3.5-3.5M45 53l3.5-3.5" stroke="#1976d2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><circle cx="45" cy="45" r="29" stroke="#1976d2" strokeWidth="2" opacity=".1" /></svg>
          </UploadIllustration>
          <UploadTitle>Upload Your Invoice</UploadTitle>
          <UploadSubtitle>To auto-populate fields and save time</UploadSubtitle>
          <UploadButton type="button" onClick={e => { e.stopPropagation(); fileInputRef.current?.click(); } }>
            Upload File <span style={{ marginLeft: 6 }}><FiUpload /></span>
          </UploadButton>
          <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={e => setSelectedFile(e.target.files?.[0] || null)} accept=".pdf,.doc,.docx" />
          <UploadHint>
            <span style={{ color: '#1976d2', cursor: 'pointer' }}>Click to upload</span> or Drag and drop
          </UploadHint>
        </UploadBox>
      </UploadColumn>
      <FormColumn>
        <FormCard>
          <HeaderRow>
            <BackArrow type="button" aria-label="Back" onClick={handleBack}>
              <svg width="20" height="20" fill="none" stroke="#222b45" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
            </BackArrow>
            <HeaderTitle>Create New Invoice</HeaderTitle>
            <LogoutButton type="button" onClick={() => { clearAuthData(); navigate('/login'); }}>
              Logout
            </LogoutButton>
          </HeaderRow>
          <TabsRow>
            <TabButton $active={activeTab === 'vendor'} onClick={() => handleTabClick('vendor')}>Vendor Details</TabButton>
            <TabButton $active={activeTab === 'invoice'} onClick={() => handleTabClick('invoice')}>Invoice Details</TabButton>
            <TabButton $active={activeTab === 'comments'} onClick={() => handleTabClick('comments')}>Comments</TabButton>
          </TabsRow>
          <Formik
            initialValues={(() => {
              const saved = localStorage.getItem('invoiceFormData');
              if (saved) {
                try {
                  return JSON.parse(saved);
                } catch {
                  // fallback to defaults if corrupted
                }
              }
              return {
                vendor: '',
                poNumber: '',
                invoiceNumber: '',
                invoiceDate: '',
                totalAmount: '',
                paymentTerms: '',
                invoiceDueDate: '',
                glPostDate: '',
                invoiceDescription: '',
                lineAmount: '',
                department: '',
                account: '',
                location: '',
                expenseDescription: '',
              };
            })()}
            validationSchema={invoiceValidationSchema}
            onSubmit={(values) => {
              alert('Form submitted! Check console for data.');
              console.log('Form submitted:', values);
            }}
          >
            {({ touched, errors, values }) => {
  React.useEffect(() => {
    localStorage.setItem('invoiceFormData', JSON.stringify(values));
  }, [values]);
  return (
    <Form style={{ padding: '1.5rem 0' }}>
      <div>
        {activeTab === 'vendor' && (
          <div>
            <SectionTitle style={{ marginTop: '2.5rem' }}>Vendor Details</SectionTitle>
            <SubSectionTitle>Vendor Information</SubSectionTitle>
            <FormGroup>
              <FormLabel>Vendor <span style={{ color: '#e53935' }}>*</span></FormLabel>
              <Field as={FormSelect} name="vendor" required className={touched.vendor && errors.vendor ? 'input-error' : ''}>
                <option value="">A - 1 Exterminators</option>
                <option value="vendor2">Vendor 2</option>
              </Field>
              <ErrorMessage name="vendor" component={ErrorText} />
              <div style={{ marginTop: 6 }}>
                <a href="#" style={{ color: '#1976d2', fontSize: '0.95em', textDecoration: 'none' }}>View Vendor Details</a>
              </div>
            </FormGroup>
            {selectedFile && (
              <div style={{ margin: '0.8rem 0', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span>{selectedFile.name}</span>
                <button type="button" onClick={handleRemoveFile}>Remove</button>
              </div>
            )}
          </div>
        )}
        {activeTab === 'invoice' && (
          <div>
            <SectionTitle style={{ marginTop: '2.5rem' }}>
              Invoice Details
            </SectionTitle>
            <SubSectionTitle>General Information</SubSectionTitle>
            <FormGroup>
              <FormLabel>Purchase Order Number <span style={{ color: '#e53935' }}>*</span></FormLabel>
              <Field as={FormSelect} name="poNumber" required className={touched.poNumber && errors.poNumber ? 'input-error' : ''}>
                <option value="">Select PO Number</option>
                <option value="po1">PO-001</option>
              </Field>
              <ErrorMessage name="poNumber" component={ErrorText} />
            </FormGroup>
            <SubSectionTitle style={{ marginTop: '2rem' }}>Invoice Details</SubSectionTitle>
            <div>
              <FormGroup>
                <FormLabel>Invoice Number <span style={{ color: '#e53935' }}>*</span></FormLabel>
                <Field as={FormSelect} name="invoiceNumber" required className={touched.invoiceNumber && errors.invoiceNumber ? 'input-error' : ''}>
                  <option value="">Select Vendor</option>
                  <option value="inv1">INV-001</option>
                </Field>
                <ErrorMessage name="invoiceNumber" component={ErrorText} />
              </FormGroup>
              <FormGroup>
                <FormLabel>Invoice Date <span style={{ color: '#e53935' }}>*</span></FormLabel>
                <Field as={FormInput} type="date" name="invoiceDate" required placeholder="MM/DD/YYYY" className={touched.invoiceDate && errors.invoiceDate ? 'input-error' : ''} />
                <ErrorMessage name="invoiceDate" component={ErrorText} />
              </FormGroup>
            </div>
            <div>
              <FormGroup>
                <FormLabel>Total Amount <span style={{ color: '#e53935' }}>*</span></FormLabel>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Field as={FormInput} type="number" name="totalAmount" min="0" step="0.01" required style={{ flex: 1 }} className={touched.totalAmount && errors.totalAmount ? 'input-error' : ''} />
                  <span style={{ marginLeft: 4, color: '#888' }}>USD</span>
                </div>
                <ErrorMessage name="totalAmount" component={ErrorText} />
              </FormGroup>
              <FormGroup>
                <FormLabel>Payment Terms <span style={{ color: '#e53935' }}>*</span></FormLabel>
                <Field as={FormSelect} name="paymentTerms" required className={touched.paymentTerms && errors.paymentTerms ? 'input-error' : ''}>
                  <option value="">Select</option>
                  <option value="net30">Net 30</option>
                  <option value="net15">Net 15</option>
                </Field>
                <ErrorMessage name="paymentTerms" component={ErrorText} />
              </FormGroup>
            </div>
            <div>
              <FormGroup>
                <FormLabel>Invoice Due Date <span style={{ color: '#e53935' }}>*</span></FormLabel>
                <Field as={FormInput} type="date" name="invoiceDueDate" required placeholder="MM/DD/YYYY" className={touched.invoiceDueDate && errors.invoiceDueDate ? 'input-error' : ''} />
                <ErrorMessage name="invoiceDueDate" component={ErrorText} />
              </FormGroup>
              <FormGroup>
                <FormLabel>GL Post Date <span style={{ color: '#e53935' }}>*</span></FormLabel>
                <Field as={FormInput} type="date" name="glPostDate" required placeholder="MM/DD/YYYY" className={touched.glPostDate && errors.glPostDate ? 'input-error' : ''} />
                <ErrorMessage name="glPostDate" component={ErrorText} />
              </FormGroup>
            </div>
            <FormGroup>
              <FormLabel>Invoice Description <span style={{ color: '#e53935' }}>*</span></FormLabel>
              <Field as={FormInput} type="text" name="invoiceDescription" required className={touched.invoiceDescription && errors.invoiceDescription ? 'input-error' : ''} />
              <ErrorMessage name="invoiceDescription" component={ErrorText} />
            </FormGroup>
            <SectionTitle style={{ marginTop: '2.5rem' }}>Expense Details <span style={{ float: 'right', fontWeight: 400 }}>$ 0.00 / <span style={{ color: '#1976d2' }}>$ 0.00</span> <button type="button" style={{ marginLeft: 8, background: '#f4f6fb', border: '1px solid #dbeafe', borderRadius: 12, color: '#1976d2', padding: '0.2em 0.8em', fontWeight: 600, cursor: 'pointer' }}> $ </button> <button type="button" style={{ marginLeft: 4, background: '#f4f6fb', border: '1px solid #dbeafe', borderRadius: 12, color: '#1976d2', padding: '0.2em 0.8em', fontWeight: 600, cursor: 'pointer' }}> % </button></span></SectionTitle>
            <div>
              <FormGroup>
                <FormLabel>Line Amount <span style={{ color: '#e53935' }}>*</span></FormLabel>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Field as={FormInput} type="number" name="lineAmount" min="0" step="0.01" required style={{ flex: 1 }} className={touched.lineAmount && errors.lineAmount ? 'input-error' : ''} />
                  <span style={{ marginLeft: 4, color: '#888' }}>USD</span>
                </div>
                <ErrorMessage name="lineAmount" component={ErrorText} />
              </FormGroup>
              <FormGroup>
                <FormLabel>Department <span style={{ color: '#e53935' }}>*</span></FormLabel>
                <Field as={FormSelect} name="department" required className={touched.department && errors.department ? 'input-error' : ''}>
                  <option value="">Select Department</option>
                  <option value="dept1">Dept 1</option>
                </Field>
                <ErrorMessage name="department" component={ErrorText} />
              </FormGroup>
            </div>
            <div>
              <FormGroup>
                <FormLabel>Account <span style={{ color: '#e53935' }}>*</span></FormLabel>
                <Field as={FormSelect} name="account" required className={touched.account && errors.account ? 'input-error' : ''}>
                  <option value="">Select Account</option>
                  <option value="acc1">Account 1</option>
                </Field>
                <ErrorMessage name="account" component={ErrorText} />
              </FormGroup>
              <FormGroup>
                <FormLabel>Location <span style={{ color: '#e53935' }}>*</span></FormLabel>
                <Field as={FormSelect} name="location" required className={touched.location && errors.location ? 'input-error' : ''}>
                  <option value="">Select Location</option>
                  <option value="loc1">Location 1</option>
                </Field>
                <ErrorMessage name="location" component={ErrorText} />
              </FormGroup>
            </div>
            <FormGroup>
              <FormLabel>Description <span style={{ color: '#e53935' }}>*</span></FormLabel>
              <Field as={FormInput} type="text" name="expenseDescription" required className={touched.expenseDescription && errors.expenseDescription ? 'input-error' : ''} />
              <ErrorMessage name="expenseDescription" component={ErrorText} />
            </FormGroup>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.2rem' }}>
              <button type="button" style={{ background: '#fff', color: '#1976d2', border: '1px solid #dbeafe' }}>
                + Add Expense Coding
              </button>
            </div>
          </div>
        )}
        {activeTab === 'comments' && (
          <div>
            <SectionTitle style={{ marginTop: '2.5rem', marginBottom: '0.5rem' }}>
              Comments
            </SectionTitle>
            <CommentInputRow>
              <CommentInput
                name="comments"
                placeholder="Add a comment and use @Name to tag someone"
                value={commentInput}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCommentInput(e.target.value)}
                onKeyDown={handleCommentInputKeyDown}
              />
              <SendButton type="button" aria-label="Send Comment" onClick={handleAddComment}>
                <svg width="20" height="20" fill="none" stroke="#1976d2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
              </SendButton>
            </CommentInputRow>
            {comments.length > 0 && (
              <div style={{ marginBottom: '1.2rem' }}>
                {comments.map((c: string, idx: number) => (
                  <div key={idx} style={{
                    background: '#f8fafc',
                    borderRadius: 6,
                    padding: '0.7rem 1rem',
                    marginBottom: 6,
                    color: '#222b45',
                    fontSize: '0.97rem'
                  }}>{c}</div>
                ))}
              </div>
            )}
            <ActionsRow>
              <DraftButton type="button">Save as Draft</DraftButton>
              <SubmitButton type="submit">Submit & New</SubmitButton>
            </ActionsRow>
          </div>
        )}
      </div>
    </Form>
  );
}}
          </Formik>
        </FormCard>
      </FormColumn>
    </MainWrapper>
  );
};


const CommentInputRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  @media (max-width: 600px) {
    flex-direction: column;
    align-items: stretch;
    gap: 0.5rem;
  }
`;

const CommentInput = styled.input`
  flex: 1;
  padding: 0.85rem 1.1rem;
  border: 1.5px solid #dbeafe;
  border-radius: 8px;
  font-size: 1.05rem;
  background: #f9fbfd;
  color: #222b45;
  transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
  box-shadow: 0 1px 2px rgba(25, 118, 210, 0.04);
  &::placeholder {
    color: #b0b8c9;
    opacity: 1;
  }
  &:hover {
    border-color: #1976d2;
    background: #f4f8fd;
  }
  &:focus {
    outline: none;
    border-color: #1976d2;
    background: #f0f7ff;
    box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.08);
  }
  @media (max-width: 600px) {
    font-size: 0.98rem;
    padding: 0.7rem 0.8rem;
  }
`;

const SendButton = styled.button`
  background: none;
  border: none;
  color: #1976d2;
  font-size: 1.2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 0.4rem 0.7rem;
`;

const ActionsRow = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
  @media (max-width: 600px) {
    flex-direction: column;
    gap: 0.5rem;
  }
`;

const DraftButton = styled.button`
  flex: 1;
  background: #fff;
  border: 1px solid #dbeafe;
  border-radius: 8px;
  padding: 0.7rem 0;
  color: #222b45;
  font-weight: 600;
  cursor: pointer;
`;

const SubmitButton = styled.button`
  flex: 1;
  background: #1976d2;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 0.7rem 0;
  font-weight: 600;
  cursor: pointer;
`;

const LogoutButton = styled.button`
  margin-left: auto;
  background: #fff;
  color: #e53935;
  border: 1px solid #e53935;
  border-radius: 8px;
  padding: 0.5rem 1.2rem;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
  &:hover {
    background: #e53935;
    color: #fff;
  }
`;

export default Dashboard;
