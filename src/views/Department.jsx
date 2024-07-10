import React, { useState, useEffect, useCallback,useContext, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import DeleteIcon from '@mui/icons-material/Delete';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import '../assets/style/Location.css';
import { API_BASE_URL } from '../components/Apiconfig';
import Sidebar from '../components/Sidebar';
import { LocationContext } from '../hooks/LocationContext';
import useCountDetails from '../components/UseCountDetails';

function Department() {
    const { locations, setLocations, countDetails, setCountDetails } = useContext(LocationContext);
    const [columnDefs] = useState([
        { headerName: 'DepartmentId', field: 'DepartmentId', sortable: true, filter: true, flex: 1, minWidth: 150 },
        { headerName: 'DepartmentName', field: 'DepartmentName', sortable: true, filter: true, flex: 1, minWidth: 150 },
        {
            headerName: 'Status',
            field: 'IsActive',
            cellRenderer: params => (
                <StatusButtonCell
                    value={params.value}
                    onUpdateStatus={() => handleUpdateStatus(params.data.DepartmentId, params.value)}
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
                    onEdit={handleEditLocation}
                />
            ),
            flex: 1,
            minWidth: 150,
            cellStyle: { textAlign: 'center' }
        },
    ]);
    const [rowData, setRowData] = useState([]);
    const DepartmentNameRef = useRef(null);
    const [isActive, setIsActive] = useState(false);
    
    const [gridApi, setGridApi] = useState(null);
    const [pageSize, setPageSize] = useState(10);
  
    const [currentDepartment, setCurrentDepartment] = useState(null);
   
    useCountDetails('Department', setCountDetails);
    useEffect(() => {
        fetch(`${API_BASE_URL}GetAllDepartment`)
            .then(response => response.json())
            .then(data => {
                if (Array.isArray(data.DepartmentDetails)) {
                    setRowData(data.DepartmentDetails);
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

    const handleQuickFilter = (event) => {
        if (gridApi) {
            gridApi.setQuickFilter(event.target.value);
        }
    };
    const handleUpdateStatus = (DepartmentId, currentStatus) => {
        const newStatus = currentStatus == 1 ? 0 : 1;

        fetch(`${API_BASE_URL}InActiveStatusChange`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                IsActive: newStatus,
                InActiveParamName: "Department",
                StatusChangeId: DepartmentId,
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

                setRowData(prevData => {
                    return prevData.map(row => {
                        if (row.DepartmentId === DepartmentId) {
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
                columnKeys: ['DepartmentId', 'DepartmentName'],
            };
            gridApi.exportDataAsCsv(params);
        }
    };
    const handleEditLocation = (Department) => {
       alert("You cannot edit Department Name Here")
    };

    useEffect(() => {
        if (currentDepartment) {
            DepartmentNameRef.current.value = currentDepartment.DepartmentName;
            setIsActive(currentDepartment.IsActive === 1);
        }
    }, [currentDepartment]);

    const onDelete = async (DepartmentId) => {
        const loc = {
            departmentId: DepartmentId,
            deleteby : 1
        };

        try {
            const response = await fetch(`${API_BASE_URL}DeleteDepartment`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loc),
            });

            const data = await response.json();
            if (data.errCode === '0') {
                alert(`Department Deleted Successfully.`);
                setRowData(prevData => prevData.filter(row => row.DepartmentId !== DepartmentId));
            } else {
                alert('Failed to delete Department.');
            }
        } catch (error) {
            alert('Failed to delete Department. Error: ' + error.message);
        }
    };
    return (
        <div className="location-master-container">
            <Sidebar />
            <div className="main-content">
                <div className="header">
                    <div className="location-label">Department</div>
                    
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
        <DeleteIcon style={{ cursor: 'pointer', marginRight: '30px', color: 'red' }} onClick={() => onDelete(data.DepartmentId)} />
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

export default Department;