// MainLayout.jsx
import React, { useState } from 'react';
import Sidebar from './Sidebar';
import '../assets/style/MainLayout.css'; // Import CSS for layout styling

const MainLayout = ({ children }) => {
 
  return (
    <div className="main-layout">
      <div>
      <Sidebar />
      </div>
      <div className="content">
        {children}
      </div>
    </div>
  );
};

export default MainLayout;
