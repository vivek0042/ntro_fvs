import { post } from "./api";

const uri = "http://localhost:8041/bionicv7/";

const postBionicV7Client = async (method, jsonData, isBodyAvailable) => {
  if (isBodyAvailable === 0) {
    const data = await post(uri + method, null);
    return { httpStatus: true, data: data };
  } else {
    const data = await post(uri + method, jsonData);
    return { httpStatus: true, data: data };
  }
};

export default postBionicV7Client;