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
  TextField,
  Typography,
  ListItemText,
  ListItemButton,
} from '@mui/material';

import { useLocales } from 'src/locales';
import { ERX } from 'src/services/claimService';

/* ================= STATIC DATA ================= */

const PHYSIOTHERAPY_LIST = [
  {
    code: 'P001',
    nameEn: 'Treadmill Exercise',
    nameAr: 'تمارين جهاز المشي',
  },
  {
    code: 'P002',
    nameEn: 'Hot or Cold Packs',
    nameAr: 'كمادات ساخنة أو باردة',
  },
  {
    code: 'P003',
    nameEn: 'Chest Physiotherapy (One Session)',
    nameAr: 'علاج طبيعي للصدر (جلسة واحدة)',
  },
  {
    code: 'P004',
    nameEn: 'Chemical Peeling',
    nameAr: 'تقشير كيميائي',
  },
];


export default function PhysiotherapyOrders({ onDataChange }) {
    const { currentLang } = useLocales();
const curLangAr = currentLang.value === 'ar';

  const [search, setSearch] = useState('');
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    if (onDataChange) {
      onDataChange(orders);
    }
  }, [orders, onDataChange]);

  const filtered = PHYSIOTHERAPY_LIST.filter((p) =>
    (curLangAr ? p.nameAr : p.nameEn).toLowerCase().includes(search.toLowerCase())
  );

  const addOrder = async (item) => {
    if (orders.find((o) => o.code === item.code)) return;
    try {
      setOrders((prev) => [
        ...prev,
        {
          ...item,
          sessions: 0,
        },
      ]);

      await ERX();
      enqueueSnackbar('Physiotherapy order sent successfully', { variant: 'success' });
    } catch (e) {
      console.error('ERX send failed', e);
      enqueueSnackbar('Failed to send physiotherapy order', { variant: 'error' });
      // Remove from UI if failed
      setOrders((prev) => prev.filter((o) => o.code !== item.code));
    }
  };

  const removeOrder = (code) => {
    setOrders((prev) => prev.filter((o) => o.code !== code));
  };

  const updateSessions = (code, value) => {
    setOrders((prev) => prev.map((o) => (o.code === code ? { ...o, sessions: value } : o)));
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
              gridTemplateColumns: '1.3fr 3fr 1.2fr 60px',
              fontWeight: 'bold',
              fontSize: 13,
              columnGap: 1,
            }}
          >
            <Typography>{curLangAr ? 'الخدمة' : 'Service'}</Typography>
            <Typography>{curLangAr ? 'الطلب' : 'Order'}</Typography>
            <Typography /> {/* فاضي */}
            <Box />
          </Box>

          {/* ===== BODY ===== */}
          {orders.length === 0 ? (
            <Box
              sx={{
                border: '2px dashed',
                borderColor: 'divider',
                borderRadius: 2,
                minHeight: 160,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'text.secondary',
              }}
            >
              <DragIndicatorIcon fontSize="large" />
              <Typography mt={1}>{curLangAr ? 'اسحب أو اختر علاج طبيعي' : 'Drag or Select Physiotherapy'}</Typography>
            </Box>
          ) : (
            orders.map((item, index) => (
              <Box
                key={item.code}
                sx={{
                  px: 1,
                  py: 0.5,
                  mb: 0.5,
                  borderRadius: 1,
                  bgcolor: '#eef5ff',
                  display: 'grid',
                  gridTemplateColumns: '1.3fr 3fr 1.2fr 60px',
                  alignItems: 'center',
                  columnGap: 1,
                }}
              >
                {/* SERVICE */}
                <Typography fontWeight="bold" fontSize={13}>
                  {index + 1}. {curLangAr ? 'علاج طبيعي' : 'Physiotherapy'}
                </Typography>

                {/* ORDER */}
                <Typography fontSize={13}>{curLangAr ? item.nameAr : item.nameEn}</Typography>
                {/* NO. SESSIONS */}
                <Box>
                  <Typography fontSize={12}>{curLangAr ? 'عدد الجلسات' : 'No. Sessions'}</Typography>
                  <TextField
                    size="small"
                    type="number"
                    value={item.sessions}
                    onChange={(e) => updateSessions(item.code, e.target.value)}
                    fullWidth
                  />
                </Box>

                {/* ACTIONS */}
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    gap: 1,
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
            placeholder={curLangAr ? 'ابحث عن علاج طبيعي' : 'Search physiotherapy'}
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

PhysiotherapyOrders.propTypes = {
  onDataChange: PropTypes.func,
};
