import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { enqueueSnackbar } from 'notistack';

import {
  Box,
  Card,
  Chip,
  Stack,
  Button,
  Divider,
  MenuItem,
  TextField,
  Typography,
  Autocomplete,
  createFilterOptions,
} from '@mui/material';

import { useParams } from '../../../routes/hooks';

import { fDateTime } from '../../../utils/format-time';

import axiosInstance from '../../../utils/axios';
import Iconify from '../../../components/iconify';
import { useLocales, useTranslate } from '../../../locales';
import { useGetdiagnosis, useGetOnePatientDiagnosis } from '../../../api/diagnosis';

const filter = createFilterOptions();

const LEVEL_META = {
  low:      { color: 'success', icon: 'solar:arrow-down-bold-duotone',  barColor: 'success.main' },
  medium:   { color: 'warning', icon: 'solar:minus-bold-duotone',       barColor: 'warning.main' },
  high:     { color: 'error',   icon: 'solar:arrow-up-bold-duotone',    barColor: 'error.main'   },
  critical: { color: 'error',   icon: 'solar:danger-bold-duotone',      barColor: 'error.main'   },
};

function InfoRow({ label, value }) {
  if (!value) return null;
  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 1.5 }}>
      <Typography sx={{ fontWeight: 600, minWidth: 180, color: 'text.secondary', fontSize: 14 }}>
        {label}
      </Typography>
      <Typography sx={{ fontSize: 14 }}>{value}</Typography>
    </Box>
  );
}

InfoRow.propTypes = { label: PropTypes.string, value: PropTypes.string };

