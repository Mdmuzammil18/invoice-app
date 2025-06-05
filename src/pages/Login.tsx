import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import styled from 'styled-components';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { storeAuthData, isAuthenticated } from '../components/ProtectedRoute';
import { useEffect, useState } from 'react';

// Types
type LoginFormValues = {
  username: string;
  password: string;
};

type LocationState = {
  from?: {
    pathname: string;
  };
};

// Styled components
const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5;
`;

const LoginCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 2rem;
  color: #333;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
`;

const Input = styled(Field)`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #646cff;
    box-shadow: 0 0 0 2px rgba(100, 108, 255, 0.2);
  }
`;

const ErrorText = styled.div`
  color: #e74c3c;
  font-size: 0.875rem;
  margin-top: 0.25rem;
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  background-color: #646cff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #535bf2;
  }
  
  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

// Validation schema
const loginSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, 'Username must be at least 3 characters')
    .required('Username is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Check if user is already logged in
  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/dashboard', { replace: true });
    } else {
      setIsLoading(false);
    }
  }, [navigate]);

  const handleSubmit = async (
    values: LoginFormValues, 
    { setSubmitting, setFieldError }: any
  ) => {
    setError('');
    
    try {
      // In a real app, you would make an API call here
      console.log('Login attempt with:', values);
      
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, accept any non-empty username/password
      if (!values.username.trim() || !values.password) {
        throw new Error('Username and password are required');
      }
      
      // Store auth data
      storeAuthData(values.username);
      
      // Redirect to the intended page or dashboard
      const from = (location.state as LocationState)?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
      setFieldError('password', errorMessage);
    } finally {
      setSubmitting(false);
    }
  };
  
  // Show loading state while checking auth status
  if (isLoading) {
    return (
      <LoginContainer>
        <LoginCard>
          <p>Loading...</p>
        </LoginCard>
      </LoginContainer>
    );
  }
  
  // If already authenticated, redirect to dashboard
  if (isAuthenticated()) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <LoginContainer>
      <LoginCard>
        <Title>Login</Title>
        {error && <ErrorText style={{ textAlign: 'center', marginBottom: '1rem' }}>{error}</ErrorText>}
        <Formik<LoginFormValues>
          initialValues={{ username: '', password: '' }}
          validationSchema={loginSchema}
          onSubmit={handleSubmit}
          validateOnChange={false}
          validateOnBlur={false}
        >
          {({ isSubmitting }) => (
            <Form>
              <FormGroup>
                <Label htmlFor="username">Username</Label>
                <Field 
                  type="text" 
                  name="username" 
                  as={Input} 
                  placeholder="Enter your username" 
                />
                <ErrorMessage name="username" component={ErrorText} />
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="password">Password</Label>
                <Field 
                  type="password" 
                  name="password" 
                  as={Input} 
                  placeholder="Enter your password" 
                />
                <ErrorMessage name="password" component={ErrorText} />
              </FormGroup>
              
              <SubmitButton type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Logging in...' : 'Login'}
              </SubmitButton>
            </Form>
          )}
        </Formik>
      </LoginCard>
    </LoginContainer>
  );
};

export default Login;
