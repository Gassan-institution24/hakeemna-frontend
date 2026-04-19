import axiosInstance from 'src/utils/axios';

// Functions making actual API calls to backend
export const createEncounter = () => axiosInstance.post('/api/claims/encounter');
export const getNewAuthorizations = () => axiosInstance.get('/api/claims/authorization/new');
export const viewAuthorizations = (id) =>
  axiosInstance.get('/api/claims/authorization/view', { params: { id, direction: 0 } });
export const setDownloaded = (id) =>
  axiosInstance.post('/api/claims/authorization/setDownloaded', null, { params: { id } });
export const cancellation = () => axiosInstance.post('/api/claims/authorization/cancel');

// ✅ E-FORM NUMBER
// Step 1: submit prior-auth request → returns { requestId, strategy } or { formNumber } for self-generated insurers
export const submitFormNumber = (data) => axiosInstance.post('/api/claims/form-number/submit', data);
// Step 2: poll for insurer response → returns { formNumber } when approved
export const checkFormNumber = (requestId) =>
  axiosInstance.get('/api/claims/form-number/check', { params: { requestId } });

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
