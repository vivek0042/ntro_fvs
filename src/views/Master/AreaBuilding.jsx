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
import {
    fetchArea,
    deleteArea,
  } from "../../services/AreaBuilding.services";

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";

const AreaBuilding = () => {
    const { state, dispatch } = useGlobalState();
    const {
      devices,
      totalCount,
      activeCount,
      inactiveCount,
      isFormOpen,
      LocationDropDown,
      TableData,
      selectedDeviceId,
    } = state;
    const [pageSize, setPageSize] = useState(10);
    const [gridApi, setGridApi] = useState(null);
    const [formData, setFormData] = useState({
      Id: 0,
      AreaBuildingId: 0,
      AreaBuildingName: "",
      LocationName: "",
      LocationId: 0,
      formType: "Add",
    });
    const [open, setOpen] = useState(false);
    const [AreaToDelete, setAreaToDelete] = useState(0);
  
    const handleClickOpen = (areaId) => {
      setAreaToDelete(areaId);
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
      setAreaToDelete(0);
    };
    const handleConfirmDelete = async () => {
        try {
          const data = await del("Master/DeleteArea", {
            AreaBuildingId: Number(AreaToDelete),
            Deleteby: 0,
          });
          fetchData();
          toast.error("Delete AreaBuilding Successfully");
          handleClose();
        } catch (error) {
          console.error("Error deleting AreaBuilding:", error);
        }
      };
      const columnDefs = [
        {
          headerName: "AreaBuilding Id",
          field: "AreaBuildingId",
          sortable: true,
          filter: true,
          hide:true,
          flex: 1,
          minWidth: 150,
        },
        {
          headerName: "Area/Building Name",
          field: "AreaBuildingName",
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
                handleUpdateStatus(params.data.AreaBuildingId, !params.value)
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
                  dispatch({ type: "TOGGLE_FORM", payload: params.data.AreaBuildingId });
                  setFormData({
                    AreaBuildingId: params.data.AreaBuildingId,
                    AreaBuildingName: params.data.AreaBuildingName,
                    LocationId: params.data.LocationId,
                    formType: "Update",
                  });
                }}
              />
              <FaTrash
                style={{ marginRight: "10px", cursor: "pointer", color: "crimson" }}
                onClick={() => handleClickOpen(params.data.AreaBuildingId)}
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
     
          const data = await get('Master/GetAllArea');
          const areas = data.AreaBuildingDetails;
          dispatch({ type: "SET_DEVICES", payload: areas });
          dispatch({
            type: "SET_COUNTS",
            payload: {
              totalCount: areas.length,
              activeCount: areas.filter((dev) => dev.IsActive).length,
              inactiveCount: areas.filter((dev) => !dev.IsActive).length,
            },
          });

      };
      const handleQuickFilter = (event) => {
        if (gridApi) {
          gridApi.setQuickFilter(event.target.value);
        }
      };
    
      const handleUpdateStatus = async (AreaBuildingId, newStatus) => {
        try {
          await updateStatus(AreaBuildingId, newStatus, "AreaBuilding");
    
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
              "AreaBuildingName",
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
            AreaBuildingId: 0,
            AreaBuildingName: "",
            LocationName: "",
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
    
        let url = "http://192.168.11.212:8070/api/master/AddArea";
        let body = {
          AreaBuildingId: Number(formData.AreaBuildingId),
          AreaBuildingName: formData.AreaBuildingName,
          LocationId: Number(formData.LocationId),
          LocationName: "",
        };
        try {
            const response = await fetch(url, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(body),
            });
      
            if (!response.ok) {
              throw new Error("Failed to add");
            }
      
            const data = await response.json();
            handleAddDevice();
            fetchData();
            if (formData.formType == "Add") toast.success("Data Add successfully");
            else toast.success("Data Updated Successfully");
          
            setFormData({
               
                AreaBuildingId: 0,
                AreaBuildingName: "",
                LocationName: "",
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
                    <h2>{formData.formType} AreaBuilding</h2>
                    <div className="form-group">
                      <>
                        <label htmlFor="AreaBuildingName">Area/Building Name</label>
                        <input
                          type="text"
                          id="AreaBuildingName"
                          name="AreaBuildingName"
                          value={formData.AreaBuildingName}
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
                        {formData.formType} AreaBuilding
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
              <span className="navbar-logo">Area List</span>
              </div>
              <div className="navbar-right">
                <button className="nav-button" onClick={handleAddDevice}>Add AreaBuilding</button>
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
        
        export default AreaBuilding;
    
