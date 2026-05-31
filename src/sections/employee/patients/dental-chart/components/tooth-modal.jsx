import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

import { TabList, TabPanel, TabContext } from '@mui/lab';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import {
  Box,
  Tab,
  Grid,
  List,
  Chip,
  Stack,
  Alert,
  Button,
  Dialog,
  Select,
  Divider,
  MenuItem,
  ListItem,
  InputLabel,
  TextField,
  Typography,
  IconButton,
  DialogTitle,
  FormControl,
  DialogActions,
  DialogContent,
  ListItemText,
  CircularProgress,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';

import { fDate } from 'src/utils/format-time';

import { CONDITIONS, getConditionColor, getConditionStroke } from '../constants/conditions';
import { getSurfaceLabel } from '../constants/fdi';

const SURFACES = ['occlusal', 'mesial', 'distal', 'buccal', 'lingual'];
const PROC_STATUSES = ['planned', 'in_progress', 'completed', 'cancelled'];
const PROC_STATUS_COLORS = {
  planned: 'info',
  in_progress: 'warning',
  completed: 'success',
  cancelled: 'error',
};

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
ColorSwatch.propTypes = { color: PropTypes.string, stroke: PropTypes.string, size: PropTypes.number };

export default function ToothModal({
  open,
  fdiNumber,
  toothData,
  patientId,
  lang,
  onClose,
  onSaveTooth,
  onAddProcedure,
  onDeleteProcedure,
  onUpdateProcedure,
}) {
  const isAr = lang === 'ar';
  const [tab, setTab] = useState('info');

  // ── Info tab state ────────────────────────────────────────────────────────
  const [wholeCondition, setWholeCondition] = useState('');
  const [wholeStatus, setWholeStatus] = useState('existing');
  const [notes, setNotes] = useState('');
  const [notesAr, setNotesAr] = useState('');
  const [treatmentPlan, setTreatmentPlan] = useState('');
  const [mobilityGrade, setMobilityGrade] = useState('');
  const [surfaceEdits, setSurfaceEdits] = useState({});
  const [infoSaving, setInfoSaving] = useState(false);
  const [infoError, setInfoError] = useState('');
  const [infoSuccess, setInfoSuccess] = useState(false);

  // ── Procedure tab state ───────────────────────────────────────────────────
  const [procedures, setProcedures] = useState([]);
  const [procDesc, setProcDesc] = useState('');
  const [procDescAr, setProcDescAr] = useState('');
  const [procSurface, setProcSurface] = useState('');
  const [procDate, setProcDate] = useState('');
  const [procCost, setProcCost] = useState('');
  const [procStatus, setProcStatus] = useState('planned');
  const [procNotes, setProcNotes] = useState('');
  const [procSaving, setProcSaving] = useState(false);
  const [procError, setProcError] = useState('');

  // ── Sync from toothData ───────────────────────────────────────────────────
  // Only re-initialise when the tooth changes (fdiNumber), not on every
  // background re-fetch.  Keeping toothData out of the deps prevents the
  // auto-save SWR revalidation from resetting the user's unsaved edits.
  useEffect(() => {
    if (toothData) {
      setWholeCondition(toothData.whole_condition || '');
      setWholeStatus(toothData.whole_status || 'existing');
      setNotes(toothData.notes || '');
      setNotesAr(toothData.notes_arabic || '');
      setTreatmentPlan(toothData.treatment_plan || '');
      setMobilityGrade(toothData.mobility_grade !== undefined ? String(toothData.mobility_grade) : '');
      setProcedures(toothData.procedures || []);
      // Surface edits — pre-fill from existing data
      const edits = {};
      SURFACES.forEach((s) => {
        edits[s] = {
          condition: toothData.surfaces?.[s]?.condition || '',
          status: toothData.surfaces?.[s]?.status || 'existing',
        };
      });
      setSurfaceEdits(edits);
    }
    setInfoError('');
    setInfoSuccess(false);
    setProcError('');
    setTab('info');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fdiNumber]);

  // ── Save info ─────────────────────────────────────────────────────────────
  const handleSaveInfo = async () => {
    setInfoSaving(true);
    setInfoError('');
    setInfoSuccess(false);
    try {
      const payload = {
        whole_condition: wholeCondition || null,
        whole_status: wholeStatus,
        notes,
        notes_arabic: notesAr,
        treatment_plan: treatmentPlan,
        mobility_grade: mobilityGrade !== '' ? Number(mobilityGrade) : undefined,
        // Surface updates will be applied individually
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

  // ── Add procedure ─────────────────────────────────────────────────────────
  const handleAddProcedure = async () => {
    if (!procDesc.trim()) {
      setProcError(isAr ? 'الوصف مطلوب' : 'Description is required');
      return;
    }
    setProcSaving(true);
    setProcError('');
    try {
      const result = await onAddProcedure(fdiNumber, {
        description: procDesc,
        description_arabic: procDescAr,
        surface: procSurface || undefined,
        date_performed: procDate || undefined,
        cost: procCost ? Number(procCost) : 0,
        status: procStatus,
        notes: procNotes,
      });
      if (result?.data?.teeth) {
        const updatedTooth = result.data.teeth.find((t) => t.fdi_number === fdiNumber);
        if (updatedTooth) setProcedures(updatedTooth.procedures || []);
      }
      setProcDesc('');
      setProcDescAr('');
      setProcSurface('');
      setProcDate('');
      setProcCost('');
      setProcNotes('');
      setProcStatus('planned');
    } catch (err) {
      setProcError(err?.message || 'Error adding');
    } finally {
      setProcSaving(false);
    }
  };

  // ── Delete procedure ──────────────────────────────────────────────────────
  const handleDeleteProc = async (procId) => {
    try {
      const result = await onDeleteProcedure(fdiNumber, procId);
      if (result?.data?.teeth) {
        const updatedTooth = result.data.teeth.find((t) => t.fdi_number === fdiNumber);
        if (updatedTooth) setProcedures(updatedTooth.procedures || []);
      }
    } catch (err) {
      console.error('Delete procedure error:', err);
    }
  };

  if (!fdiNumber) return null;

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

      <DialogContent sx={{ pt: 1.5, pb: 0, px: 2 }}>
        <TabContext value={tab}>
          <TabList onChange={(_, v) => setTab(v)} variant="fullWidth" sx={{ mb: 2 }}>
            <Tab label={isAr ? 'معلومات' : 'Info & Surfaces'} value="info" sx={{ fontSize: '0.8rem' }} />
            <Tab
              label={isAr ? `إجراءات (${procedures.length})` : `Procedures (${procedures.length})`}
              value="procedures"
              sx={{ fontSize: '0.8rem' }}
            />
            <Tab label={isAr ? 'ملاحظات' : 'Notes'} value="notes" sx={{ fontSize: '0.8rem' }} />
          </TabList>

          {/* ── Info & Surfaces tab ─── */}
          <TabPanel value="info" sx={{ p: 0 }}>
            <Grid container spacing={2}>
              {/* Whole-tooth condition */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <InputLabel sx={{ fontSize: '0.8rem' }}>
                    {isAr ? 'حالة السن الكاملة' : 'Whole-tooth Condition'}
                  </InputLabel>
                  <Select
                    value={wholeCondition}
                    label={isAr ? 'حالة السن الكاملة' : 'Whole-tooth Condition'}
                    onChange={(e) => setWholeCondition(e.target.value)}
                  >
                    <MenuItem value="">
                      <em>{isAr ? 'لا شيء' : 'None'}</em>
                    </MenuItem>
                    {CONDITIONS.filter((c) => c.toothLevel).map((c) => (
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
                        <Box sx={{ width: 12, height: 12, borderRadius: 0.5, border: '1.5px solid #BDBDBD', bgcolor: 'transparent', flexShrink: 0 }} />
                        <span>{isAr ? 'حالي' : 'Existing'}</span>
                      </Stack>
                    </MenuItem>
                    <MenuItem value="planned">
                      <Stack direction="row" alignItems="center" gap={1}>
                        <Box sx={{ width: 12, height: 12, borderRadius: 0.5, border: '2px dashed #1565C0', bgcolor: 'transparent', flexShrink: 0 }} />
                        <Box component="span" sx={{ color: '#1565C0', fontWeight: 600 }}>{isAr ? 'مخطط' : 'Planned'}</Box>
                      </Stack>
                    </MenuItem>
                    <MenuItem value="watch">
                      <Stack direction="row" alignItems="center" gap={1}>
                        <Box sx={{ width: 12, height: 12, borderRadius: 0.5, border: '2px dotted #F9A825', bgcolor: 'transparent', flexShrink: 0 }} />
                        <Box component="span" sx={{ color: '#F9A825', fontWeight: 600 }}>{isAr ? 'مراقبة' : 'Watch'}</Box>
                      </Stack>
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Mobility */}
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth size="small">
                  <InputLabel sx={{ fontSize: '0.8rem' }}>
                    {isAr ? 'درجة الحركة' : 'Mobility Grade'}
                  </InputLabel>
                  <Select
                    value={mobilityGrade}
                    label={isAr ? 'درجة الحركة' : 'Mobility Grade'}
                    onChange={(e) => setMobilityGrade(e.target.value)}
                  >
                    <MenuItem value=""><em>-</em></MenuItem>
                    {[0, 1, 2, 3].map((v) => (
                      <MenuItem key={v} value={String(v)}>{v}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Surfaces */}
              <Grid item xs={12}>
                <Typography variant="subtitle2" fontWeight={600} mb={1}>
                  {isAr ? 'حالة الأسطح' : 'Surface Conditions'}
                </Typography>
                <Grid container spacing={1}>
                  {SURFACES.map((surf) => {
                    const surfLabel = getSurfaceLabel(surf, fdiNumber, lang);
                    const edit = surfaceEdits[surf] || {};
                    return (
                      <Grid item xs={6} sm={4} key={surf}>
                        <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1.5, p: 1 }}>
                          <Typography variant="caption" fontWeight={600} color="text.secondary" display="block" mb={0.5}>
                            {surfLabel}
                          </Typography>
                          <FormControl fullWidth size="small">
                            <Select
                              value={edit.condition || ''}
                              displayEmpty
                              onChange={(e) =>
                                setSurfaceEdits((prev) => ({
                                  ...prev,
                                  [surf]: { ...prev[surf], condition: e.target.value },
                                }))
                              }
                              sx={{ fontSize: '0.75rem' }}
                            >
                              <MenuItem value=""><em>{isAr ? 'سليم' : 'Healthy'}</em></MenuItem>
                              {CONDITIONS.filter((c) => !c.toothLevel).map((c) => (
                                <MenuItem key={c.id} value={c.id}>
                                  <Stack direction="row" alignItems="center" gap={0.75}>
                                    <ColorSwatch color={c.color} stroke={c.stroke} size={11} />
                                    <span style={{ fontSize: '0.75rem' }}>{isAr ? c.labelAr : c.label}</span>
                                  </Stack>
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Box>
                      </Grid>
                    );
                  })}
                </Grid>
              </Grid>

              {infoError && (
                <Grid item xs={12}><Alert severity="error">{infoError}</Alert></Grid>
              )}
              {infoSuccess && (
                <Grid item xs={12}>
                  <Alert severity="success">{isAr ? 'تم الحفظ بنجاح' : 'Saved successfully'}</Alert>
                </Grid>
              )}
            </Grid>
          </TabPanel>

          {/* ── Procedures tab ─── */}
          <TabPanel value="procedures" sx={{ p: 0 }}>
            <Stack spacing={2}>
              {/* Add form */}
              <Box sx={{ p: 1.5, border: '1px dashed', borderColor: 'divider', borderRadius: 2, bgcolor: 'background.neutral' }}>
                <Typography variant="subtitle2" mb={1.5} fontWeight={600}>
                  {isAr ? 'إضافة إجراء' : 'Add Procedure'}
                </Typography>
                <Grid container spacing={1.5}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth size="small"
                      label={isAr ? 'الوصف (إنجليزي)' : 'Description (EN)'}
                      value={procDesc}
                      onChange={(e) => setProcDesc(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth size="small"
                      label={isAr ? 'الوصف (عربي)' : 'Description (AR)'}
                      value={procDescAr}
                      onChange={(e) => setProcDescAr(e.target.value)}
                      inputProps={{ dir: 'rtl' }}
                    />
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <FormControl fullWidth size="small">
                      <InputLabel>{isAr ? 'السطح' : 'Surface'}</InputLabel>
                      <Select value={procSurface} label={isAr ? 'السطح' : 'Surface'} onChange={(e) => setProcSurface(e.target.value)}>
                        <MenuItem value=""><em>-</em></MenuItem>
                        {SURFACES.map((s) => (
                          <MenuItem key={s} value={s}>{getSurfaceLabel(s, fdiNumber, lang)}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <TextField
                      fullWidth size="small" type="date"
                      label={isAr ? 'التاريخ' : 'Date'}
                      value={procDate}
                      onChange={(e) => setProcDate(e.target.value)}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <TextField
                      fullWidth size="small" type="number"
                      label={isAr ? 'التكلفة (JOD)' : 'Cost (JOD)'}
                      value={procCost}
                      onChange={(e) => setProcCost(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <FormControl fullWidth size="small">
                      <InputLabel>{isAr ? 'الحالة' : 'Status'}</InputLabel>
                      <Select value={procStatus} label={isAr ? 'الحالة' : 'Status'} onChange={(e) => setProcStatus(e.target.value)}>
                        {PROC_STATUSES.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField fullWidth size="small" label={isAr ? 'ملاحظات' : 'Notes'} value={procNotes} onChange={(e) => setProcNotes(e.target.value)} />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      variant="contained" size="small" onClick={handleAddProcedure}
                      disabled={procSaving}
                      startIcon={procSaving ? <CircularProgress size={14} /> : null}
                    >
                      {isAr ? 'إضافة' : 'Add'}
                    </Button>
                    {procError && <Alert severity="error" sx={{ mt: 1 }}>{procError}</Alert>}
                  </Grid>
                </Grid>
              </Box>

              {/* List */}
              {procedures.length === 0 ? (
                <Typography variant="body2" color="text.secondary" textAlign="center" py={2}>
                  {isAr ? 'لا توجد إجراءات مسجلة' : 'No procedures recorded'}
                </Typography>
              ) : (
                <List dense disablePadding>
                  {[...procedures].reverse().map((proc) => (
                    <ListItem
                      key={proc._id}
                      disableGutters
                      divider
                      secondaryAction={
                        <IconButton edge="end" size="small" color="error" onClick={() => handleDeleteProc(proc._id)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      }
                    >
                      <ListItemText
                        primary={
                          <Stack direction="row" alignItems="center" gap={1} flexWrap="wrap">
                            <Typography variant="body2" fontWeight={600}>{proc.description}</Typography>
                            <Chip
                              label={proc.status?.replace('_', ' ')}
                              size="small"
                              color={PROC_STATUS_COLORS[proc.status] || 'info'}
                              sx={{ height: 18, fontSize: '0.65rem' }}
                            />
                            {proc.cost > 0 && (
                              <Chip label={`${proc.cost} JOD`} size="small" color="success" variant="outlined" sx={{ height: 18, fontSize: '0.65rem' }} />
                            )}
                          </Stack>
                        }
                        secondary={
                          <Stack direction="row" gap={1} flexWrap="wrap" mt={0.3}>
                            {proc.description_arabic && (
                              <Typography variant="caption" color="text.secondary" dir="rtl">{proc.description_arabic}</Typography>
                            )}
                            {proc.date_performed && (
                              <Typography variant="caption" color="text.secondary">{fDate(proc.date_performed)}</Typography>
                            )}
                            {proc.performed_by?.name_english && (
                              <Typography variant="caption" color="text.secondary">— {proc.performed_by.name_english}</Typography>
                            )}
                          </Stack>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </Stack>
          </TabPanel>

          {/* ── Notes tab ─── */}
          <TabPanel value="notes" sx={{ p: 0 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth multiline rows={3}
                  label={isAr ? 'ملاحظات سريرية (إنجليزي)' : 'Clinical Notes (English)'}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth multiline rows={3}
                  label={isAr ? 'ملاحظات سريرية (عربي)' : 'Clinical Notes (Arabic)'}
                  value={notesAr}
                  onChange={(e) => setNotesAr(e.target.value)}
                  inputProps={{ dir: 'rtl' }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth multiline rows={2}
                  label={isAr ? 'خطة العلاج' : 'Treatment Plan'}
                  value={treatmentPlan}
                  onChange={(e) => setTreatmentPlan(e.target.value)}
                />
              </Grid>
              {infoError && <Grid item xs={12}><Alert severity="error">{infoError}</Alert></Grid>}
              {infoSuccess && <Grid item xs={12}><Alert severity="success">{isAr ? 'تم الحفظ' : 'Saved'}</Alert></Grid>}
            </Grid>
          </TabPanel>
        </TabContext>
      </DialogContent>

      <DialogActions sx={{ px: 2, pb: 2, pt: 1 }}>
        <Button onClick={onClose} color="inherit" size="small">{isAr ? 'إغلاق' : 'Close'}</Button>
        {tab !== 'procedures' && (
          <Button
            variant="contained" size="small"
            startIcon={infoSaving ? <CircularProgress size={14} /> : <SaveIcon fontSize="small" />}
            onClick={handleSaveInfo}
            disabled={infoSaving}
          >
            {isAr ? 'حفظ' : 'Save'}
          </Button>
        )}
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
  onClose: PropTypes.func.isRequired,
  onSaveTooth: PropTypes.func.isRequired,
  onAddProcedure: PropTypes.func.isRequired,
  onDeleteProcedure: PropTypes.func.isRequired,
  onUpdateProcedure: PropTypes.func,
};

ToothModal.defaultProps = {
  fdiNumber: null,
  toothData: null,
  patientId: null,
  lang: 'en',
  onUpdateProcedure: () => {},
};
