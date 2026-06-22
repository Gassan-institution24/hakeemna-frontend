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
  Paper,
  MenuItem,
  TextField,
  Typography,
  ListItemText,
  ListItemButton,
} from '@mui/material';

import { useLocales } from 'src/locales';
import { ERX } from 'src/services/claimService';

/* ================= STATIC DATA ================= */
/*
 * code        = LOCAL_DRUG_CODE (barcode) — used by the ERX /api/ERX/EditRequest endpoint
 * hcpcsCode   = HCPCS staging code       — used by the Authorization /api/Authorization/PostRequest (VR0139)
 * routeOfAdmin= ROA_CODE from DRUG sheet
 */
const MEDICATIONS_LIST = [
  {
    code: '6251148030235',
    hcpcsCode: 'J1180',
    nameEn: 'CIPROFLACIN 500MG TAB (10)',
    nameAr: 'سيبروفلاسين 500 ملغ أقراص (10)',
    routeOfAdmin: 'ROA074',
    granularUnit: 10,
  },
  {
    code: '5012727901770',
    hcpcsCode: 'J1180',
    nameEn: 'PREDNISOLONE 5MG TAB (28)',
    nameAr: 'بريدنيزولون 5 ملغ أقراص (28)',
    routeOfAdmin: 'ROA074',
    granularUnit: 28,
  },
  {
    code: '6251107425874',
    hcpcsCode: 'J1180',
    nameEn: 'FLUCOHEAL 150MG CAP (4)',
    nameAr: 'فلوكوهيل 150 ملغ كبسولات (4)',
    routeOfAdmin: 'ROA074',
    granularUnit: 4,
  },
  {
    code: '6251106800191',
    hcpcsCode: 'J1180',
    nameEn: 'OROTIX 120MG TAB (7)',
    nameAr: 'أوروتيكس 120 ملغ أقراص (7)',
    routeOfAdmin: 'ROA074',
    granularUnit: 7,
  },
  {
    code: '6251599000825',
    hcpcsCode: 'J1180',
    nameEn: 'IVY 10% SYRUP (100ML)',
    nameAr: 'لبلاب 10% شراب (100 مل)',
    routeOfAdmin: 'ROA074',
    granularUnit: 1,
  },
  {
    code: '6251158190004',
    hcpcsCode: 'J1180',
    nameEn: 'UNIFED EXPECTORANT SYRUP (120ML)',
    nameAr: 'يونيفيد شراب طارد للبلغم (120 مل)',
    routeOfAdmin: 'ROA074',
    granularUnit: 1,
  },
  {
    code: '3760008321213',
    hcpcsCode: 'J1180',
    nameEn: 'FAVERIN 100MG TAB (30)',
    nameAr: 'فافرين 100 ملغ أقراص (30)',
    routeOfAdmin: 'ROA074',
    granularUnit: 30,
  },
  {
    code: '6253348500037',
    hcpcsCode: 'J1180',
    nameEn: 'REPARIL 20MG TAB (40)',
    nameAr: 'ريبارل 20 ملغ أقراص (40)',
    routeOfAdmin: 'ROA074',
    granularUnit: 40,
  },
  {
    code: '2802880701163',
    hcpcsCode: 'J1180',
    nameEn: 'DONAGEN 5MG ORTHO-TAB (28)',
    nameAr: 'دوناجن 5 ملغ أقراص (28)',
    routeOfAdmin: 'ROA074',
    granularUnit: 28,
  },
  {
    code: '6251158060109',
    hcpcsCode: 'J1180',
    nameEn: 'CLODERM 0.05% OINT (25GM)',
    nameAr: 'كلوديرم 0.05% مرهم (25 غم)',
    routeOfAdmin: 'ROA092',
    granularUnit: 1,
  },
];

const SCHEDULE_OPTIONS = ['Q8H', 'Q12H', 'QD', 'BID'];

