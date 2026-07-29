import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { enqueueSnackbar } from 'notistack';

import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import {
  Box,
  Grid,
  List,
  Chip,
  Paper,
  Divider,
  TextField,
  Typography,
  ListItemText,
  ListItemButton,
} from '@mui/material';
import { useLocales } from 'src/locales';

/* ================= STATIC DATA ================= */

const CONSULTATION = {
  code: 'C001',
  serviceEn: 'Consultation',
  serviceAr: 'استشارة',
  orderEn: 'Visit',
  orderAr: 'زيارة',
  gross: 10.0,
  insurance: 10.0,
  patientShare: 0.0,
};

/* Codes and English names are taken verbatim from the EHC/JMA staging coding list
   (PROCEDURES sheet). Procedures are billed on the Claim as Activity Type '3' (JMA).

   Two groups of sheet rows are deliberately left out:
     · JOR 34-100- 549 / 585 / 544 / 501 — the source sheet stores these with embedded
       spaces. The canonical form is a guess (siblings look like JOR-34-100-550) and TPO
       validates against its own table, so they are omitted until EHC confirms the exact
       string. All four are vaccines rather than in-clinic procedures.
     · JOR-04-001-003 / JOR-04-001-008 — owned by the Physiotherapy section, which submits
       them as their own TPO order. Listing them here too would let one code be declared
       twice on the same encounter. */
const PROCEDURE_CODES = [
  ['JOR-16-01-036', 'Elbow Disl. OPR'],
  ['JOR-07-16-014', 'High recto-vaginal fistula'],
  ['JOR-02-06-017', 'Pulmonary Valvotomy & VSD Closure'],
  ['JOR-14-04-004', 'GI BLEEDING'],
  ['JOR-24-02-002', 'Reductive Mammaplasty (Unilateral)'],
  ['JOR-07-16-015', 'Entero-vesical fistula'],
  ['JOR-08-01-051', 'Remove perianal skin tag'],
  ['JOR-15-02-046', 'Pterygium'],
  ['JOR-24-11-018', 'Fasciotomy Acute'],
  ['JOR-16-01-033', 'Repair Malunion or Non Union HUM. B. Graft'],
  ['JOR-14-11-001', 'SALIVARY GLANDS SCAN'],
  ['JOR-14-17-009', 'Curative Treatment by External Beams Tumors of Gamma Knife Stereotactic RT.'],
  ['JOR-01-01-023', 'PERIPHERAL ARTERY BALLOON'],
  ['JOR-16-01-221', 'Metatarsal FR. OFR + MR.'],
  ['JOR-24-05-002', 'Fracture Orbital Fracture Orif'],
  ['JOR-29-08-003', 'Axillo-Femoral bypass Unilateral'],
  ['JOR-34-100-550', 'ISG'],
  ['JOR-19-01-001', 'Newborn Routine Examination'],
  ['JOR-28-03-017', 'Cryo-surgery'],
  ['JOR-14-01-004', 'BONE MARROW SCAN'],
  ['JOR-08-01-011', 'Burn with Dressing-Large'],
  ['JOR-02-03-013', 'Modified Blalock -Taussig shunt (GORE-TEX)'],
  ['JOR-24-11-019', 'Deeping Web Space'],
  ['JOR-33-01-011', 'Craniotomy for spontaneous intracerebral hematoma'],
  ['JOR-29-02-004', 'False aneurysm excision'],
  ['JOR-02-04-004', 'ACB with closure of acquired postinfarction VSD ADD'],
  ['JOR-24-22-006', 'Laceration: Major'],
  ['JOR-28-03-018', 'Cystic Lesion Enucleation'],
  ['JOR-08-01-010', 'Burn with Dressing-Medium'],
  ['JOR-23-04-007', 'Mesotherapy Procedure'],
  ['JOR-18-03-074', 'Barium Enema Reduction'],
  ['JOR-29-12-075', 'Ilio – canal thrombectomy + thrombolysis'],
  ['JOR-24-25-001', 'Scar revision in Face, Scalp & Neck, Up to 2.5 cm'],
  ['JOR-28-06-013', 'Diagonsis of Acute periodontal conditions'],
  ['JOR-09-01-062', 'Manual Removal of Placenat not by DEL. SUR'],
  ['JOR-26-01-040', 'Ureteric Reimplantation Boari Flap'],
  ['JOR-28-02-027', 'porcelain fused to metal crown(non precious)'],
  ['JOR-15-04-018', 'Upper Cicatricle Entropion Repair without Graft'],
  ['JOR-25-09-002', 'Repair of Sternal Deformity (Ravitch Operation), (Complex)'],
  ['JOR-25-02-013', 'Mediastenal tracheostomy'],
  ['JOR-19-01-002', 'Blood Exchange Including Cath'],
  ['JOR-15-08-004', 'Phakic IOL (ICL)'],
  ['JOR-25-01-022', 'V AT Thymectomy (for MG)'],
  ['JOR-15-05-009', 'Subtota l Exenteration'],
  ['JOR-28-03-011', 'Condlylar Fracture Open Red'],
  ['JOR-14-04-007', 'GASTRIC EMPTYING - SOLID PHASE'],
  ['JOR-05-01-083', 'Sinusotomy Sphenoidal'],
  ['JOR-15-02-047', 'Ptertgium Recurrent or if Reaching Pupil'],
  ['JOR-24-05-008', 'Fracture Maxilla ORIF'],
  ['JOR-14-13-019', 'Curative Treatment by External Beams Tumors of Curative'],
  ['JOR-34-100-556', 'Received All Childhood Vaccinations'],
  ['JOR-15-02-040', 'Tarsorrhaphy LA or GA Double'],
  ['JOR-16-01-220', 'Metatarsal FR. CR.+ GA'],
  ['JOR-24-05-009', 'Fracture Zygoma Open Reduction (Tripode)'],
  ['JOR-22-04-022', 'ULTRASOUND DOPPLER UPPER LIMBS TWO SIDES'],
  ['JOR-30-01-005', 'Electrical Cardioversion (DC Shock)'],
  ['JOR-19-01-006', 'Intravenous or arterial umbilical catheterization'],
  ['JOR-02-06-016', 'Pulmonary Valvotomy & VSD Closure & RV Outflow Patc'],
  ['JOR-14-01-003', 'BONE SCAN - SPECT'],
  ['JOR-26-01-041', 'Repair of Retrocavalureter'],
  ['JOR-16-01-264', 'Acromioplasty – open'],
  ['JOR-16-01-259', 'Shoulder Arthroscopy/ Diagnostic'],
];

