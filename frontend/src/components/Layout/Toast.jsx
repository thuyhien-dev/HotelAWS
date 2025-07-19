import React, { useEffect } from 'react';

export default function Toast({ message, type = 'info', duration = 3000, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(); 
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div
      style={{
        position: 'fixed',
        top: 20,
        right: 20,
        padding: '10px 20px',
        backgroundColor:
          type === 'success' ? 'green' :
          type === 'error' ? 'red' :
          'gray',
        color: 'white',
        borderRadius: 5,
        boxShadow: '0 0 10px rgba(0,0,0,0.3)',
        zIndex: 1000,
      }}
    >
      {message}
    </div>
  );
}
