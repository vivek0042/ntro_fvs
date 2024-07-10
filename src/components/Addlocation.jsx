import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from './Apiconfig';
import {API_FOR_FETCH} from './Apiconfig'
import '../assets/style/Form.css'

const AddLocation = ({ currentLocation, closeForm }) => {
    const [locationName, setLocationName] = useState('');
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (currentLocation) {
            setLocationName(currentLocation.LocationName);
            setIsEditing(true);
        } else {
            setLocationName('');
            setIsEditing(false);
        }
    }, [currentLocation]);

    const handleSubmit = (event) => {
        event.preventDefault();
        const location = {
            LocationName: locationName,
            LocationId: currentLocation ? currentLocation.LocationId : 0,
        };

        const url = `${API_BASE_URL}AddLocation`;

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(location),
        })
            .then(response => response.json())
            .then(data => {
                if (data.errCode === '1001' || data.errCode === '1002') {
                    alert(`Location ${data.errCode === '1001' ? 'Added' : 'Updated'} Successfully.`);
                } else {
                    alert('Location Already Exists');
                }

                closeForm(); // Close the form after submission
            })
            .catch(error => {
                console.error('Error saving location:', error);
                alert('Failed to save location.');
            });
    };

    return (
        <div className="add-location-form">
            <h2>{isEditing ? 'Edit Location' : 'Add Location'}</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Location Name:
                    <input
                        type="text"
                        value={locationName}
                        onChange={(e) => setLocationName(e.target.value)}
                        required
                    />
                </label>
                <button type="submit">{isEditing ? 'Update' : 'Add'}</button>
            </form>
            <button onClick={closeForm}>Cancel</button>
        </div>
    );
};

// for adding/edit area building

