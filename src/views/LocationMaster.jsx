import React, { useState, useEffect, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import '../assets/style/Location.css'; // Import the CSS file using the relative path

function LocationMaster() {
  const [columnDefs] = useState([
    { headerName: 'Location Id', field: 'LocationId', sortable: true, filter: true, flex: 1, minWidth: 150 },
    { headerName: 'Location Name', field: 'LocationName', sortable: true, filter: true, flex: 1, minWidth: 150 },
    { 
      headerName: 'Status', 
      field: 'button', 
      cellRendererFramework: params => (
        <StatusButtonCell 
          value={params.value} 
          onUpdateStatus={() => handleUpdateStatus(params.data.LocationId, !params.value)} 
        />
      ),
      flex: 1, 
      minWidth: 150 
    },
  ]);

  const [rowData, setRowData] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [gridApi, setGridApi] = useState(null);

  useEffect(() => {
    fetch('http://192.168.11.212:8070/api/master/GetAllLocation')
      .then(response => response.json())
      .then(data => {
        if (Array.isArray(data.LocationDetails)) {
          setRowData(data.LocationDetails);
        } else {
          console.error('API response is not an array:', data);
          setRowData([]);
        }
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setRowData([]);
      });
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

  const handleUpdateStatus = (locationId, newStatus) => {
    const url = `http://192.168.11.221:8070/api/master/InActiveStatusChange`;
    const method = 'PUT'; // or 'POST', adjust as per your API requirements

    fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json', 
      },
      body: JSON.stringify({ 
        IsActive: newStatus,
        InActiveParamName: "locationMaster",
        StatusChangeId: locationId,
        EntryBy: 1
      }),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log('Status updated successfully:', data);

        // Update rowData state to reflect the new status using functional update
        setRowData(prevData => {
          return prevData.map(row => {
            if (row.LocationId === locationId) {
              return { ...row, IsActive: newStatus };
            }
            return row;
          });
        });
      })
      .catch(error => {
        console.error('Error updating status:', error);
        // Handle error as needed
      });
  };

  return (
    <div className="grid-wrapper">
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
      </div>
      <div className="ag-theme-alpine grid-container">
        <div style={{ height: '500px', width: '100%' }}>
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
    </div>
  );
}

const StatusButtonCell = ({ value, onUpdateStatus }) => {
  const buttonStyle = {
    padding: '5px 10px',
    borderRadius: '4px',
    cursor: 'pointer',
    color: '#fff',
    fontWeight: 'bold',
    border: 'none',
    outline: 'none',
  };

  const handleClick = () => {
    onUpdateStatus();
  };

  return (
    <button 
      style={{ ...buttonStyle, backgroundColor: value ? 'green' : 'red' }}
      onClick={handleClick}
    >
      {value ? 'Active' : 'Inactive'}
    </button>
  );
};

export default LocationMaster;
