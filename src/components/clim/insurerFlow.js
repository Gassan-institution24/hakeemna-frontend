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
