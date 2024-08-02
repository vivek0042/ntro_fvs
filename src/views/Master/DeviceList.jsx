import React, { useCallback, useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import { FaEdit, FaTrash ,FaDownload} from "react-icons/fa";
import '../../assets/style/Sidebar.css'
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import StatusButtonCell from "../../components/StatusButtonCell";
import CountHeader from "../../components/Count";
import { updateStatus } from "../../services/common.services";
import { useGlobalState } from "../../context/GlobalContext";
import { toast } from "react-toastify";
import { del, post ,get} from "../../services/api";
import { InventoryCount } from "../../components/Count";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";

const DeviceList = () => {
  const { state, dispatch } = useGlobalState();
  const {
    devices,
    totalCount,
    activeCount,
    inactiveCount,
    isFormOpen,
    LocationDropDown,
    RoleRights
  } = state;
  const obj = RoleRights.filter(
    (item) =>
      item.ActionUrl == "/master/DeviceMaster" &&
      item.OperationName == "Device List"
  );
  const [pageSize, setPageSize] = useState(10);
  const [gridApi, setGridApi] = useState(null);
  const [formData, setFormData] = useState({
    Id: 0,
    DeviceId: 0,
    deviceSerialNo: "",
    DeviceType: "",
    DeviceModelName: "",
    DeviceIp: "",
    LocationId: 0,
    formType: "Add",
  });
  
  const [open, setOpen] = useState(false);
  const [deviceToDelete, setDeviceToDelete] = useState(0);

  const handleClickOpen = (deviceId) => {
    setDeviceToDelete(deviceId);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setDeviceToDelete(0);
  };

  const handleConfirmDelete = async () => {
    try {
      const data = await del("Master/DeleteDevices", {
        DeviceId: Number(deviceToDelete),
        Deleteby: 0,
      });
      fetchData();
      toast.error("Delete Device Successfully");
      handleClose();
    } catch (error) {
      console.error("Error deleting device:", error);
    }
  };

  const columnDefs = [
    {
      headerName: "Device Id",
      field: "DeviceId",
      sortable: true,
      filter: true,
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: "Serial No",
      field: "DeviceSerialNo",
      sortable: true,
      filter: true,
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: "Device Type",
      field: "DeviceType",
      sortable: true,
      filter: true,
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: "Model Name",
      field: "DeviceModelName",
      sortable: true,
      filter: true,
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: "Device Ip",
      field: "DeviceIp",
      sortable: true,
      filter: true,
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: "Location Name",
      field: "LocationName",
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
         {obj[0].CanEdit && (
          <FaEdit
            style={{ marginRight: "20px", cursor: "pointer", color: "skyblue" }}
            onClick={() => {
              dispatch({ type: "TOGGLE_FORM" });
              setFormData({
                Id: params.data.Id,
                DeviceId: params.data.DeviceId,
                deviceSerialNo: params.data.DeviceSerialNo,
                DeviceType: params.data.DeviceType,
                DeviceModelName: params.data.DeviceModelName,
                DeviceIp: params.data.DeviceIp,
                LocationId: params.data.LocationId,
                formType: "Update",
              });
            }}
          />)}
             {obj[0].CanDelete && (
          <FaTrash
            style={{ marginRight: "10px", cursor: "pointer", color: "crimson" }}
            onClick={() => handleClickOpen(params.data.Id)}
          />)}
        </>
      ),
      flex: 1,
      minWidth: 150,
    },
  ];

  useEffect(() => {
    BindLocation();
    fetchData();
    
  }, []);

  const BindLocation = async () => {
    const data = await get('dropdown/getfilllocation');

    if (Array.isArray(data.LocationDetails)) {
      dispatch({type:'Fill_DROPDOWN',payload:data.LocationDetails});
      
    }
  };

  const fetchData = async () => {
    try{
      const data = await get('Master/GetAllDevice');
      const devices = data.DeviceDetails;
      dispatch({ type: "SET_DEVICES", payload: devices });
      dispatch({
        type: "SET_COUNTS",
        payload: {
          totalCount: devices.length,
          activeCount: devices.filter((dev) => dev.IsActive).length,
          inactiveCount: devices.filter((dev) => !dev.IsActive).length,
        },
      });
      }
      catch(error){
        console.error('Error fetching devices:', error);
      }
    
  };

  const handleQuickFilter = (event) => {
    if (gridApi) {
      gridApi.setQuickFilter(event.target.value);
    }
  };

  const handleUpdateStatus = async (deviceId, newStatus) => {
    try {
      await updateStatus(deviceId, newStatus, "Device");

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
          "DeviceId",
          "DeviceSerialNo",
          "DeviceType",
          "DeviceModelName",
          "DeviceIp",
          "LocationName",
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

  const handleAddDevice = () => {
    dispatch({ type: "TOGGLE_FORM" });
  };

  const handleCancelForm = () => {
    dispatch({ type: "TOGGLE_FORM" });
    setFormData({
      Id: 0,
      locationName: "",
      deviceSerialNo: "",
      DeviceType: "",
      DeviceModelName: "",
      DeviceIp: "",
      LocationId: 0,
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
      const response = await post("master/AddDevice", {
        Id: Number(formData.Id),
      DeviceId: Number(formData.DeviceId),
      DeviceSerialNo: formData.deviceSerialNo,
      DeviceType: formData.DeviceType,
      DeviceModelName: formData.DeviceModelName,
      LocationId: Number(formData.LocationId),
      DeviceIp: formData.DeviceIp,
      LocationName: "",
      Remark: "",
      });

      handleAddDevice();
      fetchData();
      if (formData.formType == "Add") toast.success("Data Add successfully");
      else toast.success("Data Updated Successfully");
    
      setFormData({
        locationName: "",
        deviceSerialNo: "",
        DeviceType: "",
        DeviceModelName: "",
        DeviceIp: "",
        LocationId: 0,
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
            <h2>{formData.formType} Device</h2>
            <div className="form-group">
              <>
                <label htmlFor="deviceSerialNo">Device Serial No</label>
                <input
                  type="text"
                  id="deviceSerialNo"
                  name="deviceSerialNo"
                  value={formData.deviceSerialNo}
                  onChange={handleChange}
                  required
                />
                <label htmlFor="DeviceModelName">Model Name</label>
                <input
                  type="text"
                  id="DeviceModelName"
                  name="DeviceModelName"
                  value={formData.DeviceModelName}
                  onChange={handleChange}
                  required
                />
                <label htmlFor="DeviceType">Device Type</label>
                <input
                  type="text"
                  id="DeviceType"
                  name="DeviceType"
                  value={formData.DeviceType}
                  onChange={handleChange}
                  required
                />
                <label htmlFor="DeviceIp">Device Ip</label>
                <input
                  type="text"
                  id="DeviceIp"
                  name="DeviceIp"
                  value={formData.DeviceIp}
                  onChange={handleChange}
                  required
                />
                <label htmlFor="LocationId">Location</label>
                <select
                  id="LocationId"
                  name="LocationId"
                  value={formData.LocationId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a location</option>
                  {LocationDropDown.map((location) => (
                    <option
                      key={location.LocationId}
                      value={location.LocationId}
                    >
                      {location.LocationName}
                    </option>
                  ))}
                </select>
              </>
            </div>
            <div className="form-buttons">
              <button type="submit" className="btn btn-add">
                {formData.formType} Device
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
      <span className="navbar-logo">Device List</span>
      </div>
      <div className="navbar-right">
      {obj[0].CanAdd && (
        <button className="nav-button" onClick={handleAddDevice}>Add Device</button>)}
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
              
              <FaDownload style={{cursor : "pointer"}} onClick={handleExport}/>
             
              
            </label>
          </div>
          <div className="ag-theme-alpine grid-container">
            <div style={{ height: "536px", width: "100%" }}>
              <AgGridReact
                columnDefs={columnDefs}
                rowData={devices}
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
            <DialogTitle id="alert-dialog-title">{"Delete Device"}</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Are you sure you want to delete this device?
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

export default DeviceList;
