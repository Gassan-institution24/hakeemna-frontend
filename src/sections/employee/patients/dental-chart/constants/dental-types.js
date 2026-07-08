/**
 * Dental chart data-shape documentation.
 *
 * This project is JavaScript (no TypeScript compiler), so the "clean types" the
 * dental chart relies on are expressed here as JSDoc `@typedef`s. Import nothing
 * from this file — it is documentation only and emits no runtime code. Editors
 * (VS Code) surface these types for autocompletion and hover hints.
 *
 * The shapes mirror the backend Mongoose schema in
 * hakeemna-backend/models/patients/dental_chart.model.js so the frontend and
 * database stay in agreement.
 */

/**
 * Anatomical family a tooth belongs to. Drives crown/root geometry.
 * @typedef {'incisor'|'canine'|'premolar'|'molar'} ToothType
 */

/**
 * Which of the two arches a tooth sits in.
 * @typedef {'upper'|'lower'} ArchSide
 */

/**
 * The five chartable regions of a tooth crown. Storage keys are fixed and must
 * never change (they are persisted on saved patient records). Anterior teeth
 * relabel `occlusal` as "incisal" for display only — see getSurfaceLabel().
 * @typedef {'occlusal'|'buccal'|'lingual'|'mesial'|'distal'} SurfaceKey
 */

/**
 * Clinical lifecycle of a condition/treatment.
 *  - existing: already present in the mouth
 *  - planned:  proposed / to be done (rendered with a dashed ring)
 *  - watch:    monitor over time (rendered with a dotted ring)
 * @typedef {'existing'|'planned'|'watch'} TreatmentStatus
 */

/**
 * A condition applied to a single surface.
 * @typedef {Object} SurfaceState
 * @property {string|null} [condition] - condition id from CONDITIONS (conditions.js)
 * @property {TreatmentStatus} [status]
 * @property {string} [material]
 * @property {string} [notes]
 */

/**
 * A treatment/condition definition (the palette entries in conditions.js).
 * @typedef {Object} Treatment
 * @property {string} id
 * @property {string} label
 * @property {string} labelAr
 * @property {string} color   - fill color
 * @property {string} stroke  - outline color
 * @property {boolean} toothLevel - true = recolors the whole tooth, false = per surface
 * @property {string} [overlay] - optional glyph key drawn by ConditionOverlay
 * @property {string} group
 */

/**
 * The full per-tooth state kept in the odontogram map (keyed by FDI number).
 * @typedef {Object} ToothState
 * @property {number} fdi_number
 * @property {string|null} [whole_condition] - a toothLevel condition id (crown, missing, implant…)
 * @property {TreatmentStatus} [whole_status]
 * @property {Record<SurfaceKey, SurfaceState>} [surfaces]
 * @property {Array<Object>} [procedures]
 * @property {string} [notes]
 * @property {string} [notes_arabic]
 * @property {string} [treatment_plan]
 * @property {number} [mobility_grade]
 */

export {};
