import { post } from "./api";

const uri = "http://localhost:8041/bionicv7/";

const postBionicV7Client = async (method, jsonData, isBodyAvailable) => {
  let response;
  let data;

  try {
    if (isBodyAvailable === 0) {
      response = await fetch(uri + method, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;',
        },
        body: null
      });
    } else {
      response = await fetch(uri + method, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;',
        },
        body: jsonData
      });
    }

    data = await response.json();

    return { httpStatus: response.ok, data: data };
  } catch (error) {
    return { httpStatus: false, data: error.message };
  }
};

export default postBionicV7Client;
