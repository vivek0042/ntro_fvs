import React, { createContext, useReducer, useContext, useEffect } from 'react';
import { useCookies } from "react-cookie";
import { reducer } from './GlobalReducer';
import { get } from '../services/api'; // Assuming you have a get method in your api service

const GlobalStateContext = createContext();

const initialState = {
  devices: [],
  TableData: [],
  locations: [],
  LocationDropDown: [],
  RoleRights: [],
  totalCount: 0,
  activeCount: 0,
  inactiveCount: 0,
  isFormOpen: false,
  configMenu: false,
  ReportType: 0,
  ToDate: "",
  FromDate: ""
};

export const GlobalStateProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [cookies] = useCookies(["userroleid", "UserId"]);

  useEffect(() => {
    const roleRights = async () => {
      try {
        const data = await get(`UserMaster/GetUserRoleRights?id=${cookies.userroleid}`);
        if (data && data.UserRolePermissionMasterDetails) {
          dispatch({ type: "ROLE_RIGHT", payload: data.UserRolePermissionMasterDetails });
        } else {
          console.error("Invalid data format:", data);
        }
      } catch (error) {
        console.error("Error fetching role rights:", error);
      }
    };

    if (cookies.userroleid) {
      roleRights();
    }
  }, [cookies.userroleid]); // Add cookies.userroleid as a dependency

  return (
    <GlobalStateContext.Provider value={{ state, dispatch }}>
      {children}
    </GlobalStateContext.Provider>
  );
};

export const useGlobalState = () => useContext(GlobalStateContext);
