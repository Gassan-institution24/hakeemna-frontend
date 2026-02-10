import axiosInstance, { endpoints } from 'src/utils/axios';


export const submitClaim = async (claimData) => {
  const response = await axiosInstance.post("/api/claims/", claimData, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return response.data;
};

export const radiology = async (payload) => {
  const { data } = await axiosInstance.post('/api/claims/radiology', payload);
  return data;
};
export const registerVisit = async (payload) => {
  const { data } = await axiosInstance.post('/api/claims/visit/register', payload);
  return data;
};


export const getVisitById = async (visitId) => {
  const res = await axiosInstance.get(`/api/claims/visit/${visitId}`);
  return res.data;
};

export const checkEligibility = async (payload) => {
  const res = await axiosInstance.post('api/claims/eligibility', payload);
  return res.data;
};


export const createEncounter = async (payload) => {
  const res = await axiosInstance.post('api/claims/encounter', payload);
  return res.data;
};


export const getNewAuthorizations = async (payload) => {
  const res = await axiosInstance.get('api/claims/authorization/get-new', payload);
  return res.data;
};
