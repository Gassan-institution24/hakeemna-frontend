import axiosInstance from 'src/utils/axios';

export const createEncounter = () => axiosInstance.post('/api/claims/encounter');
export const getNewAuthorizations = () => axiosInstance.get('/api/claims/authorization/new');
export const viewAuthorizations = () => axiosInstance.get('/api/claims/authorization/view');
export const setDownloaded = () => axiosInstance.post('/api/claims/authorization/setDownloaded');
export const cancellation = () => axiosInstance.post('/api/claims/authorization/cancel');

// ✅ ORDERS
export const radiology = () => axiosInstance.post('/api/claims/radiology');
export const radiologyCancelation = () =>
  axiosInstance.post('/api/claims/radiology/cancelation');

export const ERX = () => axiosInstance.post('/api/claims/erx');
export const ERXcancelation = () =>
  axiosInstance.post('/api/claims/erx/cancelation');

export const lab = () => axiosInstance.post('/api/claims/lab');
export const labCancelation = () =>
  axiosInstance.post('/api/claims/lab/cancelation');

// ✅ CLAIM
export const submitClaim = () => axiosInstance.post('/api/claims/claim');