/* The coding sheet carries no Arabic text and no prices. These are the entries that were
   already priced before the list was expanded — values kept verbatim. Anything not listed
   here falls back to the English name and 0.00, and is billed at zero until priced. */
const PROCEDURE_OVERRIDES = {
  'JOR-23-04-007': { nameAr: 'علاج ميزوثيرابي', gross: 10.0, insurance: 8.0, patientShare: 2.0 },
  'JOR-08-01-011': { nameAr: 'حرق مع تضميد – كبير', gross: 7.0, insurance: 6.0, patientShare: 1.0 },
  'JOR-08-01-010': { nameAr: 'حرق مع تضميد – متوسط', gross: 5.0, insurance: 4.5, patientShare: 0.5 },
  'JOR-24-22-006': { nameAr: 'تمزق: كبير', gross: 12.0, insurance: 9.0, patientShare: 3.0 },
  'JOR-28-03-017': { nameAr: 'جراحة تجميد', gross: 6.0, insurance: 5.0, patientShare: 1.0 },
  'JOR-08-01-051': { nameAr: 'إزالة زائدة جلدية حول الشرج', gross: 6.0, insurance: 5.0, patientShare: 1.0 },
};

const PROCEDURES_LIST = PROCEDURE_CODES.map(([code, nameEn]) => {
  const override = PROCEDURE_OVERRIDES[code] || {};
  return {
    code,
    nameEn,
    nameAr: override.nameAr ?? nameEn, // sheet has no Arabic column — fall back to English
    gross: override.gross ?? 0,
    insurance: override.insurance ?? 0,
    patientShare: override.patientShare ?? 0,
  };
});

const UI_TEXT = {
  service: { en: 'Service', ar: 'الخدمة' },
  consultation: { en: 'Consultation', ar: 'استشارة' },
  visit: { en: 'Visit', ar: 'زيارة' },
  procedures: { en: 'Procedures', ar: 'إجراءات' },
  dragProcedures: { en: 'Drag or Select Procedures', ar: 'اسحب أو اختر إجراء' },
  gross: { en: 'Gross', ar: 'الإجمالي' },
  insurance: { en: 'Ins. Amount', ar: 'قيمة التأمين' },
  patientShare: { en: 'Patient Share', ar: 'حصة المريض' },
  approved: { en: 'Approved', ar: 'موافق عليه' },
  edit: { en: 'Edit', ar: 'تعديل' },
  searchProcedure: { en: 'Search procedure', ar: 'بحث عن إجراء' },
};

