import config from "../config";
// const BASE_URL = 'http://192.168.11.212:8070/api/master';

const apiRequest = async (endpoint, method = 'GET', body = null) => {
  const url = `${config.backendUrl}${endpoint}`;
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };
  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error in API request to ${endpoint}:`, error);
    throw error;
  }
};

export const get = (endpoint) => apiRequest(endpoint);
export const post = (endpoint, body) => apiRequest(endpoint, 'POST', body);
export const put = (endpoint, body) => apiRequest(endpoint, 'PUT', body);
export const del = (endpoint, body) => apiRequest(endpoint, 'DELETE', body);
