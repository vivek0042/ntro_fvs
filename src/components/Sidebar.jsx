// Sidebar.js
import React from 'react';
import { Link } from 'react-router-dom';
import '../assets/style/Sidebar.css';
import AreaBuilding from '../views/AreaBuilding';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <ul className="sidebar-list">
        <li className="sidebar-item">
          <Link to="/" className='item-1'>Location Master</Link>
        </li>
        <li className="sidebar-item">
          <Link to="/department">Department</Link>
        </li>
        <li className="sidebar-item">
          <Link to="/AreaBuilding">AreaBuilding</Link>
        </li>
        <li className="sidebar-item">
          <Link to="/Device">Device</Link>
        </li>
        <li className='sidebar-item'>
          <Link to="/DeviceInventory">Deviceinventory</Link>
        </li>
        <li className='sidebar-item'>
          <Link to="/DeviceUserMapping">DeviceUserMapping</Link>
        </li>
        <li className='sidebar-item'>
          <Link to="/CardInventory">CardInventory</Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
