// useCountDetails.js
import { useEffect } from 'react';
import { API_BASE_URL } from '../components/Apiconfig';

const useCountDetails = (paramName, setCountDetails) => {
  useEffect(() => {
    fetch(`${API_BASE_URL}InActiveActiveCountDetails?StausCountPatam=${paramName}`)
      .then(response => response.json())
      .then(data => {
        if (data && data.DatatableCountDetails) {
          setCountDetails(data.DatatableCountDetails[0]);
        }
      })
      .catch(error => {
        console.error('Error fetching count details:', error);
      });
  }, [paramName, setCountDetails]);
};

export default useCountDetails;
