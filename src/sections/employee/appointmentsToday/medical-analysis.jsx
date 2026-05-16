import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { enqueueSnackbar } from 'notistack';
import React, { useState, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller } from 'react-hook-form';

import {
  Box,
  Stack,
  Button,
  Dialog,
  Divider,
  TextField,
  Typography,
  DialogTitle,
  Autocomplete,
  DialogActions,
  DialogContent,
} from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import axiosInstance, { endpoints } from 'src/utils/axios';

import { useTranslate } from 'src/locales';
import { useAuthContext } from 'src/auth/hooks';
import { useGetFavoriteMedicalAnalysis } from 'src/api/doctor_favorite';
import { useGetMedicalAnalysis, useGeEntranceMedicalAnalysis } from 'src/api/medical_analysis';

import Iconify from 'src/components/iconify';
import FormProvider, { RHFTextField } from 'src/components/hook-form';

export default function MedicalAnalysis({ Entrance }) {
  const { user } = useAuthContext();
  const router = useRouter();
  const { medicalAnalysis, refetch } = useGeEntranceMedicalAnalysis(Entrance?._id);
  const prescriptionDialog = useBoolean();
  const saveDialog = useBoolean();
  const { favoriteMedicalAnalysis, refetch: refetchFavorites } = useGetFavoriteMedicalAnalysis();

  const { medicalAnalysisData } = useGetMedicalAnalysis();
  const { t } = useTranslate();
  const [hoveredButtonId, setHoveredButtonId] = useState(null);
  const [medicalAnalyses, setMedicalAnalyses] = useState([{ id: 0 }]);
  const [favName, setFavName] = useState('');
  const [favNameAr, setFavNameAr] = useState('');
  const [selectedFavorite, setSelectedFavorite] = useState(null);

  const handleHover = (hoveredId) => {
    setHoveredButtonId(hoveredId);
  };
  const handleMouseOut = () => {
    setHoveredButtonId(null);
  };
  const handleViewClick = (idd) => {
    router.push(paths.employee.medicalAnalysis(idd));
  };

  const addMedicalAnalysisField = () => {
    const newItem = { id: medicalAnalyses.length };

    setMedicalAnalyses((prev) => [...prev, newItem]);

    setValue(`medical_analysis[${medicalAnalyses.length}]`, {
      medical_analysis: null,
      Doctor_Comments: '',
    });
  };

 const removeMedicalAnalysisField = (id) => {
  const currentValues = methods.getValues('medical_analysis') || [];

  const updatedValues = currentValues.filter((_, index) => index !== id);

  setValue('medical_analysis', updatedValues, {
    shouldValidate: true,
  });

  setMedicalAnalyses(updatedValues.map((_, index) => ({ id: index })));
};

  const medicalAnalysisSchema = Yup.object().shape({
    employee: Yup.string(),
    patient: Yup.string(),
    entrance_mangament: Yup.string(),
    Doctor_Comments: Yup.string(),
    medical_analysis: Yup.array().of(
      Yup.object().shape({
        medical_analysis: Yup.string().required('Required'),
        Doctor_Comments: Yup.string(),
      })
    ),
  });

  const defaultValues = {
    medical_analysis: [
      {
        employee: user?.employee?._id || '',
        patient: Entrance?.patient?._id || '',
        unit_service:
          user?.employee?.employee_engagements?.[user.employee.selected_engagement]?.unit_service
            ?._id,
        unit_service_patient: Entrance?.unit_service_patient,
        entrance_mangament: Entrance?._id || '',
        medical_analysis: null,
        Doctor_Comments: '',
      },
    ],
  };

  const methods = useForm({
    mode: 'all',
    resolver: yupResolver(medicalAnalysisSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    handleSubmit,
    control,
    setValue,
    formState: { isSubmitting },
  } = methods;

  const removeMedicalAalysis = async (IdToremove) => {
    await axiosInstance.delete(
      endpoints.medicalAnalysisPatient.one(Entrance?.unit_service_patient, IdToremove)
    );
    const historyId = localStorage.getItem(`historyId${Entrance?.appointmentId}`);
    await axiosInstance.patch(endpoints.history.remove_id(historyId), {
      type: 'medicalAnalysis',
      id: IdToremove,
    });

    enqueueSnackbar(t('Field removed successfully'), { variant: 'success' });
    refetch();
    reset();
  };

  const onSubmit = async (data) => {
    try {
      const historyId = localStorage.getItem(`historyId${Entrance?.appointmentId}`);

      const payload = {
        employee: user?.employee?._id,
        patient: Entrance?.patient?._id,
        unit_service:
          user?.employee?.employee_engagements?.[user.employee.selected_engagement]?.unit_service
            ?._id,
        unit_service_patient: Entrance?.unit_service_patient,
        entrance_mangament: Entrance?._id,
        appointment: Entrance?.appointmentId,
        medical_analysis: data.medical_analysis,
      };

      const response = await axiosInstance.post(endpoints.medicalAnalysisPatient.all, payload);

      await axiosInstance.patch(endpoints.history.one(historyId), {
        medical_analysis: true,
        medicalAnalysisId: response.data._id,
      });

      enqueueSnackbar(t('Medical analysis added successfully'), {
        variant: 'success',
      });

      prescriptionDialog.onFalse();
      refetch();
      reset();
      setMedicalAnalyses([{ id: 0 }]);
    } catch (error) {
      console.error(error);
      enqueueSnackbar(t('Error uploading data'), {
        variant: 'error',
      });
    }
  };
  const handleSaveFavorite = async () => {
    if (!favName.trim() || !favNameAr.trim()) {
      enqueueSnackbar(t('Please enter favorite name in both languages'), { variant: 'warning' });
      return;
    }
    const currentValues = methods.getValues('medical_analysis') || [];
    const medicalAnalysisIds = currentValues.map((item) => item.medical_analysis).filter(Boolean);
    if (!medicalAnalysisIds.length) {
      enqueueSnackbar(t('Select at least one medical analysis first'), { variant: 'warning' });
      return;
    }
    try {
      await axiosInstance.post(endpoints.favoriteMedicalAnalysis.all, {
        favorite_name: favName.trim(),
        favorite_name_ar: favNameAr.trim(),
        medical_analysis: medicalAnalysisIds,
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

  const handleCloseDialog = () => {
    reset({
      medical_analysis: [
        {
          employee: user?.employee?._id || '',
          patient: Entrance?.patient?._id || '',
          unit_service:
            user?.employee?.employee_engagements?.[user.employee.selected_engagement]?.unit_service
              ?._id,
          unit_service_patient: Entrance?.unit_service_patient,
          entrance_mangament: Entrance?._id || '',
          medical_analysis: null,
          Doctor_Comments: '',
        },
      ],
    });

    setMedicalAnalyses([{ id: 0 }]);
    setSelectedFavorite(null);
    prescriptionDialog.onFalse();
  };
  useEffect(() => {
    reset({
      medical_analysis: [
        {
          employee: user?.employee?._id || '',
          patient: Entrance?.patient?._id || '',
          unit_service:
            user?.employee?.employee_engagements?.[user.employee.selected_engagement]?.unit_service
              ?._id,
          unit_service_patient: Entrance?.unit_service_patient,
          entrance_mangament: Entrance?._id || '',
          medical_analysis: null,
          Doctor_Comments: '',
        },
      ],
    });
  }, [user, Entrance, reset]);

  return (
    <>
      <Button variant="outlined" color="success" onClick={prescriptionDialog.onTrue} sx={{ m: 2 }}>
        {t('add medical analysis')}
        <Iconify icon="mingcute:add-line" />
      </Button>

      {medicalAnalysis?.map((info, i) => (
        <Box
          key={info?._id || i}
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
            {info?.medical_analysis?.map((item, index) => (
              <Typography key={index} variant="body2" color="text.secondary">
                {item?.medical_analysis?.name_english || item?.medical_analysis?.name_arabic}
              </Typography>
            ))}
          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button size="small" color="error" onClick={() => removeMedicalAalysis(info?._id)}>
              {t('Remove')} &nbsp; <Iconify icon="flat-color-icons:delete-database" />
            </Button>
            <Button
              size="small"
              onMouseOver={() => handleHover(info?._id)}
              onMouseOut={handleMouseOut}
              onClick={() => handleViewClick(info?._id)}
              sx={{ m: 0.5 }}
            >
              {t('View')} &nbsp;
              <Iconify icon={hoveredButtonId === info?._id ? 'emojione:eye' : 'tabler:eye-closed'} />
            </Button>
          </Box>
        </Box>
      ))}
      {/* Save as Favorite dialog */}
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

      <Dialog open={prescriptionDialog.value} onClose={handleCloseDialog}>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle sx={{ color: 'success.main', position: 'relative', top: '10px' }}>
            {t('add medical analysis')}
          </DialogTitle>
          <DialogContent>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
              <Autocomplete
                sx={{ flex: 1, minWidth: 250, my: 2 }}
                options={favoriteMedicalAnalysis || []}
                value={selectedFavorite}
                getOptionLabel={(option) =>
                  t('language') === 'ar' ? option.favorite_name_ar || '' : option.favorite_name || ''
                }
                onChange={(event, newValue) => {
                  setSelectedFavorite(newValue);
                  if (!newValue) return;
                  const favAnalyses = newValue.medical_analysis || [];
                  const formatted = favAnalyses.map((analysisId) => ({
                    employee: user?.employee?._id,
                    patient: Entrance?.patient?._id,
                    unit_service:
                      user?.employee?.employee_engagements?.[user.employee.selected_engagement]
                        ?.unit_service?._id,
                    unit_service_patient: Entrance?.unit_service_patient,
                    entrance_mangament: Entrance?._id,
                    medical_analysis: analysisId?._id || analysisId,
                    Doctor_Comments: '',
                  }));
                  setMedicalAnalyses(formatted.map((_, index) => ({ id: index })));
                  setValue('medical_analysis', formatted, { shouldValidate: true });
                }}
                renderInput={(params) => <TextField {...params} label={t('Select Favorite')} />}
              />
              {!selectedFavorite ? (
                <Button
                  size="small"
                  color="warning"
                  onClick={saveDialog.onTrue}
                  sx={{ whiteSpace: 'nowrap', mt: 1 }}
                >
                  <Iconify icon="mingcute:star-line" />
                </Button>
              ) : (
                <Button
                  size="small"
                  color="info"
                  onClick={() => router.push(paths.employee.medicalServices.medicalAnalysis.root)}
                  sx={{ whiteSpace: 'nowrap', mt: 1 }}
                >
                  <Iconify icon="solar:list-bold-duotone" sx={{ mr: 0.5 }} />
                  {t('Manage')}
                </Button>
              )}
            </Stack>
            <Divider sx={{ mb: 2 }} />
            {medicalAnalyses?.map((prescription, index) => (
              <div key={prescription.id}>
                <Autocomplete
                  sx={{ minWidth: 300, flex: 1, my: 2 }}
                  options={(medicalAnalysisData || []).filter((option) => {
                    const currentValues = watch('medical_analysis') || [];

                    return !currentValues.some(
                      (selected, i) => i !== index && selected?.medical_analysis === option._id
                    );
                  })}
                  value={
                    medicalAnalysisData?.find(
                      (item) => item._id === watch(`medical_analysis.${index}.medical_analysis`)
                    ) || null
                  }
                  onChange={(event, newValue) =>
                    setValue(`medical_analysis.${index}.medical_analysis`, newValue?._id || '', {
                      shouldValidate: true,
                    })
                  }
                  getOptionLabel={(option) =>
                    t('language') === 'ar' ? option.name_arabic : option.name_english
                  }
                  isOptionEqualToValue={(option, value) => option._id === value._id}
                  renderInput={(params) => (
                    <TextField {...params} label={t('medical analysis')} variant="outlined" />
                  )}
                />

                <Controller
                  name={`medical_analysis[${index}].Doctor_Comments`}
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <RHFTextField
                      {...field}
                      label={t('doctor comment')}
                      multiline
                      sx={{ mb: 2 }}
                      error={!!error}
                      helperText={error?.message}
                    />
                  )}
                />
                <Button
                  onClick={() => removeMedicalAnalysisField(prescription.id)}
                  sx={{ mt: 2, mb: 2 }}
                  variant="outlined"
                  disabled={medicalAnalyses.length === 1} // Disable if only one prescription
                >
                  {t('remove medical analysis')}
                </Button>

                {index === medicalAnalyses.length - 1 && (
                  <Button
                    onClick={addMedicalAnalysisField}
                    sx={{ ml: 2, bgcolor: 'success.main', display: 'inline' }}
                    variant="contained"
                  >
                    {t('Add more')}
                  </Button>
                )}
              </div>
            ))}
            <Divider />
          </DialogContent>
          <DialogActions>
            <Button variant="outlined" color="inherit" onClick={handleCloseDialog}>
              {t('Cancel')}
            </Button>
            <Button type="submit" loading={isSubmitting} variant="contained">
              {t('Upload')}
            </Button>
          </DialogActions>
        </FormProvider>
      </Dialog>
    </>
  );
}

MedicalAnalysis.propTypes = {
  Entrance: PropTypes.object,
};