export default function DiagnosisPage() {
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';
  const { id } = useParams();
  const navigate = useNavigate();

  const { patientDiagnosis, loading, refetch } = useGetOnePatientDiagnosis(id);
  const { diagnosisData } = useGetdiagnosis();

  const [editing, setEditing]       = useState(false);
  const [saving, setSaving]         = useState(false);
  const [editLevel, setEditLevel]   = useState('medium');
  const [editNote, setEditNote]     = useState('');
  const [editPrimary, setEditPrimary]         = useState(null);
  const [editSecondary, setEditSecondary]     = useState(null);
  const [primaryInput, setPrimaryInput]       = useState('');
  const [secondaryInput, setSecondaryInput]   = useState('');

  useEffect(() => {
    if (patientDiagnosis) {
      setEditLevel(patientDiagnosis.level || 'medium');
      setEditNote(patientDiagnosis.note || '');
      const pri = patientDiagnosis.primary_diagnosis ||
        (patientDiagnosis.primary_diagnosis_name ? { name: patientDiagnosis.primary_diagnosis_name } : null);
      const sec = patientDiagnosis.secondary_diagnosis ||
        (patientDiagnosis.secondary_diagnosis_name ? { name: patientDiagnosis.secondary_diagnosis_name } : null);
      setEditPrimary(pri);
      setEditSecondary(sec);
      setPrimaryInput(pri?.name || '');
      setSecondaryInput(sec?.name || '');
    }
  }, [patientDiagnosis]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await axiosInstance.put(`/api/patient-diagnosis/${id}`, {
        level: editLevel,
        note: editNote,
        primary_diagnosis: editPrimary?._id || undefined,
        primary_diagnosis_name: !editPrimary?._id ? editPrimary?.name : undefined,
        secondary_diagnosis: editSecondary?._id || undefined,
        secondary_diagnosis_name: !editSecondary?._id ? editSecondary?.name : undefined,
      });
      enqueueSnackbar(t('Diagnosis updated successfully'), { variant: 'success' });
      refetch();
      setEditing(false);
    } catch {
      enqueueSnackbar(t('Error updating diagnosis'), { variant: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const buildAutocompleteProps = (value, setValue, inputValue, setInputValue) => ({
    freeSolo: true,
    options: diagnosisData || [],
    value,
    inputValue,
    onInputChange: (_, newVal, reason) => {
      setInputValue(newVal);
      if (reason === 'input') {
        setValue(newVal.trim() ? { name: newVal.trim() } : null);
      }
    },
    onChange: (_, newValue) => {
      let normalized;
      if (typeof newValue === 'string') normalized = { name: newValue };
      else if (newValue?.inputValue) normalized = { name: newValue.inputValue };
      else normalized = newValue;
      setValue(normalized);
      setInputValue(newValue?.inputValue || newValue?.name || (typeof newValue === 'string' ? newValue : '') || '');
    },
    filterOptions: (options, params) => {
      const filtered = filter(options, params);
      const { inputValue: iv } = params;
      const exists = options.some((o) => o.name?.toLowerCase() === iv.toLowerCase());
      if (iv !== '' && !exists) {
        filtered.push({ inputValue: iv, name: `${t('Add')}: "${iv}"` });
      }
      return filtered;
    },
    getOptionLabel: (option) => {
      if (typeof option === 'string') return option;
      if (option.inputValue) return option.inputValue;
      return option.name || '';
    },
    isOptionEqualToValue: (option, val) => {
      if (!val) return false;
      return option._id && val._id ? option._id === val._id : option.name === val.name;
    },
  });

  const displayLevel = editing ? editLevel : patientDiagnosis?.level;
  const levelMeta = LEVEL_META[displayLevel] || { color: 'default', icon: '', barColor: 'success.main' };

  const primaryName =
    patientDiagnosis?.primary_diagnosis?.name || patientDiagnosis?.primary_diagnosis_name;
  const secondaryName =
    patientDiagnosis?.secondary_diagnosis?.name || patientDiagnosis?.secondary_diagnosis_name;

  const patientName = curLangAr
    ? patientDiagnosis?.patient?.name_arabic || patientDiagnosis?.patient?.name_english
    : patientDiagnosis?.patient?.name_english || patientDiagnosis?.patient?.name_arabic;

  const doctorName = curLangAr
    ? patientDiagnosis?.given_by?.employee?.name_arabic ||
      patientDiagnosis?.given_by?.name_arabic ||
      patientDiagnosis?.given_by?.name_english
    : patientDiagnosis?.given_by?.employee?.name_english ||
      patientDiagnosis?.given_by?.name_english ||
      patientDiagnosis?.given_by?.name_arabic;

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <Typography color="text.secondary">{t('Loading...')}</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        minHeight: '60vh',
        p: { xs: 2, md: 4 },
        bgcolor: '#f5f7fa',
      }}
    >
      <Stack
        component={Card}
        sx={{
          width: '100%',
          maxWidth: 760,
          borderRadius: 3,
          overflow: 'hidden',
          boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
        }}
      >
        {/* Coloured top bar */}
        <Box sx={{ height: 6, bgcolor: levelMeta.barColor }} />

        {/* Header */}
        <Box
          sx={{
            px: 4,
            pt: 3,
            pb: 2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 1,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                bgcolor: 'primary.lighter',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Iconify icon="solar:stethoscope-bold-duotone" width={24} color="primary.main" />
            </Box>
            <Typography variant="h5" fontWeight={700}>
              {t('Diagnosis Details')}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" color="text.secondary">
              {fDateTime(patientDiagnosis?.created_at)}
            </Typography>
            {!editing && (
              <Button
                size="small"
                variant="outlined"
                startIcon={<Iconify icon="solar:pen-bold-duotone" />}
                onClick={() => setEditing(true)}
              >
                {t('Edit')}
              </Button>
            )}
          </Box>
        </Box>

        <Divider />

        {/* Body */}
        <Box sx={{ px: 4, py: 3 }}>
          {editing ? (
            <Stack spacing={2.5}>
              <Autocomplete
                {...buildAutocompleteProps(editPrimary, setEditPrimary, primaryInput, setPrimaryInput)}
                renderInput={(params) => (
                  <TextField {...params} label={t('Primary Diagnosis')} size="small" />
                )}
              />
              <Autocomplete
                {...buildAutocompleteProps(editSecondary, setEditSecondary, secondaryInput, setSecondaryInput)}
                renderInput={(params) => (
                  <TextField {...params} label={t('Secondary Diagnosis')} size="small" />
                )}
              />
              <TextField
                select
                size="small"
                label={t('Level')}
                value={editLevel}
                onChange={(e) => setEditLevel(e.target.value)}
                fullWidth
              >
                <MenuItem value="low">{t('Low')}</MenuItem>
                <MenuItem value="medium">{t('Medium')}</MenuItem>
                <MenuItem value="high">{t('High')}</MenuItem>
                <MenuItem value="critical">{t('Critical')}</MenuItem>
              </TextField>
              <TextField
                label={t("Doctor's Note")}
                multiline
                rows={3}
                value={editNote}
                onChange={(e) => setEditNote(e.target.value)}
                fullWidth
                size="small"
              />
            </Stack>
          ) : (
            <>
              {displayLevel && (
                <Box sx={{ mb: 3 }}>
                  <Chip
                    icon={<Iconify icon={levelMeta.icon} width={16} />}
                    label={t(displayLevel.charAt(0).toUpperCase() + displayLevel.slice(1))}
                    color={levelMeta.color}
                    sx={{ fontWeight: 700, fontSize: 13, px: 1 }}
                  />
                </Box>
              )}

              <Box
                sx={{
                  mb: 3, p: 3, borderRadius: 2,
                  bgcolor: 'primary.lighter',
                  borderLeft: '5px solid', borderColor: 'primary.main',
                }}
              >
                <Typography
                  variant="caption" color="primary.main" fontWeight={700}
                  sx={{ mb: 0.5, display: 'block' }}
                >
                  {t('Primary Diagnosis')}
                </Typography>
                <Typography variant="h6" fontWeight={700}>
                  {primaryName || '—'}
                </Typography>
              </Box>

              {secondaryName && (
                <Box
                  sx={{
                    mb: 3, p: 3, borderRadius: 2,
                    bgcolor: 'warning.lighter',
                    borderLeft: '5px solid', borderColor: 'warning.main',
                  }}
                >
                  <Typography
                    variant="caption" color="warning.dark" fontWeight={700}
                    sx={{ mb: 0.5, display: 'block' }}
                  >
                    {t('Secondary Diagnosis')}
                  </Typography>
                  <Typography variant="h6" fontWeight={700}>
                    {secondaryName}
                  </Typography>
                </Box>
              )}

              {patientDiagnosis?.note && (
                <Box
                  sx={{
                    mb: 3, p: 2.5, borderRadius: 2,
                    bgcolor: '#fafafa', borderLeft: '4px solid #4CAF50',
                  }}
                >
                  <Typography
                    variant="caption" color="text.secondary" fontWeight={700}
                    sx={{ mb: 0.5, display: 'block' }}
                  >
                    {t("Doctor's Note")}
                  </Typography>
                  <Typography color="text.primary" sx={{ lineHeight: 1.8 }}>
                    {patientDiagnosis.note}
                  </Typography>
                </Box>
              )}

              <Divider sx={{ my: 2.5 }} />

              <InfoRow label={t('Patient')} value={patientName} />
              <InfoRow label={t('Given By')} value={doctorName} />
              <InfoRow
                label={t('Appointment')}
                value={patientDiagnosis?.appointment?.appointment_number}
              />
            </>
          )}
        </Box>

        {/* Footer */}
        <Box
          sx={{
            px: 4, py: 2.5,
            bgcolor: '#fafafa',
            borderTop: '1px solid #eee',
            display: 'flex',
            gap: 2,
          }}
        >
          {editing ? (
            <>
              <Button
                variant="contained"
                onClick={handleSave}
                disabled={saving}
                startIcon={<Iconify icon="solar:diskette-bold-duotone" />}
              >
                {saving ? t('Saving...') : t('Save')}
              </Button>
              <Button
                variant="outlined"
                color="inherit"
                onClick={() => { setEditing(false); setPrimaryInput(primaryName || ''); setSecondaryInput(secondaryName || ''); }}
                disabled={saving}
              >
                {t('Cancel')}
              </Button>
            </>
          ) : (
            <Button
              variant="text"
              onClick={() => navigate(-1)}
              startIcon={<Iconify icon="icon-park:back" />}
            >
              {t('Back')}
            </Button>
          )}
        </Box>
      </Stack>
    </Box>
  );
}
