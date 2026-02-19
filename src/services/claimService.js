import axiosInstance, { endpoints } from 'src/utils/axios';

export const submitClaim = () => axiosInstance.post('/api/claims/claim');
export const radiology = () => axiosInstance.post('/api/claims/radiology');
export const ERX = () => axiosInstance.post('/api/claims/erx');
export const createEncounter = () => axiosInstance.post('/api/claims/encounter');
export const viewAuthorizations = () => axiosInstance.get('/api/claims/authorization/view');
export const setDownloaded = () => axiosInstance.post('/api/claims/authorization/setDownloaded');

export const getNewAuthorizations = async (payload) => {
  const res = await axiosInstance.get('api/claims/authorization/new', payload);
  return res.data;
};

export const lab = () => axiosInstance.post('/api/claims/lab');
