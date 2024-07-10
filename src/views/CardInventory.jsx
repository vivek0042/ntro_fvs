import React, { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../components/Apiconfig';
import Sidebar from '../components/Sidebar';
import {AddCard} from '../components/Addlocation';
import { LocationContext } from '../hooks/LocationContext';
import useCountDetails from '../components/UseCountDetails';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import DeleteIcon from '@mui/icons-material/Delete';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import '../assets/style/Location.css';
import InventoryCount from '../components/InventoryCount';

const CardInventory = () =>{
    const { locations, setLocations, countDetails, setCountDetails } = useContext(LocationContext);
    const [columnDefs] = useState([
        { headerName: 'cardId', field: 'cardId', sortable: true, filter: true, flex: 1,hide:true, minWidth: 150 },
        { headerName: 'Card Serial No', field: 'Mcsn', sortable: true, filter: true, flex: 1, minWidth: 150 },
        { headerName: 'Location', field: 'LocationName', sortable: true, filter: true, flex: 1, minWidth: 150 },
        { headerName: 'Card Type', field: 'CardType', sortable: true, filter: true, flex: 1, minWidth: 150 },
        { headerName: '	Remark', field: 'Remark', sortable: true, filter: true, flex: 1, minWidth: 150 },
        {
            headerName: 'Status',
            field: null,
            cellRenderer: params => {
                let style = {};
                let text = '';

                switch (params.data.CardStatusName) {
                    case 'Received':
                        style = { color: '#4B0EAE' };
                        text = 'Received';
                        break;
                    case 'In Transist':
                        style = { color: '#1077DA' };
                        text = 'InTransit';
                        break;
                    case 'Allocated':
                        style = { color: '#3BB264' };
                        text = 'Allocated';
                        break;
                    case 'UnAllocated':
                        style = { color: '#CC4A31' };
                        text = 'UnAllocated';
                        break;
                    case 'Withdrawn':
                        style = { color: '#F07A20' };
                        text = 'Withdrawn';
                        break;
                    default:
                        text = '';
                        break;
                }

                return <span style={style}>{text}</span>;
            },
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
    const[counts,setcounts]=useState({ReceivedCount:0,InTransitCount:0,AllocatedCount:0,UnAllocatedCount:0,WithdrawnCount:0})

    const handleNavigateToAddLocation = () => {
        setCurrentLocation(null);
        setShowForm(true);
    };
    InventoryCount('CardInventory', setcounts);
    useEffect(() => {
        fetch(`${API_BASE_URL}GetCardInventory`)
            .then(response => response.json())
            .then(data => {
                if (Array.isArray(data.CardInventoryDetails)) {
                    setLocations(data.CardInventoryDetails);
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
    const handleExport = () => {
        if (gridApi) {
            const params = {
                columnKeys: ['Mcsn', 'LocationName', 'CardType', 'Remark', 'Status'],
            };
            gridApi.exportDataAsCsv(params);
        }
    };
    const openEditForm = (location) => {
        setShowForm(true);
        setCurrentLocation(location);
    };
    const handleEditLocation = (location) => {
        openEditForm(location);
    };
    const onDelete = async (locationId) => {
        const loc = {
            cardAllocationId: locationId,
            deleteby: 1
        };

        try {
            const response = await fetch(`${API_BASE_URL}DeleteCardInventory`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loc),
            });

            const data = await response.json();
            if (data.errCode === '0') {
                alert(`Card Deleted Successfully.`);
                setLocations(prevData => prevData.filter(row => row.id !== locationId));
            } else {
                alert('Failed to delete Card.');
            }
        } catch (error) {
            alert('Failed to delete Card. Error: ' + error.message);
        }
    };
    return (
        <div className="location-master-container">
            <Sidebar />
            <div className="main-content">
                <div className="header">
                    <div className="location-label">Card Inventory</div>
                    <div className="buttons">
                        <button onClick={handleNavigateToAddLocation} className='add-location'>Add Card</button>
                        <button className="bulk-location">Import Bulk Card</button>
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
                            <div className="detail-label">Received:</div>
                            <div className="detail-value">{counts.ReceivedCount}</div>
                        </div>
                        <div className="count-detail" id="y_count">
                            <div className="detail-label">InTransit:</div>
                            <div className="detail-value">{counts.InTransitCount}</div>
                        </div>
                        <div className="count-detail" id="a_count">
                            <div className="detail-label">Allocated:</div>
                            <div className="detail-value">{counts.AllocatedCount}</div>
                        </div>
                        <div className="count-detail" id="i_count">
                            <div className="detail-label">UnAllocated:</div>
                            <div className="detail-value">{counts.UnAllocatedCount}</div>
                        </div>
                        <div className="count-detail" id="v_count">
                            <div className="detail-label">Withdrawn:</div>
                            <div className="detail-value">{counts.WithdrawnCount}</div>
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
                    <AddCard
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
        <DeleteIcon style={{ cursor: 'pointer', marginRight: '30px', color: 'red' }} onClick={() => onDelete(data.CardId)} />
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



export default CardInventory;