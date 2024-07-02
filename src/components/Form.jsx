import React, { useState,useEffect } from 'react';
import '../assets/style/Form.css'; // Import the CSS file

function Form({ onAddLocation, onCancel, LocationId, params }) {
    const [LocationDropDown,setLocationDropDown] = useState([]);
  const [formData, setFormData] = useState({

    deviceSerialNo: '',
    DeviceType:'',
    DeviceModelName:'',
    DeviceIp:'',
    LocationName:0,
    CardStatusID:0,
    Remark:''

  });


  const BindLocation=async()=>{

    const response = await fetch('http://192.168.11.212:8070/api/dropdown/getfilllocation');
    const data = await response.json();
    if(Array.isArray(data.LocationDetails)){
        setLocationDropDown(data.LocationDetails);
    }
  }


  useEffect(()=>{
    BindLocation();
},[]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    let url = '';
    let body = {};

    if (params === 'Location') {
        
      url = 'http://192.168.11.212:8070/api/master/AddLocation';
      body = { LocationId: LocationId, LocationName: formData.locationName };
    } 
    else if (params === 'Device') {
      url = 'http://192.168.11.212:8070/api/master/AddDevice';
      body = { DeviceSerialNo: formData.deviceSerialNo , 
        DeviceType: formData.DeviceType ,
        DeviceModelName: formData.DeviceModelName,
        Remark: formData.Remark,
        CardStatusID: formData.CardStatusID,
        LocationName: formData.LocationName,
        DeviceIp: formData.DeviceIp};
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error('Failed to add');
      }

      const data = await response.json();
      onAddLocation(data);

      // Clear form fields
      setFormData({
        locationName: '',
        deviceSerialNo: '',
        DeviceType:'',
        DeviceModelName:'',
        DeviceIp:'',
        LocationName:'',
        CardStatusID:'',
        Remark:''
      });
    } catch (error) {
      console.error('Error adding:', error);
    }
  };

  return (
    <div className="form-container">
      <form className="add-location-form" onSubmit={handleSubmit}>
        <h2>Add {params}</h2>
        <div className="form-group">
          {params === 'Location' ? (
            <>
              <label htmlFor="locationName">Location Name</label>
              <input
                type="text"
                id="locationName"
                name="locationName"
                value={formData.locationName}
                onChange={handleChange}
                required
              />
            </>
          ) : params === 'Device' ? (
            <>
              <label htmlFor="deviceSerialNo">Device Serial No</label>
              <input
                type="text"
                id="deviceSerialNo"
                name="deviceSerialNo"
                value={formData.deviceSerialNo}
                onChange={handleChange}
                required
              />
              <label htmlFor="DeviceModelName">Modal Name</label>
              <input
                type="text"
                id="DeviceModelName"
                name="DeviceModelName"
                value={formData.DeviceModelName}
                onChange={handleChange}
                required
              />
              <label htmlFor="DeviceType">Device Type</label>
              <input
                type="text"
                id="DeviceType"
                name="DeviceType"
                value={formData.DeviceType}
                onChange={handleChange}
                required
              />
              <label htmlFor="DeviceIp">Device Ip</label>
              <input
                type="text"
                id="DeviceIp"
                name="DeviceIp"
                value={formData.DeviceIp}
                onChange={handleChange}
                required
              />
              <label htmlFor="LocationName">Location</label>
              <select
           
                id="LocationName"
                name="LocationName"
                value={formData.LocationName}
                onChange={handleChange}
                required
              >
                <option value="">Select a location</option>
                {LocationDropDown.map((location)=>(<option key={location.LocationId} value={location.LocationId}>{location.LocationName}</option>))}
                </select>
              <label htmlFor="CardStatusID">Device Status</label>
              <select
             
                id="CardStatusID"
                name="CardStatusID"
                value={formData.CardStatusID}
                onChange={handleChange}
                required
              >
                <option value="0">Select Device Status</option>
                <option value="1">Recieved</option>
                <option value="2">In Transit</option>
                <option value="3">Allocated</option>
                <option value="4">UnAllocated</option>
                <option value="5">Withdraw</option>
                  </select>  
              <label htmlFor="Remark">Remark</label>
              <input
                type="text"
                id="Remark"
                name="Remark"
                value={formData.Remark}
                onChange={handleChange}
                required
              />  
            </>
          ) : null}
        </div>
        <div className="form-buttons">
          <button type="submit" className="btn btn-add">
            Add {params}
          </button>
          <button type="button" className="btn btn-cancel" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default Form;
