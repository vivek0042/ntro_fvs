import { get, post, put, del } from './api';
import { toast } from 'react-toastify';
export const updateStatus = async (Id, newStatus , params) => {
    try {
      const data = await put('Master/InActiveStatusChange', {
        IsActive: Number(newStatus),
        InActiveParamName: params,
        StatusChangeId: Id,
        EntryBy: 1,
      });
      
      return data;
    } catch (error) {
      console.error('Error updating status:', error);
      throw error;
    }
  };

  export const statusCount = async(param) =>{
        try {
            const data = await get('Master/InActiveActiveCountDetails?StausCountPatam='+param);
            return data.DatatableCountDetails;
        }
        catch(error){
            console.error('Error Fetching Count:', error);
            throw error;
        }
  };