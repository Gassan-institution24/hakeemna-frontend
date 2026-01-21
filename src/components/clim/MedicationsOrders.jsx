import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

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

/* ================= STATIC DATA ================= */

const MEDICATIONS_LIST = [
  {
    code: 'M001',
    nameEn: 'Panadol Advance 500mg Tablet (24)',
    nameAr: 'بانادول أدفانس 500 ملغ أقراص (24)',
  },
  {
    code: 'M002',
    nameEn: 'Panadol Joint 665mg Tablet (18)',
    nameAr: 'بانادول جوينت 665 ملغ أقراص (18)',
  },
  {
    code: 'M003',
    nameEn: 'Azithromycin 250mg Capsules',
    nameAr: 'أزيثروميسين 250 ملغ كبسولات',
  },
  {
    code: 'M004',
    nameEn: 'Flagyl 125mg/5ml Suspension (120ml)',
    nameAr: 'فلاجيل معلق 125 ملغ/5 مل (120 مل)',
  },
  {
    code: 'M005',
    nameEn: 'Zinnat 500mg Tablet (10)',
    nameAr: 'زينات 500 ملغ أقراص (10)',
  },
];

const SCHEDULE_OPTIONS = ['Q8H', 'Q12H', 'QD', 'BID'];

export default function MedicationsOrders({ onDataChange }) {
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';
  const [search, setSearch] = useState('');
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    if (onDataChange) {
      onDataChange(orders.length > 0);
    }
  }, [orders, onDataChange]);
  const filtered = MEDICATIONS_LIST.filter((m) => {
    const name = curLangAr ? m.nameAr : m.nameEn;
    return name.toLowerCase().includes(search.toLowerCase());
  });

  const addOrder = (item) => {
    if (orders.find((o) => o.code === item.code)) return;
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
};
