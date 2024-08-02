import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { useGlobalState } from '../context/GlobalContext';
import { get } from '../services/api';
import logo from "../assets/images/ntro_logo.png";
import userimg from "../assets/images/dash_usersummary.svg";
import home from "../assets/images/configuration_icon.svg";

const Sidebar = () => {
  const [parentMenuItems, setParentMenuItems] = useState([]);
  const [configMenuItems, setConfigMenuItems] = useState([]);
  const [cookies] = useCookies(['userroleid']);
  const { state, dispatch } = useGlobalState();

  useEffect(() => {
    const fetchMenuItems = async () => {
      const parentMenus = await getMenuItems(cookies.userroleid, 0);
      const configMenus = await getMenuItems(cookies.userroleid, 1);
      setParentMenuItems(parentMenus);
      setConfigMenuItems(configMenus);
    };

    fetchMenuItems();
  }, [cookies.userroleid]); // Add cookies.userroleid as a dependency

  const getMenuItems = async (roleId, menuType) => {
    try {
      const response = await get(`UserMaster/GetMenuRoleWise?RoleID=${roleId}&MenuType=${menuType}`);
      return response || [];
    } catch (error) {
      console.error('Error fetching menu items:', error);
      return [];
    }
  };

  const filteredParentMenuItems = parentMenuItems
    .filter(item => item.ParentMenuId === 0)
    .map(item => ({
      OperationName: item.OperationName,
      ImgClassName: item.ImgClassName,
      ActionUrl: item.ActionUrl
    }));

  const filteredConfigMenuItems = configMenuItems
    .filter(item => item.ParentMenuId !== 0)
    .map(item => ({
      OperationName: item.OperationName,
      ImgClassName: item.ImgClassName,
      ActionUrl: item.ActionUrl
    }));

  const openConfig = (operationName) => () => {
    if (operationName === "Config Master") {
      dispatch({ type: "CONFIG_FORM", payload: true });
    } else {
      dispatch({ type: "CONFIG_FORM", payload: false });
    }
  };

  return (
    <div className="main-wrapper slide_layout_wrapper">
      <div className="row">
        <div className="custom_sidebar">
          <div className="nav flex-column nav-pills text-center" id="v-pills-tab" role="tablist" aria-orientation="vertical">
            <div className="user_type">
              <img src={logo} alt="user-icon" height="40" width="42" />
            </div>
            <ul>
              {filteredParentMenuItems.map(item => (
                <li 
                  key={item.OperationName} 
                  className={`nav-link ${item.OperationName === 'Admin Dashboard' ? 'first_child' : ''}`} 
                  title={item.OperationName}
                >
                  <Link 
                    to={item.ActionUrl} 
                    onClick={openConfig(item.OperationName)}
                    className="menu_box"
                  >
                    <div className={`menu_icon sprite ${item.ImgClassName}`}></div>
                    {item.OperationName === "Admin Dashboard" ? "DashBoard" : 
                     item.OperationName === "Card Issuance" ? "Card" : 
                     item.OperationName === "EntityMaster" ? "Entity" : 
                     item.OperationName === "Report Master" ? "Report" : 
                     item.OperationName === "Config Master" ? "Config" : 
                     item.OperationName === "User Management" ? "User" : 
                     item.OperationName}
                  </Link>
                </li>
              ))}
              <li className="nav-link last_child_user" title="User Image">
                <Link className="menu_box" to="#">
                  <div className="menu_icon">
                    <img src={userimg} className="nav-icon" alt="User img" width="30" height="30" />
                  </div>
                </Link>
              </li>
            </ul>
          </div>
        </div>
        {state.configMenu && (
          <div className="slide_menu" id="config_menu">
            <div className="d-flex align-items-center mt-2 mb-2">
              <img className="me-2" src={home} alt="Home" />
              <h2>Configuration</h2>
            </div>
            <div className="config_box">
              <div className="nav c_sidebar flex-column nav-pills">
                <ul>
                  {filteredConfigMenuItems.length > 0 && (
                    <>
                      <li>
                        <div className="config_subttl mt-3 mb-1" id="activelink">
                          Company Management
                        </div>
                        <ul className="config_submenu">
                          {filteredConfigMenuItems.filter(item => ['Location', 'AreaBuilding', 'Department', 'Company Profile'].includes(item.OperationName)).map(item => (
                            <li key={item.OperationName} className="nav-link" title={item.OperationName}>
                              <Link className="menu_box" to={item.ActionUrl}>{item.OperationName}</Link>
                            </li>
                          ))}
                        </ul>
                      </li>
                      <li>
                        <div className="config_subttl mt-3 mb-1" id="activelink">
                          Device Management
                        </div>
                        <ul className="config_submenu">
                          {filteredConfigMenuItems.filter(item => ['Device List', 'Device Mapping', 'Device Inventory', 'Device User Mapping'].includes(item.OperationName)).map(item => (
                            <li key={item.OperationName} className="nav-link" title={item.OperationName}>
                              <Link className="menu_box" to={item.ActionUrl}>{item.OperationName}</Link>
                            </li>
                          ))}
                        </ul>
                      </li>
                      <li>
                        <div className="config_subttl mt-3 mb-1" id="activelink">
                          Card Management
                        </div>
                        <ul className="config_submenu">
                          {filteredConfigMenuItems.filter(item => item.OperationName === 'CardInventoryMaster').map(item => (
                            <li key={item.OperationName} className="nav-link" title="Card Inventory">
                              <Link className="menu_box" to={item.ActionUrl}>Card Inventory</Link>
                            </li>
                          ))}
                        </ul>
                      </li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
