import React, { useCallback, useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import { FaEdit, FaTrash ,FaDownload} from "react-icons/fa";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import StatusButtonCell from "../../components/StatusButtonCell";
import Form from "../../components/Form";
import { updateStatus } from "../../services/common.services";
import { useGlobalState } from "../../context/GlobalContext";
import { post,get,del } from "../../services/api";
import { toast } from "react-toastify";
import { InventoryCount } from "../../components/Count";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";
const DeviceInventory = () => {
  const { state, dispatch } = useGlobalState();
  const {
    devices,
    isFormOpen,
    LocationDropDown,
 
  } = state;

  const [pageSize, setPageSize] = useState(10);
  const [gridApi, setGridApi] = useState(null);
  const [InvCount, setInvCount] = useState([]);
  

  const [formData, setFormData] = useState({
    deviceSerialNo: '',
    DeviceType: '',
    DeviceModelName: '',
    DeviceIp: '',
    LocationId: 0,
    CardStatusID: 0,
    Remark: '',
    formType: "Add",
  });

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
      headerName: "Device Status",
      field: "CardStatusID",
      cellRenderer: params => {
        let style = {};
        let text = '';

        switch (params.data.CardStatusID) {
            case 1:
                style = { color: '#4B0EAE' };
                text = 'Received';
                break;
            case 2:
                style = { color: '#1077DA' };
                text = 'InTransit';
                break;
            case 3:
                style = { color: '#3BB264' };
                text = 'Allocated';
                break;
            case 4:
                style = { color: '#CC4A31' };
                text = 'UnAllocated';
                break;
            case 5:
                style = { color: '#F07A20' };
                text = 'Withdrawn';
                break;
            default:
                text = '';
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
      headerName: "Remark",
      field: "Remark",
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
                DeviceId: params.data.DeviceId,
                deviceSerialNo: params.data.DeviceSerialNo,
                DeviceType: params.data.DeviceType,
                DeviceModelName: params.data.DeviceModelName,
                DeviceIp: params.data.DeviceIp,
                LocationId: params.data.LocationId,
                Remark:params.data.Remark,
                CardStatusID:params.data.CardStatusID,
                formType: "Update",
              });
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
    InventoryCountDetail();
    BindLocation();
    fetchData();
   
  }, []);

//Handle Global State
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
    }
    catch(error){
      console.error('Error fetching devices:', error);
    }
      
  };

  const InventoryCountDetail = async () => {
    const payload = {
      ParamName: "DeviceInventory",
      sDeviceSerialNo: "",
      sLocationId: 0,
      sCardStatusID: 0,
      sFromDate: "",
      sToDate: "",
      sAreaBuildingID: 0,
      sId: 0,
      sDeviceId: "",
      sDeviceModelName: "",
      sDeviceType: "",
      sLocationName: "",
      sDeviceIp: "",
      sMappingFlag: 0,
      sRemark: "",
      sIsActive: 0,
      userID: "",
      firstName: "",
      lastName: "",
      emailAddress: "",
      role: 0,
    };
    const res = await post("Master/InventoryCountDetailsFilter", payload);
    setInvCount(res.InventoryCountDeatils);
  };

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
      CardStatusID:0,
      Remark:""
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
        Remark: formData.Remark,
        CardStatusID : formData.CardStatusID
      });

      handleAddDevice();
      fetchData();
      if (formData.formType == "Add") toast.success("Data Add successfully");
      else toast.success("Data Updated Successfully");
      InventoryCountDetail();
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

  // Ag-grid dataTable Function

  const handleQuickFilter = (event) => {
    if (gridApi) {
      gridApi.setQuickFilter(event.target.value);
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
          "CardStatusID",
          "Remark",
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

  //view

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
                  <option key={location.LocationId} value={location.LocationId}>
                    {location.LocationName}
                  </option>
                ))}
              </select>

              <label htmlFor="CardStatusID">Device Status</label>
              <select
                id="CardStatusID"
                name="CardStatusID"
                value={formData.CardStatusID}
                onChange={handleChange}
                required
              >
                <option value="0">Select Device Status</option>
                <option value="1">Received</option>
                <option value="2">In Transit</option>
                <option value="3">Allocated</option>
                <option value="4">Unallocated</option>
                <option value="5">Withdrawn</option>
              </select>
              <label htmlFor="Remark">Remark</label>
              <input
                type="text"
                id="Remark"
                name="Remark"
                value={formData.Remark}
                onChange={handleChange}
                required
              />
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
      <span className="navbar-logo">Device Inventory</span>
      </div>
      <div className="navbar-right">
        <button className="nav-button" onClick={handleAddDevice}>Add Device</button>
        <button className="nav-button">Import Bulk</button>
      </div>
    </nav>
           {InvCount.length != 0 && <InventoryCount count={InvCount} />}
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

export default DeviceInventory;
