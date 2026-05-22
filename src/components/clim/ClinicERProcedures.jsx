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
import { ERX } from 'src/services/claimService';

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

/* Codes are from the EHC/JMA staging coding list (PROCEDURES sheet).
   Type '3' (JMA) is used for these in the TPO authorization payload. */
const PROCEDURES_LIST = [
  {
    code: 'JOR-04-001-003',
    nameEn: 'Chemical Treatment (per Session)',
    nameAr: 'علاج كيميائي (لكل جلسة)',
    gross: 5.0,
    insurance: 4.5,
    patientShare: 0.5,
  },
  {
    code: 'JOR-04-001-008',
    nameEn: 'Electrotherapy (1st Session)',
    nameAr: 'علاج كهربائي (الجلسة الأولى)',
    gross: 5.0,
    insurance: 4.5,
    patientShare: 0.5,
  },
  {
    code: 'JOR-23-04-007',
    nameEn: 'Mesotherapy Procedure',
    nameAr: 'علاج ميزوثيرابي',
    gross: 10.0,
    insurance: 8.0,
    patientShare: 2.0,
  },
  {
    code: 'JOR-08-01-011',
    nameEn: 'Burn with Dressing - Large',
    nameAr: 'حرق مع تضميد – كبير',
    gross: 7.0,
    insurance: 6.0,
    patientShare: 1.0,
  },
  {
    code: 'JOR-08-01-010',
    nameEn: 'Burn with Dressing - Medium',
    nameAr: 'حرق مع تضميد – متوسط',
    gross: 5.0,
    insurance: 4.5,
    patientShare: 0.5,
  },
  {
    code: 'JOR-24-22-006',
    nameEn: 'Laceration: Major',
    nameAr: 'تمزق: كبير',
    gross: 12.0,
    insurance: 9.0,
    patientShare: 3.0,
  },
  {
    code: 'JOR-28-03-017',
    nameEn: 'Cryo-surgery',
    nameAr: 'جراحة تجميد',
    gross: 6.0,
    insurance: 5.0,
    patientShare: 1.0,
  },
  {
    code: 'JOR-08-01-051',
    nameEn: 'Remove Perianal Skin Tag',
    nameAr: 'إزالة زائدة جلدية حول الشرج',
    gross: 6.0,
    insurance: 5.0,
    patientShare: 1.0,
  },
];
const UI_TEXT = {
  service: {
    en: 'Service',
    ar: 'الخدمة',
  },
  consultation: {
    en: 'Consultation',
    ar: 'استشارة',
  },
  visit: {
    en: 'Visit',
    ar: 'زيارة',
  },
  procedures: {
    en: 'Procedures',
    ar: 'إجراءات',
  },
  dragProcedures: {
    en: 'Drag or Select Procedures',
    ar: 'اسحب أو اختر إجراء',
  },
  gross: {
    en: 'Gross',
    ar: 'الإجمالي',
  },
  insurance: {
    en: 'Ins. Amount',
    ar: 'قيمة التأمين',
  },
  patientShare: {
    en: 'Patient Share',
    ar: 'حصة المريض',
  },
  approved: {
    en: 'Approved',
    ar: 'موافق عليه',
  },
  edit: {
    en: 'Edit',
    ar: 'تعديل',
  },
  searchProcedure: {
    en: 'Search procedure',
    ar: 'بحث عن إجراء',
  },
};

export default function ClinicERProcedures({ onDataChange }) {
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
    const name = curLangAr ? p.nameAr : p.nameEn;
    return name.toLowerCase().includes(search.toLowerCase());
  });

  const hasProcedures = procedures.length > 0;

  const addProcedure = async (item) => {
    if (procedures.find((p) => p.code === item.code)) return;

    try {
      // update UI أولاً
      setProcedures((prev) => [...prev, item]);

      // call backend
      await ERX();

      enqueueSnackbar('Procedure order sent successfully', { variant: 'success' });
    } catch (e) {
      console.error('ERX send failed', e);
      enqueueSnackbar('Failed to send procedure order', { variant: 'error' });
      // Remove from UI if failed
      setProcedures((prev) => prev.filter((p) => p.code !== item.code));
    }
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
};
