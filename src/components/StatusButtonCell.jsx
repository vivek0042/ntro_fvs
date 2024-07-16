const StatusButtonCell = ({ value, onUpdateStatus }) => {
    const buttonStyle = {
      padding: '5px 10px',
      borderRadius: '4px',
      cursor: 'pointer',
      color: '#fff',
      fontWeight: 'bold',
      border: 'none',
      outline: 'none',
    };
  
    const handleClick = () => {
      onUpdateStatus();
    };
  
    return (
      <button
        style={{ ...buttonStyle, backgroundColor: value ? 'green' : 'red' }}
        onClick={handleClick}
      >
        {value ? 'Active' : 'Inactive'}
      </button>
    );
  };

  export default StatusButtonCell;