const AddAreaBuilding = ({ currentLocation, closeForm }) => {
    
    const [areaBuilding, setAreaBuilding] = useState('');
    const [locationId, setLocationId] = useState('');
    const [locations, setLocations] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [locationName, setLocationName] = useState('');

    useEffect(() => {
        if (currentLocation) {
            setAreaBuilding(currentLocation.AreaBuildingName);
            setLocationId(currentLocation.LocationId);
            setIsEditing(true);
        } else {
            setAreaBuilding('');
            setLocationId('');
            setIsEditing(false);
        }
    }, [currentLocation]);

    useEffect(() => {
        // Fetch locations from the server
        fetch(`${API_FOR_FETCH}GetFillLocation`)
            .then(response => response.json())
            .then(data => {
                setLocations(data.LocationDetails);
            })
            .catch(error => {
                console.error('Error fetching locations:', error);
            });
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();
        const location = {
            locationId: locationId || 0, // Ensure locationId is included, use 0 if not set
            areaBuildingName: areaBuilding,
            areaBuildingId: currentLocation ? currentLocation.AreaBuildingId : 0,
            locationName:locationName || ''
        };

        const url = `${API_BASE_URL}AddArea`;

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(location),
        })
            .then(response => response.json())
            .then(data => {
                if (data.errCode === '1001' || data.errCode === '1002') {
                    alert(`AreaBuilding ${data.errCode === '1001' ? 'Added' : 'Updated'} Successfully.`);
                } else {
                    alert('AreaBuilding Already Exists');
                }

                closeForm(); 
            })
            .catch(error => {
                console.error('Error saving location:', error);
                alert('Failed to save location.');
            });
    };

    return (
        <div className="add-location-form">
            <h2>{isEditing ? 'Edit Location' : 'Add Location'}</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    AreaBuilding name:
                    <input
                        type="text"
                        value={areaBuilding}
                        onChange={(e) => setAreaBuilding(e.target.value)}
                        required
                    />
                </label>
                <label>
                    Location Name:
                    <select
                        value={locationId}
                        onChange={(e) => setLocationId(e.target.value)}
                        required
                    >
                        <option value="">Select Location</option>
                        {locations.map(location => (
                            <option key={location.LocationId} value={location.LocationId}>
                                {location.LocationName}
                            </option>
                        ))}
                    </select>
                </label>
                <button type="submit">{isEditing ? 'Update' : 'Add'}</button>
            </form>
            <button onClick={closeForm}>Cancel</button>
        </div>
    );
};
const AddDevice = ({ currentLocation, closeForm }) => {
    
    const [Device, setDevice] = useState('');
    const [locationId, setLocationId] = useState('');
    const [locations, setLocations] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [modalname, setmodelname] = useState('');
    const [devicetype, setdevicetype] = useState('');
    const [deviceip, setdeviceip] = useState('');
    const[deviceId,setdeviceId]=useState('');
    const[remarks,setremarks]=useState('');
    const [selectedValue, setSelectedValue] = useState('');

    const statusOptions = [
        { value: 1, text: 'Received', style: { color: '#4B0EAE' } },
        { value: 2, text: 'InTransit', style: { color: '#1077DA' } },
        { value: 3, text: 'Allocated', style: { color: '#3BB264' } },
        { value: 4, text: 'UnAllocated', style: { color: '#CC4A31' } },
        { value: 5, text: 'Withdrawn', style: { color: '#F07A20' } },
      ];

    useEffect(() => {
       if (currentLocation) {
            setDevice(currentLocation.DeviceSerialNo);
            setLocationId(currentLocation.LocationId);
            setmodelname(currentLocation.DeviceModelName);
            setdevicetype(currentLocation.DeviceType);
            setdeviceip(currentLocation.DeviceIp);
            setdeviceId(currentLocation.DeviceId);
            setremarks(currentLocation.Remark);
            setSelectedValue(currentLocation.CardStatusID);
            setIsEditing(true);
        } else {
            setDevice('');
            setLocationId('');
            setmodelname('');
            setdevicetype('');
            setdeviceip('');
            setdeviceId('');
            setIsEditing(false);
            setSelectedValue('');
            setremarks('');
        }
    }, [currentLocation]);

    useEffect(() => {
        // Fetch locations from the server
        fetch(`${API_FOR_FETCH}GetFillLocation`)
            .then(response => response.json())
            .then(data => {
                setLocations(data.LocationDetails);
            })
            .catch(error => {
                console.error('Error fetching locations:', error);
            });
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();
        const location = {
            locationId: locationId || 0, // Ensure locationId is included, use 0 if not set
            deviceSerialNo: Device,
            deviceId:  deviceId ? parseInt(deviceId, 10) : 0, 
            id: currentLocation ? currentLocation.Id : 0,
            deviceModelName:modalname,
            deviceType:devicetype,
            deviceIp:deviceip,
            remark:remarks,
            CardStatusID:selectedValue,
            locationName:''
        };

        const url = `${API_BASE_URL}AddDevice`;

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(location),
        })
            .then(response => response.json())
            .then(data => {
                if (data.errCode === '1001' || data.errCode === '1002') {
                    alert(`Device ${data.errCode === '1001' ? 'Added' : 'Updated'} Successfully.`);
                } else {
                    alert('Device Already Exists');
                }

                closeForm(); 
            })
            .catch(error => {
                console.error('Error saving Device:', error);
                alert('Failed to save Device.');
            });
    };
    const handleChange = (e) => {
        const newValue = parseInt(e.target.value);
        setSelectedValue(newValue);
        // onStatusChange(data.Id, newValue);
      };
    

    return (
        <div className="add-location-form">
            <h2>{isEditing ? 'Edit Device' : 'Add Device'}</h2>
            <form onSubmit={handleSubmit}>
                <label>
                Device Serial No:
                    <input
                        type="text"
                        value={Device}
                        onChange={(e) => setDevice(e.target.value)}
                        required
                    />
                </label>
                <label>
                Device Modal Name:
                    <input
                        type="text"
                        value={modalname}
                        onChange={(e) => setmodelname(e.target.value)}
                        required
                    />
                </label>
                <label>
                Device IP:
                    <input
                        type="text"
                        value={deviceip}
                        onChange={(e) => setdeviceip(e.target.value)}
                        required
                    />
                </label>
                <label>
                Device Type:
                    <input
                        type="text"
                        value={devicetype}
                        onChange={(e) => setdevicetype(e.target.value)}
                        required
                    />
                </label>
                <label>
                    Location Name:
                    <select
                        value={locationId}
                        onChange={(e) => setLocationId(e.target.value)}
                        required
                    >
                        <option value="">Select Location</option>
                        {locations.map(location => (
                            <option key={location.LocationId} value={location.LocationId}>
                                {location.LocationName}
                            </option>
                        ))}
                    </select>
                </label>
                <label>
                 Card Status:
                    <select value={selectedValue} onChange={handleChange}>
                        {statusOptions.map((option) => (
                            <option key={option.value} value={option.value} style={option.style}>
                            {option.text}
                            </option>
                        ))}
                    </select>
                </label>
                <label>
                Remarks:
                    <input
                        type="text"
                        value={remarks}
                        onChange={(e) => setremarks(e.target.value)}
                        required
                    />
                </label>
                <button type="submit">{isEditing ? 'Update' : 'Add'}</button>
            </form>
            <button onClick={closeForm}>Cancel</button>
        </div>
    );
};
const AddDeviceUser = ({ currentLocation, closeForm }) => {
    
    const [DeviceSerialNo, setdeviceserialNo] = useState('');
    const[EntityADID,setentityADID] = useState('');
    const [locationId, setLocationId] = useState('');
    const [locations, setLocations] = useState([]);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
       if (currentLocation) {
            setLocationId(currentLocation.LocationId);
            setdeviceserialNo(currentLocation.DeviceSerialNo);
            setentityADID(currentLocation.entityADID)
            setIsEditing(true);
           
        } else {
            setLocationId('');
            setdeviceserialNo('');
            setIsEditing(false);
            setentityADID('');
           
        }
    }, [currentLocation]);

    useEffect(() => {
        // Fetch locations from the server
        fetch(`${API_FOR_FETCH}GetFillLocation`)
            .then(response => response.json())
            .then(data => {
                setLocations(data.LocationDetails);
            })
            .catch(error => {
                console.error('Error fetching locations:', error);
            });
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();
        const location = {
            deviceSerialNo: DeviceSerialNo,
            // MappingId:  Id ? parseInt(Id, 10) : 0, 
            MappingId: currentLocation ? currentLocation.MappingId : 0,
            entityADID:EntityADID,
            locationName:''
        };

        const url = `${API_BASE_URL}AddDeviceUserMapping`;

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(location),
        })
            .then(response => response.json())
            .then(data => {
                if (data.errCode === '1001' || data.errCode === '1002') {
                    alert(`Device ${data.errCode === '1001' ? 'Added' : 'Updated'} Successfully.`);
                } else {
                    alert('Device Already Exists');
                }

                closeForm(); 
            })
            .catch(error => {
                console.error('Error saving Device:', error);
                alert('Failed to save Device.');
            });
    };
   
    

    return (
        <div className="add-location-form">
            <h2>{isEditing ? 'Edit Device' : 'Add Device'}</h2>
            <form onSubmit={handleSubmit}>
                <label>
                Device Serial No:
                    <input
                        type="text"
                        value={DeviceSerialNo}
                        onChange={(e) => setdeviceserialNo(e.target.value)}
                        required
                    />
                </label>
                <label>
                EntityADID:
                    <input
                        type="text"
                        value={EntityADID}
                        onChange={(e) => setentityADID(e.target.value)}
                        required
                    />
                </label>
                
                <button type="submit">{isEditing ? 'Update' : 'Add'}</button>
            </form>
            <button onClick={closeForm}>Cancel</button>
        </div>
    );
};
const AddCard = ({ currentLocation, closeForm }) => {
    
    const [cardSerialNo, setcardserialno] = useState('');
    const[cardId,setcardId]=useState('');
    const[remarks,setremarks] = useState('');
    const [locationId, setLocationId] = useState('');
    const [locations, setLocations] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedValue, setSelectedValue] = useState('');

    const statusOptions = [
        { value: 1, text: 'Received', style: { color: '#4B0EAE' } },
        { value: 2, text: 'InTransit', style: { color: '#1077DA' } },
        { value: 3, text: 'Allocated', style: { color: '#3BB264' } },
        { value: 4, text: 'UnAllocated', style: { color: '#CC4A31' } },
        { value: 5, text: 'Withdrawn', style: { color: '#F07A20' } },
      ];

    useEffect(() => {
       if (currentLocation) {
            setLocationId(currentLocation.LocationId);
            setcardId(currentLocation.CardId);
            setcardserialno(currentLocation.Mcsn);
            setremarks(currentLocation.Remark);
            setSelectedValue(currentLocation.CardStatus);
            setIsEditing(true);
        } else {
            setLocationId('');
            setcardserialno('');
            setIsEditing(false);
            setcardId('');
            setSelectedValue('');
           
        }
    }, [currentLocation]);

    useEffect(() => {
        // Fetch locations from the server
        fetch(`${API_FOR_FETCH}GetFillLocation`)
            .then(response => response.json())
            .then(data => {
                setLocations(data.LocationDetails);
            })
            .catch(error => {
                console.error('Error fetching locations:', error);
            });
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();
        const location = {
            cardSerialNo: cardSerialNo,
            // MappingId:  Id ? parseInt(Id, 10) : 0, 
            cardId:cardId ? parseInt(cardId, 10) : 0,
            Remark:remarks,
            locationId: locationId || 0,
            cardStatus:selectedValue,
            locationName:'',
            Cid: "",
            Mcsn: "",
            LocationName: "",
            CardStatusName: "",
            IsActive: 0,
            CardType: "",
        };

        const url = `${API_BASE_URL}AddCardInventory`;

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(location),
        })
            .then(response => response.json())
            .then(data => {
                if (data.errCode === '1001' || data.errCode === '1002') {
                    alert(`card ${data.errCode === '1001' ? 'Added' : 'Updated'} Successfully.`);
                } else {
                    alert('card Already Exists');
                }

                closeForm(); 
            })
            .catch(error => {
                console.error('Error saving card:', error);
                alert('Failed to save card.');
            });
    };
    const handleChange = (e) => {
        const newValue = parseInt(e.target.value);
        setSelectedValue(newValue);
        // onStatusChange(data.Id, newValue);
      };
    

    return (
        <div className="add-location-form">
            <h2>{isEditing ? 'Edit card' : 'Add card'}</h2>
            <form onSubmit={handleSubmit}>
                <label>
                Card Serial No:
                    <input
                        type="text"
                        value={cardSerialNo}
                        onChange={(e) => setcardserialno(e.target.value)}
                        required
                    />
                </label>
                <label>
                Remark:
                    <input
                        type="text"
                        value={remarks}
                        onChange={(e) => setremarks(e.target.value)}
                        required
                    />
                </label>
                <label>
                    Location Name:
                    <select
                        value={locationId}
                        onChange={(e) => setLocationId(e.target.value)}
                        required
                    >
                        <option value="">Select Location</option>
                        {locations.map(location => (
                            <option key={location.LocationId} value={location.LocationId}>
                                {location.LocationName}
                            </option>
                        ))}
                    </select>
                </label>
                <label>
                 Card Status:
                    <select value={selectedValue} onChange={handleChange}>
                        {statusOptions.map((option) => (
                            <option key={option.value} value={option.value} style={option.style}>
                            {option.text}
                            </option>
                        ))}
                    </select>
                </label>
                
                <button type="submit">{isEditing ? 'Update' : 'Add'}</button>
            </form>
            <button onClick={closeForm}>Cancel</button>
        </div>
    );
};



export {AddAreaBuilding,AddCard,AddDeviceUser,AddLocation,AddDevice};
