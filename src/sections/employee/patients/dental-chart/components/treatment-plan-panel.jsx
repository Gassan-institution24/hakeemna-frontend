import PropTypes from 'prop-types';
import { useMemo, useState } from 'react';

import {
  Box,
  Chip,
  Table,
  Stack,
  Alert,
  Paper,
  Button,
  Dialog,
  Select,
  Divider,
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

import { useGetUSActiveServiceTypes } from 'src/api/service_types';

import Iconify from 'src/components/iconify';

import PanelCard from './panel-card';
import { getSurfaceLabel } from '../constants/fdi';
import { toNotation } from '../constants/numbering';
import { idOf, splitByVisit } from '../constants/visit-scope';

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

// A date input needs `yyyy-MM-dd`; the visit carries a full ISO timestamp.
const dateInputValue = (value) => {
  if (!value) return todayValue();
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? todayValue() : d.toISOString().slice(0, 10);
};

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
        // Older rows may carry an Arabic description; it is no longer captured,
        // but it is still the better label for those rows in an Arabic UI.
        label: (lang === 'ar' && proc.description_arabic) || proc.description || '—',
        surface: proc.surface ? getSurfaceLabel(proc.surface, fdi, lang) : null,
        status: proc.status,
        doctor: proc.performed_by,
        date: proc.date_performed,
        cost: proc.cost,
        currency: proc.currency || 'JOD',
        visitId: idOf(proc.visit),
      });
    });
  });

  return rows.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0) || a.fdi - b.fdi);
}

const groupTotal = (rows) => rows.reduce((sum, row) => sum + (Number(row.cost) || 0), 0);

const groupCurrency = (rows) => rows.find((row) => row.currency)?.currency || 'JOD';

// ----------------------------------------------------------------------

