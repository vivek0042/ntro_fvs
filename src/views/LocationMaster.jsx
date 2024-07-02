// src/pages/LocationMaster.js
import React, { useState, useEffect, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import 'ag-grid-community/styles/ag-grid.css';
import Form from '../components/Form';
import '../App.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import '../assets/style/Location.css';
import { fetchLocations , deleteLocation } from '../services/location.services';
import { updateStatus} from '../services/common.services'
import StatusButtonCell from '../components/StatusButtonCell';
function LocationMaster() {
  const [columnDefs] = useState([
    { headerName: 'Location Id', field: 'LocationId', sortable: true, filter: true, flex: 1, minWidth: 150 },
    { headerName: 'Location Name', field: 'LocationName', sortable: true, filter: true, flex: 1, minWidth: 150 },
    {
      headerName: 'Status',
      field: 'IsActive',
      cellRenderer: params => (
        <StatusButtonCell
          value={params.value}
          onUpdateStatus={() => handleUpdateStatus(params.data.LocationId, !params.value)}
        />
      ),
      flex: 1,
      minWidth: 150,
    },
    {
      cellRenderer: params => (
        <>
          <FaEdit
            style={{ marginRight: '20px', cursor: 'pointer', color: 'skyblue' }}
            onClick={() => { setLocation(params.data.LocationId); setIsFormOpen(true); }}
          />
          <FaTrash
            style={{ marginRight: '10px', cursor: 'pointer', color: 'crimson' }}
            onClick={() => delteLocation(params.data.LocationId)}
          />
        </>
      ),
      flex: 1,
      minWidth: 150,
    },
  ]);

  const [rowData, setRowData] = useState([]);
  const [location, setLocation] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [gridApi, setGridApi] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchLocations();
      setRowData(data);
    };
    fetchData();
  }, []);

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

  const handleUpdateStatus = async (locationId, newStatus) => {
    try {
      await updateStatus(locationId, newStatus , "LocationMaster");
      setRowData(prevData => prevData.map(row => {
        if (row.LocationId === locationId) {
          return { ...row, IsActive: newStatus };
        }
        return row;
      }));
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleExport = () => {
    if (gridApi) {
      const params = {
        columnKeys: ['LocationId', 'LocationName'],
      };
      gridApi.exportDataAsCsv(params);
    }
  };

  const handleAddLocation = () => {
    setLocation(0);
    setIsFormOpen(false);
    fetchLocations().then(setRowData);
  };

  const handleCancelForm = () => {
    setLocation(0);
    setIsFormOpen(false);
  };

  const delteLocation = async (locId) => {
    try {
      await deleteLocation(locId);
      fetchLocations().then(setRowData);
    } catch (error) {
      console.error('Error deleting location:', error);
    }
  };

  return (
    <div className="content-inner">
      {isFormOpen ? (
        <Form onAddLocation={handleAddLocation} onCancel={handleCancelForm} LocationId={location} params="Location" />
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
              <button className='btnDownload' onClick={handleExport}>Download</button>
              <button className='btnAdd' onClick={() => setIsFormOpen(true)}>Add Location</button>
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
}



export default LocationMaster;
