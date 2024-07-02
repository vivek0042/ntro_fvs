import React, { useState, useEffect, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import StatusButtonCell from '../components/StatusButtonCell';
import Form from '../components/Form';
import { fetchDevices, deleteDevice } from '../services/DeviceInventory.services';
import {updateStatus} from '../services/common.services'
const DeviceInventory = () => {
  const [columnDefs] = useState([
    { headerName: 'Device Id', field: 'DeviceId', sortable: true, filter: true, flex: 1, minWidth: 150 },
    { headerName: 'Serial No', field: 'DeviceSerialNo', sortable: true, filter: true, flex: 1, minWidth: 150 },
    { headerName: 'Device Type', field: 'DeviceType', sortable: true, filter: true, flex: 1, minWidth: 150 },
    { headerName: 'Model Name', field: 'DeviceModelName', sortable: true, filter: true, flex: 1, minWidth: 150 },
    { headerName: 'Device Ip', field: 'DeviceIp', sortable: true, filter: true, flex: 1, minWidth: 150 },
    { headerName: 'Location Name', field: 'LocationName', sortable: true, filter: true, flex: 1, minWidth: 150 },
    { headerName: 'Device Status', field: 'CardStatusID', sortable: true, filter: true, flex: 1, minWidth: 150 },
    { headerName: 'Remark', field: 'Remark', sortable: true, filter: true, flex: 1, minWidth: 150 },
    { 
      headerName: 'Status', 
      field: 'IsActive', 
      cellRenderer: params => (
        <StatusButtonCell 
          value={params.value} 
          onUpdateStatus={() => handleUpdateStatus(params.data.Id, !params.value)} 
        />
      ),
      flex: 1, 
      minWidth: 150,
    },
    {
      cellRenderer: params => (
        <>
          <FaEdit style={{ marginRight: '20px', cursor: 'pointer', color: 'skyblue' }} onClick={() => { setDeviceId(params.data.Id); setIsFormOpen(true); }} />
          <FaTrash style={{ marginRight: '10px', cursor: 'pointer', color: 'crimson' }} onClick={() => deleteDeviceHandler(params.data.Id)} />
        </>
      ),
      flex: 1,
      minWidth: 150,
    },
  ]);

  const [rowData, setRowData] = useState([]);
  const [deviceId, setDeviceId] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [gridApi, setGridApi] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const devices = await fetchDevices();
    setRowData(devices);
  };

  const onGridReady = useCallback((params) => {
    setGridApi(params.api);
    params.api.paginationSetPageSize(pageSize);
  }, [pageSize]);

  const handlePageSizeChange = (event) => {
    setPageSize(Number(event.target.value));
    if (gridApi) {
      gridApi.paginationSetPageSize(Number(event.target.value));
    }
  };

  const handleQuickFilter = (event) => {
    if (gridApi) {
      gridApi.setQuickFilter(event.target.value);
    }
  };

  const handleUpdateStatus = async (deviceId, newStatus) => {
    try {
      await updateStatus(deviceId, newStatus , "Device");
      setRowData(prevData => prevData.map(row => row.Id === deviceId ? { ...row, IsActive: newStatus } : row));
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleExport = () => {
    if (gridApi) {
      const params = {
        columnKeys: ['DeviceId', 'DeviceSerialNo', 'DeviceType', 'DeviceModelName', 'DeviceIp', 'LocationName', 'CardStatusID', 'Remark', 'IsActive'],
      };
      gridApi.exportDataAsCsv(params);
    }
  };

  const handleAddDevice = () => {
    setDeviceId(0);
    setIsFormOpen(false);
    fetchData();
  };

  const handleCancelForm = () => {
    setDeviceId(0);
    setIsFormOpen(false);
  };

  const deleteDeviceHandler = async (deviceId) => {
    try {
      await deleteDevice(deviceId);
      fetchData();
    } catch (error) {
      console.error('Error deleting device:', error);
    }
  };

  return (
    <div className="content-inner">
      {isFormOpen ? (
        <Form onAddDevice={handleAddDevice} onCancel={handleCancelForm} DeviceId={deviceId} params="Device" />
      ) : (
        <>
          <div className="grid-controls">
            <label>
              Page Size:
              <select value={pageSize} onChange={handlePageSizeChange}>
                {[10, 20, 30, 40, 50].map(size => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span>Search: </span>
              <input type="text" onChange={handleQuickFilter} placeholder="Search..." />
            </label>
            <label>
              <button className="btnDownload" onClick={handleExport}>Download</button>
              <button className="btnAdd" onClick={() => setIsFormOpen(true)}>Add Device</button>
            </label>
          </div>
          <div className="ag-theme-alpine grid-container">
            <div style={{ height: '520px', width: '100%' }}>
              <AgGridReact
                columnDefs={columnDefs}
                rowData={rowData}
                pagination={true}
                paginationPageSize={pageSize}
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
        </>
      )}
    </div>
  );
};



export default DeviceInventory;