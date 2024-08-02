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

const DeviceUserMapping = () => {
  const { state, dispatch } = useGlobalState();
  const {
    TableData,
    isFormOpen,
    LocationDropDown,  
    RoleRights
  } = state;
  const [pageSize, setPageSize] = useState(10);
  const [gridApi, setGridApi] = useState(null);
  const [formData, setFormData] = useState({
    DeviceSerialNo : "",
    EntityADID:"",
    MappingId:0,
    formType: "Add",
  });
  const obj = RoleRights.filter(
    (item) =>
      item.ActionUrl == "/master/DeviceUserMapping" &&
      item.OperationName == "Device User Mapping"
  );
  const [open, setOpen] = useState(false);
  const [mappingToDelete, setmappingToDelete] = useState(0);

  const handleClickOpen = (MappingId) => {
    setmappingToDelete(MappingId);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setmappingToDelete(0);
  };

  const handleConfirmDelete = async () => {
    try {
      const data = await del("Master/DeleteDeviceuser", {
        MappingId: Number(mappingToDelete),
        Deleteby: 0,
      });
      fetchData();
      toast.error("Delete DeviceUser Mapping Successfully");
      handleClose();
    } catch (error) {
      console.error("Error deleting DeviceUser Mapping:", error);
    }
  };

  const columnDefs = [
    {
      headerName: "Device Sr No",
      field: "DeviceSerialNo",
      sortable: true,
      filter: true,
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: "Entity AD ID",
      field: "EntityADID",
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
            handleUpdateStatus(params.data.MappingId, !params.value)
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
                DeviceSerialNo : params.data.DeviceSerialNo,
                EntityADID:params.data.EntityADID,
                MappingId:params.data.MappingId,
                formType: "Update",
              });
            }}
          />)}
             {obj[0].CanDelete && (
          <FaTrash
            style={{ marginRight: "10px", cursor: "pointer", color: "crimson" }}
            onClick={() => handleClickOpen(params.data.MappingId)}
          />)}
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
    try{
      const data = await get('Master/GetAllDeviceUser');
      const deviceUser = data.DeviceUserMappingDetails;
      dispatch({ type: "TABLE_DATA", payload: deviceUser });
    
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

  const handleUpdateStatus = async (MappingId, newStatus) => {
    try {
      await updateStatus(MappingId, newStatus, "DeviceUserMapping");

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
          "EntityADID",
          "DeviceSerialNo",
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
        DeviceSerialNo : "",
        EntityADID:"",
        MappingId:0,
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
      const response = await post("master/AddDeviceUserMapping", {
        MappingId: formData.MappingId,
        EntityADID:formData.EntityADID,
        DeviceSerialNo:formData.DeviceSerialNo,
      });

      handleAddDevice();
      fetchData();
      if (formData.formType == "Add") toast.success("Data Add successfully");
      else toast.success("Data Updated Successfully");
    
      setFormData({
        DeviceSerialNo : "",
        EntityADID:"",
        MappingId:0,
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
            <h2>{formData.formType} Mapping</h2>
            <div className="form-group">
              <>
                <label htmlFor="EntityADID">User Id(ADId User)</label>
                <input
                  type="text"
                  id="EntityADID"
                  name="EntityADID"
                  value={formData.EntityADID}
                  onChange={handleChange}
                  required
                />
                <label htmlFor="DeviceSerialNo">Device Serial No</label>
                <input
                  type="text"
                  id="DeviceSerialNo"
                  name="DeviceSerialNo"
                  value={formData.DeviceSerialNo}
                  onChange={handleChange}
                  required
                />
               
              </>
            </div>
            <div className="form-buttons">
              <button type="submit" className="btn btn-add">
                {formData.formType} Mapping
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
      <span className="navbar-logo">Device Mapping</span>
      </div>
      <div className="navbar-right">
      {obj[0].CanAdd && (
        <button className="nav-button" onClick={handleAddDevice}>Map Device</button>)}
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
              
              <FaDownload style={{cursor : "pointer"}} onClick={handleExport}/>
             
              
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
            <DialogTitle id="alert-dialog-title">{"Delete Device Mapping"}</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Are you sure you want to delete this device Mapping?
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

export default DeviceUserMapping;
