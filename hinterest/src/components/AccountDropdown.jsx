import React, { useState } from 'react';

export default function AccountDropdown() {
  const [open, setOpen] = useState(false);

  const handleToggle = () => setOpen(!open);

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button onClick={handleToggle} style={{
        padding: '8px 12px',
        borderRadius: '6px',
        backgroundColor: '#f0f0f0',
        border: '1px solid #ccc',
        cursor: 'pointer'
      }}>
        Account ⌄
      </button>

      {open && (
        <div style={{
          position: 'absolute',
          top: '100%',
          right: 0,
          backgroundColor: 'white',
          border: '1px solid #ccc',
          borderRadius: '6px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          zIndex: 1000,
          marginTop: '8px',
          minWidth: '150px'
        }}>
          <div style={menuItemStyle}>Profile</div>
          <div style={menuItemStyle}>Settings</div>
          <div style={menuItemStyle}>Logout</div>
        </div>
      )}
    </div>
  );
}

const menuItemStyle = {
  padding: '10px 15px',
  cursor: 'pointer',
  borderBottom: '1px solid #eee',
  backgroundColor: 'white',
  transition: 'background 0.2s',
};