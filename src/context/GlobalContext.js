import React, { createContext, useReducer, useContext, useEffect } from 'react';
import {reducer} from'./GlobalReducer';
import { deleteDevice } from '../services/DeviceInventory.services';
const GlobalStateContext = createContext();

const initialState = {
  devices: [],
  TableData:[],
  locations: [],
  LocationDropDown:[],
  totalCount: 0,
  activeCount: 0,
  inactiveCount: 0,
  isFormOpen: false,
  selectedId: null,
};


export const GlobalStateProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(()=>{
    BindLocation();
  },[])
  
  const BindLocation = async () => {
    const response = await fetch(
      "http://192.168.11.212:8070/api/dropdown/getfilllocation"
    );
    const data = await response.json();
    if (Array.isArray(data.LocationDetails)) {
      dispatch({type:'Fill_DROPDOWN',payload:data.LocationDetails});
      
    }
  };
  
  return (
    <GlobalStateContext.Provider value={{ state, dispatch }}>
      {children}
    </GlobalStateContext.Provider>
  );
};

export const useGlobalState = () => useContext(GlobalStateContext);