export default function ClinicERProcedures({ onDataChange, visitCtx, encounterId }) {
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const [search, setSearch] = useState('');
  const [procedures, setProcedures] = useState([]);

  useEffect(() => {
    if (onDataChange) {
      onDataChange(procedures);
    }
  }, [procedures, onDataChange]);

  const filtered = PROCEDURES_LIST.filter((p) => {
    const name = (curLangAr ? p.nameAr : p.nameEn) || '';
    return name.toLowerCase().includes(search.toLowerCase());
  });

  const hasProcedures = procedures.length > 0;

  // Procedures are performed in-clinic, so there is no order to send to another provider —
  // they are declared on the Claim as Activity Type '3' (JMA). The previous implementation
  // posted them to the ERX endpoint, which hard-codes Type '5' (Drug); TPO rejects a JOR
  // code declared as a drug, so the row was always rolled back and nothing could be added.
  const addProcedure = (item) => {
    if (procedures.find((p) => p.code === item.code)) return;
    setProcedures((prev) => [...prev, item]);
    enqueueSnackbar('Procedure added', { variant: 'success' });
  };

  const removeProcedure = (code) => {
    setProcedures((prev) => prev.filter((p) => p.code !== code));
  };

  return (
    <Paper sx={{ p: 2, borderRadius: 2 }}>
      <Grid container spacing={2}>
        {/* ================= LEFT ================= */}
        <Grid item xs={12} md={8}>
          {/* ===== Consultation (HORIZONTAL) ===== */}
          <Box
            sx={{
              p: 2,
              mb: 1,
              borderRadius: 1,
              bgcolor: '#eef5ff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 2,
            }}
          >
            <Typography fontWeight="bold">
              1. {curLangAr ? CONSULTATION.serviceAr : CONSULTATION.serviceEn}
            </Typography>

            <Typography>{curLangAr ? CONSULTATION.orderAr : CONSULTATION.orderEn}</Typography>

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                px: 1.5,
                py: 0.5,
                bgcolor: '#fff',
                borderRadius: 1,
                fontSize: 13,
              }}
            >
              <Typography fontSize={13}>
                {curLangAr ? UI_TEXT.gross.ar : UI_TEXT.gross.en}: {CONSULTATION.gross}
              </Typography>

              <Typography fontSize={13}>
                {curLangAr ? UI_TEXT.insurance.ar : UI_TEXT.insurance.en}: {CONSULTATION.insurance}
              </Typography>

              <Typography fontSize={13}>
                {curLangAr ? UI_TEXT.patientShare.ar : UI_TEXT.patientShare.en}:{' '}
                {CONSULTATION.patientShare}
              </Typography>
            </Box>

            <Chip
              label={curLangAr ? UI_TEXT.approved.ar : UI_TEXT.approved.en}
              color="success"
              size="small"
            />
          </Box>

          {/* ===== Procedures Area ===== */}
          <Box
            sx={{
              border: '2px dashed',
              borderColor: 'divider',
              borderRadius: 2,
              minHeight: 160,
              p: 2,
            }}
          >
            {!hasProcedures ? (
              <Box
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'text.secondary',
                }}
              >
                <DragIndicatorIcon fontSize="large" />
                <Typography mt={1}>
                  {curLangAr ? UI_TEXT.dragProcedures.ar : UI_TEXT.dragProcedures.en}
                </Typography>
              </Box>
            ) : (
              procedures.map((item, index) => (
                <Box
                  key={item.code}
                  sx={{
                    p: 2,
                    mb: 1,
                    borderRadius: 1,
                    bgcolor: '#f4f6f8',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 2,
                  }}
                >
                  <Typography fontWeight="bold">
                    {index + 2}. {curLangAr ? UI_TEXT.procedures.ar : UI_TEXT.procedures.en}
                  </Typography>

                  <Typography>{curLangAr ? item.nameAr : item.nameEn}</Typography>

                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                      px: 1.5,
                      py: 0.5,
                      bgcolor: '#fff',
                      borderRadius: 1,
                      fontSize: 13,
                    }}
                  >
                    <Typography fontSize={13}>
                      {curLangAr ? UI_TEXT.gross.ar : UI_TEXT.gross.en}: {item.gross}
                    </Typography>

                    <Typography fontSize={13}>
                      {curLangAr ? UI_TEXT.insurance.ar : UI_TEXT.insurance.en}: {item.insurance}
                    </Typography>

                    <Typography fontSize={13}>
                      {curLangAr ? UI_TEXT.patientShare.ar : UI_TEXT.patientShare.en}:{' '}
                      {item.patientShare}
                    </Typography>
                  </Box>

                  {/* ACTIONS */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography
                      sx={{
                        color: 'primary.main',
                        cursor: 'pointer',
                        fontSize: 14,
                        fontWeight: 500,
                      }}
                    >
                      {curLangAr ? UI_TEXT.edit.ar : UI_TEXT.edit.en}
                    </Typography>

                    <DeleteIcon
                      sx={{ color: 'error.main', cursor: 'pointer' }}
                      fontSize="small"
                      onClick={() => removeProcedure(item.code)}
                    />
                  </Box>
                </Box>
              ))
            )}
          </Box>
        </Grid>

        {/* ================= RIGHT ================= */}
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            size="small"
            placeholder={curLangAr ? UI_TEXT.searchProcedure.ar : UI_TEXT.searchProcedure.en}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <Divider sx={{ my: 1 }} />

          <List dense sx={{ maxHeight: 220, overflow: 'auto' }}>
            {filtered.map((item) => (
              <ListItemButton key={item.code} onClick={() => addProcedure(item)}>
                <AddIcon fontSize="small" sx={{ mr: 1 }} />
                <ListItemText primary={curLangAr ? item.nameAr : item.nameEn} />
              </ListItemButton>
            ))}
          </List>
        </Grid>
      </Grid>
    </Paper>
  );
}

ClinicERProcedures.propTypes = {
  onDataChange: PropTypes.func,
  visitCtx: PropTypes.object,
  encounterId: PropTypes.string,
};
