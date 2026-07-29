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
import { lab, labCancelation } from 'src/services/claimService';

/* Codes are from the EHC/JMA staging coding list (LABORATORY TESTS sheet). */
const LAB_ORDERS_LIST = [
  {
    code: 'JOR-27-06-078',
    nameEn: 'Herpes Simplex Virus I&II DNA PCR',
    nameAr: 'تفاعل البوليميراز لفيروس الهربس',
  },
  {
    code: 'JOR-27-01-118',
    nameEn: 'Tobramycin Level',
    nameAr: 'مستوى توبراميسين',
  },
  {
    code: 'JOR-27-03-077',
    nameEn: 'Anti-Malaria AB',
    nameAr: 'أضداد الملاريا',
  },
  {
    code: 'JOR-27-03-410',
    nameEn: 'Insulin Receptor Antibodies',
    nameAr: 'أضداد مستقبلات الأنسولين',
  },
  {
    code: 'JOR-27-16-037',
    nameEn: 'Flow Cytometry CD2',
    nameAr: 'قياس التدفق CD2',
  },
  {
    code: 'JOR-27-01-112',
    nameEn: 'Syphilis Antibodies',
    nameAr: 'أضداد الزهري',
  },
  {
    code: 'JOR-27-06-077',
    nameEn: 'EBV by PCR Quantitative',
    nameAr: 'فيروس ابشتاين-بار PCR كمي',
  },
  {
    code: 'JOR-27-02-009',
    nameEn: 'Amino Acids, Blood',
    nameAr: 'الأحماض الأمينية في الدم',
  },
  {
    code: 'JOR-27-15-019',
    nameEn: 'Factor X',
    nameAr: 'عامل التخثر X',
  },
  {
    code: 'JOR-27-01-092',
    nameEn: 'Growth Hormone Stimulation (Glucagon)',
    nameAr: 'تحفيز هرمون النمو بالغلوكاجون',
  },
];

