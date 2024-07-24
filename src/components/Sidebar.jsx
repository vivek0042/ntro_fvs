// Sidebar.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../assets/style/Sidebar.css"; // Import CSS for sidebar styling

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
            <ul>
          Master
            <li>
              <Link to="/Master/location-master">Location Master</Link>
            </li>
            <li>
              <Link to="/Master/DeviceList">Device List</Link>
            </li>
            <li>
              <Link to="/Master/Device-Inventory">Device Inventory</Link>
            </li>
            <li>
              <Link to="/Master/Card-Inventory">Card Inventory</Link>
            </li>
            <li>
              <Link to="/Master/Department">Department</Link>
            </li>
            <li>
              <Link to="/Master/AreaBuilding">AreaBuilding</Link>
            </li>
            <li>
              <Link to="/Master/CompanyProfile">CompanyProfile</Link>
            </li>
            </ul>
          </li>
          {/* Add more navigation links as needed */}
        </ul>
      </div>
    </>
  );
};

export default Sidebar;
