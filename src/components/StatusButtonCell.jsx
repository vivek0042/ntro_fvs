import React from 'react';

const StatusButtonCell = ({ value, onUpdateStatus }) => {
  const buttonStyle = {
    padding: '3px 8px', // Reduced padding for a smaller button size
    borderRadius: '4px',
    cursor: 'pointer',
    color: '#fff',
    fontWeight: 'bold',
    fontSize: '0.875rem', // Slightly smaller font size
    border: 'none',
    outline: 'none',
  };

  const handleClick = () => {
    onUpdateStatus();
  };

  return (
    <button
      style={{ 
        ...buttonStyle, 
        backgroundColor: value ? 'green' : 'red' 
      }}
      onClick={handleClick}
    >
      {value ? 'Active' : 'Inactive'}
    </button>
  );
};

export default StatusButtonCell;
