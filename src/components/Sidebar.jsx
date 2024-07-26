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
            <Link to="/DashBoard/AdminDashBoard">DashBoard</Link>
          </li>
          <li>
            <Link to="/Transaction/EntityEnrollmentCardIssuance">Card</Link>
          </li>
          <li>
            <Link to="/Master/EntityMaster">Entity</Link>
          </li>
          <li>
            <ul>
              User
              <li>
                <Link to="/UserMaster/User">User</Link>
              </li>
              <li>
                <Link to="/UserMaster/UserRole">User-Role</Link>
              </li>
              <li>
                <Link to="/UserMaster/UserRolePermission">
                  UserRolePermission
                </Link>
              </li>
            </ul>
          </li>
          <li>
            <Link to="/Report/Report">Report</Link>
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
                <Link to="/Master/DeviceUserMapping">Device User Mapping</Link>
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
