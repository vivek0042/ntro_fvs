// Sidebar.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../assets/style/Sidebar.css'; // Import CSS for sidebar styling

const Sidebar = () => {
  return (
    <>
      <div className="sidebar">
        <h2>NTRO</h2>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/location-master">Location Master</Link>
          </li>
          <li>
            <Link to="/Device-Inventory">Device Master</Link>
          </li>
          {/* Add more navigation links as needed */}
        </ul>
      </div>
      
    </>
  );
};

export default Sidebar;
