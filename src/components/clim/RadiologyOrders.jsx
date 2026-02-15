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
  TextField,
  Typography,
  ListItemText,
  ListItemButton,
} from '@mui/material';

import { useLocales } from 'src/locales';
import { radiology } from 'src/services/claimService';

/* ================= STATIC DATA ================= */

const RADIOLOGY_LIST = [
  {
    code: 'R001',
    nameEn: 'Chest X-Ray – One View',
    nameAr: 'أشعة صدر – صورة واحدة',
  },
  {
    code: 'R002',
    nameEn: 'Portable Ultrasound',
    nameAr: 'تصوير بالموجات فوق الصوتية المحمول',
  },
  {
    code: 'R003',
    nameEn: 'CT Foot Without Contrast',
    nameAr: 'تصوير طبقي للقدم بدون مادة ظليلة',
  },
  {
    code: 'R004',
    nameEn: 'Portable Chest X-Ray',
    nameAr: 'أشعة صدر محمولة',
  },
];

export default function RadiologyOrders({ onDataChange }) {
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const [search, setSearch] = useState('');
  const [orders, setOrders] = useState([]);
  const [sending, setSending] = useState(false); 

  useEffect(() => {
    if (onDataChange) {
      onDataChange(orders.length > 0);
    }
  }, [orders, onDataChange]);
  const filtered = RADIOLOGY_LIST.filter((r) => {
    const name = curLangAr ? r.nameAr : r.nameEn;
    return name.toLowerCase().includes(search.toLowerCase());
  });

const addOrder = async (item) => {
  if (orders.find((o) => o.code === item.code)) return;

  try {
    setSending(true);

    // update UI أولاً
    setOrders((prev) => [...prev, item]);

    // call backend (static payload)
    await radiology();

    console.log('Radiology sent successfully');
  } catch (e) {
    console.error('Radiology send failed', e);
  } finally {
    setSending(false);
  }
};


  const removeOrder = (code) => {
    setOrders((prev) => prev.filter((o) => o.code !== code));
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
              gridTemplateColumns: '1.5fr 2fr 2fr 2fr 60px',
              fontSize: 14,
              columnGap: 1,
              alignItems: 'center',
            }}
          >
            <Typography>{curLangAr ? 'الخدمة' : 'Service'}</Typography>
            <Typography>{curLangAr ? 'الطلب' : 'Order'}</Typography>
            <Typography>{curLangAr ? 'الملحقات' : 'Modifiers'}</Typography>
            <Typography>{curLangAr ? 'الأسباب' : 'Reasons'}</Typography>
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
                {curLangAr ? 'اسحب أو اختر طلب أشعة' : 'Drag or Select Radiology Order'}
              </Typography>
            </Box>
          ) : (
            orders.map((item, index) => (
              <Box
                sx={{
                  mb: 1,
                  px: 1,
                  py: 0.5,
                  borderRadius: 1,
                  bgcolor: '#f4f6f8',
                  display: 'grid',
                  gridTemplateColumns: '1.5fr 2fr 2fr 2fr 60px',
                  fontWeight: 'bold',
                  fontSize: 14,
                  columnGap: 1,
                }}
              >
                <Typography fontWeight="bold">
                  {index + 1}. {curLangAr ? 'أشعة' : 'Radiology'}
                </Typography>

                <Typography> {curLangAr ? item.nameAr : item.nameEn}</Typography>

                <Typography color="text.secondary">{item.modifier || ''}</Typography>
                <Typography color="text.secondary">{item.reason || ''}</Typography>
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
                    {curLangAr ? 'تعديل' : 'Edit'}
                  </Typography>

                  <DeleteIcon
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
            placeholder={curLangAr ? 'بحث عن طلب أشعة' : 'Search radiology order'}
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

RadiologyOrders.propTypes = {
  onDataChange: PropTypes.func,
};
