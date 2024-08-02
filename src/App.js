import withAuth from "./components/withAuth ";
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./components/MainLayout";
import LocationMaster from "./views/Master/LocationMaster";
import DeviceInventory from "./views/Master/DeviceInventory";
import DeviceList from "./views/Master/DeviceList";
import CardInventory from "./views/Master/CardInventory";
import { ToastContainer } from "react-toastify";
import { GlobalStateProvider } from "./context/GlobalContext";
import "react-toastify/dist/ReactToastify.css";
import DeviceUserMapping from "./views/Master/DeviceUserMapping";
import Report from "./views/Report/Report";
import CardReport from "./views/Report/CardReport";
import DeviceReport from "./views/Report/DeviceReport";
import User from "./views/User/User";
import UserRole from "./views/User/UserRole";
import UserRolePermission from "./views/User/UserRolePermission";
import EntityMaster from "./views/Master/Entity";
import AdminDashBoard from "./views/DashBoard/AdminDashBoard";
import SignIn from "./views/Login";
import EntityEnrollmentCardIssuance from "./views/Transaction/EntityEnrollmentCardIssuance";
import { get } from "../src/services/api";
import { useCookies } from "react-cookie";
import { useGlobalState } from "./context/GlobalContext";
// Use withAuth to protect your components
const ProtectedAdminDashBoard = withAuth(AdminDashBoard);
const ProtectedLocationMaster = withAuth(LocationMaster);
const ProtectedDeviceInventory = withAuth(DeviceInventory);
const ProtectedDeviceList = withAuth(DeviceList);
const ProtectedCardInventory = withAuth(CardInventory);
const ProtectedDeviceUserMapping = withAuth(DeviceUserMapping);
const ProtectedReport = withAuth(Report);
const ProtectedCardReport = withAuth(CardReport);
const ProtectedDeviceReport = withAuth(DeviceReport);
const ProtectedUser = withAuth(User);
const ProtectedUserRole = withAuth(UserRole);
const ProtectedUserRolePermission = withAuth(UserRolePermission);
const ProtectedEntityMaster = withAuth(EntityMaster);
const ProtectedEntityEnrollmentCardIssuance = withAuth(
  EntityEnrollmentCardIssuance
);

function App() {
  const [actionUrls, setActionUrls] = useState([]);

  const [cookies] = useCookies(["userroleid", "UserId"]);
  useEffect(() => {
    roleRights();
  }, [cookies.userroleid]);
  const roleRights = async () => {
    const data = await get(
      "UserMaster/GetUserRoleRights?id=" + cookies.userroleid
    );
  
    const actionUrls = data.UserRolePermissionMasterDetails.filter(
      (item) => item.CanView
    ).map((item) => item.ActionUrl);

    setActionUrls(actionUrls);
  };
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
                  {actionUrls.includes("/Home/Admindashboard") && (
                    <Route
                      path="/DashBoard/Admindashboard"
                      element={<ProtectedAdminDashBoard />}
                    />
                  )}
                  {actionUrls.includes("/master/LocationMaster") && (
                    <Route
                      path="/master/LocationMaster"
                      element={<ProtectedLocationMaster />}
                    />
                  )}
                  {actionUrls.includes("/master/DeviceMaster") && (
                    <Route
                      path="/master/DeviceMaster"
                      element={<ProtectedDeviceList />}
                    />
                  )}
                  {actionUrls.includes("/master/DeviceInventory") && (
                    <Route
                      path="/master/DeviceInventory"
                      element={<ProtectedDeviceInventory />}
                    />
                  )}
                  {actionUrls.includes("/master/CardInventoryMaster") && (
                    <Route
                      path="/master/CardInventoryMaster"
                      element={<ProtectedCardInventory />}
                    />
                  )}
                  {actionUrls.includes("/master/DeviceUserMapping") && (
                    <Route
                      path="/master/DeviceUserMapping"
                      element={<ProtectedDeviceUserMapping />}
                    />
                  )}
                  {actionUrls.includes("/Report/Report") && (
                    <Route
                      path="/Report/Report"
                      element={<ProtectedReport />}
                    />
                  )}
                  {actionUrls.includes("/Report/Report") && (
                    <Route
                      path="/Report/CardReport"
                      element={<ProtectedCardReport />}
                    />
                  )}
                  {actionUrls.includes("/Report/Report") && (
                    <Route
                      path="/Report/DeviceReport"
                      element={<ProtectedDeviceReport />}
                    />
                  )}
                  {actionUrls.includes("/UserMaster/User") && (
                    <Route
                      path="/UserMaster/User"
                      element={<ProtectedUser />}
                    />
                  )}
                  {actionUrls.includes("/UserMaster/UserRole") && (
                    <Route
                      path="/UserMaster/UserRole"
                      element={<ProtectedUserRole />}
                    />
                  )}
                  {actionUrls.includes("/UserMaster/UserRolePermission") && (
                    <Route
                      path="/UserMaster/UserRolePermission"
                      element={<ProtectedUserRolePermission />}
                    />
                  )}
                  {actionUrls.includes("/master/EntityMaster") && (
                    <Route
                      path="/Master/EntityMaster"
                      element={<ProtectedEntityMaster />}
                    />
                  )}
                  {actionUrls.includes("/Transaction/EntityEnrollmentandcardIssuance") && (
                    <Route
                      path="/Transaction/EntityEnrollmentandcardIssuance"
                      element={<ProtectedEntityEnrollmentCardIssuance />}
                    />
                  )}
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
