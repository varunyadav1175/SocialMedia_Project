// SignupForm.js

import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './SignupForm.css'; // Import CSS file
import Toast from './toast'

const SignupForm = () => {
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showSignupToast, setShowSignupToast] = useState(false);
  const navigate = useNavigate();

  const initialValues = {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    profilePicture: '',
    termsAndConditions: false
  };

  const validationSchema = Yup.object().shape({
    username: Yup.string().required('Username is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match').required('Confirm password is required'),
    name: Yup.string().required('Name is required'),
    profilePicture: Yup.string(),
    termsAndConditions: Yup.boolean().oneOf([true], 'You must accept the terms and conditions')
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await axios.post('http://localhost:3000/api/auth/signup', values);
      const token = response.data.token;
      localStorage.setItem('token', token);
      setSuccessMessage(response.data.message);
      setErrorMessage('');
      setShowSignupToast(true); // Show the signup toast
      setTimeout(() => {
        navigate('/posts'); // Redirect to posts page after a delay
      }, 2000); // Adjust the delay as needed
    } catch (error) {
      setSuccessMessage('');
      setErrorMessage('An error occurred while signing up');
    }
    setSubmitting(false);
  };
  
  
  
  

  return (
    <div className="signup-form-container">
      <div className="signup-form-content">
        <h2 className="form-title">Signup</h2>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="form">
              {/* Username field */}
              <div className="form-group">
                <Field type="text" name="username" placeholder="Username" className="input-field" />
                <ErrorMessage name="username" component="div" className="error-message" />
              </div>

              {/* Email field */}
              <div className="form-group">
                <Field type="email" name="email" placeholder="Email" className="input-field" />
                <ErrorMessage name="email" component="div" className="error-message" />
              </div>

              {/* Password field */}
              <div className="form-group">
                <Field type="password" name="password" placeholder="Password" className="input-field" />
                <ErrorMessage name="password" component="div" className="error-message" />
              </div>

              {/* Confirm Password field */}
              <div className="form-group">
                <Field type="password" name="confirmPassword" placeholder="Confirm Password" className="input-field" />
                <ErrorMessage name="confirmPassword" component="div" className="error-message" />
              </div>

              {/* Name field */}
              <div className="form-group">
                <Field type="text" name="name" placeholder="Name" className="input-field" />
                <ErrorMessage name="name" component="div" className="error-message" />
              </div>

              {/* Terms and Conditions checkbox */}
              <div className="form-group terms">
                <Field type="checkbox" name="termsAndConditions" className="checkbox-field" />
                <label className="terms-label">Accept Terms and Conditions</label>
                <ErrorMessage name="termsAndConditions" component="div" className="error-message" />
              </div>

              {/* Submit button */}
              <button type="submit" disabled={isSubmitting} className="submit-button">
                {isSubmitting ? 'Signing up...' : 'Signup'}
              </button>
            </Form>
          )}
        </Formik>
        {/* Success and error messages */}
        {successMessage && <div className="success-message">{successMessage}</div>}
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        {showSignupToast && <Toast message="Signup successful!" />}
      </div>
    </div>
  );
};

export default SignupForm;