export default function MedicationsOrders({ onDataChange, visitCtx, encounterId }) {
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';
  const [search, setSearch] = useState('');
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (onDataChange) {
      onDataChange(orders);
    }
  }, [orders, onDataChange]);

  const filtered = MEDICATIONS_LIST.filter((m) => {
    const name = curLangAr ? m.nameAr : m.nameEn;
    return name.toLowerCase().includes(search.toLowerCase());
  });

  const addOrder = async (item) => {
    if (orders.find((o) => o.code === item.code)) return;

    if (!visitCtx || !encounterId) {
      enqueueSnackbar('Please complete eligibility check first', { variant: 'warning' });
      return;
    }

    try {
      setOrders((prev) => [
        ...prev,
        {
          ...item,
          dosage: 1,
          schedule: 'Q12H',
          duration: 1,
          packQty: 1,
          fillQty: 1,
        },
      ]);

      await ERX({
        ...visitCtx,
        encounterId,
        medications: [{
          code:         item.code,          // barcode → TPO drug code list
          nameEn:       item.nameEn,
          routeOfAdmin: item.routeOfAdmin || 'ROA074',
          quantity:     1,
          duration:     1,
          refills:      0,
          instructions: `Supply 1, Duration 1 days, Refill 0`,
        }],
      });
      enqueueSnackbar('Medication order sent successfully', { variant: 'success' });
    } catch (e) {
      console.error('ERX send failed', e);
      enqueueSnackbar('Failed to send medication order', { variant: 'error' });
      // Remove from UI if failed
      setOrders((prev) => prev.filter((o) => o.code !== item.code));
    }
  };

  const removeOrder = (code) => {
    setOrders((prev) => prev.filter((o) => o.code !== code));
  };

  const updateOrder = (code, field, value) => {
    setOrders((prev) => prev.map((o) => (o.code === code ? { ...o, [field]: value } : o)));
  };

  return (
    <Paper sx={{ p: 2, borderRadius: 2 }}>
      <Grid container spacing={2}>
        {/* ================= LEFT ================= */}
        <Grid item xs={12} md={8}>
          {/* ===== HEADER ===== */}
          <Box
            sx={{
              mb: 1,
              px: 1,
              py: 0.5,
              borderRadius: 1,
              bgcolor: '#f4f6f8',
              display: 'grid',
              gridTemplateColumns: '1.3fr 2.5fr 4.6fr 60px',
              fontWeight: 'bold',
              fontSize: 13,
              columnGap: 1,
            }}
          >
            <Typography>{curLangAr ? 'الخدمة' : 'Service'}</Typography>
            <Typography>{curLangAr ? 'الطلب' : 'Order'}</Typography>
            <Typography />
            <Box />
          </Box>

          {/* ===== BODY ===== */}
          {orders.length === 0 ? (
            <Box
              sx={{
                border: '2px dashed',
                borderColor: 'divider',
                borderRadius: 2,
                minHeight: 180,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'text.secondary',
              }}
            >
              <DragIndicatorIcon fontSize="large" />
              <Typography mt={1}>
                {curLangAr ? 'اسحب أو اختر دواء' : 'Drag or Select Medication'}
              </Typography>
            </Box>
          ) : (
            orders.map((item, index) => (
              <Box
                key={item.code}
                sx={{
                  display: 'grid',
                  gridTemplateColumns: '1.2fr 2.4fr 0.8fr 1fr 0.8fr 0.9fr 0.9fr 0.6fr',
                  gap: 1,
                  alignItems: 'center',
                }}
              >
                {/* SERVICE */}
                <Typography fontWeight="bold" fontSize={13}>
                  {index + 1}. {curLangAr ? 'دواء' : 'Medication'}
                </Typography>

                {/* ORDER */}
                <Typography fontSize={13}>{curLangAr ? item.nameAr : item.nameEn}</Typography>

                {/* DOSAGE */}
                <Box>
                  <Typography fontSize={11}>{curLangAr ? 'الجرعة' : 'Dosage'}</Typography>
                  <TextField
                    fullWidth
                    size="small"
                    type="number"
                    value={item.dosage}
                    onChange={(e) => updateOrder(item.code, 'dosage', e.target.value)}
                  />
                </Box>

                {/* SCHEDULE */}
                <Box>
                  <Typography fontSize={11}>{curLangAr ? 'الجدول' : 'Schedule'}</Typography>
                  <TextField
                    fullWidth
                    size="small"
                    select
                    value={item.schedule}
                    onChange={(e) => updateOrder(item.code, 'schedule', e.target.value)}
                  >
                    {SCHEDULE_OPTIONS.map((opt) => (
                      <MenuItem key={opt} value={opt}>
                        {opt}
                      </MenuItem>
                    ))}
                  </TextField>
                </Box>

                {/* DURATION */}
                <Box>
                  <Typography fontSize={11}>{curLangAr ? 'المدة' : 'Duration'}</Typography>
                  <TextField
                    fullWidth
                    size="small"
                    type="number"
                    value={item.duration}
                    onChange={(e) => updateOrder(item.code, 'duration', e.target.value)}
                  />
                </Box>

                {/* PACK QTY */}
                <Box>
                  <Typography fontSize={11}>{curLangAr ? 'الكمية في العبوة' : 'Pack Qty'}</Typography>
                  <TextField
                    fullWidth
                    size="small"
                    type="number"
                    value={item.packQty}
                    onChange={(e) => updateOrder(item.code, 'packQty', e.target.value)}
                  />
                </Box>

                {/* FILL QTY */}
                <Box>
                  <Typography fontSize={11}>{curLangAr ? 'كمية التعبئة' : 'Fill Qty'}</Typography>
                  <TextField
                    fullWidth
                    size="small"
                    type="number"
                    value={item.fillQty}
                    onChange={(e) => updateOrder(item.code, 'fillQty', e.target.value)}
                  />
                </Box>

                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    gap: 0.5,
                  }}
                >
                  <Typography
                    sx={{
                      color: 'primary.main',
                      cursor: 'pointer',
                      fontSize: 14,
                      fontWeight: 500,
                    }}
                  >
                    {curLangAr ? 'تعديل' : 'Edit'}
                  </Typography>

                  <DeleteIcon
                    fontSize="small"
                    sx={{ color: 'error.main', cursor: 'pointer' }}
                    onClick={() => removeOrder(item.code)}
                  />
                </Box>
              </Box>
            ))
          )}
        </Grid>

        {/* ================= RIGHT ================= */}
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            size="small"
            placeholder={curLangAr ? 'بحث عن دواء' : 'Search medication'}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <List dense sx={{ mt: 1, maxHeight: 220, overflow: 'auto' }}>
            {filtered.map((item) => (
              <ListItemButton key={item.code} onClick={() => addOrder(item)}>
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

MedicationsOrders.propTypes = {
  onDataChange: PropTypes.func,
  visitCtx: PropTypes.object,
  encounterId: PropTypes.string,
};
