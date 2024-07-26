import React, { createContext, useReducer, useContext, useEffect } from 'react';
import {reducer} from'./GlobalReducer';

import { get } from 'jquery';
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
  ReportType:0,
  ToDate:"",
  FromDate:""
 
};


export const GlobalStateProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

 


  return (
    <GlobalStateContext.Provider value={{ state, dispatch }}>
      {children}
    </GlobalStateContext.Provider>
  );
};

export const useGlobalState = () => useContext(GlobalStateContext);