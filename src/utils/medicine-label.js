// How a medicine is named wherever a doctor prescribes it (entrance → prescription):
// trade name, concentration, dosage form, unit and package — each only when it has a value.
// Concentration_source falls back to the older `concentration` field for medicines imported
// before it existed, so those keep showing their strength.

export const MEDICINE_LABEL_SELECT =
  'trade_name concentration Concentration_source Rational_Dosage_Form Rational_Unit pakage_for_unit';

const clean = (v) => (v === undefined || v === null ? '' : String(v).trim());

export function medicineLabel(medicine) {
  if (!medicine) return '';
  return [
    medicine.trade_name,
    medicine.Concentration_source || medicine.concentration,
    medicine.Rational_Dosage_Form,
    medicine.Rational_Unit,
    medicine.pakage_for_unit,
  ]
    .map(clean)
    .filter(Boolean)
    .join(' · ');
}
