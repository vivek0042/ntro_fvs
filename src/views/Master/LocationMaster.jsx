// src/pages/LocationMaster.js
import React, { useState, useEffect, useCallback } from "react";
import { AgGridReact } from "ag-grid-react";
import { FaEdit, FaTrash ,FaDownload } from "react-icons/fa";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "../../assets/style/Location.css";
import {
  fetchLocations,
  deleteLocation,
} from "../../services/location.services";
import { updateStatus } from "../../services/common.services";
import StatusButtonCell from "../../components/StatusButtonCell";
import CountHeader from "../../components/Count";
import { useGlobalState } from "../../context/GlobalContext";
import { toast } from "react-toastify";
import { get, post, del } from "../../services/api";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";

function LocationMaster() {
  const { state, dispatch } = useGlobalState();
  const {
    locations,
    totalCount,
    activeCount,
    inactiveCount,
    isFormOpen,
    selectedId,
  } = state;
  const [pageSize, setPageSize] = useState(10);
  const [gridApi, setGridApi] = useState(null);
  const [formData, setFormData] = useState({
    locationName: "",
    LocationId: 0,
    formType: "Add",
  });
  const [columnDefs] = useState([
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
            handleUpdateStatus(params.data.LocationId, !params.value)
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
                LocationId: params.data.LocationId,
                locationName: params.data.LocationName,
                formType: "Update",
              });
            }}
          />
          <FaTrash
            style={{ marginRight: "10px", cursor: "pointer", color: "crimson" }}
            onClick={() => handleClickOpen(params.data.LocationId)}
          />
        </>
      ),
      flex: 1,
      minWidth: 150,
    },
  ]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await get("Master/GetAllLocation");
      const data = res.LocationDetails;
      dispatch({ type: "SET_LOCATIONS", payload: data });
      dispatch({
        type: "SET_COUNTS",
        payload: {
          totalCount: data.length,
          activeCount: data.filter((loc) => loc.IsActive).length,
          inactiveCount: data.filter((loc) => !loc.IsActive).length,
        },
      });
    } catch (error) {
      console.error("Error fetching locations:", error);
    }
  };

  const handleUpdateStatus = async (locationId, newStatus) => {
    try {
      await updateStatus(locationId, newStatus, "LocationMaster");
      fetchData();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const onGridReady = useCallback(
    (params) => {
      setGridApi(params.api);
      params.api.paginationSetPageSize(pageSize);
    },
    [pageSize]
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleQuickFilter = (event) => {
    if (gridApi) {
      gridApi.setQuickFilter(event.target.value);
    }
  };

  const [open, setOpen] = useState(false);
  const [LocationToDelete, setLocationToDelete] = useState(0);

  const handleClickOpen = (LocationId) => {
    setLocationToDelete(LocationId);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setLocationToDelete(0);
  };

  const handleConfirmDelete = async () => {
    try {
      const data = await del("Master/DeleteLocation", {
        Id: Number(LocationToDelete),
        Deleteby: 0,
      });
      fetchData();
      toast.error("Delete Location Successfully");
      handleClose();
    } catch (error) {
      console.error("Error deleting Location:", error);
    }
  };
  const handleExport = () => {
    if (gridApi) {
      const params = {
        columnKeys: ["LocationId", "LocationName"],
      };
      gridApi.exportDataAsCsv(params);
    }
  };

  const handleAddLocation = () => {
    dispatch({ type: "TOGGLE_FORM" });
  };

  const handleCancelForm = () => {
    dispatch({ type: "TOGGLE_FORM" });
    setFormData({
      locationName: "",
      LocationId: 0,
      formType: "Add",
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await post("Master/AddLocation", {
        LocationId: formData.LocationId,
        LocationName: formData.locationName,
      });
      handleAddLocation();

      fetchData();

      if (formData.formType == "Add") toast.success("Data Add successfully");
      else toast.success("Data Updated Successfully");

      setFormData({
        locationName: "",
        LocationId: 0,
        formType: "Add",
      });
    } catch (error) {
      console.error("Error adding:", error);
    }
  };

  return (
    <div className="content-inner">
      {isFormOpen ? (
        <div className="form-container">
          <form className="add-location-form" onSubmit={handleSubmit}>
            <h2>{formData.formType} Location</h2>
            <div className="form-group">
              <>
                <label htmlFor="locationName">Location Name</label>
                <input
                  type="text"
                  id="locationName"
                  name="locationName"
                  value={formData.locationName}
                  onChange={handleChange}
                  required
                />
              </>
            </div>
            <div className="form-buttons">
              <button type="submit" className="btn btn-add">
                {formData.formType} Card
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
              <span className="navbar-logo">Location</span>
            </div>
            <div className="navbar-right">
              <button className="nav-button" onClick={handleAddLocation}>
                Add Location
              </button>
              <button className="nav-button">Import Location</button>
            </div>
          </nav>
          <CountHeader
            totalCount={totalCount}
            activeCount={activeCount}
            inactiveCount={inactiveCount}
          />
          <div className="grid-controls">
            {/* <label>
              Page Size:
              <select value={pageSize} onChange={handlePageSizeChange}>
                {[10, 20, 30, 40, 50].map(size => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </label> */}
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
            <div style={{ height: "520px", width: "100%" }}>
              <AgGridReact
                columnDefs={columnDefs}
                rowData={locations}
                pagination={true}
                defaultColDef={{
                  sortable: true,
                  filter: true,
                  flex: 1,
                  minWidth: 150,
                }}
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
            <DialogTitle id="alert-dialog-title">
              {"Delete Location"}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Are you sure you want to delete this Location?
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
}

export default LocationMaster;
