// src/pages/LocationMaster.js
import React, { useState, useEffect, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import '../../assets/style/Location.css';
import { fetchLocations, deleteLocation } from '../../services/location.services';
import { updateStatus } from '../../services/common.services';
import StatusButtonCell from '../../components/StatusButtonCell';
import CountHeader from '../../components/Count';
import { useGlobalState } from '../../context/GlobalContext';
import Form from '../../components/Form';

function LocationMaster() {
  const { state, dispatch } = useGlobalState();
  const { locations, totalCount, activeCount, inactiveCount, isFormOpen, selectedId } = state;
  const [pageSize, setPageSize] = useState(10);
  const [gridApi, setGridApi] = useState(null);
  const [columnDefs] = useState([
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
            onClick={() => dispatch({ type: 'TOGGLE_FORM', payload: params.data.LocationId })}
          />
          <FaTrash
            style={{ marginRight: '10px', cursor: 'pointer', color: 'crimson' }}
            onClick={() => deleteLocationHandler(params.data.LocationId)}
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
    const data = await fetchLocations();
    dispatch({ type: 'SET_LOCATIONS', payload: data });
    dispatch({
      type: 'SET_COUNTS',
      payload: {
        totalCount: data.length,
        activeCount: data.filter(loc => loc.IsActive).length,
        inactiveCount: data.filter(loc => !loc.IsActive).length,
      },
    });
  };

  const handleUpdateStatus = async (locationId, newStatus) => {
    try {
      await updateStatus(locationId, newStatus, 'LocationMaster');
      fetchData();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const deleteLocationHandler = async (locationId) => {
    try {
      await deleteLocation(locationId);
      fetchData();
    } catch (error) {
      console.error('Error deleting location:', error);
    }
  };

  const onGridReady = useCallback((params) => {
    setGridApi(params.api);
    params.api.paginationSetPageSize(pageSize);
  }, [pageSize]);

 

  const handleQuickFilter = (event) => {
    if (gridApi) {
      gridApi.setQuickFilter(event.target.value);
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
    dispatch({ type: 'TOGGLE_FORM' });
    fetchData();
  };

  const handleCancelForm = () => {
    dispatch({ type: 'TOGGLE_FORM' });
  };

  return (
    <div className="content-inner">
      {isFormOpen ? (
        <Form onAdd={handleAddLocation} onCancel={handleCancelForm} LocationId={selectedId} params="Location" />
      ) : (
        <>
          <CountHeader totalCount={totalCount} activeCount={activeCount} inactiveCount={inactiveCount} />
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
              <input type="text" onChange={handleQuickFilter} placeholder="Search..." />
            </label>
            <label>
              <button className='btnDownload' onClick={handleExport}>Download</button>
              <button className='btnAdd' onClick={() => dispatch({ type: 'TOGGLE_FORM' })}>Add Location</button>
            </label>
          </div>
          <div className="ag-theme-alpine grid-container">
            <div style={{ height: '520px', width: '100%' }}>
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
        </>
      )}
    </div>
  );
}

export default LocationMaster;

