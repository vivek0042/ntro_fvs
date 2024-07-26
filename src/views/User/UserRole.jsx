import React, { useCallback, useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import { FaEdit, FaTrash, FaDownload } from "react-icons/fa";
import "../../assets/style/Sidebar.css";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import StatusButtonCell from "../../components/StatusButtonCell";
import { updateStatus } from "../../services/common.services";
import { useGlobalState } from "../../context/GlobalContext";
import { toast } from "react-toastify";
import { del, post, get } from "../../services/api";

const UserRole = () => {
  const { state, dispatch } = useGlobalState();
  const { TableData, isFormOpen, LocationDropDown } = state;
  const [pageSize, setPageSize] = useState(10);
  const [gridApi, setGridApi] = useState(null);
  const [formData, setFormData] = useState({
    RoleId: 0,
    RoleName: "",
    RoleDescription: "",
    AuthType: 0,
    formType: "Add",
  });

  const columnDefs = [
    {
      headerName: "Role Name",
      field: "RoleName",
      sortable: true,
      filter: true,
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: "Role Description",
      field: "RoleDescription",
      sortable: true,
      filter: true,
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: "Auth Type",
      field: "AuthType",
      cellRenderer: params => {
        let style = {};
        let text = '';

        switch (params.data.AuthType) {
            case 1:
                style = { color: '#1077DA' };
                text = '2FA';
                break;
            case 2:
                style = { color: '#4B0EAE' };
                text = '3FA';
                break;
            default:
                style = { color: '#3BB264' };
                text = 'NFA';
                break;
        }

        return <span style={style}>{text}</span>;
    },
      sortable: true,
      filter: true,
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: "Status",
      field: "IsActive",
      cellRenderer: (params) => (
        <StatusButtonCell
          value={params.value}
          onUpdateStatus={() =>
            handleUpdateStatus(params.data.RoleId, !params.value)
          }
        />
      ),
      flex: 1,
      minWidth: 150,
    },
    {
      cellRenderer: (params) => (
        <>
          <FaEdit
            style={{ marginRight: "20px", cursor: "pointer", color: "skyblue" }}
            onClick={() => {
              dispatch({ type: "TOGGLE_FORM" });
              setFormData({
                RoleId: params.data.RoleId,
                RoleName: params.data.RoleName,
                RoleDescription: params.data.RoleDescription,
                AuthType: params.data.AuthType,
                formType: "Update",
              });
            }}
          />
        </>
      ),
      flex: 1,
      minWidth: 150,
    },
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const data = await get("UserMaster/GetAllUser");
      const UserRole = data.RoleDetails;
      dispatch({ type: "TABLE_DATA", payload: UserRole });
    } catch (error) {
      console.error("Error fetching devices:", error);
    }
  };

  const handleQuickFilter = (event) => {
    if (gridApi) {
      gridApi.setQuickFilter(event.target.value);
    }
  };

  const handleUpdateStatus = async (deviceId, newStatus) => {
    try {
      await updateStatus(deviceId, newStatus, "UserRole");

      if (newStatus == 1) toast.success("Activated Successfully");
      else if (newStatus == 0) toast.error("Deactivate Successfully");

      fetchData();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleExport = () => {
    if (gridApi) {
      const params = {
        columnKeys: [
          "RoleName",
          "RoleDescription",
          "AuthType",
          "IsActive",
        ],
      };
      gridApi.exportDataAsCsv(params);
    }
  };

  const onGridReady = useCallback(
    (params) => {
      setGridApi(params.api);
      params.api.paginationSetPageSize(pageSize);
    },
    [pageSize]
  );

  const handleAddUserRole = () => {
    dispatch({ type: "TOGGLE_FORM" });
  };

  const handleCancelForm = () => {
    dispatch({ type: "TOGGLE_FORM" });
    setFormData({
      RoleId: 0,
      RoleName: "",
      RoleDescription: "",
      AuthType: 0,
      formType: "Add",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await post("UserMaster/AddUser", { 
        RoleId: Number(formData.RoleId),
        RoleName: formData.RoleName,
        RoleDescription: formData.RoleDescription,
        AuthType: Number(formData.AuthType),
        Permission: ''
      });
      handleAddUserRole();
      fetchData();
      if (formData.formType == "Add") toast.success("Data Add successfully");
      else toast.success("Data Updated Successfully");

      setFormData({
        RoleId: 0,
        RoleName: "",
        RoleDescription: "",
        AuthType: 0,
        formType: "Add",
      });
    } catch (error) {
      toast.error("Error adding:" + error);
      console.error("Error adding:", error);
    }
  };

  return (
    <div className="content-inner">
      {isFormOpen ? (
        <div className="form-container">
          <form className="add-location-form" onSubmit={handleSubmit}>
            <h2>{formData.formType} User Role</h2>
            <div className="form-group">
              <>
                <label htmlFor="RoleName">Role Name</label>
                <input
                  type="text"
                  id="RoleName"
                  name="RoleName"
                  value={formData.RoleName}
                  onChange={handleChange}
                  required
                />
                <label htmlFor="RoleDescription">Role Description</label>
                <input
                  type="text"
                  id="RoleDescription"
                  name="RoleDescription"
                  value={formData.RoleDescription}
                  onChange={handleChange}
                  required
                />
    
                <label>Auth-Type</label>
                <div>
                  <input
                    className="RadioInput"
                    type="radio"
                    name="AuthType"
                    id="auth1"
                    value="0"
                    checked={formData.AuthType === 0||formData.AuthType==="0"}
                    onChange={handleChange}
                  />
                  <label className="RadioLabel" htmlFor="auth1">NFA</label>
                </div>
                <div>
                  <input
                    className="RadioInput"
                    type="radio"
                    name="AuthType"
                    id="auth2"
                    value="1"
                    checked={formData.AuthType === 1||formData.AuthType==="1"}
                    onChange={handleChange}
                  />
                  <label className="RadioLabel" htmlFor="auth2">2FA(Pin)</label>
                </div>
                <div>
                  <input
                    className="RadioInput"
                    type="radio"
                    name="AuthType"
                    id="auth3"
                    value="2"
                    checked={formData.AuthType === 2||formData.AuthType==="2"}
                    onChange={handleChange}
                  />
                  <label className="RadioLabel" htmlFor="auth3">3FA(Pin/Card/BioMetric)</label>
                </div>
              </>
            </div>
            <div className="form-buttons">
              <button type="submit" className="btn btn-add">
                {formData.formType} Role
              </button>
              <button
                type="button"
                className="btn btn-cancel"
                onClick={handleCancelForm}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : (
        <>
          <nav className="navbar">
            <div className="navbar-left">
              <span className="navbar-logo">User Role</span>
            </div>
            <div className="navbar-right">
              <button className="nav-button" onClick={handleAddUserRole}>
                Add Role
              </button>
              <button className="nav-button">Import Bulk</button>
            </div>
          </nav>

          <div className="grid-controls">
            <label>
              <span>Search: </span>
              <input
                type="text"
                onChange={handleQuickFilter}
                placeholder="Search..."
              />
            </label>
            <label>
              <FaDownload
                style={{ cursor: "pointer" }}
                onClick={handleExport}
              />
            </label>
          </div>
          <div className="ag-theme-alpine grid-container">
            <div style={{ height: "536px", width: "100%" }}>
              <AgGridReact
                columnDefs={columnDefs}
                rowData={TableData}
                pagination
                paginationPageSize={pageSize}
                defaultColDef={{
                  sortable: true,
                  filter: true,
                  flex: 1,
                  minWidth: 150,
                }}
                enableBrowserTooltips
                floatingFilter
                onGridReady={onGridReady}
              />
            </div>
          </div>
         
        </>
      )}
    </div>
  );
};

export default UserRole;
