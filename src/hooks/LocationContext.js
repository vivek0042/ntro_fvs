// LocationContext.js
import React, { createContext, useState } from 'react';

export const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
  const [locations, setLocations] = useState([]);
  const [countDetails, setCountDetails] = useState({ TotalCountActiveInActive: 0, ActiveCount: 0, InActiveCount: 0 });

  return (
    <LocationContext.Provider value={{ locations, setLocations, countDetails, setCountDetails }}>
      {children}
    </LocationContext.Provider>
  );
};
