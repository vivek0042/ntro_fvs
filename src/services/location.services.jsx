// src/services/locationService.js
import { get, post, put, del } from './api';

export const fetchLocations = async () => {
  try {
    const data = await get('Master/GetAllLocation');
    if (Array.isArray(data.LocationDetails)) {
      return data.LocationDetails;
    } else {
      console.error('API response is not an array:', data);
      return [];
    }
  } catch (error) {
    console.error('Error fetching locations:', error);
    return [];
  }
};



export const deleteLocation = async (locationId) => {
  try {
    const data = await post('Master/DeleteLocation', { id: locationId });
    return data.DatatableCountDetails;
  } catch (error) {
    console.error('Error deleting location:', error);
    throw error;
  }
};
