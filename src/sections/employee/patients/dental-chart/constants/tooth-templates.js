import { isPrimary, getToothType } from './fdi';
import TOOTH_ARTWORK from '../assets/teeth/artwork';

// Which artwork template renders a given tooth.
//
// The upstream artwork ships four facial archetypes (11 incisor, 13 canine,
// 14 premolar, 16 molar). Hakeemna's existing `getToothType()` already returns
// exactly those four categories — including resolving primary positions 4–5 to
// `molar` — so no new tooth-classification logic is introduced here.
const TYPE_TO_TEMPLATE = {
  incisor: '11',
  canine: '13',
  premolar: '14',
  molar: '16',
};

// Primary teeth reuse the permanent artwork at a reduced scale. The templates do
// contain dedicated `milktooth-*` layers, but those are a separate crown shape
// rather than a scale of the permanent one; wiring them is a follow-up.
export const PRIMARY_SCALE = 0.85;

// Occlusal artwork exists for posterior teeth only — upstream ships none for
// incisors or canines, so those keep their facial drawing when occlusal view is
// on. That is what makes the hybrid arch work: every tooth stays visible and
// clickable rather than blanking out half the chart.
const OCCLUSAL_TEMPLATE = {
  premolar: '14_occl',
  molar: '16_occl',
};

export const hasOcclusalView = (fdi) => Boolean(OCCLUSAL_TEMPLATE[getToothType(fdi)]);

export const getTemplateId = (fdi, occlusal = false) => {
  const type = getToothType(fdi);
  if (occlusal && OCCLUSAL_TEMPLATE[type]) return OCCLUSAL_TEMPLATE[type];
  return TYPE_TO_TEMPLATE[type] || '16';
};

export const getToothArtwork = (fdi, occlusal = false) =>
  TOOTH_ARTWORK[getTemplateId(fdi, occlusal)] || null;

// The artwork carries a viewBox but no width/height, so the renderer has to size
// it. Aspect ratios are read from the markup once, at module load.
const ASPECT = Object.entries(TOOTH_ARTWORK).reduce((acc, [id, markup]) => {
  const viewBox = /viewBox="([\d.\s-]+)"/.exec(markup || '');
  if (viewBox) {
    const [, , w, h] = viewBox[1].trim().split(/\s+/).map(Number);
    if (w > 0 && h > 0) acc[id] = h / w;
  }
  return acc;
}, {});

// Height-to-width ratio for a tooth's template. Facial views are tall (~1.65:1 —
// crown plus roots); occlusal views are near-square, so this must follow the
// template actually in use or the tile geometry breaks when the view flips.
export const getToothAspect = (fdi, occlusal = false) =>
  ASPECT[getTemplateId(fdi, occlusal)] || 1.65;

// Rendered size for a tooth, shrinking primary teeth so both dentitions read
// consistently on the same chart.
export const getToothScale = (fdi) => (isPrimary(fdi) ? PRIMARY_SCALE : 1);

export default getToothArtwork;
