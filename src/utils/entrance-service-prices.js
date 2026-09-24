/**
 * Resolve the price of each service billed on a visit.
 *
 * A visit's `Service_types` is a flat list of service ids and the price was always re-derived
 * from the catalogue's `Price_per_unit`. That is wrong whenever a clinician typed a different
 * figure — a dental treatment added at a quoted rate, a discount, a longer procedure. The typed
 * price was stored on the dental chart and then silently ignored by both the invoice and the
 * appointment view, which each showed the catalogue price instead.
 *
 * `Service_prices` on the entrance carries those overrides as `{ service_type, price }` entries.
 *
 * Two things this has to get right:
 *
 *   - **Keyed by service, not by index.** `Service_types` is appended to by /service-types but
 *     also replaced wholesale by the "services provided" card, so any positional pairing would
 *     come apart the first time someone ticked a box there.
 *   - **Repeats are meaningful.** The same treatment done twice is two billed lines, and they can
 *     carry different prices. Overrides for one service are therefore consumed in order: the
 *     first occurrence takes the first override, the second takes the second, and once they run
 *     out the rest fall back to the catalogue.
 */

/** `Price_per_unit` is a String on service_types and may be blank or non-numeric. */
export const catalogPrice = (service) => {
  const raw = Number(service?.Price_per_unit);
  return Number.isFinite(raw) && raw > 0 ? raw : 0;
};

/**
 * A function that returns the price for each service as you walk `Service_types` in order.
 *
 * Stateful by design — call it once per line, in order, and it hands back the right override for
 * a repeated service. Build a fresh one per pass.
 *
 * @param {Array} servicePrices the entrance's `Service_prices`
 * @returns {(service: object) => number} price for the next occurrence of that service
 */
export function createPriceResolver(servicePrices) {
  const queues = new Map();

  (servicePrices || []).forEach((entry) => {
    // `service_type` may arrive populated or as a bare id.
    const id = String(entry?.service_type?._id || entry?.service_type || '');
    if (!id) return;

    // Rejected BEFORE Number(): Number(null) and Number('') are both 0, so a line sent with no
    // price would otherwise be stored as a real override of zero and billed as free. Only an
    // actual number counts as "the clinician set this price".
    const raw = entry?.price;
    if (raw === null || raw === undefined || raw === '') return;

    const price = Number(raw);
    if (!Number.isFinite(price) || price < 0) return;

    if (!queues.has(id)) queues.set(id, []);
    queues.get(id).push(price);
  });

  return (service) => {
    const id = String(service?._id || service || '');
    const queue = queues.get(id);

    // shift(), so a second line of the same service takes the next override rather than
    // repeating the first.
    if (queue && queue.length) return queue.shift();

    return catalogPrice(service);
  };
}

export default createPriceResolver;
