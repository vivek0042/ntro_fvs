import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './components/MainLayout';
import LocationMaster from './views/Master/LocationMaster';
import DeviceInventory from './views/Master/DeviceInventory';
import DeviceList from './views/Master/DeviceList';
import CardInventory from './views/Master/CardInventory';
import { ToastContainer } from 'react-toastify';
import { GlobalStateProvider } from './context/GlobalContext';
import 'react-toastify/dist/ReactToastify.css';
import DeviceUserMapping from './views/Master/DeviceUserMapping';
import Report from './views/Report/Report';
import CardReport from './views/Report/CardReport';
import DeviceReport from './views/Report/DeviceReport';
import User from './views/User/User';
import UserRole from './views/User/UserRole';
import UserRolePermission from './views/User/UserRolePermission';
import EntityMaster from './views/Master/Entity';
import AdminDashBoard from './views/DashBoard/AdminDashBoard';
import SignIn from './views/Login';
import EntityEnrollmentCardIssuance from './views/Transaction/EntityEnrollmentCardIssuance';

function App() {
  return (
    <GlobalStateProvider>
      <Router>
        <ToastContainer />
        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route
            path="*"
            element={
              <MainLayout>
                <Routes>
                  <Route path="/DashBoard/AdminDashBoard" element={<AdminDashBoard />} />
                  <Route path="/Master/location-master" element={<LocationMaster />} />
                  <Route path="/Master/DeviceList" element={<DeviceList />} />
                  <Route path="/Master/Device-Inventory" element={<DeviceInventory />} />
                  <Route path="/Master/Card-Inventory" element={<CardInventory />} />
                  <Route path="/Master/DeviceUserMapping" element={<DeviceUserMapping />} />
                  <Route path="/Report/Report" element={<Report />} />
                  <Route path="/Report/CardReport" element={<CardReport />} />
                  <Route path="/Report/DeviceReport" element={<DeviceReport />} />
                  <Route path="/UserMaster/User" element={<User />} />
                  <Route path="/UserMaster/UserRole" element={<UserRole />} />
                  <Route path="/UserMaster/UserRolePermission" element={<UserRolePermission />} />
                  <Route path="/Master/EntityMaster" element={<EntityMaster />} />
                  <Route path="/Transaction/EntityEnrollmentCardIssuance" element={<EntityEnrollmentCardIssuance />} />
                </Routes>
              </MainLayout>
            }
          />
        </Routes>
      </Router>
    </GlobalStateProvider>
  );
}

export default App;
