// App.jsx
import React from 'react';
import { BrowserRouter as Router,Routes, Route, Switch } from 'react-router-dom';
import MainLayout from './components/MainLayout';
import LocationMaster from './views/Master/LocationMaster';
import DeviceInventory from './views/Master/DeviceInventory';
import DeviceList from './views/Master/DeviceList';
import CardInventory from './views/Master/CardInventory';
import AreaBuilding from './views/Master/AreaBuilding';

import { ToastContainer } from 'react-toastify';
import { GlobalStateProvider } from './context/GlobalContext';
import 'react-toastify/dist/ReactToastify.css';
import Department from '../src/views/Master/Department';
import CompanyProfile from './views/Master/CompanyProfile';

function App() {
  return (
    <GlobalStateProvider>
    <Router>
      <ToastContainer />
      <MainLayout>
        <Routes>
          <Route path="/Master/location-master" element ={<LocationMaster/>} />
          <Route path='/Master/DeviceList' element={<DeviceList/>}/>
          <Route path="/Master/Device-Inventory" element ={<DeviceInventory/>} />
          <Route path="/Master/Card-Inventory" element ={<CardInventory/>} />
          <Route path ="/Master/Department" element={<Department/>}/>
          <Route path="/Master/AreaBuilding" element={<AreaBuilding/>}/>
          <Route path="Master/CompanyProfile" element = {<CompanyProfile/>}/>
          {/* Add more routes as needed */}
        </Routes>
      </MainLayout>
    </Router>
    </GlobalStateProvider>
  );
}

export default App;
