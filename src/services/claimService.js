import axiosInstance from 'src/utils/axios';

export const createEncounter = () => axiosInstance.post('/api/claims/encounter');
export const getNewAuthorizations = () => axiosInstance.get('/api/claims/authorization/new');
export const viewAuthorizations = () => axiosInstance.get('/api/claims/authorization/view');
export const setDownloaded = () => axiosInstance.post('/api/claims/authorization/setDownloaded');
export const radiology = () => axiosInstance.post('/api/claims/radiology');
export const ERX = () => axiosInstance.post('/api/claims/erx');
export const lab = () => axiosInstance.post('/api/claims/lab');
export const submitClaim = () => axiosInstance.post('/api/claims/claim');
