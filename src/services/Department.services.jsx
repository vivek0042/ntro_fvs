import { get, post, put, del } from './api';

export const fetchDepartment = async () => {
  try {
    const data = await get('Master/GetAllDepartment');
    if (Array.isArray(data.DepartmentDetails)) {
      return data.DepartmentDetails;
    } else {
      console.error('API response is not an array:', data);
      return [];
    }
  } catch (error) {
    console.error('Error fetching department:', error);
    return [];
  }
};

export const deleteDepartment = async (departmentId) => {
  try {
    const data = await del('Master/DeleteDepartment', { DepartmentId: departmentId });
    return data;
  } catch (errCode) {
       alert('Error deleting department:', errCode);
    
  }
};