function AddTreatmentDialog({
  open,
  onClose,
  onSubmit,
  teeth,
  unitServiceId,
  numbering,
  visit,
  lang,
}) {
  const isAr = lang === 'ar';
  const [fdi, setFdi] = useState('');
  const [service, setService] = useState(null);
  const [description, setDescription] = useState('');
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

  // Inside an appointment every line belongs to that visit and shares its date,
  // so the date is shown but not editable.
  const visitDate = visit?.date ? dateInputValue(visit.date) : null;
  const effectiveDate = visitDate || date;

  const costHelper = isAr
    ? 'تُضاف هذه التكلفة إلى فاتورة الموعد'
    : 'This cost is added to the appointment invoice';
  const dateHelper = isAr
    ? 'كل علاجات هذا الموعد تحمل تاريخ الموعد'
    : "Every treatment in this appointment carries the appointment's date";

  const reset = () => {
    setFdi('');
    setService(null);
    setDescription('');
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

    setDescription(serviceLabel(value, isAr) || value.name_english || '');
    setCost(String(servicePrice(value)));
  };

  const handleSubmit = async () => {
    if (!fdi || !description.trim()) return;
    setSaving(true);
    try {
      await onSubmit(Number(fdi), {
        description: description.trim(),
        status,
        cost: cost ? Number(cost) : 0,
        // Only set when the line came from the catalogue, so hand-typed
        // treatments and painted rows simply have no service behind them.
        // This is also what puts the price on the invoice.
        service_type: service && typeof service !== 'string' ? service._id : undefined,
        // Sent explicitly so the record is not silently stamped with server-now.
        // In a visit the caller overrides this with the appointment's own date.
        date_performed: effectiveDate || undefined,
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
            helperText={visit ? costHelper : ' '}
          />

          <TextField
            fullWidth
            size="small"
            type="date"
            label={isAr ? 'التاريخ' : 'Date'}
            value={effectiveDate}
            onChange={(e) => setDate(e.target.value)}
            disabled={Boolean(visitDate)}
            InputLabelProps={{ shrink: true }}
            helperText={visitDate ? dateHelper : ' '}
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
  visit: PropTypes.object,
  lang: PropTypes.string,
};

// ----------------------------------------------------------------------

// The lines of one plan. Shared by the current visit and by every card in the
// history dialog so a past plan reads exactly like the one being written now.
function TreatmentLines({ rows, numbering, onDelete, lang }) {
  const isAr = lang === 'ar';

  return (
    <Box sx={{ overflowX: 'auto' }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>{isAr ? 'السن' : 'Tooth'}</TableCell>
            <TableCell>{isAr ? 'العلاج' : 'Treatment'}</TableCell>
            <TableCell>{isAr ? 'الحالة' : 'Status'}</TableCell>
            <TableCell>{isAr ? 'الطبيب' : 'Doctor'}</TableCell>
            <TableCell>{isAr ? 'التكلفة' : 'Cost'}</TableCell>
            {onDelete && <TableCell />}
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
              <TableCell sx={{ whiteSpace: 'nowrap' }}>{performerName(row.doctor, isAr)}</TableCell>
              <TableCell sx={{ whiteSpace: 'nowrap' }}>
                {row.cost > 0 ? `${row.cost} ${row.currency}` : '—'}
              </TableCell>
              {onDelete && (
                <TableCell align="right">
                  {row.id && (
                    <Tooltip title={isAr ? 'حذف' : 'Delete'}>
                      <IconButton size="small" color="error" onClick={() => onDelete(row)}>
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
  );
}

TreatmentLines.propTypes = {
  rows: PropTypes.array,
  numbering: PropTypes.string,
  onDelete: PropTypes.func,
  lang: PropTypes.string,
};

// ----------------------------------------------------------------------

// Past visits, newest first: one card per plan, each headed by its date, the
// treating doctor and what it came to.
function HistoryDialog({ open, onClose, groups, numbering, lang }) {
  const isAr = lang === 'ar';

  const totals = useMemo(() => {
    const allRows = groups.flatMap((group) => group.rows);
    return {
      visits: groups.length,
      treatments: allRows.length,
      cost: groupTotal(allRows),
      currency: groupCurrency(allRows),
    };
  }, [groups]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ fontSize: '1rem' }}>
        {isAr ? 'سجل العلاج السابق' : 'Previous treatment history'}
      </DialogTitle>

      <DialogContent dividers sx={{ backgroundColor: 'background.neutral' }}>
        {groups.length === 0 ? (
          <Stack alignItems="center" justifyContent="center" sx={{ py: 6, gap: 1 }}>
            <Iconify icon="solar:history-linear" width={32} sx={{ color: 'text.disabled' }} />
            <Typography variant="body2" color="text.secondary">
              {isAr ? 'لا يوجد سجل علاج سابق.' : 'No previous treatment on record.'}
            </Typography>
          </Stack>
        ) : (
          <Stack gap={2} sx={{ py: 1 }}>
            {/* Summary strip — the three numbers worth knowing at a glance */}
            <Stack direction="row" flexWrap="wrap" gap={1.5}>
              {[
                {
                  icon: 'solar:calendar-bold',
                  label: isAr ? 'زيارات' : 'Visits',
                  value: totals.visits,
                },
                {
                  icon: 'solar:clipboard-text-bold',
                  label: isAr ? 'علاجات' : 'Treatments',
                  value: totals.treatments,
                },
                {
                  icon: 'solar:wallet-money-bold',
                  label: isAr ? 'الإجمالي' : 'Total',
                  value: `${totals.cost} ${totals.currency}`,
                },
              ].map((stat) => (
                <Paper
                  key={stat.label}
                  variant="outlined"
                  sx={{
                    flex: '1 1 140px',
                    px: 2,
                    py: 1.25,
                    borderRadius: 1.5,
                    backgroundColor: 'background.paper',
                  }}
                >
                  <Stack direction="row" alignItems="center" gap={1}>
                    <Iconify icon={stat.icon} width={18} sx={{ color: 'primary.main' }} />
                    <Box>
                      <Typography variant="caption" color="text.secondary" display="block">
                        {stat.label}
                      </Typography>
                      <Typography variant="subtitle2">{stat.value}</Typography>
                    </Box>
                  </Stack>
                </Paper>
              ))}
            </Stack>

            <Divider />

            {groups.map((group) => {
              const total = groupTotal(group.rows);
              const currency = groupCurrency(group.rows);
              const doctor = performerName(group.rows[0]?.doctor, isAr);

              return (
                <Paper
                  key={group.key}
                  variant="outlined"
                  sx={{ borderRadius: 1.5, overflow: 'hidden', backgroundColor: 'background.paper' }}
                >
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    flexWrap="wrap"
                    gap={1}
                    sx={{
                      px: 2,
                      py: 1.25,
                      borderBottom: '1px solid',
                      borderColor: 'divider',
                      backgroundColor: 'background.neutral',
                    }}
                  >
                    <Stack direction="row" alignItems="center" gap={1}>
                      <Iconify
                        icon="solar:calendar-bold"
                        width={16}
                        sx={{ color: 'primary.main' }}
                      />
                      <Typography variant="subtitle2">
                        {group.date ? fDate(group.date, 'dd MMM yyyy') : '—'}
                      </Typography>
                      {doctor !== '—' && (
                        <Typography variant="caption" color="text.secondary">
                          · {doctor}
                        </Typography>
                      )}
                    </Stack>

                    <Stack direction="row" alignItems="center" gap={1}>
                      <Chip
                        size="small"
                        variant="outlined"
                        label={`${group.rows.length} ${isAr ? 'علاج' : 'treatments'}`}
                      />
                      {total > 0 && (
                        <Chip
                          size="small"
                          color="primary"
                          variant="soft"
                          label={`${total} ${currency}`}
                        />
                      )}
                    </Stack>
                  </Stack>

                  <Box sx={{ px: 1, py: 0.5 }}>
                    <TreatmentLines rows={group.rows} numbering={numbering} lang={lang} />
                  </Box>
                </Paper>
              );
            })}
          </Stack>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} size="small">
          {isAr ? 'إغلاق' : 'Close'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

HistoryDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  groups: PropTypes.array,
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
  visit,
  numbering,
  lang,
}) {
  const isAr = lang === 'ar';
  const [dialogOpen, setDialogOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);

  const allRows = useMemo(() => collectTreatmentRows(teethMap, lang), [teethMap, lang]);

  // Inside an appointment the panel is about *this* visit: the plan being written
  // now. Everything earlier moves behind the history button so the doctor is not
  // reading years of records while treating. Outside an appointment — the
  // standalone chart — the full list stays exactly as it was.
  const { current: currentRows, history: historyGroups } = useMemo(
    () => splitByVisit(allRows, visit?.id),
    [allRows, visit?.id]
  );

  const inVisit = Boolean(visit?.id);

  const emptyVisitText = isAr
    ? 'لم يُضف أي علاج في هذا الموعد بعد.'
    : 'No treatment added in this appointment yet.';
  const emptyChartText = isAr ? 'لا توجد علاجات بعد.' : 'No treatments planned yet.';
  const currentTotal = groupTotal(currentRows);
  const currentCurrency = groupCurrency(currentRows);

  const handleDelete = async (row) => {
    if (!onDeleteProcedure || !row.id) return;
    const confirmed = window.confirm(
      isAr ? 'حذف هذا العلاج نهائياً؟' : 'Delete this treatment line?'
    );
    if (!confirmed) return;
    await onDeleteProcedure(row.fdi, row.id);
  };

  const title = inVisit
    ? `${isAr ? 'خطة علاج هذا الموعد' : "This appointment's treatment plan"} (${currentRows.length})`
    : `${isAr ? 'خطة العلاج' : 'Treatment plan'} (${currentRows.length})`;

  return (
    <PanelCard
      icon="solar:clipboard-text-bold"
      title={title}
      action={
        <Stack direction="row" spacing={1}>
          {inVisit && (
            <Button
              size="small"
              variant="outlined"
              startIcon={<Iconify icon="solar:history-bold" width={16} />}
              onClick={() => setHistoryOpen(true)}
              disabled={historyGroups.length === 0}
            >
              {isAr ? 'عرض السجل السابق' : 'Show old history'}
            </Button>
          )}
          {onAddProcedure && (
            <Button
              size="small"
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" width={16} />}
              onClick={() => setDialogOpen(true)}
            >
              {isAr ? 'إضافة' : 'Add treatment'}
            </Button>
          )}
        </Stack>
      }
    >
      {currentRows.length === 0 ? (
        <Stack alignItems="center" justifyContent="center" sx={{ py: 4, gap: 1 }}>
          <Iconify icon="solar:clipboard-text-linear" width={28} sx={{ color: 'text.disabled' }} />
          <Typography variant="caption" color="text.secondary">
            {inVisit ? emptyVisitText : emptyChartText}
          </Typography>
          {inVisit && historyGroups.length > 0 && (
            <Button
              size="small"
              onClick={() => setHistoryOpen(true)}
              startIcon={<Iconify icon="solar:history-bold" width={16} />}
            >
              {isAr ? 'عرض السجل السابق' : 'Show old history'}
            </Button>
          )}
        </Stack>
      ) : (
        <Stack gap={1.5}>
          {/* One plan, one date — the header that makes these lines read as a
              single record rather than N unrelated ones. */}
          {inVisit && (
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              flexWrap="wrap"
              gap={1}
              sx={{
                px: 1.5,
                py: 1,
                borderRadius: 1.5,
                backgroundColor: 'background.neutral',
              }}
            >
              <Stack direction="row" alignItems="center" gap={1}>
                <Iconify icon="solar:calendar-bold" width={16} sx={{ color: 'primary.main' }} />
                <Typography variant="subtitle2">
                  {visit.date ? fDate(visit.date, 'dd MMM yyyy') : fDate(new Date(), 'dd MMM yyyy')}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  · {currentRows.length} {isAr ? 'علاج' : 'treatments'}
                </Typography>
              </Stack>

              {currentTotal > 0 && (
                <Chip
                  size="small"
                  color="primary"
                  variant="soft"
                  label={`${isAr ? 'الإجمالي' : 'Total'}: ${currentTotal} ${currentCurrency}`}
                />
              )}
            </Stack>
          )}

          <TreatmentLines
            rows={currentRows}
            numbering={numbering}
            onDelete={onDeleteProcedure ? handleDelete : undefined}
            lang={lang}
          />

          {inVisit && currentTotal > 0 && (
            <Alert severity="info" icon={<Iconify icon="solar:bill-list-bold" width={18} />}>
              <Typography variant="caption">
                {isAr
                  ? 'أسعار الخدمات المختارة أُضيفت إلى فاتورة هذا الموعد.'
                  : 'Prices of catalogue services have been added to this appointment’s invoice.'}
              </Typography>
            </Alert>
          )}
        </Stack>
      )}

      {onAddProcedure && (
        <AddTreatmentDialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          onSubmit={onAddProcedure}
          teeth={teeth}
          unitServiceId={unitServiceId}
          numbering={numbering}
          visit={visit}
          lang={lang}
        />
      )}

      <HistoryDialog
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        groups={historyGroups}
        numbering={numbering}
        lang={lang}
      />
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
  // The appointment being treated, when the chart is opened from an encounter.
  // Its presence is what switches the panel to single-visit mode.
  visit: PropTypes.object,
  numbering: PropTypes.string,
  lang: PropTypes.string,
};
