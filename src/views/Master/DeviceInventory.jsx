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
import { updateStatus } from "../../services/common.services";
import { useGlobalState } from "../../context/GlobalContext";

const DeviceInventory = () => {
  const { state, dispatch } = useGlobalState();
  const {
    devices,
    totalCount,
    activeCount,
    inactiveCount,
    isFormOpen,
    selectedId,
  } = state;

  const [pageSize, setPageSize] = useState(10);
  const [gridApi, setGridApi] = useState(null);


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
              dispatch({ type: "TOGGLE_FORM", payload: params.data.Id });
            }}
          />
          <FaTrash
            style={{ marginRight: "10px", cursor: "pointer", color: "crimson" }}
            onClick={() => deleteDeviceHandler(params.data.Id)}
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

//Handle Global State

  const fetchData = async () => {
    const devices = await fetchDevices();
    dispatch({ type: "SET_DEVICES", payload: devices });
    dispatch({
      type: "SET_COUNTS",
      payload: {
        totalCount: devices.length,
        activeCount: devices.filter((dev) => dev.IsActive).length,
        inactiveCount: devices.filter((dev) => !dev.IsActive).length,
      },
    });
  };

  const deleteDeviceHandler = async (deviceId) => {
    try {
      await deleteDevice(deviceId);
      dispatch({
        type: "SET_DEVICES",
        payload: devices.filter((device) => device.Id !== deviceId),
      });
    } catch (error) {
      console.error("Error deleting device:", error);
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


  const handleAddDevice = () => {
    dispatch({ type: "TOGGLE_FORM" });
  };


  const handleCancelForm = () => {
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
      {isFormOpen ? (
        <Form
          onAdd={handleAddDevice}
          onCancel={handleCancelForm}
          LocationId={selectedId}
          params="Device"
        />
      ) : (
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
              <button className="btnAdd" onClick={handleAddDevice}>
                Add Device
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
      )}
    </div>
  );
};

export default DeviceInventory;
