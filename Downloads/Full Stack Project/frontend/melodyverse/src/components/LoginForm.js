import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // Import CSS file
import Toast from './toast'; // Import the Toast component

const LoginForm = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const [showToast, setShowToast] = useState(false); // State for showing toast message
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const initialValues = {
    username: '',
    password: ''
  };

  const validationSchema = Yup.object().shape({
    username: Yup.string().required('Username is required'),
    password: Yup.string().required('Password is required')
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await axios.post('http://localhost:3000/api/auth/login', values);
      const token = response.data.token;
      localStorage.setItem('token', token);
      setShowToast(true); // Show the toast message
      setTimeout(() => {
        navigate('/posts');
      }, 3000); // Redirect after 3 seconds
    } catch (error) {
      setErrorMessage('Invalid username or password');
    }
    setSubmitting(false);
  };

  return (
    <div className="login-form-container">
      <div className="login-form-content">
        <h2 className="form-title">Login</h2>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="form">
              <div className="form-group">
                <Field type="text" name="username" placeholder="Username" className="input-field" />
                <ErrorMessage name="username" component="div" className="error-message" />
              </div>
              <div className="form-group password-group">
                <Field type={showPassword ? 'text' : 'password'} name="password" placeholder="Password" className="input-field" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="password-toggle-button">
                  {showPassword ? 'Hide Password 🔒' : 'Show Password 👁️'}
                </button>
              </div>
                <ErrorMessage name="password" component="div" className="error-message" />
              <button type="submit" disabled={isSubmitting} className="submit-button">
                {isSubmitting ? 'Logging in...' : 'Login'}
              </button>
            </Form>
          )}
        </Formik>
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        <div className="additional-options">
          <a href="/signup" className="signup-link">Signup</a>
          <a href="/forgotpassword" className="forgot-password">Forgot Password</a>
        </div>
        {/* Show the toast message if login is successful */}
        {showToast && <Toast message="Login successful!" onClose={() => setShowToast(false)} />}
      </div>
    </div>
  );
};

export default LoginForm;
