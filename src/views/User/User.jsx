import React, { useCallback, useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import { FaEdit, FaTrash, FaDownload } from "react-icons/fa";
import "../../assets/style/Sidebar.css";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import StatusButtonCell from "../../components/StatusButtonCell";
import CountHeader from "../../components/Count";
import { updateStatus } from "../../services/common.services";
import { useGlobalState } from "../../context/GlobalContext";
import { toast } from "react-toastify";
import { del, post, get } from "../../services/api";
import { InventoryCount } from "../../components/Count";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";

const User = () => {
  const { state, dispatch } = useGlobalState();
  const {
    TableData,
    totalCount,
    activeCount,
    inactiveCount,
    isFormOpen,
    LocationDropDown,
  } = state;
  const [pageSize, setPageSize] = useState(10);
  const [gridApi, setGridApi] = useState(null);
  const [formData, setFormData] = useState({
    Id: 0,
    UserId: "",
    FirstName: "",
    LastName: "",
    Password: "",
    EmailAddress: "",
    RoleId: 0,
    RoleName: "",
    formType: "Add",
  });

  const [open, setOpen] = useState(false);
  const [edit,setEdit]=useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const [deviceToDelete, setDeviceToDelete] = useState(0);

  const handleClickOpen = (userId) => {
    setOpen(true);
    setDeviceToDelete(userId)
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirmDelete = async () => {
    try {
      const data = await del("UserMaster/DeleteUserManagement", {
        Id: Number(deviceToDelete),
        Deleteby: 0,
      });
      fetchData();
      toast.error("Delete User Successfully");
      handleClose();
    } catch (error) {
      console.error("Error deleting User:", error);
    }
  };

  const columnDefs = [
    {
      headerName: "User Id",
      field: "UserId",
      sortable: true,
      filter: true,
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: "First Name",
      field: "FirstName",
      sortable: true,
      filter: true,
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: "Last Name",
      field: "LastName",
      sortable: true,
      filter: true,
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: "Email Address",
      field: "EmailAddress",
      sortable: true,
      filter: true,
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: "Role Name",
      field: "RoleName",
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
            handleUpdateStatus(params.data.Id, !params.value)
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
                Id: params.data.Id,
                UserId: params.data.UserId,
                FirstName: params.data.FirstName,
                LastName: params.data.LastName,
                Password: params.data.Password,
                EmailAddress: params.data.EmailAddress,
                RoleId: params.data.RoleId,
                RoleName: params.data.RoleName,
                formType: "Update",
              });
              setIsDisabled(false);
              setEdit(true);
            }}
          />
          <FaTrash
            style={{ marginRight: "10px", cursor: "pointer", color: "crimson" }}
            onClick={() => handleClickOpen(params.data.Id)}
          />
        </>
      ),
      flex: 1,
      minWidth: 150,
    },
  ];

  useEffect(() => {
    BindRole();
    fetchData();
  }, []);

  const BindRole = async () => {
    const data = await get("DropDown/GetFillRole");

    if (Array.isArray(data.RoleDetails)) {
      dispatch({ type: "Fill_DROPDOWN", payload: data.RoleDetails });
    }
  };
 
  const fetchData = async () => {
    try {
      const data = await get("UserMaster/GetUserManagement?id=0");
      const user = data.UserManagementDetails;
      dispatch({ type: "TABLE_DATA", payload: user });
      dispatch({
        type: "SET_COUNTS",
        payload: {
          totalCount: user.length,
          activeCount: user.filter((dev) => dev.IsActive).length,
          inactiveCount: user.filter((dev) => !dev.IsActive).length,
        },
      });
    } catch (error) {
      console.error("Error fetching User:", error);
    }
  };

  const handleQuickFilter = (event) => {
    if (gridApi) {
      gridApi.setQuickFilter(event.target.value);
    }
  };

  const handleUpdateStatus = async (userId, newStatus) => {
    try {
      await updateStatus(userId, newStatus, "User");

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
          "UserId",
          "FirstName",
          "LastName",
          "Password",
          "EmailAddress",
          "RoleName",
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

  const handleAddUser = () => {
    dispatch({ type: "TOGGLE_FORM" });
  };

  const handleCancelForm = () => {
    dispatch({ type: "TOGGLE_FORM" });
    setFormData({
      Id: 0,
      UserId: "",
      FirstName: "",
      LastName: "",
      Password: "",
      EmailAddress: "",
      RoleId: 0,
      RoleName: "",
      formType: "Add",
    });
    setIsDisabled(true)
    setEdit(false);
  };

  const adidVerification = async (e) => {

    try {
        var d = new Date();
        var _txn = d.valueOf().toString();
       
       
        var objreq = {
            txn: _txn,
            adid: e.target.value,
            mode: "",
            IsEnrollment: "2"
        };
      const data = await post("Transaction/getaddetails",objreq);

      if (data != null) {
        if (data.ec == "0") {
          toast.success("ADId User found in Active directory.");
          setIsDisabled(false);
        } else if (data.ec == "204") {
          toast.error("ADId User already Exits.");
          setIsDisabled(true);
        } else if (data.ec == "225") {
          toast.success("Valid ADId User Found.");
          setIsDisabled(true);
        } else if (data.ec == "210") {
          toast.error("ADId User not found in Active directory.");
          setIsDisabled(true);
        } else if (data.ec == "310") {
          toast.success("ADId User found in Active directory.");
          setIsDisabled(false);
          document.getElementById("UserId").setAttribute("disabled","true");
          setFormData((prevState) => ({
            ...prevState,
            FirstName: data.firstName,
            LastName: data.lastName,
            EmailAddress: data.email,
          }));
        } else {
            setIsDisabled(true);
        }
      }
    } catch (error) {}
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

    const body = {
      Id: Number(formData.Id),
      UserId: formData.UserId,
      FirstName: formData.FirstName,
      LastName: formData.LastName,
      EmailAddress: formData.EmailAddress,
      Password: formData.Password||"",
      RoleId: formData.RoleId,
      RoleName: formData.RoleName,
    EntityAdId: ""
    };

    try {
      const response = await post("UserMaster/AddUserManagement", body);

      handleAddUser();
      fetchData();
      if (formData.formType == "Add") toast.success("Data Add successfully");
      else toast.success("Data Updated Successfully");

      setFormData({
        Id: 0,
        UserId: "",
        FirstName: "",
        LastName: "",
        Password: "",
        EmailAddress: "",
        RoleId: 0,
        RoleName: "",
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
            <h2>{formData.formType} User</h2>
            <div className="form-group">
              <>
                <label htmlFor="UserId">User ID(ADId User)</label>
                <input
                  type="text"
                  id="UserId"
                  name="UserId"
                  value={formData.UserId}
                  onChange={handleChange}
                  onBlur={adidVerification}
                  disabled={edit}
                  required
                />
                <label htmlFor="FirstName">First Name</label>
                <input
                  type="text"
                  id="FirstName"
                  name="FirstName"
                  value={formData.FirstName}
                  onChange={handleChange}
                  disabled={isDisabled}
                  required
                />
                <label htmlFor="LastName">Last Name</label>
                <input
                  type="text"
                  id="LastName"
                  name="LastName"
                  value={formData.LastName}
                  onChange={handleChange}
                  disabled={isDisabled}
                  required
                />
                <label htmlFor="EmailAddress">Email Address</label>
                <input
                  type="text"
                  id="EmailAddress"
                  name="EmailAddress"
                  value={formData.EmailAddress}
                  onChange={handleChange}
                  disabled={isDisabled}
                  required
                />
                <label htmlFor="RoleId">Role</label>
                <select
                  id="RoleId"
                  name="RoleId"
                  value={formData.RoleId}
                  onChange={handleChange}
                  disabled={isDisabled}
                  required
                >
                  <option value="">Select a Role</option>
                  {LocationDropDown.map((location) => (
                    <option
                      key={location.RoleId}
                      value={location.RoleId}
                    >
                      {location.RoleName}
                    </option>
                  ))}
                </select>
              </>
            </div>
            <div className="form-buttons">
              <button type="submit" className="btn btn-add">
                {formData.formType} User
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
              <span className="navbar-logo">User</span>
            </div>
            <div className="navbar-right">
              <button className="nav-button" onClick={handleAddUser}>
                Add User
              </button>
              <button className="nav-button">Import Bulk</button>
            </div>
          </nav>

          <CountHeader
            totalCount={totalCount}
            activeCount={activeCount}
            inactiveCount={inactiveCount}
          />
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
          <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">{"Delete User"}</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Are you sure you want to delete this user?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="primary">
                Cancel
              </Button>
              <Button onClick={handleConfirmDelete} color="primary" autoFocus>
                Delete
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </div>
  );
};

export default User;
