import React, { useState } from 'react';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { enqueueSnackbar } from 'notistack';
import { yupResolver } from '@hookform/resolvers/yup';

import {
  Box,
  Chip,
  Stack,
  Button,
  Dialog,
  Divider,
  MenuItem,
  TextField,
  Typography,
  DialogTitle,
  Autocomplete,
  DialogActions,
  DialogContent,
} from '@mui/material';

import { paths } from '../../../routes/paths';
import { useRouter } from '../../../routes/hooks';

import { useBoolean } from '../../../hooks/use-boolean';

import axiosInstance from '../../../utils/axios';
import Iconify from '../../../components/iconify';
import { useAuthContext } from '../../../auth/hooks';
import { useLocales, useTranslate } from '../../../locales';
import { useGetFavoriteDiagnosis } from '../../../api/doctor_favorite';
import { useGetdiagnosis, useGetEntranceDiagnosis } from '../../../api';
import FormProvider, { RHFTextField } from '../../../components/hook-form';

// ─── level → chip color ───────────────────────────────────────────────────────

const LEVEL_COLOR = {
  low: 'success',
  medium: 'warning',
  high: 'error',
  critical: 'error',
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function Diagnosis({ Entrance }) {
  const { user } = useAuthContext();
  const dialog = useBoolean();
  const router = useRouter();
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const { diagnosisData } = useGetdiagnosis();
  const { EntranceDiagnosis, refetch } = useGetEntranceDiagnosis(Entrance?._id);
  const { favoriteDiagnosis, refetch: refetchFavorites } = useGetFavoriteDiagnosis();

  const saveDialog = useBoolean();
  const [hoveredId, setHoveredId] = useState(null);
  const [favName, setFavName] = useState('');
  const [favNameAr, setFavNameAr] = useState('');
  const [selectedFavorite, setSelectedFavorite] = useState(null);

  const schema = Yup.object().shape({
    primary_diagnosis: Yup.object().required('Primary diagnosis is required'),
    secondary_diagnosis: Yup.object().nullable(),
    level: Yup.string(),
    note: Yup.string(),
  });

  const defaultValues = {
    primary_diagnosis: null,
    secondary_diagnosis: null,
    level: 'medium',
    note: '',
  };

  const methods = useForm({ resolver: yupResolver(schema), defaultValues });
  const { handleSubmit, setValue, watch, reset } = methods;

  // ── Fill form from a saved favorite list ─────────────────────────────────
  const handleSelectFavorite = (favorite) => {
    if (!favorite?.diagnoses?.length) return;
    const [first, second] = favorite.diagnoses;
    setValue('primary_diagnosis', first || null, { shouldValidate: true });
    setValue('secondary_diagnosis', second || null, { shouldValidate: true });
  };

  const handleSaveFavorite = async () => {
    const primary = watch('primary_diagnosis');
    const secondary = watch('secondary_diagnosis');
    if (!primary) {
      enqueueSnackbar(t('Select a primary diagnosis first'), { variant: 'warning' });
      return;
    }
    const diagnoses = [primary._id, secondary?._id].filter(Boolean);
    try {
      await axiosInstance.post('/api/favorite-diagnosis', {
        favorite_name: favName,
        favorite_name_ar: favNameAr,
        diagnoses,
      });
      enqueueSnackbar(t('Saved to favorites'), { variant: 'success' });
      saveDialog.onFalse();
      setFavName('');
      setFavNameAr('');
      refetchFavorites();
    } catch {
      enqueueSnackbar(t('Error saving favorite'), { variant: 'error' });
    }
  };

  const onSubmit = async (data) => {
    try {
      await axiosInstance.post('/api/patient-diagnosis', {
        primary_diagnosis: data.primary_diagnosis?._id,
        secondary_diagnosis: data.secondary_diagnosis?._id,
        appointment: Entrance?.appointmentId,
        entrance: Entrance?._id,
        unit_service_patient: Entrance?.unit_service_patient,
        patient: Entrance?.patient?._id,
        given_by: user?._id,
        level: data.level,
        note: data.note,
      });
      enqueueSnackbar(t('Diagnosis added successfully'), { variant: 'success' });
      refetch();
      dialog.onFalse();
      reset();
      setSelectedFavorite(null);
    } catch {
      enqueueSnackbar(t('Error saving diagnosis'), { variant: 'error' });
    }
  };

  const handleRemove = async (diagnosisId) => {
    try {
      await axiosInstance.patch(`/api/patient-diagnosis/${diagnosisId}`, { active: false });
      enqueueSnackbar(t('Removed successfully'), { variant: 'success' });
      refetch();
    } catch {
      enqueueSnackbar(t('Error removing diagnosis'), { variant: 'error' });
    }
  };

  const handleView = (diagnosisId) => {
    router.push(paths.employee.diagnosis(diagnosisId));
  };

  return (
    <>
      <Button variant="outlined" color="success" onClick={dialog.onTrue} sx={{ m: 2 }}>
        {t('Add Diagnosis')}
        <Iconify icon="mingcute:add-line" />
      </Button>

      {/* ── Existing diagnoses list ─────────────────────────────────────── */}
      {Array.isArray(EntranceDiagnosis) && EntranceDiagnosis.length > 0 && (
        <Box sx={{ px: 2 }}>
          {EntranceDiagnosis.map((item, i) => (
            <Box
              key={item?._id || i}
              sx={{
                bgcolor: '#fff',
                border: 2,
                borderRadius: 2,
                borderColor: '#EDEFF2',
                p: 2,
                mb: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 1,
              }}
            >
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle1" fontWeight={600}>
                  {item?.primary_diagnosis?.name || t('Diagnosis')}
                </Typography>

                {item?.secondary_diagnosis?.name && (
                  <Typography variant="body2" color="text.secondary">
                    {t('Secondary')}: {item.secondary_diagnosis.name}
                  </Typography>
                )}

                {item?.level && (
                  <Chip
                    label={t(item.level)}
                    color={LEVEL_COLOR[item.level] || 'default'}
                    size="small"
                    sx={{ mt: 0.5 }}
                  />
                )}
              </Box>

              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button size="small" color="error" onClick={() => handleRemove(item?._id)}>
                  {t('Remove')} &nbsp;
                  <Iconify icon="flat-color-icons:delete-database" />
                </Button>

                <Button
                  size="small"
                  onMouseOver={() => setHoveredId(item?._id)}
                  onMouseOut={() => setHoveredId(null)}
                  onClick={() => handleView(item?._id)}
                  sx={{ m: 0.5 }}
                >
                  {t('View')} &nbsp;
                  <Iconify icon={hoveredId === item?._id ? 'emojione:eye' : 'tabler:eye-closed'} />
                </Button>
              </Box>
            </Box>
          ))}
        </Box>
      )}

      {/* ── Save as Favorite dialog ─────────────────────────────────────── */}
      <Dialog open={saveDialog.value} onClose={saveDialog.onFalse}>
        <DialogTitle>{t('Save as Favorite')}</DialogTitle>
        <DialogContent sx={{ width: 360, pt: 1 }}>
          <TextField
            fullWidth
            label={t('Favorite Name (EN)')}
            value={favName}
            onChange={(e) => setFavName(e.target.value)}
            sx={{ mb: 2, mt: 1 }}
          />
          <TextField
            fullWidth
            label={t('Favorite Name (AR)')}
            value={favNameAr}
            onChange={(e) => setFavNameAr(e.target.value)}
            inputProps={{ dir: 'rtl' }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={saveDialog.onFalse}>{t('Cancel')}</Button>
          <Button variant="contained" color="warning" onClick={handleSaveFavorite}>
            {t('Save')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Add diagnosis dialog ────────────────────────────────────────── */}
      <Dialog
        open={dialog.value}
        onClose={() => { dialog.onFalse(); setSelectedFavorite(null); }}
      >
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle>{t('Add Diagnosis')}</DialogTitle>

          <DialogContent sx={{ width: 400 }}>
            {/* Favorite selector */}
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
              <Autocomplete
                sx={{ flex: 1 }}
                options={favoriteDiagnosis || []}
                value={selectedFavorite}
                getOptionLabel={(option) =>
                  curLangAr ? option.favorite_name_ar || '' : option.favorite_name || ''
                }
                onChange={(_, selected) => {
                  setSelectedFavorite(selected);
                  if (selected) handleSelectFavorite(selected);
                }}
                renderInput={(params) => (
                  <TextField {...params} label={t('Select Favorite')} sx={{ my: 2 }} />
                )}
              />
              {!selectedFavorite ? (
                <Button
                  size="small"
                  color="warning"
                  onClick={saveDialog.onTrue}
                  sx={{ whiteSpace: 'nowrap', mt: 1 }}
                >
                  <Iconify icon="mingcute:star-line" sx={{ mr: 0.5 }} />
                </Button>
              ) : (
                <Button
                  size="small"
                  color="info"
                  onClick={() => router.push(paths.employee.medicalServices.diagnosis.root)}
                  sx={{ whiteSpace: 'nowrap', mt: 1 }}
                >
                  <Iconify icon="solar:list-bold-duotone" sx={{ mr: 0.5 }} />
                  {t('Manage')}
                </Button>
              )}
            </Stack>
            <Divider sx={{ mb: 2 }} />

            <Autocomplete
              options={diagnosisData || []}
              value={watch('primary_diagnosis') || null}
              onChange={(_, newValue) =>
                setValue('primary_diagnosis', newValue, { shouldValidate: true })
              }
              getOptionLabel={(option) => option.name || ''}
              isOptionEqualToValue={(option, value) => option._id === value._id}
              renderInput={(params) => (
                <TextField {...params} label={t('Primary Diagnosis')} sx={{ my: 2 }} />
              )}
            />

            <Autocomplete
              options={diagnosisData || []}
              value={watch('secondary_diagnosis') || null}
              onChange={(_, newValue) =>
                setValue('secondary_diagnosis', newValue, { shouldValidate: true })
              }
              getOptionLabel={(option) => option.name || ''}
              isOptionEqualToValue={(option, value) => option._id === value._id}
              renderInput={(params) => (
                <TextField {...params} label={t('Secondary Diagnosis')} sx={{ mb: 2 }} />
              )}
            />

            <TextField
              select
              label={t('Level')}
              value={watch('level')}
              onChange={(e) => setValue('level', e.target.value)}
              fullWidth
              sx={{ mb: 2 }}
            >
              <MenuItem value="low">{t('Low')}</MenuItem>
              <MenuItem value="medium">{t('Medium')}</MenuItem>
              <MenuItem value="high">{t('High')}</MenuItem>
              <MenuItem value="critical">{t('Critical')}</MenuItem>
            </TextField>

            <RHFTextField name="note" label={t('Doctor Note')} multiline rows={3} />
          </DialogContent>

          <DialogActions>
            <Button onClick={() => { dialog.onFalse(); setSelectedFavorite(null); }}>{t('Cancel')}</Button>
            <Button type="submit" variant="contained">
              {t('Save')}
            </Button>
          </DialogActions>
        </FormProvider>
      </Dialog>
    </>
  );
}

Diagnosis.propTypes = {
  Entrance: PropTypes.object,
};
