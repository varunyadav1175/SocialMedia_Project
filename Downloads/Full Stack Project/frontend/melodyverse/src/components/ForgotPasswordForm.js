// ForgotPasswordForm.js
import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import './ForgotPassword.css';

const ForgotPasswordForm = () => {
  const [successMessage, setSuccessMessage] = useState('');

  const initialValues = {
    email: ''
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Email is required')
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      setSuccessMessage('Email has been sent with further instructions!');
      resetForm();
    } catch (error) {
      console.error('Error sending email:', error);
    }
    setSubmitting(false);
  };

  return (
    <div className="forgot-password-container">
      <b><h1>Forgot Password</h1></b>
      <br></br>
      <h6>Provide the email address you used when creating the account</h6>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
          <Form>
            <div className="form-group">
              <Field type="email" name="email" placeholder="Enter your email" />
              <ErrorMessage name="email" component="div" className="error-message" />
            </div>
            <button className='sendemailbutton' type="submit">
              Send Email
            </button>
          </Form>
      </Formik>
      {successMessage && <div className="success-message">{successMessage}</div>}
    </div>
  );
};

export default ForgotPasswordForm;
