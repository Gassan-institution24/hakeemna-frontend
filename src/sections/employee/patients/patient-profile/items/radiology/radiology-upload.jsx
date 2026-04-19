import * as yup from 'yup';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import React, { useMemo, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, useFieldArray } from 'react-hook-form';

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
import { useGetImagings } from 'src/api/imaging';
import { useLocales, useTranslate } from 'src/locales';
import { useGetFavoriteRadiology } from 'src/api/doctor_favorite';

import Iconify from 'src/components/iconify';
import { RHFTextField } from 'src/components/hook-form';
import FormProvider from 'src/components/hook-form/form-provider';

export default function RadiologyUpload({ patient, refetch }) {
  const { t } = useTranslate();
  const { user } = useAuthContext();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';
  const [tab, setTab] = useState(0);

  const { enqueueSnackbar } = useSnackbar();
  const { favoriteRadiology } = useGetFavoriteRadiology();

  const [loading, setloading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedFav, setSelectedFav] = useState(null);
  const dialogMethods = useForm({
    defaultValues: { radiology: [] },
  });

  const { imagingData } = useGetImagings();

  const employee = user?.employee?.employee_engagements?.[user.employee.selected_engagement];

  const defaultRadiology = useMemo(
    () => ({
      patient: patient?.patient?._id,
      radiology: null,
      Doctor_Comments: '',
    }),
    [patient?.patient?._id]
  );
  const schema = yup.object().shape({
    radiology: yup.array().of(
      yup.object().shape({
        radiology: yup.string().required(t('required field')),
        Doctor_Comments: yup.string(),
      })
    ),
  });

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: { radiology: [defaultRadiology] },
  });

  const {
    control,
    setValue,
    formState: { errors },
  } = methods;

  const { fields, append, remove } = useFieldArray({ control, name: 'radiology' });

  const appendDrug = () => {
    append(defaultRadiology);
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
      if (!data.radiology?.length || data.radiology.some((one) => !one.radiology)) {
        enqueueSnackbar(t('please choose radiology'), { variant: 'error' });
        return;
      }

      const payload = {
        unit_service_patient: patient?._id,
        patient: patient?.patient?._id,
        radiology: data.radiology.map((one) => ({
          radiology: one.radiology,
          Doctor_Comments: one.Doctor_Comments || '',
        })),
      };

      await axiosInstance.post(endpoints.radiologyPatient.all, payload);

      methods.reset({ radiology: [defaultRadiology] });

      refetch();
      enqueueSnackbar(t('radiology added successfully'));
    } catch (e) {
      enqueueSnackbar(curLangAr ? e.arabic_message || e.message : e.message, { variant: 'error' });
    }
  });
  const watchRadiology = methods.watch('radiology');

  return (
    <FormProvider methods={methods}>
      <Card sx={{ p: 2, mb: 4 }}>
        <Typography variant="subtitle1">{t('radiology')}</Typography>
        <Tabs value={tab} onChange={(e, v) => setTab(v)}>
          <Tab label={t('manual entry')} />
          {favoriteRadiology?.length && <Tab label={t('favorites')} />}
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
                        borderColor: errors.radiology?.[index]?.radiology ? 'error.main' : '',
                      },
                    },
                  }}
                  value={
                    imagingData?.find(
                      (item) => item._id === methods.watch(`radiology[${index}].radiology`)
                    ) || null
                  }
                  options={(imagingData || []).filter(
                    (option) =>
                      !watchRadiology?.some(
                        (selected, i) => i !== index && selected?.radiology === option._id
                      )
                  )}
                  onChange={(event, newValue) =>
                    setValue(`radiology[${index}].radiology`, newValue?._id, {
                      shouldValidate: true,
                    })
                  }
                  // eslint-disable-next-line
                  getOptionLabel={(option) => option.diagnostic_test}
                  renderInput={(params) => (
                    <TextField {...params} label={t('radiology')} variant="outlined" />
                  )}
                />
                <Typography variant="caption" sx={{ color: 'error.main' }}>
                  {errors.radiology?.[index]?.radiology?.message}
                </Typography>
              </Stack>
              <RHFTextField
                sx={{ minWidth: 350, flex: 1 }}
                name={`radiology[${index}].Doctor_Comments`}
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
              {favoriteRadiology?.map((fav) => (
                <ListItemButton
                  key={fav._id}
                  onClick={() => {
                    const mapped = fav.radiology.map((med) => ({
                      radiology: med._id,
                      Doctor_Comments: '',
                    }));

                    dialogMethods.reset({ radiology: mapped });
                    setSelectedFav(fav);
                    setOpenDialog(true);
                  }}
                >
                  <ListItemText
                    primary={curLangAr ? fav.favorite_name_ar : fav.favorite_name}
                    secondary={`${fav.radiology.length} ${t('radiology')}`}
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
            {dialogMethods.watch('radiology')?.map((one, index) => {
              const medInfo = selectedFav?.radiology?.[index];
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
                    {medInfo.diagnostic_test}
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
              const radiology = dialogMethods.getValues('radiology');

              const mappedDrugs = radiology.map((med) => ({
                unit_service: employee?.unit_service?._id,
                employee: user?.employee?._id,
                patient: patient?.patient?._id,
                unit_service_patient: patient?._id,
                ...med,
              }));

              await axiosInstance.post(endpoints.radiologyPatient.all, {
                unit_service_patient: patient?._id,
                patient: patient?.patient?._id,
                radiology: mappedDrugs.map((med) => ({
                  radiology: med.radiology,
                  Doctor_Comments: med.Doctor_Comments || '',
                })),
              });

              enqueueSnackbar(t('radiology added successfully'));
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
RadiologyUpload.propTypes = { patient: PropTypes.object, refetch: PropTypes.func };
