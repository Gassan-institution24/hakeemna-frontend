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
  Autocomplete,
  DialogActions,
  DialogContent,
  InputAdornment,
} from '@mui/material';

import { fDate } from 'src/utils/format-time';

import Iconify from 'src/components/iconify';
import { useGetUSActiveServiceTypes } from 'src/api/service_types';

import PanelCard from './panel-card';
import { getSurfaceLabel } from '../constants/fdi';
import { toNotation } from '../constants/numbering';

// ----------------------------------------------------------------------

const STATUS_COLOR = {
  planned: 'info',
  in_progress: 'warning',
  completed: 'success',
  cancelled: 'default',
};

const STATUSES = ['planned', 'in_progress', 'completed', 'cancelled'];

/**
 * Doctor shown as first + family name.
 *
 * Names here are frequently four parts (given · father · grandfather · family),
 * which is far too wide for a table cell; the middle parts are the ones that
 * carry no identifying value between colleagues.
 */
const performerName = (performedBy, isAr) => {
  if (!performedBy || typeof performedBy === 'string') return '—';
  // The name lives on the linked employee; the user only carries the email.
  const src = performedBy.employee || performedBy;
  const full = isAr
    ? src.name_arabic || src.name_english
    : src.name_english || src.name_arabic;

  if (!full) return performedBy.email || '—';

  const parts = String(full).trim().split(/\s+/).filter(Boolean);
  if (parts.length <= 2) return parts.join(' ');
  return `${parts[0]} ${parts[parts.length - 1]}`;
};

const todayValue = () => new Date().toISOString().slice(0, 10);

// `Price_per_unit` is stored as a String on service_types, and may be blank or
// non-numeric — never let that reach the cost field as NaN.
const servicePrice = (service) => {
  const raw = Number(service?.Price_per_unit);
  return Number.isFinite(raw) ? raw : 0;
};

const serviceLabel = (service, isAr) => {
  if (!service) return '';
  if (typeof service === 'string') return service;
  const name = isAr
    ? service.name_arabic || service.name_english
    : service.name_english || service.name_arabic;
  return name || '';
};

// One flat, most-recent-first list of the actual procedure records. Painting a
// tooth appends such a record on the server, so this is a real history: every
// row keeps the date it was performed on instead of borrowing the tooth's
// last-modified timestamp (which the save rewrites on every save).
function collectTreatmentRows(teethMap, lang) {
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
      });
    });
  });

  return rows.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0) || a.fdi - b.fdi);
}

// ----------------------------------------------------------------------

