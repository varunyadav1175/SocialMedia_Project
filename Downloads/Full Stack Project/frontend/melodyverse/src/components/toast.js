import React from 'react';
import './Toast.css'; // Define styles for your toast notification

const Toast = ({ message, onClose }) => {
  return (
    <div className="toast">
      <div className="toast-content">{message}</div>
      <button className="close-button" onClick={onClose}>X</button>
    </div>
  );
};

export default Toast;
