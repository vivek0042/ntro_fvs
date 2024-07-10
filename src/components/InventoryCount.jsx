import { useEffect } from 'react';
import { API_BASE_URL } from '../components/Apiconfig';


const InventoryCount = (paramName, setCountDetails) => {
  useEffect(() => {
    const payload = {
      paramName: paramName,
      sDeviceSerialNo: "",
      sLocationId: 0,
      sCardStatusID: 0,
      sFromDate: "",
      sToDate: "",
      sAreaBuildingID: 0,
      sId: 0,
      sDeviceId: "",
      sDeviceModelName: "",
      sDeviceType: "",
      sLocationName: "",
      sDeviceIp: "",
      sMappingFlag: 0,
      sRemark: "",
      sIsActive: 0,
      userID: "",
      firstName: "",
      lastName: "",
      emailAddress: "",
      role: 0
    };

    fetch(`${API_BASE_URL}InventoryCountDetailsFilter`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })
      .then(response => response.json())
      .then(data => {
        if (data && data.InventoryCountDeatils) {
          setCountDetails(data.InventoryCountDeatils[0]);
        }
      })
      .catch(error => {
        console.error('Error fetching count details:', error);
      });
  }, [paramName, setCountDetails]);
};

export default InventoryCount;
