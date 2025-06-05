import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createGlobalStyle } from 'styled-components';
import { InvoiceProvider } from './context/InvoiceContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProtectedRoute, { isAuthenticated } from './components/ProtectedRoute';

// Global styles
const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    line-height: 1.5;
    color: #333;
    background-color: #f5f5f5;
  }
  
  #root {
    min-height: 100vh;
  }
`;

const theme = {
  colors: {
    primary: '#646cff',
    error: '#ff4d4f',
    text: '#333',
    textSecondary: '#666',
    border: '#ddd',
    background: '#f5f5f5',
    white: '#fff',
  },
  shadows: {
    sm: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
    md: '0 4px 6px rgba(0,0,0,0.1), 0 1px 3px rgba(0,0,0,0.08)',
    lg: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)',
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
  },
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
  },
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <InvoiceProvider>
        <Router>
          <Routes>
            <Route 
              path="/login" 
              element={isAuthenticated() ? <Navigate to="/dashboard" replace /> : <Login />} 
            />
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/invoices/new" element={<div>New Invoice Form</div>} />
              <Route path="/invoices/:id" element={<div>Invoice Details</div>} />
              <Route path="/invoices/:id/edit" element={<div>Edit Invoice</div>} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </InvoiceProvider>
    </ThemeProvider>
  );
}

export default App;
