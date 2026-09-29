// Periodontal chart — pure logic, no imports (so it can be exercised directly
// with node). Everything the chart derives lives here: CAL, the summary, which
// teeth can be probed, and the on-screen order of the six sites.
//
// Sites: MB, B, DB on the buccal side; ML, L, DL on the lingual/palatal side.
// A site exists only once it has a probing depth — absent means "not charted",
// never "0 mm" (same invariant as the server and as React-Odontogram-Modul).
//
// GM is the CEJ → gingival-margin distance: positive = recession (margin apical
// to the CEJ), negative = enlargement. CAL = PD + GM, derived, never stored.

export const BUCCAL_SITES = ['MB', 'B', 'DB'];
export const LINGUAL_SITES = ['ML', 'L', 'DL'];
export const PERIO_SITES = [...BUCCAL_SITES, ...LINGUAL_SITES];

export const PD_MIN = 1;
export const PD_MAX = 15;
export const GM_MIN = -10;
export const GM_MAX = 20;

// Clinical thresholds used for colouring and the summary.
export const PD_WARN = 4;
export const PD_ALERT = 6;

const quadrantOf = (fdi) => Math.floor(fdi / 10);

// Teeth on the patient's right (Q1/Q4, primary Q5/Q8) sit on the viewer's left,
// so their distal side is on screen-left: D · centre · M. The patient's left
// (Q2/Q3, primary Q6/Q7) reads M · centre · D.
export function screenSiteOrder(fdi, side) {
  const right = [1, 4, 5, 8].includes(quadrantOf(fdi));
  const sites = side === 'buccal' ? BUCCAL_SITES : LINGUAL_SITES;
  return right ? [...sites].reverse() : sites;
}

const toInt = (value) => {
  if (value === null || value === undefined || value === '') return null;
  const n = Math.round(Number(value));
  return Number.isFinite(n) ? n : null;
};

export function clampPd(value) {
  const n = toInt(value);
  if (n === null || n < PD_MIN) return null;
  return Math.min(PD_MAX, n);
}

export function clampGm(value) {
  const n = toInt(value);
  if (n === null) return null;
  return Math.min(GM_MAX, Math.max(GM_MIN, n));
}

// CAL for one site, or null when the site is not charted. A missing GM counts as
// 0 (margin at the CEJ), which is how CAL reads when only PD was probed.
export function calOf(site) {
  if (!site || !site.pd) return null;
  return site.pd + (site.gm || 0);
}

// ── Tooth status, from the odontogram's own record for that tooth ─────────────
// No natural tooth to probe: missing, not yet erupted, impacted, or a bridge
// pontic (the gap under a bridge).
const NOT_PROBEABLE_DX = new Set(['missing', 'unerupted', 'impacted']);

export function isProbeable(odontoTooth) {
  if (!odontoTooth) return true;
  if (NOT_PROBEABLE_DX.has(odontoTooth.whole_diagnosis)) return false;
  return odontoTooth.whole_condition !== 'bridge_pontic';
}

export const isImplant = (odontoTooth) => odontoTooth?.whole_condition === 'implant';

// ── Summary ───────────────────────────────────────────────────────────────────
const round1 = (n) => Math.round(n * 10) / 10;

/**
 * Derived statistics for one exam. Only teeth that can be probed count, so a
 * tooth later charted as missing cannot skew the averages.
 *
 * @param {object} teeth  { [fdi]: { sites, mobility_grade, furcation_grade, plaque } }
 * @param {number[]} probeableFdis  teeth present in the mouth
 */
export function computePerioSummary(teeth, probeableFdis) {
  const present = new Set(probeableFdis || []);
  const pds = [];
  const cals = [];
  let bleeding = 0;
  let suppuration = 0;
  let plaqueTeeth = 0;

  present.forEach((fdi) => {
    const tooth = teeth?.[fdi];
    if (!tooth) return;
    if (tooth.plaque) plaqueTeeth += 1;
    PERIO_SITES.forEach((key) => {
      const site = tooth.sites?.[key];
      if (!site?.pd) return;
      pds.push(site.pd);
      cals.push(calOf(site));
      if (site.bop) bleeding += 1;
      if (site.sup) suppuration += 1;
    });
  });

  const charted = pds.length;
  const avg = (list) => (list.length ? round1(list.reduce((a, b) => a + b, 0) / list.length) : null);

  return {
    chartedSites: charted,
    bleedingSites: bleeding,
    suppurationSites: suppuration,
    bopPercent: charted ? round1((bleeding / charted) * 100) : null,
    maxPd: charted ? Math.max(...pds) : null,
    avgPd: avg(pds),
    maxCal: charted ? Math.max(...cals) : null,
    avgCal: avg(cals),
    sitesPd4: pds.filter((pd) => pd >= 4).length,
    sitesPd5: pds.filter((pd) => pd >= 5).length,
    sitesPd6: pds.filter((pd) => pd >= 6).length,
    plaquePercent: present.size ? round1((plaqueTeeth / present.size) * 100) : null,
  };
}

// ── Draft ↔ API shape ─────────────────────────────────────────────────────────
// The editor keeps teeth keyed by FDI; the API stores an array.

export function examToDraft(exam) {
  const teeth = {};
  (exam?.teeth || []).forEach((tooth) => {
    const sites = {};
    PERIO_SITES.forEach((key) => {
      const site = tooth.sites?.[key];
      if (site?.pd) {
        sites[key] = {
          pd: site.pd,
          ...(site.gm !== undefined && site.gm !== null && { gm: site.gm }),
          ...(site.bop && { bop: true }),
          ...(site.sup && { sup: true }),
        };
      }
    });
    teeth[tooth.fdi_number] = {
      sites,
      mobility_grade: tooth.mobility_grade || 0,
      furcation_grade: tooth.furcation_grade || 0,
      plaque: !!tooth.plaque,
      notes: tooth.notes || '',
    };
  });
  return teeth;
}

export function draftToTeeth(draft) {
  return Object.entries(draft || {})
    .map(([fdi, tooth]) => ({
      fdi_number: Number(fdi),
      sites: tooth.sites || {},
      mobility_grade: tooth.mobility_grade || 0,
      furcation_grade: tooth.furcation_grade || 0,
      plaque: !!tooth.plaque,
      notes: tooth.notes || '',
    }))
    .filter(
      (t) =>
        Object.keys(t.sites).length || t.mobility_grade || t.furcation_grade || t.plaque || t.notes
    )
    .sort((a, b) => a.fdi_number - b.fdi_number);
}
