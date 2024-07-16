import React, { useCallback, useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import { FaEdit, FaTrash, FaDownload } from "react-icons/fa";
import '../../assets/style/Sidebar.css'
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import StatusButtonCell from "../../components/StatusButtonCell";
import CountHeader from "../../components/Count";
import {
  fetchDepartment,
  deleteDepartment,
} from "../../services/Department.services";
import { updateStatus } from "../../services/common.services";
import { useGlobalState } from "../../context/GlobalContext";
import { toast } from "react-toastify";
import { del, post } from "../../services/api";
import { InventoryCount } from "../../components/Count";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";

const Department = () => {
  const { state, dispatch } = useGlobalState();
  const {
    TableData,
    totalCount,
    activeCount,
    inactiveCount,
    isFormOpen,
    selectedDeviceId,
  } = state;

  const [pageSize, setPageSize] = useState(10);
  const [gridApi, setGridApi] = useState(null);
  const [InvCount, setInvCount] = useState([]);
  const [formData, setFormData] = useState({
    DepartmentId: 0,
    DepartmentName: "",
    formType: "Add",
  });
  const [open, setOpen] = useState(false);
  const [departmentToDelete, setDepartmentToDelete] = useState(null);

  const handleClickOpen = (department) => {
    setDepartmentToDelete(department);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setDepartmentToDelete(null);
  };

  const handleConfirmDelete = async () => {
    try {
      if (departmentToDelete) {
        const data = await del("Master/DeleteDepartment", {
          departmentId: Number(departmentToDelete.DepartmentId),
          Deleteby: 0,
        });
        fetchData();
        toast.error("Delete Department Successfully");
        handleClose();
      } else {
        console.error("No department selected for deletion.");
      }
    } catch (error) {
      console.error("Error deleting Department:", error);
    }
  };

  const columnDefs = [
    {
      headerName: "Department Id",
      field: "DepartmentId",
      sortable: true,
      filter: true,
      flex: 1,
      hide: true,
      minWidth: 150,
    },
    {
      headerName: "Department Name",
      field: "DepartmentName",
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
            handleUpdateStatus(params.data.DepartmentId, !params.value)
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

              // dispatch({ type: "TOGGLE_FORM", payload: params.data.DepartmentId });
              //for edit the department just un comment this code.

              // setFormData({
              //   DepartmentId: params.data.DepartmentId,
              //   DepartmentName: params.data.DepartmentName,
              //   formType: "Update",
              // });
            }}
          />
          <FaTrash
            style={{ marginRight: "10px", cursor: "pointer", color: "crimson" }}
            onClick={() => handleClickOpen(params.data)}
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
    
      const departmentData = await fetchDepartment();
   
        dispatch({ type: "Table_Data", payload: departmentData });
      
      dispatch({
        type: 'SET_COUNTS',
        payload: {
          totalCount: departmentData.length,
          activeCount: departmentData.filter(loc => loc.IsActive).length,
          inactiveCount: departmentData.filter(loc => !loc.IsActive).length,
        },
      });
  
  };

  const handleQuickFilter = (event) => {
    if (gridApi) {
      gridApi.setQuickFilter(event.target.value);
    }
  };

  const handleUpdateStatus = async (departmentId, newStatus) => {
    try {
      await updateStatus(departmentId, newStatus, "Department");

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
          "DepartmentId",
          "DepartmentName",
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
    // dispatch({ type: "TOGGLE_FORM" });  //  For add depatment just uncomment this code.
  };

  const handleCancelForm = () => {
    dispatch({ type: "TOGGLE_FORM" });
    setFormData({
      DepartmentId: 0,
      DepartmentName: "",
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

  return (
    <div className="content-inner">
      {isFormOpen ? (
        <div className="form-container">
          <form className="add-location-form" >
            <h2>{formData.formType} Department</h2>
            <div className="form-group">
              <>
            
                <label htmlFor="DepartmentName">Department Name</label>
                <input
                  type="text"
                  id="DepartmentName"
                  name="DepartmentName"
                  value={formData.DepartmentName}
                  onChange={handleChange}
                  required
                />
              </>
            </div>
            <div className="form-buttons">
              <button type="submit" className="btn btn-add">
                {formData.formType} Department
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
      <span className="navbar-logo">Department</span>
      </div>
      <div className="navbar-right">
        <button className="nav-button" onClick={handleAddDevice}>Add Department</button>
        <button className="nav-button">Import Bulk</button>
      </div>
    </nav>
    <CountHeader totalCount={totalCount} activeCount={activeCount} inactiveCount={inactiveCount} />
        

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
            <DialogTitle id="alert-dialog-title">{"Delete Device"}</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Are you sure you want to delete this department?
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

export default Department;
