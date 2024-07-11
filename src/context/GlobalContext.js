import React, { createContext, useReducer, useContext } from 'react';
import {reducer} from'./GlobalReducer';
import { deleteDevice } from '../services/DeviceInventory.services';
const GlobalStateContext = createContext();

const initialState = {
  devices: [],
  TableData:[],
  locations: [],
  totalCount: 0,
  activeCount: 0,
  inactiveCount: 0,
  isFormOpen: false,
  selectedId: null,
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