/**
 * Which order flow an insurer uses.
 *
 * Every payer now uses the batched flow: the visit approval is confirmed before the visit
 * opens, orders are collected inside it, and one "Send Order" action submits them grouped by
 * TPO transaction type (Lab + physiotherapy, Rad, ERX).
 *
 * The set below is the escape hatch. Any license listed in it falls back to the original
 * flow — "Open Visit", each order sent the moment it is added, and the final Authorization
 * (carrying the diagnosis and every order) sent from inside the visit at claim time. That is
 * what WATANIA and DELTA used to do; put their licenses back in the set to restore it.
 */
export const AUTHORIZATION_FLOW_INSURERS = new Set([]);

export const usesBatchedOrders = (insuranceLicense) =>
  !AUTHORIZATION_FLOW_INSURERS.has(insuranceLicense);

/**
 * Islamic Insurance and MedNet/Solidarity (all three sit behind the JOIINSC payer).
 *
 * Their visit runs as three requests: Eligibility, then the visit approval that returns the
 * e-Form number, then the in-clinic procedures — which have no TPO order transaction of
 * their own and are approved by an Authorization posted against that e-Form encounter. That
 * third step can be repeated as the doctor adds more procedures, so these payers get a
 * "Send Order" action of their own inside the procedures section. Every other payer keeps
 * declaring its procedures on the claim and never sees that button.
 */
export const PROCEDURE_AUTHORIZATION_INSURERS = new Set([
  'IslamicINS',
  'MedNet',
  'Solidarity',
  'MED_NET',      // Mednet TPA staging
  'JOR-INS-CO',   // Jordan Insurance Co. (under Mednet) staging
]);

export const usesProcedureAuthorization = (insuranceLicense) =>
  PROCEDURE_AUTHORIZATION_INSURERS.has(insuranceLicense);
