import { get, post, put, del } from './api';

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