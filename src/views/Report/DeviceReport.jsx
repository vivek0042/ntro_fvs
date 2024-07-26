import React, { useCallback, useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import { FaEdit, FaTrash, FaDownload } from "react-icons/fa";
import "../../assets/style/Sidebar.css";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { useGlobalState } from "../../context/GlobalContext";
import { toast } from "react-toastify";
import { del, post, get } from "../../services/api";

const DeviceReport = () => {
  const { state, dispatch } = useGlobalState();
  const { TableData, ToDate, FromDate } = state;
  const [pageSize, setPageSize] = useState(10);
  const [gridApi, setGridApi] = useState(null);

  const columnDefs = [
    {
      headerName: "Device ID",
      field: "Device ID",
      sortable: true,
      filter: true,
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: "Model Name",
      field: "Device Model Name",
      sortable: true,
      filter: true,
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: "Serial Number",
      field: "Device Serial Number",
      sortable: true,
      filter: true,
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: "Location",
      field: "Location",
      sortable: true,
      filter: true,
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: "Mapped with (Ad User)",
      field: "EntityADID",
      sortable: true,
      filter: true,
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: "Mapped Date",
      field: "MappingDate",
      sortable: true,
      filter: true,
      flex: 1,
      minWidth: 150,
    }
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const data = await post("Report/GetSummuryReport", {
        param: "Device",
        fromdate: localStorage.getItem("FromDate"),
        todate: localStorage.getItem("ToDate"),
      });
      const DeviceReport = data;
      dispatch({ type: "TABLE_DATA", payload: DeviceReport });
    } catch (error) {
      console.error("Error fetching devices:", error);
    }
  };

  const handleQuickFilter = (event) => {
    if (gridApi) {
      gridApi.setQuickFilter(event.target.value);
    }
  };

  const handleExport = () => {
    if (gridApi) {
      const params = {
        columnKeys: [
          "Device ID",
          "Device Model Name",
          "Device Serial Number",
          "Location",
          "EntityADID",
          "MappingDate",
        
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    localStorage.setItem(name, value);
    dispatch({ type: 'SET_DATE', payload: { name, value } });
  };

  return (
    <div className="content-inner">
      <>
        <nav className="navbar">
          <div className="navbar-left">
            <span className="navbar-logo">Device Register Report</span>
          </div>
          <div className="navbar-right">
         
            <div className="form-group">
              <label htmlFor="FromDate">From Date</label>
              <div>
                <input
                  className="form-control-custom"
                  type="date"
                  id="FromDate"
                  name="FromDate"
                  value={ localStorage.getItem('FromDate')}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="ToDate">To Date</label>
              <div>
                <input
                  className="form-control-custom"
                  type="date"
                  id="ToDate"
                  name="ToDate"
                  value={localStorage.getItem('ToDate')}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <button className="nav-button" onClick={fetchData}>
             filter
            </button>
          
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
            <FaDownload style={{ cursor: "pointer" }} onClick={handleExport} />
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
    </div>
  );
};

export default DeviceReport;
