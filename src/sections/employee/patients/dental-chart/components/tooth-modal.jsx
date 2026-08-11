import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

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
  MenuItem,
  InputLabel,
  Typography,
  IconButton,
  DialogTitle,
  FormControl,
  DialogActions,
  DialogContent,
  CircularProgress,
} from '@mui/material';

import {
  CONDITIONS,
  getConditionColor,
  getConditionStroke,
  getConditionsByKind,
} from '../constants/conditions';

const TOOTH_DIAGNOSES = getConditionsByKind('diagnosis', { toothLevel: true });
const TOOTH_PROCEDURES = getConditionsByKind('procedure', { toothLevel: true });

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
}) {
  const isAr = lang === 'ar';

  // ── Tooth info state ──────────────────────────────────────────────────────
  const [wholeDiagnosis, setWholeDiagnosis] = useState('');
  const [wholeCondition, setWholeCondition] = useState('');
  const [wholeStatus, setWholeStatus] = useState('existing');
  const [surfaceEdits, setSurfaceEdits] = useState({});
  const [infoSaving, setInfoSaving] = useState(false);
  const [infoError, setInfoError] = useState('');
  const [infoSuccess, setInfoSuccess] = useState(false);

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
    setInfoError('');
    setInfoSuccess(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fdiNumber]);

  // ── Save info ─────────────────────────────────────────────────────────────
  const handleSaveInfo = async () => {
    setInfoSaving(true);
    setInfoError('');
    setInfoSuccess(false);
    try {
      const payload = {
        whole_diagnosis: wholeDiagnosis || null,
        whole_condition: wholeCondition || null,
        whole_status: wholeStatus,
      };
      // Apply surface changes
      await onSaveTooth(fdiNumber, payload, surfaceEdits);
      setInfoSuccess(true);
    } catch (err) {
      setInfoError(err?.message || 'Error saving');
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
            <FormControl fullWidth size="small">
              <InputLabel sx={{ fontSize: '0.8rem' }}>
                {isAr ? 'تشخيص السن' : 'Tooth Diagnosis'}
              </InputLabel>
              <Select
                value={wholeDiagnosis}
                label={isAr ? 'تشخيص السن' : 'Tooth Diagnosis'}
                onChange={(e) => setWholeDiagnosis(e.target.value)}
              >
                <MenuItem value="">
                  <em>{isAr ? 'لا شيء' : 'None'}</em>
                </MenuItem>
                {TOOTH_DIAGNOSES.map((c) => (
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
                <MenuItem value="watch">
                  <Stack direction="row" alignItems="center" gap={1}>
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: 0.5,
                        border: '2px dotted #F9A825',
                        bgcolor: 'transparent',
                        flexShrink: 0,
                      }}
                    />
                    <Box component="span" sx={{ color: '#F9A825', fontWeight: 600 }}>
                      {isAr ? 'مراقبة' : 'Watch'}
                    </Box>
                  </Stack>
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {infoError && (
            <Grid item xs={12}>
              <Alert severity="error">{infoError}</Alert>
            </Grid>
          )}
          {infoSuccess && (
            <Grid item xs={12}>
              <Alert severity="success">{isAr ? 'تم الحفظ بنجاح' : 'Saved successfully'}</Alert>
            </Grid>
          )}
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
};

ToothModal.defaultProps = {
  fdiNumber: null,
  toothData: null,
  patientId: null,
  lang: 'en',
  bridge: null,
  onRemoveBridge: null,
};
