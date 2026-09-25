import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import { useMemo, useState, useEffect } from 'react';

import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import {
  Box,
  Grid,
  Chip,
  Stack,
  Alert,
  Button,
  Dialog,
  Select,
  Divider,
  Tooltip,
  MenuItem,
  TextField,
  InputLabel,
  Typography,
  IconButton,
  DialogTitle,
  FormControl,
  Autocomplete,
  DialogActions,
  DialogContent,
  CircularProgress,
} from '@mui/material';

import { createDentalDiagnosis } from 'src/api/dental_diagnoses';

import {
  CONDITIONS,
  getConditionColor,
  getConditionLabel,
  getTableDiagnoses,
  getConditionStroke,
  getConditionsByKind,
} from '../constants/conditions';

// Procedures are a fixed catalogue, so they can be resolved once at module load.
// Diagnoses cannot: the clinic's own entries arrive at runtime, so that list is
// rebuilt inside the component whenever they change.
const TOOTH_PROCEDURES = getConditionsByKind('procedure', { toothLevel: true });

// Palette offered when defining a diagnosis, drawn from the colours the built-in
// conditions already use so a custom entry does not look foreign on the chart.
const CUSTOM_COLORS = [
  { color: '#ECEFF1', stroke: '#90A4AE' },
  { color: '#FFCDD2', stroke: '#E53935' },
  { color: '#FFE0B2', stroke: '#FB8C00' },
  { color: '#FFF9C4', stroke: '#FDD835' },
  { color: '#C8E6C9', stroke: '#43A047' },
  { color: '#B3E5FC', stroke: '#039BE5' },
  { color: '#D1C4E9', stroke: '#8E24AA' },
  { color: '#F8BBD0', stroke: '#D81B60' },
];

const SURFACES = ['occlusal', 'mesial', 'distal', 'buccal', 'lingual'];

function ColorSwatch({ color, stroke, size = 14 }) {
  return (
    <Box
      sx={{
        width: size,
        height: size,
        borderRadius: 0.5,
        backgroundColor: color,
        border: `1.5px solid ${stroke}`,
        flexShrink: 0,
      }}
    />
  );
}
ColorSwatch.propTypes = {
  color: PropTypes.string,
  stroke: PropTypes.string,
  size: PropTypes.number,
};

// ----------------------------------------------------------------------

