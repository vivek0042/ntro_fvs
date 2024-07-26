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
import { InventoryCardCount } from "../../components/Count";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";
const EntityEnrollmentCardIssuance = () => {
  const { state, dispatch } = useGlobalState();
  const {
    TableData,
    isFormOpen,
    LocationDropDown,
 
  } = state;

  const [pageSize, setPageSize] = useState(10);
  const [gridApi, setGridApi] = useState(null);
  const [InvCount, setInvCount] = useState([]);
  

  const columnDefs = [
    {
      headerName: "EmpName",
      field: "empName",
      sortable: true,
      filter: true,
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: "Mapping Date",
      field: "mappingDate",
      sortable: true,
      filter: true,
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: "Validity Date",
      field: "cardValidityDate",
      sortable: true,
      filter: true,
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: "Location",
      field: "locationName",
      sortable: true,
      filter: true,
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: "Area/Building",
      field: "areaBuildingName",
      sortable: true,
      filter: true,
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: "Department",
      field: "departmentName",
      sortable: true,
      filter: true,
      flex: 1,
      minWidth: 150,
    },
    {
        headerName: "Card Serial No",
        field: "cardSerialNo",
        sortable: true,
        filter: true,
        flex: 1,
        minWidth: 150,
      },
      {
        headerName: "Card ID",
        field: "entityADID",
        sortable: true,
        filter: true,
        flex: 1,
        minWidth: 150,
      },
      {
        headerName: "Card Type",
        field: "cardType",
        sortable: true,
        filter: true,
        flex: 1,
        minWidth: 150,
      },
      {
        headerName: "Status",
        field: "cardStatus",
        sortable: true,
        filter: true,
        flex: 1,
        minWidth: 150,
      },

    {
      cellRenderer: (params) => (
        <>
          
          <FaTrash
            style={{ marginRight: "10px", cursor: "pointer", color: "crimson" }}
            onClick={() => handleClickOpen(params.data.entityADID)}
          />
        </>
      ),
      flex: 1,
      minWidth: 150,
    },
  ];

  useEffect(() => {
    InventoryCountDetail();

    fetchData();
   
  }, []);


  const fetchData = async () => {
    try{
    const data = await post('UserMaster/GetAllEntiryEnrollmentandcard',{cardID:0});
    const EntityEnrollMappingMasterDetails = data.entityEnrollMappingMasterDetails;
    dispatch({ type: "TABLE_DATA", payload: EntityEnrollMappingMasterDetails });
    }
    catch(error){
      console.error('Error fetching devices:', error);
    }
      
  };

  const InventoryCountDetail = async () => {
    const payload = {
      ParamName: "CardCommunication",
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
    const res = await post("UserMaster/InventoryCountDetailsUserCardFilter", payload);
    setInvCount(res.datatableCountDetails);
  };

  const [open, setOpen] = useState(false);
  const [CardCommunicationToDelete, setCardCommunicationToDelete] = useState(0);

  const handleClickOpen = (deviceId) => {
    setCardCommunicationToDelete(deviceId);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCardCommunicationToDelete(0);
  };

  const handleConfirmDelete = async () => {
    try {
      const data = await del("UserMaster/DeleteCardEntity", {
        AdId: CardCommunicationToDelete.toString(),
        Deleteby: 0,
      });
      fetchData();
      toast.error("Card-Entity mapping deleted successfully.");
      handleClose();
    } catch (error) {
      console.error("Error deleting Card-Entity mapping:", error);
    }
  };

  const handleAddDevice = () => {
    dispatch({ type: "TOGGLE_FORM" });
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
     
        <>
         <nav className="navbar">
      <div className="navbar-left">
      <span className="navbar-logo">Entity Enrollment and card Issuance</span>
      </div>
      <div className="navbar-right">
        <button className="nav-button" onClick={handleAddDevice}>New Issuance</button>
       
      </div>
    </nav>
           {InvCount.length != 0 && <InventoryCardCount count={InvCount} />}
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
            <DialogTitle id="alert-dialog-title">{"Delete Entity"}</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Are you sure you want to delete this Entity?
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
 
    </div>
  );
};

export default EntityEnrollmentCardIssuance;
