// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LocationMaster from '../src/views/LocationMaster';
import Department from '../src/views/Department';
import Device from './views/Device';
import DeviceInventory from './views/DeviceInventory';
import DeviceUserMapping from './views/DeviceUserMapping';
import CardInventory from './views/CardInventory';
import Sidebar from './components/Sidebar';
import './App.css';
import { LocationProvider } from '../src/hooks/LocationContext'
import {AddLocation,AddAreaBuilding,AddDevice} from './components/Addlocation';
import AreaBuilding from './views/AreaBuilding';
// import { DepartmentProvider } from '../hooks/DepartmentContext';

function App() {
  return (
    <Router>
      <div className="app-container1">
        <Sidebar />
        <div className="main-content1">
          <LocationProvider>
            
              <Routes>
                <Route path="/" element={<LocationMaster />} />
                <Route path="/department" element={<Department />} />
                <Route path="/addlocation" element={<AddLocation/>}/>
                <Route path="/AreaBuilding" element={<AreaBuilding/>}/>
                <Route path="/Device" element={<Device/>}/>
                <Route path="/DeviceInventory" element={<DeviceInventory/>}/>
                <Route path="/DeviceUserMapping" element={<DeviceUserMapping/>}/>
                <Route path="/CardInventory" element={<CardInventory/>}/>
                {/* Add more routes as needed */}
              </Routes>
           
          </LocationProvider>
        </div>
      </div>
    </Router>
  );
}

export default App;
