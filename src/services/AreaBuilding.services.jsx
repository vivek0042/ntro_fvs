// src/services/deviceService.js
import { get, post, put, del } from './api';

export const fetchArea = async () => {
  try {
    const data = await get('Master/GetAllArea');
    if (Array.isArray(data.AreaBuildingDetails)) {
      return data.AreaBuildingDetails;
    } else {
      console.error('API response is not an array:', data);
      return [];
    }
  } catch (error) {
    console.error('Error fetching AreaBuilding:', error);
    return [];
  }
};

export const deleteArea = async (areaId) => {
  try {
    const data = await del('Master/DeleteArea', { AreaBuildingId: areaId });
    return data;
  } catch (error) {
    console.error('Error deleting AreaBuilding:', error);
    throw error;
  }
};
