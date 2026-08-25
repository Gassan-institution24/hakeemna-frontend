import PropTypes from 'prop-types';
import { useMemo, useState } from 'react';

import {
  Box,
  Chip,
  Table,
  Stack,
  Button,
  Dialog,
  Select,
  Tooltip,
  MenuItem,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  TextField,
  InputLabel,
  IconButton,
  Typography,
  FormControl,
  DialogTitle,
  DialogActions,
  DialogContent,
} from '@mui/material';

import { fDate } from 'src/utils/format-time';

import Iconify from 'src/components/iconify';

import PanelCard from './panel-card';
import { getSurfaceLabel } from '../constants/fdi';
import { toNotation } from '../constants/numbering';

// ----------------------------------------------------------------------

// Payment is a separate axis — it shows in the Payment column, never here.
// Marking a procedure paid moves its status to 'completed'.
const STATUS_COLOR = {
  planned: 'info',
  in_progress: 'warning',
  completed: 'success',
  cancelled: 'default',
};

const STATUSES = ['planned', 'in_progress', 'completed', 'cancelled'];

const performerName = (performedBy, isAr) => {
  if (!performedBy || typeof performedBy === 'string') return '—';
  // The name lives on the linked employee; the user only carries the email.
  const src = performedBy.employee || performedBy;
  const name = isAr
    ? src.name_arabic || src.name_english
    : src.name_english || src.name_arabic;
  return name || performedBy.email || '—';
};

const todayValue = () => new Date().toISOString().slice(0, 10);

const PAYMENT_LABELS = {
  paid: { en: 'Paid', ar: 'مدفوع' },
  unpaid: { en: 'Unpaid', ar: 'غير مدفوع' },
};

const PAYMENT_ACTIONS = {
  // Shown on a paid row — the button reverses the payment.
  paid: { en: 'Undo', ar: 'تراجع' },
  unpaid: { en: 'Mark paid', ar: 'تعليم كمدفوع' },
};

const pick = (dict, key, isAr) => (isAr ? dict[key].ar : dict[key].en);

// One flat, most-recent-first list of the actual procedure records. Painting a
// tooth appends such a record on the server, so this is a real history: every
// row keeps the date it was performed on instead of borrowing the tooth's
// last-modified timestamp (which the autosave rewrites on every save).
function collectProcedureRows(teethMap, lang) {
  const rows = [];

  Object.values(teethMap || {}).forEach((tooth) => {
    const fdi = tooth.fdi_number;

    (tooth.procedures || []).forEach((proc) => {
      rows.push({
        key: proc._id || `p-${fdi}-${proc.description}`,
        id: proc._id,
        fdi,
        label: (lang === 'ar' && proc.description_arabic) || proc.description || '—',
        surface: proc.surface ? getSurfaceLabel(proc.surface, fdi, lang) : null,
        status: proc.status,
        doctor: proc.performed_by,
        date: proc.date_performed,
        cost: proc.cost,
        currency: proc.currency || 'JOD',
        paymentStatus: proc.payment_status || 'unpaid',
        paidAt: proc.paid_at,
      });
    });
  });

  return rows.sort(
    (a, b) => new Date(b.date || 0) - new Date(a.date || 0) || a.fdi - b.fdi
  );
}

// ----------------------------------------------------------------------

