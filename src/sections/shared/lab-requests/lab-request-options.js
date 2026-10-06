// Option lists for the dental lab request (lab prescription).
//
// They follow what dental lab Rx / work-authorization forms ask for: restoration
// type, teeth, material, shade, margin and pontic design, contacts and occlusion,
// implant details, impression type and the enclosures sent with the case.
// Values are stored as-is; labels go through t(), so the Arabic lives in ar.json.

export const RESTORATION_TYPES = [
  { value: 'crown', label: 'Crown' },
  { value: 'bridge', label: 'Bridge' },
  { value: 'veneer', label: 'Veneer' },
  { value: 'inlay_onlay', label: 'Inlay / Onlay' },
  { value: 'post_core', label: 'Post & Core' },
  { value: 'implant_crown', label: 'Implant Crown' },
  { value: 'implant_bridge', label: 'Implant Bridge' },
  { value: 'custom_abutment', label: 'Custom Abutment' },
  { value: 'complete_denture', label: 'Complete Denture' },
  { value: 'partial_denture', label: 'Partial Denture' },
  { value: 'night_guard', label: 'Night Guard' },
  { value: 'retainer', label: 'Retainer' },
  { value: 'aligner', label: 'Clear Aligner' },
  { value: 'surgical_guide', label: 'Surgical Guide' },
  { value: 'temporary', label: 'Temporary Crown / Bridge' },
  { value: 'study_model', label: 'Study Model' },
  { value: 'other', label: 'Other' },
];

// Restoration types that carry pontics.
export const BRIDGE_TYPES = ['bridge', 'implant_bridge', 'temporary'];
export const IMPLANT_TYPES = ['implant_crown', 'implant_bridge', 'custom_abutment'];
export const REMOVABLE_TYPES = ['complete_denture', 'partial_denture'];
// Fixed work, where margin / shade / contacts matter.
export const FIXED_TYPES = [
  'crown',
  'bridge',
  'veneer',
  'inlay_onlay',
  'implant_crown',
  'implant_bridge',
  'temporary',
];

export const MATERIALS = [
  'Zirconia (full contour)',
  'Zirconia (layered)',
  'Lithium disilicate (e.max)',
  'PFM (non-precious)',
  'PFM (precious / gold)',
  'Full cast metal',
  'Full gold',
  'Composite',
  'PMMA (temporary)',
  'Acrylic',
  'Flexible (Valplast)',
  'Cobalt-chrome',
  'Titanium',
];

export const STAGES = [
  'Finish',
  'Framework try-in',
  'Bisque bake try-in',
  'Wax try-in',
  'Custom tray',
  'Bite block / wax rim',
  'Repair',
  'Reline',
];

export const SHADE_GUIDES = ['VITA Classical', 'VITA 3D-Master', 'Ivoclar Chromascop', 'Other'];

export const SHADES = [
  'A1', 'A2', 'A3', 'A3.5', 'A4',
  'B1', 'B2', 'B3', 'B4',
  'C1', 'C2', 'C3', 'C4',
  'D2', 'D3', 'D4',
  'BL1', 'BL2', 'BL3', 'BL4',
  '0M1', '0M2', '0M3',
  '1M1', '1M2',
  '2L1.5', '2L2.5', '2M1', '2M2', '2M3', '2R1.5', '2R2.5',
  '3L1.5', '3L2.5', '3M1', '3M2', '3M3', '3R1.5', '3R2.5',
  '4L1.5', '4L2.5', '4M1', '4M2', '4M3', '4R1.5', '4R2.5',
  '5M1', '5M2', '5M3',
];

export const TRANSLUCENCY = ['Low', 'Medium', 'High'];

export const MARGIN_TYPES = [
  'Chamfer',
  'Heavy chamfer',
  'Shoulder',
  'Shoulder with bevel',
  'Knife edge / feather',
  'Porcelain butt margin',
  '360° metal collar',
  'Lingual metal collar',
];

export const PONTIC_DESIGNS = [
  'Ridge lap',
  'Modified ridge lap',
  'Ovate',
  'Sanitary (hygienic)',
  'Conical',
];

export const OCCLUSAL_CONTACTS = ['Light', 'Normal', 'Heavy', 'Out of occlusion'];

export const PROXIMAL_CONTACTS = ['Light', 'Normal', 'Tight', 'Open'];

export const INSUFFICIENT_CLEARANCE = [
  'Call me',
  'Reduction coping',
  'Metal occlusal island',
  'Adjust opposing tooth',
];

export const ABUTMENT_TYPES = [
  'Stock abutment',
  'Custom titanium',
  'Custom zirconia',
  'Ti-base',
  'Multi-unit',
];

export const DENTURE_BASES = [
  'Acrylic (standard)',
  'High-impact acrylic',
  'Flexible',
  'Cast metal (Co-Cr)',
];

export const IMPRESSION_TYPES = [
  'Digital scan (STL)',
  'Silicone (PVS) impression',
  'Alginate impression',
  'Poured models',
];

export const ENCLOSURES = [
  'Upper impression',
  'Lower impression',
  'Bite registration',
  'Opposing model',
  'Models',
  'Digital scan files',
  'Photos',
  'Shade tab',
  'Face-bow record',
  'Implant analogs',
  'Scan bodies',
  'Impression copings',
  'Old denture / prosthesis',
  'Custom tray',
];

export const STATUSES = [
  { value: 'draft', label: 'Draft', color: 'default' },
  { value: 'sent', label: 'Sent to lab', color: 'info' },
  { value: 'received', label: 'Received by lab', color: 'info' },
  { value: 'in_progress', label: 'In progress', color: 'warning' },
  { value: 'try_in', label: 'Ready for try-in', color: 'secondary' },
  { value: 'ready', label: 'Ready', color: 'primary' },
  { value: 'delivered', label: 'Delivered to clinic', color: 'success' },
  { value: 'completed', label: 'Completed', color: 'success' },
  { value: 'cancelled', label: 'Cancelled', color: 'error' },
];

export const statusOf = (value) => STATUSES.find((one) => one.value === value) || STATUSES[0];

export const restorationLabel = (value) =>
  RESTORATION_TYPES.find((one) => one.value === value)?.label || value || '';

// FDI chart, in the order a dentist reads it: patient's right on the left.
export const ADULT_TEETH = {
  upper: [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28],
  lower: [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38],
};

export const CHILD_TEETH = {
  upper: [55, 54, 53, 52, 51, 61, 62, 63, 64, 65],
  lower: [85, 84, 83, 82, 81, 71, 72, 73, 74, 75],
};

export const EMPTY_LAB_REQUEST = {
  lab_name: '',
  lab_phone: '',
  lab_email: '',
  due_date: '',
  urgent: false,
  restoration_type: 'crown',
  teeth: [],
  pontics: [],
  material: '',
  stage: 'Finish',
  shade_guide: 'VITA Classical',
  shade: '',
  shade_incisal: '',
  shade_cervical: '',
  stump_shade: '',
  translucency: '',
  characterization: '',
  margin_type: '',
  pontic_design: '',
  occlusal_contact: '',
  proximal_contact: '',
  insufficient_clearance: '',
  implant_system: '',
  implant_platform: '',
  abutment_type: '',
  implant_retention: '',
  denture_base: '',
  teeth_mould: '',
  impression_type: '',
  enclosures: [],
  instructions: '',
  status: 'sent',
  hide_patient_name: false,
};
