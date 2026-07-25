import axiosInstance from '../utils/axios';

// Functions making actual API calls to backend
export const createEncounter = () => axiosInstance.post('/api/claims/encounter');
export const getNewAuthorizations = () => axiosInstance.get('/api/claims/authorization/new');
export const viewAuthorizations = (id) =>
  axiosInstance.get('/api/claims/authorization/view', { params: { id, direction: 0 } });
export const setDownloaded = (id) =>
  axiosInstance.post('/api/claims/authorization/setDownloaded', null, { params: { id } });
export const cancellation = (data) => axiosInstance.post('/api/claims/authorization/cancel', data);

// ✅ E-FORM NUMBER
// Step 1: submit prior-auth request → returns { requestId, strategy } or { formNumber } for self-generated insurers
export const submitFormNumber = (data) => axiosInstance.post('/api/claims/form-number/submit', data);
// Step 2: poll for insurer response → returns { formNumber } when approved
export const checkFormNumber = (requestId) =>
  axiosInstance.get('/api/claims/form-number/check', { params: { requestId } });

// ✅ ORDERS
export const radiology = (data) => axiosInstance.post('/api/claims/radiology', data);
export const radiologyCancelation = (data) =>
  axiosInstance.post('/api/claims/radiology/cancelation', data);

export const ERX = (data) => axiosInstance.post('/api/claims/erx', data);
export const ERXcancelation = (data) =>
  axiosInstance.post('/api/claims/erx/cancelation', data);

export const lab = (data) => axiosInstance.post('/api/claims/lab', data);
export const labCancelation = (data) =>
  axiosInstance.post('/api/claims/lab/cancelation', data);

// ✅ CLAIM
export const submitClaim        = (data) => axiosInstance.post('/api/claims/claim', data);
export const getNewClaims       = ()     => axiosInstance.get('/api/claims/claim/new');
export const setClaimDownloaded = (id)   => axiosInstance.post('/api/claims/claim/setDownloaded', null, { params: { id } });
export const viewClaim          = (id)   => axiosInstance.get('/api/claims/claim/view', { params: { id, direction: 0 } });

// ✅ VISIT APPROVAL (Prior Authorization / Eligibility)
export const submitVisitApproval = (data) =>
  axiosInstance.post('/api/claims/visit-approval/submit', data);
export const checkVisitApproval = (requestId) =>
  axiosInstance.get('/api/claims/visit-approval/check', { params: { requestId } });

// ✅ VISIT AUTHORIZATION (WATANIA only — step 2, triggered on "Create Visit")
// Sends Authorization with EncounterID = IDPayer. Poll /visit-approval/check for result.
export const submitVisitAuthorization = (data) =>
  axiosInstance.post('/api/claims/visit-authorization/submit', data);

// ✅ FINAL AUTHORIZATION (WATANIA only — triggered on "Close and Submit Claim")
// Sends ONE Authorization with ALL visit data. EncounterID must equal IDPayer from eligibility.
export const submitFinalAuthorization = (data) =>
  axiosInstance.post('/api/claims/final-authorization/submit', data);
export const checkFinalAuthorization = (requestId) =>
  axiosInstance.get('/api/claims/final-authorization/check', { params: { requestId } });
