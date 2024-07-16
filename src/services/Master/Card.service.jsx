import { get, post, put, del } from '../api';

export const fetchCards = async () => {
    try {
      const data = await get('Master/GetCardInventory');
      if (Array.isArray(data.CardInventoryDetails)) {
        return data.CardInventoryDetails;
      } else {
        console.error('API response is not an array:', data);
        return [];
      }
    } catch (error) {
      console.error('Error fetching Cards:', error);
      return [];
    }
  };

