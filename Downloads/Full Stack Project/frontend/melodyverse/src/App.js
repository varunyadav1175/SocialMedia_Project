// App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignupForm from './components/SignupForm';
import PostList from './components/PostList';
import LoginForm from './components/LoginForm';
import ForgotPasswordForm from './components/ForgotPasswordForm';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/posts" element={<PostList />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/forgotpassword" element={<ForgotPasswordForm/>} />

      </Routes>
    </Router>
  );
};

export default App;
