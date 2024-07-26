import React, { useCallback, useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import { FaEdit, FaTrash } from "react-icons/fa";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import StatusButtonCell from "../../components/StatusButtonCell";
import Form from "../../components/Form";
import CountHeader from "../../components/Count";
import {
  fetchDevices,
  deleteDevice,
} from "../../services/DeviceInventory.services";
import { fetchCards } from "../../services/Master/Card.service";
import { updateStatus } from "../../services/common.services";
import { useGlobalState } from "../../context/GlobalContext";

const CardInventory = () => {
  const { state, dispatch } = useGlobalState();
  const {
    devices,
    totalCount,
    activeCount,
    inactiveCount,
    isFormOpen,
  
  } = state;

  const [pageSize, setPageSize] = useState(10);
  const [gridApi, setGridApi] = useState(null);
  const [LocationDropDown, setLocationDropDown] = useState([]);
  const [formData, setFormData] = useState({
    Remark: "",
    CardStatus: 0,
    LocationId: 0,
    CardSerialNo: "",
  });

  const columnDefs = [
    {
      headerName: "Card Serial No",
      field: "Mcsn",
      sortable: true,
      filter: true,
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: "Location",
      field: "LocationName",
      sortable: true,
      filter: true,
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: "Card Type",
      field: "CardType",
      sortable: true,
      filter: true,
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: "Status",
      field: "CardStatusName",
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
      cellRenderer: (params) => (
        <>
          <FaEdit
            style={{ marginRight: "20px", cursor: "pointer", color: "skyblue" }}
            onClick={() => {
              dispatch({ type: "TOGGLE_FORM" });
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
    BindLocation();
  }, []);

  const fetchData = async () => {
    try{
       const Cards = await  get('Master/GetCardInventory');
        if (Array.isArray(data.CardInventoryDetails)) {
          return data.CardInventoryDetails;
        } 
        dispatch({ type: "SET_DEVICES", payload: Cards });
        dispatch({
          type: "SET_COUNTS",
          payload: {
            totalCount: Cards.length,
            activeCount: Cards.filter((Card) => Card.IsActive).length,
            inactiveCount: Cards.filter((Card) => !Card.IsActive).length,
          },
        });

      } catch (error) {
        console.error('Error fetching Cards:', error);
        return [];
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
      fetchData();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleExport = () => {
    if (gridApi) {
      const params = {
        columnKeys: ["Mcsn", "LocationId", "CardType", "CardStatus", "Remark"],
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

  const handleAddCard = () => {
    dispatch({ type: "TOGGLE_FORM" });
  };

  const handleCancelForm = () => {
    dispatch({ type: "TOGGLE_FORM" });
    setFormData({
        Remark: "",
        CardStatus: 0,
        LocationId: 0,
        CardSerialNo: "",
      });
  };

  const BindLocation = async () => {
    const response = await fetch(
      "http://192.168.11.212:8070/api/dropdown/getfilllocation"
    );
    const data = await response.json();
    if (Array.isArray(data.LocationDetails)) {
      setLocationDropDown(data.LocationDetails);
    }
  };

  useEffect(() => {}, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    let url = "http://192.168.11.212:8070/api/master/AddCardInventory";
    let body = {
  
      CardSerialNo: formData.CardSerialNo,
      LocationId: Number(formData.LocationId),
      CardStatus: Number(formData.CardStatus),
      Remark: formData.Remark,
      Mcsn:"",
      LocationName:"",
      CardType:"",
      CardStatusName:"",
      CID:"",
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
      handleAddCard(data);

      // Clear form fields
      setFormData({
        Remark: "",
        CardStatus: 0,
        LocationId: 0,
        CardSerialNo: "",
      });
    } catch (error) {
      console.error("Error adding:", error);
    }
  };

  return (
    <div className="content-inner">
     
        <>
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
              <button className="btnDownload" onClick={handleExport}>
                Download
              </button>
              <button className="btnAdd" onClick={handleAddCard}>
                Add Card
              </button>
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
        </>
      
    </div>
  );
};

export default CardInventory;
