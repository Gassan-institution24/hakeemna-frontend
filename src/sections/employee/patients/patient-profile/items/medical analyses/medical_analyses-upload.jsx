import * as yup from 'yup';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import { useForm, useFieldArray } from 'react-hook-form';
import React, { useMemo, useState, useEffect } from 'react';

import {
  Tab,
  Box,
  Card,
  Tabs,
  List,
  Stack,
  Button,
  Dialog,
  Divider,
  TextField,
  IconButton,
  Typography,
  DialogTitle,
  Autocomplete,
  ListItemText,
  DialogContent,
  DialogActions,
  ListItemButton,
} from '@mui/material';

import axiosInstance, { endpoints } from 'src/utils/axios';

import { useAuthContext } from 'src/auth/hooks';
import { useLocales, useTranslate } from 'src/locales';
import { useGetMedicalAnalysis } from 'src/api/medicalAnalysis';
import { useGetFavoriteMedicalAnalysis } from 'src/api/doctorFavorite';

import Iconify from 'src/components/iconify';
import { RHFTextField } from 'src/components/hook-form';
import FormProvider from 'src/components/hook-form/form-provider';

export default function MedicalAnalysesUpload({ patient, refetch }) {
  const { t } = useTranslate();
  const { user } = useAuthContext();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';
  const [tab, setTab] = useState(0);

  const { enqueueSnackbar } = useSnackbar();
  const { favoriteMedicalAnalysis } = useGetFavoriteMedicalAnalysis();

  const [loading, setloading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedFav, setSelectedFav] = useState(null);
  const dialogMethods = useForm({
    defaultValues: { analyses: [] },
  });

  const { medicalAnalysisData } = useGetMedicalAnalysis();
  const employee = user?.employee?.employee_engagements?.[user.employee.selected_engagement];

  const defaultAnalysis = useMemo(
    () => ({
      medical_analysis: null,
      Doctor_Comments: '',
    }),
    []
  );

  const methods = useForm({
    defaultValues: { analyses: [defaultAnalysis] },
    analyses: yup.array().of(
      yup.object().shape({
        medical_analysis: yup.string().required(t('required field')),
        Doctor_Comments: yup.string(),
      })
    ),
  });

  const {
    control,
    setValue,
    formState: { errors },
  } = methods;

  const { fields, append, remove } = useFieldArray({ control, name: 'analyses' });

  const appendDrug = () => {
    append(defaultAnalysis);
  };

  const removeDrug = (index) => {
    remove(index);
    setloading(true);
    setTimeout(() => {
      setloading(false);
    }, 100);
  };

  const handleSubmit = methods.handleSubmit(async (data) => {
    try {
      if (!data.analyses?.length || data.analyses.some((one) => !one.medical_analysis)) {
        enqueueSnackbar(t('please choose medical analysis'), { variant: 'error' });
        return;
      }

      const payload = {
        unit_service_patient: patient?._id,
        medical_analyses: data.analyses.map((one) => ({
          medical_analysis: one.medical_analysis,
          Doctor_Comments: one.Doctor_Comments || '',
        })),
      };

      await axiosInstance.post(endpoints.medicalAnalysisPatient.all, payload);

      methods.reset({ analyses: [defaultAnalysis] });

      refetch();
      enqueueSnackbar(t('medical analysis added successfully'));
    } catch (e) {
      enqueueSnackbar(curLangAr ? e.arabic_message || e.message : e.message, { variant: 'error' });
    }
  });

  useEffect(() => {
    setValue('analyses', [defaultAnalysis]);
  }, [defaultAnalysis, setValue]);
  return (
    <FormProvider methods={methods}>
      <Card sx={{ p: 2, mb: 4 }}>
        <Typography variant="subtitle1">{t('medical analysis')}</Typography>
        <Tabs value={tab} onChange={(e, v) => setTab(v)}>
          <Tab label={t('manual entry')} />
          {favoriteMedicalAnalysis?.length && <Tab label={t('favorites')} />}
        </Tabs>
        {tab === 0 &&
          !loading &&
          fields.map((one, index) => (
            <Stack direction="row" flexWrap="wrap" rowGap={2} columnGap={1} mt={2}>
              <Stack>
                <Autocomplete
                  sx={{
                    minWidth: 300,
                    flex: 1,
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: errors.analyses?.[index]?.medicines ? 'error.main' : '',
                      },
                    },
                  }}
                  options={medicalAnalysisData}
                  onChange={(event, newValue) =>
                    setValue(`analyses[${index}].medical_analysis`, newValue?._id)
                  }
                  // eslint-disable-next-line
                  getOptionLabel={(option) =>
                    curLangAr ? option.name_arabic : option.name_english
                  }
                  renderInput={(params) => (
                    <TextField {...params} label={t('medical analysis')} variant="outlined" />
                  )}
                />
                <Typography variant="caption" sx={{ color: 'error.main' }}>
                  {errors.analyses?.[index]?.medicines?.message}
                </Typography>
              </Stack>
              <RHFTextField
                sx={{ minWidth: 350, flex: 1 }}
                name={`analyses[${index}].Doctor_Comments`}
                label={t('doctor comment')}
              />
              <IconButton color="error" onClick={() => removeDrug(index)}>
                <Iconify width={25} icon="mi:delete" />
              </IconButton>
            </Stack>
          ))}
        {tab === 1 && (
          <Box mt={2}>
            <List>
              {favoriteMedicalAnalysis?.map((fav) => (
                <ListItemButton
                  key={fav._id}
                  onClick={() => {
                    const mapped = fav.medical_analyses.map((med) => ({
                      medical_analysis: med._id,
                      Doctor_Comments: '',
                    }));

                    dialogMethods.reset({ analyses: mapped });
                    setSelectedFav(fav);
                    setOpenDialog(true);
                  }}
                >
                  <ListItemText
                    primary={curLangAr ? fav.favorite_name_ar : fav.favorite_name}
                    secondary={`${fav.medical_analyses.length} ${t('medical analysis')}`}
                  />
                </ListItemButton>
              ))}
            </List>
          </Box>
        )}
        {tab === 0 && (
          <>
            <Divider sx={{ mt: 2 }} />
            <Button color="success" onClick={appendDrug}>
              <Iconify width={20} icon="ri:add-line" />
              {t('add')}
            </Button>
            <Stack alignItems="end">
              <Button variant="contained" onClick={handleSubmit} sx={{ mt: 2 }}>
                {t('save')}
              </Button>
            </Stack>
          </>
        )}
      </Card>
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="lg" fullWidth>
        <DialogTitle>
          {curLangAr ? selectedFav?.favorite_name_ar : selectedFav?.favorite_name}
        </DialogTitle>

        <FormProvider methods={dialogMethods}>
          <DialogContent dividers>
            {dialogMethods.watch('analyses')?.map((one, index) => {
              const medInfo = selectedFav?.medical_analyses?.[index];
              return (
                <Card
                  key={index}
                  sx={{
                    p: 2,
                    mb: 3,
                    borderRadius: 2,
                    border: '1px solid #eee',
                  }}
                >
                  <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                    {curLangAr ? medInfo.name_arabic : medInfo.name_english}
                  </Typography>
                </Card>
              );
            })}
            <Divider sx={{ mb: 2 }} />
            {selectedFav?.note && (
              <Box px={3} pt={1}>
                <Typography variant="body2" color="text.secondary">
                  {selectedFav.note}
                </Typography>
                <Divider sx={{ mt: 2 }} />
              </Box>
            )}
          </DialogContent>
        </FormProvider>

        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>{t('cancel')}</Button>

          <Button
            variant="contained"
            onClick={async () => {
              const analyses = dialogMethods.getValues('analyses');

              const mappedDrugs = analyses.map((med) => ({
                unit_service: employee?.unit_service?._id,
                employee: user?.employee?._id,
                patient: patient?.patient?._id,
                unit_service_patient: patient?._id,
                ...med,
              }));

              await axiosInstance.post(endpoints.medicalAnalysisPatient.all, {
                unit_service_patient: patient?._id,
                medical_analyses: mappedDrugs.map((med) => ({
                  medical_analysis: med.medical_analysis,
                  Doctor_Comments: med.Doctor_Comments || '',
                })),
              });

              enqueueSnackbar(t('prescription added successfully'));
              setOpenDialog(false);
              refetch();
            }}
          >
            {t('save')}
          </Button>
        </DialogActions>
      </Dialog>
    </FormProvider>
  );
}
MedicalAnalysesUpload.propTypes = { patient: PropTypes.object, refetch: PropTypes.func };
