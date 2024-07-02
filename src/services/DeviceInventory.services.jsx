// src/services/deviceService.js
import { get, post, put, del } from './api';

export const fetchDevices = async () => {
  try {
    const data = await get('Master/GetAllDevice');
    if (Array.isArray(data.DeviceDetails)) {
      return data.DeviceDetails;
    } else {
      console.error('API response is not an array:', data);
      return [];
    }
  } catch (error) {
    console.error('Error fetching devices:', error);
    return [];
  }
};

export const deleteDevice = async (deviceId) => {
  try {
    const data = await del('Master/DeleteDevices', { DeviceId: deviceId });
    return data;
  } catch (error) {
    console.error('Error deleting device:', error);
    throw error;
  }
};