// Defines a diagnosis the built-in catalogue does not cover. It is saved against
// the clinic, not this patient, so it is on the list for every chart afterwards.
function AddDiagnosisDialog({ open, onClose, onCreated, unitServiceId, lang }) {
  const isAr = lang === 'ar';
  const { enqueueSnackbar } = useSnackbar();

  const [label, setLabel] = useState('');
  const [labelAr, setLabelAr] = useState('');
  const [paletteIndex, setPaletteIndex] = useState(0);
  const [saving, setSaving] = useState(false);

  const reset = () => {
    setLabel('');
    setLabelAr('');
    setPaletteIndex(0);
  };

  const handleClose = () => {
    if (saving) return;
    reset();
    onClose();
  };

  const handleSubmit = async () => {
    if (!label.trim()) return;
    setSaving(true);
    try {
      const created = await createDentalDiagnosis(unitServiceId, {
        label: label.trim(),
        label_arabic: labelAr.trim(),
        color: CUSTOM_COLORS[paletteIndex].color,
        stroke: CUSTOM_COLORS[paletteIndex].stroke,
      });
      enqueueSnackbar(isAr ? 'تمت إضافة التشخيص' : 'Diagnosis added', { variant: 'success' });
      reset();
      onCreated(created);
      onClose();
    } catch (err) {
      enqueueSnackbar(err?.message || (isAr ? 'فشل الحفظ' : 'Error saving'), { variant: 'error' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontSize: '1rem' }}>
        {isAr ? 'إضافة تشخيص جديد' : 'Add New Diagnosis'}
      </DialogTitle>
      <DialogContent>
        <Stack gap={2} sx={{ mt: 1 }}>
          <TextField
            autoFocus
            fullWidth
            size="small"
            label={isAr ? 'الاسم (بالإنجليزية)' : 'Name (English)'}
            value={label}
            onChange={(e) => setLabel(e.target.value)}
          />

          <TextField
            fullWidth
            size="small"
            label={isAr ? 'الاسم (بالعربية)' : 'Name (Arabic)'}
            value={labelAr}
            onChange={(e) => setLabelAr(e.target.value)}
          />

          <Box>
            <Typography variant="caption" color="text.secondary">
              {isAr ? 'لون المخطط' : 'Chart colour'}
            </Typography>
            <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mt: 0.75 }}>
              {CUSTOM_COLORS.map((c, i) => (
                <Box
                  key={c.color}
                  component="button"
                  type="button"
                  onClick={() => setPaletteIndex(i)}
                  aria-label={c.color}
                  sx={{
                    width: 30,
                    height: 30,
                    p: 0,
                    cursor: 'pointer',
                    borderRadius: 1,
                    backgroundColor: c.color,
                    border: '2px solid',
                    borderColor: i === paletteIndex ? 'primary.main' : c.stroke,
                    outline: i === paletteIndex ? '2px solid' : 'none',
                    outlineColor: 'primary.light',
                  }}
                />
              ))}
            </Stack>
          </Box>

          <Typography variant="caption" color="text.secondary">
            {isAr
              ? 'سيكون هذا التشخيص متاحاً لكل مرضى العيادة.'
              : 'This diagnosis becomes available for every patient in the clinic.'}
          </Typography>
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
          disabled={saving || !label.trim()}
        >
          {isAr ? 'حفظ' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

AddDiagnosisDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  onCreated: PropTypes.func.isRequired,
  unitServiceId: PropTypes.string,
  lang: PropTypes.string,
};

export default function ToothModal({
  open,
  fdiNumber,
  toothData,
  patientId,
  lang,
  bridge,
  onClose,
  onSaveTooth,
  onRemoveBridge,
  unitServiceId,
  customDiagnoses,
  tableDiagnoses,
}) {
  const isAr = lang === 'ar';

  // Rebuilt whenever the clinic's catalogue or the diagnoses table changes, so a
  // diagnosis added from the button below appears without reopening the dialog.
  // Only diagnoses stored in the database are offered here: the clinic's own, then
  // the dental half of the diagnoses table. The chart's built-in states (missing,
  // impacted, …) stay on the paint palette, where they drive the tooth artwork.
  const toothDiagnoses = useMemo(
    () => [
      ...getConditionsByKind('diagnosis', { toothLevel: true }).filter((c) => c.custom),
      ...getTableDiagnoses(),
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [customDiagnoses, tableDiagnoses]
  );

  const diagnosisGroup = (c) => {
    if (c.fromTable) return isAr ? 'جدول التشخيصات (ICD-10)' : 'Diagnoses table (ICD-10)';
    return isAr ? 'تشخيصات العيادة' : 'Clinic diagnoses';
  };

  const [addDiagnosisOpen, setAddDiagnosisOpen] = useState(false);

  // ── Tooth info state ──────────────────────────────────────────────────────
  const [wholeDiagnosis, setWholeDiagnosis] = useState('');
  const [wholeCondition, setWholeCondition] = useState('');
  const [wholeStatus, setWholeStatus] = useState('existing');
  const [surfaceEdits, setSurfaceEdits] = useState({});
  const [infoSaving, setInfoSaving] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  // ── Sync from toothData ───────────────────────────────────────────────────
  // Only re-initialise when the tooth changes (fdiNumber), not on every
  // background re-fetch.  Keeping toothData out of the deps prevents the
  // auto-save SWR revalidation from resetting the user's unsaved edits.
  useEffect(() => {
    if (toothData) {
      setWholeDiagnosis(toothData.whole_diagnosis || '');
      setWholeCondition(toothData.whole_condition || '');
      setWholeStatus(toothData.whole_status || 'existing');
      // Surface edits — pre-fill from existing data
      const edits = {};
      SURFACES.forEach((s) => {
        edits[s] = {
          diagnosis: toothData.surfaces?.[s]?.diagnosis || '',
          condition: toothData.surfaces?.[s]?.condition || '',
          status: toothData.surfaces?.[s]?.status || 'existing',
        };
      });
      setSurfaceEdits(edits);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fdiNumber]);

  // ── Save info ─────────────────────────────────────────────────────────────
  const handleSaveInfo = async () => {
    setInfoSaving(true);
    try {
      const payload = {
        whole_diagnosis: wholeDiagnosis || null,
        whole_condition: wholeCondition || null,
        whole_status: wholeStatus,
      };
      // Apply surface changes
      await onSaveTooth(fdiNumber, payload, surfaceEdits);
      enqueueSnackbar(isAr ? 'تم الحفظ بنجاح' : 'Saved successfully', { variant: 'success' });
      // Close only once the save actually succeeded — a failure keeps the dialog
      // open so the edits are not lost.
      onClose();
    } catch (err) {
      enqueueSnackbar(err?.message || (isAr ? 'فشل الحفظ' : 'Error saving'), { variant: 'error' });
    } finally {
      setInfoSaving(false);
    }
  };

  if (!fdiNumber) return null;

  // Bridge member role label (avoids a nested ternary inside the JSX).
  let bridgeRoleText = '';
  if (bridge) {
    if (bridge.pontics?.includes(fdiNumber)) bridgeRoleText = isAr ? ' · حامل' : ' · pontic';
    else bridgeRoleText = isAr ? ' · دعامة' : ' · abutment';
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Stack direction="row" alignItems="center" gap={1.5}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 1.5,
                backgroundColor: getConditionColor(toothData?.whole_condition),
                border: `2px solid ${getConditionStroke(toothData?.whole_condition || 'healthy')}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography variant="caption" fontWeight={700} color="text.primary">
                {fdiNumber}
              </Typography>
            </Box>
            <Box>
              <Typography variant="subtitle1" fontWeight={700}>
                {isAr ? `السن رقم ${fdiNumber}` : `Tooth #${fdiNumber}`}
              </Typography>
              {toothData?.whole_condition && (
                <Chip
                  label={
                    isAr
                      ? CONDITIONS.find((c) => c.id === toothData.whole_condition)?.labelAr
                      : CONDITIONS.find((c) => c.id === toothData.whole_condition)?.label
                  }
                  size="small"
                  sx={{
                    height: 20,
                    fontSize: '0.68rem',
                    backgroundColor: getConditionColor(toothData.whole_condition),
                    border: `1px solid ${getConditionStroke(toothData.whole_condition)}`,
                  }}
                />
              )}
            </Box>
          </Stack>
          <IconButton size="small" onClick={onClose}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Stack>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ pt: 2, pb: 0, px: 2 }}>
        <Grid container spacing={2}>
          {/* Bridge banner */}
          {bridge && (
            <Grid item xs={12}>
              <Alert
                severity="info"
                icon={false}
                action={
                  onRemoveBridge && (
                    <Button color="error" size="small" onClick={() => onRemoveBridge(bridge._id)}>
                      {isAr ? 'إزالة الجسر' : 'Remove bridge'}
                    </Button>
                  )
                }
                sx={{ py: 0.25 }}
              >
                <Typography variant="caption" fontWeight={600}>
                  {isAr ? 'جزء من جسر ثابت' : 'Part of a fixed bridge'}
                </Typography>{' '}
                <Typography variant="caption" color="text.secondary">
                  ({bridge.teeth?.join('–')}
                  {bridgeRoleText})
                </Typography>
              </Alert>
            </Grid>
          )}

          {/* Whole-tooth diagnosis */}
          <Grid item xs={12} sm={6}>
            <Stack direction="row" alignItems="center" gap={1}>
              {/* Searchable: the diagnoses table can run to hundreds of entries. */}
              <Autocomplete
                fullWidth
                size="small"
                options={toothDiagnoses}
                groupBy={diagnosisGroup}
                value={
                  toothDiagnoses.find((c) => c.id === wholeDiagnosis) ||
                  // A saved value not offered here (e.g. a palette state such as
                  // "missing") still shows by its name, rather than blanking.
                  (wholeDiagnosis
                    ? {
                        id: wholeDiagnosis,
                        label: getConditionLabel(wholeDiagnosis, 'en'),
                        labelAr: getConditionLabel(wholeDiagnosis, 'ar'),
                      }
                    : null)
                }
                onChange={(_e, option) => setWholeDiagnosis(option?.id || '')}
                getOptionLabel={(c) => (isAr ? c.labelAr || c.label : c.label) || ''}
                isOptionEqualToValue={(a, b) => a.id === b.id}
                renderOption={(props, c) => (
                  <li {...props} key={c.id}>
                    <Stack direction="row" alignItems="center" gap={1}>
                      <ColorSwatch color={c.color} stroke={c.stroke} />
                      <span>{isAr ? c.labelAr || c.label : c.label}</span>
                    </Stack>
                  </li>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={isAr ? 'تشخيص السن' : 'Tooth Diagnosis'}
                    placeholder={isAr ? 'ابحث بالاسم أو الرمز' : 'Search by name or code'}
                  />
                )}
              />

              {/* Define a diagnosis the catalogue is missing, without leaving
                  the tooth being charted. */}
              <Tooltip title={isAr ? 'إضافة تشخيص جديد' : 'Add a new diagnosis'}>
                <span>
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<AddIcon fontSize="small" />}
                    onClick={() => setAddDiagnosisOpen(true)}
                    disabled={!unitServiceId}
                    sx={{ whiteSpace: 'nowrap', flexShrink: 0 }}
                  >
                    {isAr ? 'جديد' : 'Add new'}
                  </Button>
                </span>
              </Tooltip>
            </Stack>
          </Grid>

          {/* Whole-tooth procedure / restoration */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth size="small">
              <InputLabel sx={{ fontSize: '0.8rem' }}>
                {isAr ? 'إجراء / تعويض السن' : 'Tooth Procedure / Restoration'}
              </InputLabel>
              <Select
                value={wholeCondition}
                label={isAr ? 'إجراء / تعويض السن' : 'Tooth Procedure / Restoration'}
                onChange={(e) => setWholeCondition(e.target.value)}
              >
                <MenuItem value="">
                  <em>{isAr ? 'لا شيء' : 'None'}</em>
                </MenuItem>
                {TOOTH_PROCEDURES.map((c) => (
                  <MenuItem key={c.id} value={c.id}>
                    <Stack direction="row" alignItems="center" gap={1}>
                      <ColorSwatch color={c.color} stroke={c.stroke} />
                      <span>{isAr ? c.labelAr : c.label}</span>
                    </Stack>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth size="small">
              <InputLabel sx={{ fontSize: '0.8rem' }}>
                {isAr ? 'نوع العلاج' : 'Treatment Status'}
              </InputLabel>
              <Select
                value={wholeStatus}
                label={isAr ? 'نوع العلاج' : 'Treatment Status'}
                onChange={(e) => setWholeStatus(e.target.value)}
              >
                <MenuItem value="existing">
                  <Stack direction="row" alignItems="center" gap={1}>
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: 0.5,
                        border: '1.5px solid #BDBDBD',
                        bgcolor: 'transparent',
                        flexShrink: 0,
                      }}
                    />
                    <span>{isAr ? 'حالي' : 'Existing'}</span>
                  </Stack>
                </MenuItem>
                <MenuItem value="planned">
                  <Stack direction="row" alignItems="center" gap={1}>
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: 0.5,
                        border: '2px dashed #1565C0',
                        bgcolor: 'transparent',
                        flexShrink: 0,
                      }}
                    />
                    <Box component="span" sx={{ color: '#1565C0', fontWeight: 600 }}>
                      {isAr ? 'مخطط' : 'Planned'}
                    </Box>
                  </Stack>
                </MenuItem>
                <MenuItem value="completed">
                  <Stack direction="row" alignItems="center" gap={1}>
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: 0.5,
                        border: '2px solid #2E7D32',
                        bgcolor: '#2E7D32',
                        flexShrink: 0,
                      }}
                    />
                    <Box component="span" sx={{ color: '#2E7D32', fontWeight: 600 }}>
                      {isAr ? 'مكتمل' : 'Completed'}
                    </Box>
                  </Stack>
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>

        </Grid>
      </DialogContent>

      <DialogActions sx={{ px: 2, pb: 2, pt: 1 }}>
        <Button onClick={onClose} color="inherit" size="small">
          {isAr ? 'إغلاق' : 'Close'}
        </Button>
        <Button
          variant="contained"
          size="small"
          startIcon={infoSaving ? <CircularProgress size={14} /> : <SaveIcon fontSize="small" />}
          onClick={handleSaveInfo}
          disabled={infoSaving}
        >
          {isAr ? 'حفظ' : 'Save'}
        </Button>
      </DialogActions>

      <AddDiagnosisDialog
        open={addDiagnosisOpen}
        onClose={() => setAddDiagnosisOpen(false)}
        // Select it straight away — the dentist opened this to chart it now.
        onCreated={(created) => created?.key && setWholeDiagnosis(created.key)}
        unitServiceId={unitServiceId}
        lang={lang}
      />
    </Dialog>
  );
}

ToothModal.propTypes = {
  open: PropTypes.bool.isRequired,
  fdiNumber: PropTypes.number,
  toothData: PropTypes.object,
  patientId: PropTypes.string,
  lang: PropTypes.string,
  bridge: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  onSaveTooth: PropTypes.func.isRequired,
  onRemoveBridge: PropTypes.func,
  unitServiceId: PropTypes.string,
  customDiagnoses: PropTypes.array,
  tableDiagnoses: PropTypes.array,
};

ToothModal.defaultProps = {
  fdiNumber: null,
  toothData: null,
  patientId: null,
  lang: 'en',
  bridge: null,
  onRemoveBridge: null,
};