function AddTreatmentDialog({ open, onClose, onSubmit, teeth, unitServiceId, numbering, lang }) {
  const isAr = lang === 'ar';
  const [fdi, setFdi] = useState('');
  const [service, setService] = useState(null);
  const [description, setDescription] = useState('');
  const [descriptionAr, setDescriptionAr] = useState('');
  const [status, setStatus] = useState('planned');
  const [cost, setCost] = useState('');
  const [date, setDate] = useState(todayValue());
  const [saving, setSaving] = useState(false);

  // The clinic's own catalogue — same source the accounting module prices from.
  const { serviceTypesData, loading: servicesLoading } = useGetUSActiveServiceTypes(unitServiceId);
  const services = useMemo(
    () => (Array.isArray(serviceTypesData) ? serviceTypesData : []),
    [serviceTypesData]
  );

  const reset = () => {
    setFdi('');
    setService(null);
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

  // Picking a service seeds the name and the price; both stay editable after.
  const handleServiceChange = (_e, value) => {
    setService(value);
    if (!value) return;

    if (typeof value === 'string') {
      // freeSolo: a one-off treatment with no catalogue entry.
      setDescription(value);
      return;
    }

    setDescription(value.name_english || value.name_arabic || '');
    setDescriptionAr(value.name_arabic || '');
    setCost(String(servicePrice(value)));
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
        // Only set when the line came from the catalogue, so hand-typed
        // treatments and painted rows simply have no service behind them.
        service_type: service && typeof service !== 'string' ? service._id : undefined,
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
        {isAr ? 'إضافة علاج' : 'Add treatment'}
      </DialogTitle>
      <DialogContent>
        <Stack gap={2} sx={{ mt: 1 }}>
          <FormControl size="small" fullWidth>
            <InputLabel>{isAr ? 'السن' : 'Tooth'}</InputLabel>
            <Select
              value={fdi}
              label={isAr ? 'السن' : 'Tooth'}
              onChange={(e) => setFdi(e.target.value)}
            >
              {teeth.map((t) => (
                <MenuItem key={t} value={t}>
                  {toNotation(t, numbering)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Autocomplete
            freeSolo
            size="small"
            options={services}
            value={service}
            loading={servicesLoading}
            onChange={handleServiceChange}
            getOptionLabel={(option) => serviceLabel(option, isAr)}
            isOptionEqualToValue={(option, value) => option?._id === value?._id}
            renderOption={(props, option) => (
              <li {...props} key={option._id}>
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  sx={{ width: '100%', gap: 2 }}
                >
                  <Typography variant="body2">{serviceLabel(option, isAr)}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {servicePrice(option) > 0 ? servicePrice(option) : '—'}
                  </Typography>
                </Stack>
              </li>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                label={isAr ? 'العلاج / الخدمة' : 'Treatment / service'}
                placeholder={isAr ? 'اختر من الخدمات...' : 'Pick from services…'}
                helperText={
                  isAr
                    ? 'اختر خدمة ليتم تعبئة السعر تلقائياً، أو اكتب علاجاً مخصصاً'
                    : 'Pick a service to auto-fill its price, or type a one-off treatment'
                }
              />
            )}
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
            <Select
              value={status}
              label={isAr ? 'الحالة' : 'Status'}
              onChange={(e) => setStatus(e.target.value)}
            >
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
            label={isAr ? 'التكلفة' : 'Cost'}
            value={cost}
            onChange={(e) => setCost(e.target.value)}
            InputProps={{
              endAdornment: <InputAdornment position="end">JOD</InputAdornment>,
            }}
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

AddTreatmentDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  teeth: PropTypes.arrayOf(PropTypes.number),
  unitServiceId: PropTypes.string,
  numbering: PropTypes.string,
  lang: PropTypes.string,
};

// ----------------------------------------------------------------------

export default function TreatmentPlanPanel({
  teethMap,
  teeth,
  onAddProcedure,
  onDeleteProcedure,
  unitServiceId,
  numbering,
  lang,
}) {
  const isAr = lang === 'ar';
  const [dialogOpen, setDialogOpen] = useState(false);

  const rows = useMemo(() => collectTreatmentRows(teethMap, lang), [teethMap, lang]);

  const handleDelete = async (row) => {
    if (!onDeleteProcedure || !row.id) return;
    const confirmed = window.confirm(
      isAr ? 'حذف هذا العلاج نهائياً؟' : 'Delete this treatment line?'
    );
    if (!confirmed) return;
    await onDeleteProcedure(row.fdi, row.id);
  };

  return (
    <PanelCard
      icon="solar:clipboard-text-bold"
      title={`${isAr ? 'خطة العلاج' : 'Treatment plan'} (${rows.length})`}
      action={
        <Button
          size="small"
          variant="contained"
          startIcon={<Iconify icon="mingcute:add-line" width={16} />}
          onClick={() => setDialogOpen(true)}
          disabled={!onAddProcedure}
        >
          {isAr ? 'إضافة' : 'Add treatment'}
        </Button>
      }
    >
      {rows.length === 0 ? (
        <Stack alignItems="center" justifyContent="center" sx={{ py: 4, gap: 1 }}>
          <Iconify icon="solar:clipboard-text-linear" width={28} sx={{ color: 'text.disabled' }} />
          <Typography variant="caption" color="text.secondary">
            {isAr ? 'لا توجد علاجات بعد.' : 'No treatments planned yet.'}
          </Typography>
        </Stack>
      ) : (
        <Box sx={{ overflowX: 'auto' }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>{isAr ? 'السن' : 'Tooth'}</TableCell>
                <TableCell>{isAr ? 'العلاج' : 'Treatment'}</TableCell>
                <TableCell>{isAr ? 'الحالة' : 'Status'}</TableCell>
                <TableCell>{isAr ? 'الطبيب' : 'Doctor'}</TableCell>
                <TableCell>{isAr ? 'التاريخ' : 'Date'}</TableCell>
                <TableCell>{isAr ? 'التكلفة' : 'Cost'}</TableCell>
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
                      <Typography
                        component="span"
                        variant="caption"
                        color="text.secondary"
                        sx={{ ml: 0.5 }}
                      >
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
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>
                    {performerName(row.doctor, isAr)}
                  </TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>
                    {row.date ? fDate(row.date) : '—'}
                  </TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>
                    {row.cost > 0 ? `${row.cost} ${row.currency}` : '—'}
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
        <AddTreatmentDialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          onSubmit={onAddProcedure}
          teeth={teeth}
          unitServiceId={unitServiceId}
          numbering={numbering}
          lang={lang}
        />
      )}
    </PanelCard>
  );
}

TreatmentPlanPanel.propTypes = {
  teethMap: PropTypes.object,
  teeth: PropTypes.arrayOf(PropTypes.number),
  onAddProcedure: PropTypes.func,
  onDeleteProcedure: PropTypes.func,
  // The clinic whose service catalogue prices the treatment lines.
  unitServiceId: PropTypes.string,
  numbering: PropTypes.string,
  lang: PropTypes.string,
};
