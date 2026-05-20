import PropTypes from 'prop-types';
import { useState } from 'react';

import {
  Box,
  Tab,
  Chip,
  Grid,
  List,
  Stack,
  Alert,
  Button,
  Dialog,
  Divider,
  ListItem,
  MenuItem,
  TextField,
  Typography,
  IconButton,
  DialogTitle,
  ListItemText,
  DialogActions,
  DialogContent,
  CircularProgress,
} from '@mui/material';
import { TabList, TabPanel, TabContext } from '@mui/lab';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import ToothIcon from '@mui/icons-material/Mood';

import { fDate } from 'src/utils/format-time';
import { useTranslate } from 'src/locales';

import { STATUS_COLORS, STATUS_STROKE } from './tooth-svg';
import { updateTooth, addProcedure, deleteProcedure } from '../../../../api/dental_chart';

// ----------------------------------------------------------------------

const STATUSES = [
  'healthy',
  'cavity',
  'filling',
  'crown',
  'missing',
  'root_canal',
  'extraction_needed',
];

// ----------------------------------------------------------------------

export default function ToothDialog({ open, toothData, patientId, statusLabels, onClose }) {
  const { t } = useTranslate();
  const [tab, setTab] = useState('status');

  // Status / notes state
  const [status, setStatus] = useState(toothData?.status || 'healthy');
  const [notes, setNotes] = useState(toothData?.notes || '');
  const [notesAr, setNotesAr] = useState(toothData?.notes_arabic || '');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Procedure state
  const [procDesc, setProcDesc] = useState('');
  const [procDescAr, setProcDescAr] = useState('');
  const [procDate, setProcDate] = useState('');
  const [addingProc, setAddingProc] = useState(false);
  const [procError, setProcError] = useState('');

  const [procedures, setProcedures] = useState(toothData?.procedures || []);

  const handleSaveStatus = async () => {
    setSaving(true);
    setSaveError('');
    setSaveSuccess(false);
    try {
      const result = await updateTooth(patientId, toothData.tooth_number, {
        status,
        notes,
        notes_arabic: notesAr,
      });
      const updatedTooth = result?.data?.teeth?.find(
        (tooth) => tooth.tooth_number === toothData.tooth_number
      );
      if (updatedTooth) setProcedures(updatedTooth.procedures || []);
      setSaveSuccess(true);
    } catch (err) {
      setSaveError(err?.message || 'Error saving');
    } finally {
      setSaving(false);
    }
  };

  const handleAddProcedure = async () => {
    if (!procDesc.trim()) {
      setProcError(t('Description is required'));
      return;
    }
    setAddingProc(true);
    setProcError('');
    try {
      const result = await addProcedure(patientId, toothData.tooth_number, {
        description: procDesc,
        description_arabic: procDescAr,
        procedure_date: procDate || undefined,
      });
      const updatedTooth = result?.data?.teeth?.find(
        (tooth) => tooth.tooth_number === toothData.tooth_number
      );
      if (updatedTooth) setProcedures(updatedTooth.procedures || []);
      setProcDesc('');
      setProcDescAr('');
      setProcDate('');
    } catch (err) {
      setProcError(err?.message || 'Error adding procedure');
    } finally {
      setAddingProc(false);
    }
  };

  const handleDeleteProcedure = async (procedureId) => {
    try {
      const result = await deleteProcedure(patientId, toothData.tooth_number, procedureId);
      const updatedTooth = result?.data?.teeth?.find(
        (tooth) => tooth.tooth_number === toothData.tooth_number
      );
      if (updatedTooth) setProcedures(updatedTooth.procedures || []);
    } catch (err) {
      console.error('Delete procedure error:', err);
    }
  };

  const statusColor = STATUS_COLORS[status] || '#fff';
  const statusStroke = STATUS_STROKE[status] || '#bbb';

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Stack direction="row" alignItems="center" gap={1.5}>
            {/* Tooth icon with current color */}
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: 2,
                backgroundColor: statusColor,
                border: `2px solid ${statusStroke}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ToothIcon sx={{ fontSize: 20, color: statusStroke }} />
            </Box>
            <Box>
              <Typography variant="subtitle1" fontWeight={700}>
                {t('Tooth')} #{toothData?.tooth_number}
              </Typography>
              <Chip
                label={statusLabels[toothData?.status] || toothData?.status}
                size="small"
                sx={{
                  backgroundColor: STATUS_COLORS[toothData?.status],
                  border: `1px solid ${STATUS_STROKE[toothData?.status]}`,
                  fontSize: '0.7rem',
                  height: 20,
                  color: ['healthy', 'filling'].includes(toothData?.status) ? '#212121' : '#fff',
                }}
              />
            </Box>
          </Stack>
          <IconButton size="small" onClick={onClose}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Stack>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ pt: 2 }}>
        <TabContext value={tab}>
          <TabList onChange={(_, v) => setTab(v)} variant="fullWidth" sx={{ mb: 2 }}>
            <Tab label={t('Status & Notes')} value="status" />
            <Tab
              label={`${t('Procedures')} (${procedures.length})`}
              value="procedures"
            />
          </TabList>

          {/* ── Status & Notes Tab ── */}
          <TabPanel value="status" sx={{ p: 0 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  select
                  fullWidth
                  label={t('Status')}
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  size="small"
                >
                  {STATUSES.map((s) => (
                    <MenuItem key={s} value={s}>
                      <Stack direction="row" alignItems="center" gap={1}>
                        <Box
                          sx={{
                            width: 14,
                            height: 14,
                            borderRadius: 0.5,
                            backgroundColor: STATUS_COLORS[s],
                            border: `1.5px solid ${STATUS_STROKE[s]}`,
                          }}
                        />
                        {statusLabels[s] || s}
                      </Stack>
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  label={t('Notes (English)')}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  size="small"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  label={t('Notes (Arabic)')}
                  value={notesAr}
                  onChange={(e) => setNotesAr(e.target.value)}
                  size="small"
                  inputProps={{ dir: 'rtl' }}
                />
              </Grid>

              {saveError && (
                <Grid item xs={12}>
                  <Alert severity="error">{saveError}</Alert>
                </Grid>
              )}
              {saveSuccess && (
                <Grid item xs={12}>
                  <Alert severity="success">{t('Saved successfully')}</Alert>
                </Grid>
              )}
            </Grid>
          </TabPanel>

          {/* ── Procedures Tab ── */}
          <TabPanel value="procedures" sx={{ p: 0 }}>
            <Stack spacing={2}>
              {/* Add procedure form */}
              <Box
                sx={{
                  p: 2,
                  border: '1px dashed',
                  borderColor: 'divider',
                  borderRadius: 2,
                  backgroundColor: 'background.neutral',
                }}
              >
                <Typography variant="subtitle2" mb={1.5}>
                  {t('Add Procedure')}
                </Typography>
                <Grid container spacing={1.5}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      size="small"
                      label={t('Description (EN)')}
                      value={procDesc}
                      onChange={(e) => setProcDesc(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      size="small"
                      label={t('Description (AR)')}
                      value={procDescAr}
                      onChange={(e) => setProcDescAr(e.target.value)}
                      inputProps={{ dir: 'rtl' }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      size="small"
                      type="date"
                      label={t('Date')}
                      value={procDate}
                      onChange={(e) => setProcDate(e.target.value)}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} sx={{ display: 'flex', alignItems: 'center' }}>
                    <Button
                      fullWidth
                      variant="contained"
                      size="small"
                      onClick={handleAddProcedure}
                      disabled={addingProc}
                      startIcon={addingProc ? <CircularProgress size={14} /> : null}
                    >
                      {t('Add')}
                    </Button>
                  </Grid>
                </Grid>
                {procError && (
                  <Alert severity="error" sx={{ mt: 1 }}>
                    {procError}
                  </Alert>
                )}
              </Box>

              {/* Procedures list */}
              {procedures.length === 0 ? (
                <Typography variant="body2" color="text.secondary" textAlign="center" py={2}>
                  {t('No procedures recorded')}
                </Typography>
              ) : (
                <List dense disablePadding>
                  {[...procedures].reverse().map((proc) => (
                    <ListItem
                      key={proc._id}
                      disableGutters
                      divider
                      secondaryAction={
                        <IconButton
                          edge="end"
                          size="small"
                          color="error"
                          onClick={() => handleDeleteProcedure(proc._id)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      }
                    >
                      <ListItemText
                        primary={proc.description}
                        secondary={
                          <Stack direction="row" gap={1} flexWrap="wrap">
                            {proc.description_arabic && (
                              <Typography variant="caption" dir="rtl" color="text.secondary">
                                {proc.description_arabic}
                              </Typography>
                            )}
                            {proc.procedure_date && (
                              <Typography variant="caption" color="text.secondary">
                                {fDate(proc.procedure_date)}
                              </Typography>
                            )}
                            {proc.performed_by?.name_english && (
                              <Typography variant="caption" color="text.secondary">
                                — {proc.performed_by.name_english}
                              </Typography>
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
        </TabContext>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} color="inherit">
          {t('Cancel')}
        </Button>
        {tab === 'status' && (
          <Button
            variant="contained"
            onClick={handleSaveStatus}
            disabled={saving}
            startIcon={saving ? <CircularProgress size={14} /> : null}
          >
            {t('Save')}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}

ToothDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  toothData: PropTypes.object,
  patientId: PropTypes.string.isRequired,
  statusLabels: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
};
