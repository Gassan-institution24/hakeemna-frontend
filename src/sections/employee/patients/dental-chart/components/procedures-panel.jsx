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
  MenuItem,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  TextField,
  InputLabel,
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
import { getConditionKind, getConditionLabel } from '../constants/conditions';

// ----------------------------------------------------------------------

const STATUS_COLOR = {
  existing: 'success',
  planned: 'info',
  watch: 'warning',
  in_progress: 'warning',
  completed: 'success',
  cancelled: 'default',
};

const STATUSES = ['planned', 'in_progress', 'completed', 'cancelled'];

const SURFACE_KEYS = ['occlusal', 'incisal', 'mesial', 'distal', 'buccal', 'lingual'];

const performerName = (performedBy, isAr) => {
  if (!performedBy || typeof performedBy === 'string') return '—';
  // The name lives on the linked employee; the user only carries the email.
  const src = performedBy.employee || performedBy;
  const name = isAr
    ? src.name_arabic || src.name_english
    : src.name_english || src.name_arabic;
  return name || performedBy.email || '—';
};

// Build one flat, most-recent-first list from three sources of "work done on a
// tooth": whole-tooth restorations, per-surface restorations, and the formal
// procedure records added through the tooth dialog.
function collectProcedureRows(teethMap, lang) {
  const rows = [];

  Object.values(teethMap || {}).forEach((tooth) => {
    const fdi = tooth.fdi_number;
    // Painted conditions have no date of their own; the tooth's own timestamp
    // records when it was last worked on.
    const toothDate = tooth.updated_at || tooth.created_at || null;

    if (tooth.whole_condition && getConditionKind(tooth.whole_condition) === 'procedure') {
      rows.push({
        key: `w-${fdi}`,
        fdi,
        label: getConditionLabel(tooth.whole_condition, lang),
        surface: null,
        status: tooth.whole_status || 'existing',
        doctor: tooth.updated_by,
        date: toothDate,
      });
    }

    SURFACE_KEYS.forEach((s) => {
      const surf = tooth.surfaces?.[s];
      if (surf && surf.condition && getConditionKind(surf.condition) === 'procedure') {
        rows.push({
          key: `s-${fdi}-${s}`,
          fdi,
          label: getConditionLabel(surf.condition, lang),
          surface: getSurfaceLabel(s, fdi, lang),
          status: surf.status || 'existing',
          doctor: surf.updated_by || tooth.updated_by,
          date: surf.updated_at || toothDate,
        });
      }
    });

    (tooth.procedures || []).forEach((proc) => {
      rows.push({
        key: proc._id || `p-${fdi}-${proc.description}`,
        fdi,
        label: (lang === 'ar' && proc.description_arabic) || proc.description || '—',
        surface: proc.surface ? getSurfaceLabel(proc.surface, fdi, lang) : null,
        status: proc.status,
        doctor: proc.performed_by,
        date: proc.date_performed,
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
  const [saving, setSaving] = useState(false);

  const reset = () => {
    setFdi('');
    setDescription('');
    setDescriptionAr('');
    setStatus('planned');
    setCost('');
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

export default function ProceduresPanel({ teethMap, teeth, onAddProcedure, numbering, lang }) {
  const isAr = lang === 'ar';
  const [dialogOpen, setDialogOpen] = useState(false);

  const rows = useMemo(() => collectProcedureRows(teethMap, lang), [teethMap, lang]);

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
  numbering: PropTypes.string,
  lang: PropTypes.string,
};