export default function LaboratoryOrders({
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

  const filtered = LAB_ORDERS_LIST.filter((l) => {
    const name = curLangAr ? l.nameAr : l.nameEn;
    return name.toLowerCase().includes(search.toLowerCase());
  });

  const newRow = (item) => ({
    ...item,
    frequency: 0,
    howOften: curLangAr ? 'الآن' : 'NOW',
  });

  const addOrder = async (item) => {
    if (orders.find((o) => o.code === item.code)) return;

    // Batched flow: collect only. "Send Order" submits every lab test in one Lab request.
    if (deferSend) {
      setOrders((prev) => [...prev, newRow(item)]);
      enqueueSnackbar('Laboratory order added', { variant: 'success' });
      return;
    }

    if (!visitCtx || !encounterId) {
      enqueueSnackbar('Please complete eligibility check first', { variant: 'warning' });
      return;
    }

    const confirmed = window.confirm(
      curLangAr ? 'هل أنت متأكد من إضافة هذا الطلب؟' : 'Are you sure you want to add this order?'
    );

    if (!confirmed) return;

    try {
      setOrders((prev) => [...prev, newRow(item)]);

      const res = await lab({
        ...visitCtx,
        encounterId,
        labTests: [{ code: item.code, nameEn: item.nameEn, quantity: 1 }],
      });

      const ref = res?.data?.referenceNumber;
      const orderId = res?.data?.orderId;
      const activityIds = res?.data?.activityIds;
      // Keep the TPO orderId + activity IDs + reference on the stored order so it can be cancelled later.
      setOrders((prev) => prev.map((o) => (o.code === item.code ? { ...o, orderId, activityIds, referenceNumber: ref } : o)));
      enqueueSnackbar(
        ref ? `Laboratory order sent — Ref: ${ref}` : 'Laboratory order sent successfully',
        { variant: 'success' }
      );
    } catch (e) {
      console.error('Lab send failed', e);
      enqueueSnackbar(e?.response?.data?.error || 'Failed to send laboratory order', { variant: 'error' });
      // Remove from UI if failed
      setOrders((prev) => prev.filter((o) => o.code !== item.code));
    }
  };

  const removeOrder = async (code) => {
    const target = orders.find((o) => o.code === code);

    // Batched flow: free before "Send Order". Afterwards the whole Lab batch has to be
    // cancelled at the insurer — TPO cancels a whole Order, not one activity within it.
    if (deferSend) {
      if (sentBatch && onCancelBatch) {
        const cancelled = await onCancelBatch();
        if (!cancelled) return;
      }
      setOrders((prev) => prev.filter((o) => o.code !== code));
      return;
    }

    const confirmed = window.confirm(
      curLangAr ? 'هل أنت متأكد من حذف هذا الطلب؟' : 'Are you sure you want to delete this order?'
    );

    if (!confirmed) return;

    try {
      // Cancel at the insurer only if the order was actually submitted (has a TPO orderId).
      let alreadyCancelled = false;
      if (target?.orderId) {
        const res = await labCancelation({
          ...visitCtx,
          encounterId,
          orderId:     target.orderId,
          activityIds: target.activityIds,
          labTests:    [{ code: target.code, nameEn: target.nameEn, quantity: target.quantity || 1 }],
        });
        alreadyCancelled = !!res?.data?.alreadyCancelled;
      }
      setOrders((prev) => prev.filter((o) => o.code !== code));
      enqueueSnackbar(
        alreadyCancelled ? 'Laboratory order was already cancelled' : 'Laboratory order cancelled',
        { variant: 'success' }
      );
    } catch (e) {
      console.error('Cancel failed', e);
      enqueueSnackbar(e?.response?.data?.error || 'Failed to cancel laboratory order', { variant: 'error' });
    }
  };

  return (
    <Paper sx={{ p: 2, borderRadius: 2 }}>
      <Grid container spacing={2}>
        {/* LEFT */}
        <Grid item xs={12} md={8}>
          {/* ===== HEADER ===== */}
          <Box
            sx={{
              mb: 1,
              px: 2,
              py: 1,
              borderRadius: 1,
              bgcolor: '#f4f6f8',
              display: 'grid',
              gridTemplateColumns: '1.8fr 2fr 1fr 1fr 80px',
              fontWeight: 'bold',
              fontSize: 14,
            }}
          >
            <Typography>{curLangAr ? 'الخدمة' : 'Service'}</Typography>
            <Typography>{curLangAr ? 'الطلب' : 'Order'}</Typography>
            <Typography>{curLangAr ? 'العدد' : 'Frequency'}</Typography>
            <Typography>{curLangAr ? 'التكرار' : 'How Often'}</Typography>
            <Box />
          </Box>

          {/* ===== ROWS ===== */}
          {orders.length === 0 ? (
            <Box
              sx={{
                border: '2px dashed',
                borderColor: 'divider',
                borderRadius: 2,
                minHeight: 180,
                p: 2,
              }}
            >
              <Box
                sx={{
                  height: '100%',
                  display: 'flex',
                  gridTemplateColumns: '1.5fr 2fr 1fr 1fr 80px',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'text.secondary',
                }}
              >
                <DragIndicatorIcon fontSize="large" />
                <Typography mt={1}>
                  {curLangAr ? 'اسحب أو اختر طلب مختبر' : 'Drag or Select Laboratory Order'}
                </Typography>
              </Box>
            </Box>
          ) : (
            orders.map((item, index) => (
              <Box
                key={item.code}
                sx={{
                  px: 2,
                  py: 1.5,
                  mb: 1,
                  borderRadius: 1,
                  bgcolor: '#eef5ff',
                  display: 'grid',
                  gridTemplateColumns: '1.8fr 2fr 1fr 1fr 80px',
                  alignItems: 'center',
                }}
              >
                {/* SERVICE */}
                <Typography fontWeight="bold">
                  {' '}
                  {index + 1}. {curLangAr ? 'مختبر' : 'Laboratory'}
                </Typography>

                {/* ORDER */}
                <Typography>{curLangAr ? item.nameAr : item.nameEn}</Typography>

                {/* FREQUENCY */}
                <Typography>{item.frequency}</Typography>

                {/* HOW OFTEN */}
                <Typography>{item.howOften}</Typography>

                {/* ACTIONS */}
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
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

        {/* RIGHT */}
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            size="small"
            placeholder={curLangAr ? 'ابحث عن فحص مخبري' : 'Search laboratory order'}
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

LaboratoryOrders.propTypes = {
  onDataChange: PropTypes.func,
  visitCtx: PropTypes.object,
  encounterId: PropTypes.string,
  deferSend: PropTypes.bool,
  sentBatch: PropTypes.object,
  onCancelBatch: PropTypes.func,
};
