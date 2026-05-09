import axiosInstance from '../utils/axios';

/**
 * Visit Approval Service
 * Handles three insurance strategies: DELTA, WATANIA, ZERO
 */

// ✅ STEP 1: Submit visit approval request
// POST /api/claims/visit-approval/submit
// Body: {
//   insuranceLicense: string,    // e.g., "WataniaINS", "DeltaINS", "MedNet"
//   clinicianId: string,         // Provider license
//   patientNID: string,          // Patient national ID
//   memberID: string,            // Insurance member ID
//   visitType: string,           // "gp" | "specialist" | "consultant"
//   benefitType: string,         // "outpatient" | "maternity" | "dental"
//   idPayer?: string,            // From eligibility response (required for WATANIA)
//   diagnosisCode?: string,      // Override default diagnosis
//   extraActivities?: array      // Additional procedures (WATANIA only)
// }
export const submitVisitApproval = (data) =>
  axiosInstance.post('/api/claims/visit-approval/submit', data);

// ✅ STEP 2: Check approval status (for async strategies)
// GET /api/claims/visit-approval/check?requestId=...
// Returns { success, pending, formNumber?, idPayer?, validUntil?, result? }
export const checkVisitApproval = (requestId) =>
  axiosInstance.get('/api/claims/visit-approval/check', { params: { requestId } });

export default {
  submitVisitApproval,
  checkVisitApproval,
};
