// App.jsx
import React from 'react';
import { BrowserRouter as Router,Routes, Route, Switch } from 'react-router-dom';
import MainLayout from './components/MainLayout';
import LocationMaster from './views/LocationMaster';
import DeviceInventory from './views/DeviceInventory';

function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
      
          <Route path="/location-master" element ={<LocationMaster/>} />
          <Route path="/Device-Inventory" element ={<DeviceInventory/>} />
          {/* Add more routes as needed */}
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;
