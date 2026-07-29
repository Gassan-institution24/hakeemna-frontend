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
import { radiology, radiologyCancelation } from 'src/services/claimService';

/* ================= STATIC DATA ================= */

/* Codes are from the EHC/JMA staging coding list (RADIOLOGY PROCEDURES sheet). */
const RADIOLOGY_LIST = [
  {
    code: 'JOR-22-04-021',
    nameEn: 'Ultrasound Doppler Upper Limb (One Side)',
    nameAr: 'دوبلر الموجات فوق الصوتية للطرف العلوي (جانب واحد)',
  },
  {
    code: 'JOR-22-02-143',
    nameEn: 'CT Liver 3-Phase W & W/O Contrast',
    nameAr: 'تصوير طبقي للكبد ثلاثي المراحل مع وبدون مادة ظليلة',
  },
  {
    code: 'JOR-22-03-134',
    nameEn: 'MRI Whole Spine W/Contrast',
    nameAr: 'رنين مغناطيسي للعمود الفقري كاملاً مع مادة ظليلة',
  },
  {
    code: 'JOR-22-02-007',
    nameEn: 'CT Abdomen W/Contrast',
    nameAr: 'تصوير طبقي للبطن مع مادة ظليلة',
  },
  {
    code: 'JOR-22-02-081',
    nameEn: 'CT Knee W/O Contrast',
    nameAr: 'تصوير طبقي للركبة بدون مادة ظليلة',
  },
  {
    code: 'JOR-22-02-144',
    nameEn: 'CT Upper Extremity W & W/O Contrast',
    nameAr: 'تصوير طبقي للطرف العلوي مع وبدون مادة ظليلة',
  },
  {
    code: 'JOR-22-03-049',
    nameEn: 'MRI Cervico-Dorsal Spine W/O Contrast',
    nameAr: 'رنين مغناطيسي للعمود الفقري العنقي الظهري بدون مادة ظليلة',
  },
  {
    code: 'JOR-22-03-039',
    nameEn: 'MRI Brain + MRA Brain & Neck',
    nameAr: 'رنين مغناطيسي للدماغ + تصوير أوعية الدماغ والرقبة',
  },
];

export default function RadiologyOrders({
  onDataChange,
  visitCtx,
  encounterId,
  deferSend,
  sentBatch,
  onCancelBatch,
}) {
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const [search, setSearch] = useState('');
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (onDataChange) {
      onDataChange(orders);
    }
  }, [orders, onDataChange]);

  const filtered = RADIOLOGY_LIST.filter((r) => {
    const name = curLangAr ? r.nameAr : r.nameEn;
    return name.toLowerCase().includes(search.toLowerCase());
  });

  const addOrder = async (item) => {
    if (orders.find((o) => o.code === item.code)) return;

    // Batched flow: collect only. "Send Order" submits every study in one Rad request.
    if (deferSend) {
      setOrders((prev) => [...prev, item]);
      enqueueSnackbar('Radiology order added', { variant: 'success' });
      return;
    }

    if (!visitCtx || !encounterId) {
      enqueueSnackbar('Please complete eligibility check first', { variant: 'warning' });
      return;
    }

    try {
      // update UI first
      setOrders((prev) => [...prev, item]);

      const res = await radiology({
        ...visitCtx,
        encounterId,
        radiologyTests: [{ code: item.code, nameEn: item.nameEn, quantity: 1 }],
      });

      const ref = res?.data?.referenceNumber;
      const orderId = res?.data?.orderId;
      const activityIds = res?.data?.activityIds;
      // Keep the TPO orderId + activity IDs + reference on the stored order so it can be cancelled later.
      setOrders((prev) => prev.map((o) => (o.code === item.code ? { ...o, orderId, activityIds, referenceNumber: ref } : o)));
      enqueueSnackbar(
        ref ? `Radiology order sent — Ref: ${ref}` : 'Radiology order sent successfully',
        { variant: 'success' }
      );
    } catch (e) {
      console.error('Radiology send failed', e);
      enqueueSnackbar(e?.response?.data?.error || 'Failed to send radiology order', { variant: 'error' });
      // Remove from UI if failed
      setOrders((prev) => prev.filter((o) => o.code !== item.code));
    }
  };

  const removeOrder = async (code) => {
    const target = orders.find((o) => o.code === code);

    // Batched flow: free before "Send Order". Afterwards the whole Rad batch has to be
    // cancelled at the insurer — TPO cancels a whole Order, not one activity within it.
    if (deferSend) {
      if (sentBatch && onCancelBatch) {
        const cancelled = await onCancelBatch();
        if (!cancelled) return;
      }
      setOrders((prev) => prev.filter((o) => o.code !== code));
      return;
    }

    try {
      // Cancel at the insurer only if the order was actually submitted (has a TPO orderId).
      let alreadyCancelled = false;
      if (target?.orderId) {
        const res = await radiologyCancelation({
          ...visitCtx,
          encounterId,
          orderId:        target.orderId,
          activityIds:    target.activityIds,
          radiologyTests: [{ code: target.code, nameEn: target.nameEn, quantity: target.quantity || 1 }],
        });
        alreadyCancelled = !!res?.data?.alreadyCancelled;
      }
      setOrders((prev) => prev.filter((o) => o.code !== code));
      if (target?.orderId) {
        enqueueSnackbar(
          alreadyCancelled ? 'Radiology order was already cancelled' : 'Radiology order cancelled',
          { variant: 'success' }
        );
      }
    } catch (e) {
      console.error('Radiology cancel failed', e);
      enqueueSnackbar(e?.response?.data?.error || 'Failed to cancel radiology order', { variant: 'error' });
    }
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
                key={item.code}
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
  visitCtx: PropTypes.object,
  encounterId: PropTypes.string,
  deferSend: PropTypes.bool,
  sentBatch: PropTypes.object,
  onCancelBatch: PropTypes.func,
};