function AddProcedureDialog({ open, onClose, onSubmit, teeth, numbering, lang }) {
  const isAr = lang === 'ar';
  const [fdi, setFdi] = useState('');
  const [description, setDescription] = useState('');
  const [descriptionAr, setDescriptionAr] = useState('');
  const [status, setStatus] = useState('planned');
  const [cost, setCost] = useState('');
  const [date, setDate] = useState(todayValue());
  const [saving, setSaving] = useState(false);

  const reset = () => {
    setFdi('');
    setDescription('');
    setDescriptionAr('');
    setStatus('planned');
    setCost('');
    setDate(todayValue());
  };

  const handleClose = () => {
    if (saving) return;
    reset();
    onClose();
  };

  const handleSubmit = async () => {
    if (!fdi || !description.trim()) return;
    setSaving(true);
    try {
      await onSubmit(Number(fdi), {
        description: description.trim(),
        description_arabic: descriptionAr.trim() || undefined,
        status,
        cost: cost ? Number(cost) : 0,
        // Sent explicitly so the record is not silently stamped with server-now.
        date_performed: date || undefined,
      });
      reset();
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontSize: '1rem' }}>
        {isAr ? 'إضافة إجراء' : 'Add Procedure'}
      </DialogTitle>
      <DialogContent>
        <Stack gap={2} sx={{ mt: 1 }}>
          <FormControl size="small" fullWidth>
            <InputLabel>{isAr ? 'السن' : 'Tooth'}</InputLabel>
            <Select value={fdi} label={isAr ? 'السن' : 'Tooth'} onChange={(e) => setFdi(e.target.value)}>
              {teeth.map((t) => (
                <MenuItem key={t} value={t}>
                  {toNotation(t, numbering)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            size="small"
            label={isAr ? 'الوصف' : 'Description'}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <TextField
            fullWidth
            size="small"
            dir="rtl"
            label={isAr ? 'الوصف (عربي)' : 'Description (Arabic)'}
            value={descriptionAr}
            onChange={(e) => setDescriptionAr(e.target.value)}
          />

          <FormControl size="small" fullWidth>
            <InputLabel>{isAr ? 'الحالة' : 'Status'}</InputLabel>
            <Select value={status} label={isAr ? 'الحالة' : 'Status'} onChange={(e) => setStatus(e.target.value)}>
              {STATUSES.map((s) => (
                <MenuItem key={s} value={s}>
                  {s.replace('_', ' ')}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            size="small"
            type="number"
            label={isAr ? 'التكلفة (دينار)' : 'Cost (JOD)'}
            value={cost}
            onChange={(e) => setCost(e.target.value)}
          />

          <TextField
            fullWidth
            size="small"
            type="date"
            label={isAr ? 'التاريخ' : 'Date'}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} size="small" disabled={saving}>
          {isAr ? 'إلغاء' : 'Cancel'}
        </Button>
        <Button
          variant="contained"
          size="small"
          onClick={handleSubmit}
          disabled={saving || !fdi || !description.trim()}
        >
          {isAr ? 'حفظ' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

AddProcedureDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  teeth: PropTypes.arrayOf(PropTypes.number),
  numbering: PropTypes.string,
  lang: PropTypes.string,
};

// ----------------------------------------------------------------------

export default function ProceduresPanel({
  teethMap,
  teeth,
  onAddProcedure,
  onDeleteProcedure,
  onSetPayment,
  numbering,
  lang,
}) {
  const isAr = lang === 'ar';
  const [dialogOpen, setDialogOpen] = useState(false);
  const [payingId, setPayingId] = useState(null);

  const rows = useMemo(() => collectProcedureRows(teethMap, lang), [teethMap, lang]);

  const handleTogglePayment = async (row) => {
    if (!onSetPayment || !row.id) return;
    const next = row.paymentStatus === 'paid' ? 'unpaid' : 'paid';
    // Un-paying reverses a financial record, so make it deliberate.
    if (next === 'unpaid') {
      const confirmed = window.confirm(
        isAr ? 'إلغاء تعليم الإجراء كمدفوع؟' : 'Mark this procedure as unpaid again?'
      );
      if (!confirmed) return;
    }
    setPayingId(row.id);
    try {
      await onSetPayment(row.fdi, row.id, next);
    } finally {
      setPayingId(null);
    }
  };

  const handleDelete = async (row) => {
    if (!onDeleteProcedure || !row.id) return;
    const confirmed = window.confirm(
      isAr ? 'حذف هذا الإجراء نهائياً؟' : 'Delete this procedure record?'
    );
    if (!confirmed) return;
    await onDeleteProcedure(row.fdi, row.id);
  };

  return (
    <PanelCard
      icon="solar:clipboard-text-bold"
      title={`${isAr ? 'الإجراءات' : 'Procedures'} (${rows.length})`}
      action={
        <Button
          size="small"
          variant="contained"
          startIcon={<Iconify icon="mingcute:add-line" width={16} />}
          onClick={() => setDialogOpen(true)}
          disabled={!onAddProcedure}
        >
          {isAr ? 'إضافة' : 'Add Procedure'}
        </Button>
      }
    >
      {rows.length === 0 ? (
        <Stack alignItems="center" justifyContent="center" sx={{ py: 4, gap: 1 }}>
          <Iconify icon="solar:clipboard-text-linear" width={28} sx={{ color: 'text.disabled' }} />
          <Typography variant="caption" color="text.secondary">
            {isAr ? 'لا توجد إجراءات بعد.' : 'No procedures added yet.'}
          </Typography>
        </Stack>
      ) : (
        <Box sx={{ overflowX: 'auto' }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>{isAr ? 'السن' : 'Tooth'}</TableCell>
                <TableCell>{isAr ? 'الإجراء' : 'Procedure'}</TableCell>
                <TableCell>{isAr ? 'الحالة' : 'Status'}</TableCell>
                <TableCell>{isAr ? 'الطبيب' : 'Doctor'}</TableCell>
                <TableCell>{isAr ? 'التاريخ' : 'Date'}</TableCell>
                <TableCell>{isAr ? 'التكلفة' : 'Cost'}</TableCell>
                <TableCell>{isAr ? 'الدفع' : 'Payment'}</TableCell>
                {onDeleteProcedure && <TableCell />}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.key}>
                  <TableCell sx={{ fontWeight: 600 }}>{toNotation(row.fdi, numbering)}</TableCell>
                  <TableCell>
                    {row.label}
                    {row.surface && (
                      <Typography component="span" variant="caption" color="text.secondary" sx={{ ml: 0.5 }}>
                        ({row.surface})
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      variant="soft"
                      label={row.status ? String(row.status).replace('_', ' ') : '—'}
                      color={STATUS_COLOR[row.status] || 'default'}
                    />
                  </TableCell>
                  <TableCell>{performerName(row.doctor, isAr)}</TableCell>
                  <TableCell>{row.date ? fDate(row.date) : '—'}</TableCell>
                  <TableCell>{row.cost > 0 ? `${row.cost} ${row.currency}` : '—'}</TableCell>
                  <TableCell>
                    <Stack direction="row" alignItems="center" gap={0.75}>
                      <Tooltip title={row.paidAt ? fDate(row.paidAt) : ''}>
                        <Chip
                          size="small"
                          variant="soft"
                          color={row.paymentStatus === 'paid' ? 'success' : 'default'}
                          label={pick(PAYMENT_LABELS, row.paymentStatus, isAr)}
                        />
                      </Tooltip>

                      {onSetPayment && row.id && (
                        <Button
                          size="small"
                          variant="text"
                          disabled={payingId === row.id}
                          onClick={() => handleTogglePayment(row)}
                          sx={{ minWidth: 0, px: 0.75, fontSize: '0.7rem' }}
                        >
                          {pick(PAYMENT_ACTIONS, row.paymentStatus, isAr)}
                        </Button>
                      )}
                    </Stack>
                  </TableCell>
                  {onDeleteProcedure && (
                    <TableCell align="right">
                      {row.id && (
                        <Tooltip title={isAr ? 'حذف' : 'Delete'}>
                          <IconButton size="small" color="error" onClick={() => handleDelete(row)}>
                            <Iconify icon="solar:trash-bin-trash-bold" width={16} />
                          </IconButton>
                        </Tooltip>
                      )}
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      )}

      {onAddProcedure && (
        <AddProcedureDialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          onSubmit={onAddProcedure}
          teeth={teeth}
          numbering={numbering}
          lang={lang}
        />
      )}
    </PanelCard>
  );
}

ProceduresPanel.propTypes = {
  teethMap: PropTypes.object,
  teeth: PropTypes.arrayOf(PropTypes.number),
  onAddProcedure: PropTypes.func,
  onDeleteProcedure: PropTypes.func,
  onSetPayment: PropTypes.func,
  numbering: PropTypes.string,
  lang: PropTypes.string,
};
