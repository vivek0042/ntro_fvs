import React, { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../components/Apiconfig';
import Sidebar from '../components/Sidebar';
import {AddAreaBuilding} from '../components/Addlocation';
import { LocationContext } from '../hooks/LocationContext';
import useCountDetails from '../components/UseCountDetails';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import DeleteIcon from '@mui/icons-material/Delete';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import '../assets/style/Location.css';

function AreaBuilding() {
  const { locations, setLocations, countDetails, setCountDetails } = useContext(LocationContext);
  const [columnDefs] = useState([
    { headerName: 'AreaBuilding ID', field: 'AreaBuildingId', sortable: true, filter: true, flex: 1, minWidth: 150 },
    { headerName: 'Area/Building Name', field: 'AreaBuildingName', sortable: true, filter: true, flex: 1, minWidth: 150 },
    { headerName: 'Location Name', field: 'LocationName', sortable: true, filter: true, flex: 1, minWidth: 150 },
    { headerName: 'Location Id', field: 'LocationId', sortable: true,hide:true, filter: true, flex: 1, minWidth: 150 },
    {
      headerName: 'Status',
      field: 'IsActive',
      cellRenderer: params => (
        <StatusButtonCell
          value={params.value}
          onUpdateStatus={() => handleUpdateStatus(params.data.AreaBuildingId, params.value)}
        />
      ),
      flex: 1,
      minWidth: 150
    },
    {
      headerName: 'Actions',
      headerComponentFramework: ActionHeader,
      cellRenderer: params => (
        <ActionCell
          data={params.data}
          onDelete={onDelete}
          onEdit={handleEditLocation} // Pass handleEditLocation to ActionCell
        />
      ),
      flex: 1,
      minWidth: 150,
      cellStyle: { textAlign: 'center' }
    },
  ]);
  const [gridApi, setGridApi] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const navigate = useNavigate();

  const handleNavigateToAddLocation = () => {
    setCurrentLocation(null);
    setShowForm(true);
  };
  useCountDetails('AreaBuilding', setCountDetails);

  useEffect(() => {
    fetch(`${API_BASE_URL}GetAllArea`)
      .then(response => response.json())
      .then(data => {
        if (Array.isArray(data.AreaBuildingDetails)) {
          setLocations(data.AreaBuildingDetails);
        } else {
          console.error('API response is not an array:', data);
          setLocations([]);
        }
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setLocations([]);
      });
  }, [setLocations]);

  const onGridReady = (params) => {
    setGridApi(params.api);
    params.api.paginationSetPageSize(10); // Set your desired page size
  };
  const handleQuickFilter = (event) => {
    if (gridApi) {
      gridApi.setQuickFilter(event.target.value);
    }
  };

  const handleUpdateStatus = (AreaBuildingId, currentStatus) => {
    const newStatus = currentStatus === 1 ? 0 : 1;

    fetch(`${API_BASE_URL}InActiveStatusChange`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        IsActive: newStatus,
        InActiveParamName: "AreaBuilding",
        StatusChangeId: AreaBuildingId,
        EntryBy: 0
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
        alert('Status updated successfully:', data);

        setLocations(prevData => {
          return prevData.map(row => {
            if (row.AreaBuildingId === AreaBuildingId) {
              return { ...row, IsActive: newStatus };
            }
            return row;
          });
        });
      })
      .catch(error => {
        console.error('Error updating status:', error);
      });
  };
  const handleExport = () => {
    if (gridApi) {
      const params = {
        columnKeys: ['AreaBuildingId', 'AreaName', 'LocationName'],
      };
      gridApi.exportDataAsCsv(params);
    }
  };

  const openEditForm = (area) => {
    setShowForm(true);
    setCurrentLocation(area);
  };

  const handleEditLocation = (area) => {
    openEditForm(area);
  };
  const onDelete = async (AreaBuildingId) => {
    const loc = {
      areaBuildingId: AreaBuildingId,
      deleteby: 1
    };

    try {
      const response = await fetch(`${API_BASE_URL}DeleteArea`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loc),
      });

      const data = await response.json();
      if (data.errCode === '0') {
        alert(`Location Deleted Successfully.`);
        setLocations(prevData => prevData.filter(row => row.AreaBuildingId !== AreaBuildingId));
      } else {
        alert('Failed to delete location.');
      }
    } catch (error) {
      alert('Failed to delete location. Error: ' + error.message);
    }
  };
  return (
    <div className="location-master-container">
      <Sidebar />
      <div className="main-content">
        <div className="header">
          <div className="location-label">Location</div>
          <div className="buttons">
            <button onClick={handleNavigateToAddLocation} className='add-location'>Add AreaBuilding</button>
            <button className="bulk-location">Bulk Location</button>
          </div>
        </div>

        <div className="grid-controls">
          <div className="search-and-export">
            <label className="search-label">
              Search:
              <input type="text" onChange={handleQuickFilter} placeholder="Search..." />
            </label>
            <button className="export-button" onClick={handleExport}>Download CSV</button>
          </div>
          <div className="count-details-container">
            <div className="count-detail" id="t_count">
              <div className="detail-label">Total Count:</div>
              <div className="detail-value">{countDetails.TotalCountActiveInActive}</div>
            </div>
            <div className="count-detail" id="a_count">
              <div className="detail-label">Active Count:</div>
              <div className="detail-value">{countDetails.ActiveCount}</div>
            </div>
            <div className="count-detail" id="i_count">
              <div className="detail-label">Inactive Count:</div>
              <div className="detail-value">{countDetails.InActiveCount}</div>
            </div>
          </div>
        </div>

        <div className="ag-theme-alpine grid-container">
          <div style={{ height: '500px', width: '100%' }}>
            <AgGridReact
              columnDefs={columnDefs}
              rowData={locations}
              pagination={true}
              paginationPageSize={10}
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

      {showForm && (
        <div className="form-container">
          <AddAreaBuilding
            currentLocation={currentLocation}
            closeForm={() => setShowForm(false)}
          />
        </div>
      )}
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
      style={{ ...buttonStyle, backgroundColor: value === 1 ? 'green' : 'red' }}
      onClick={handleClick}
    >
      {value === 1 ? 'Active' : 'Inactive'}
    </button>
  );
};

const ActionCell = ({ data, onDelete, onEdit }) => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
    <DeleteIcon style={{ cursor: 'pointer', marginRight: '30px', color: 'red' }} onClick={() => onDelete(data.AreaBuildingId)} />
    <EditRoundedIcon style={{ cursor: 'pointer' }} onClick={() => onEdit(data)} />
  </div>
);

const ActionHeader = () => (
  <>
    <span>Actions</span>
    <br />
    <span>
      <EditRoundedIcon style={{ verticalAlign: 'middle', cursor: 'pointer' }} />
    </span>
  </>
);
export default AreaBuilding