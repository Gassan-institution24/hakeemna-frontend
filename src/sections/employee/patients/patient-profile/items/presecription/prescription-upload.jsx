import * as yup from 'yup';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, useFieldArray } from 'react-hook-form';
import React, { useMemo, useState, useEffect } from 'react';

import {
  Card,
  Stack,
  Button,
  Divider,
  TextField,
  IconButton,
  Typography,
  Autocomplete,
} from '@mui/material';

import { useDebounce } from 'src/hooks/use-debounce';

import axiosInstance, { endpoints } from 'src/utils/axios';

import { useGetMedicines } from 'src/api';
import { useAuthContext } from 'src/auth/hooks';
import { useLocales, useTranslate } from 'src/locales';

import Iconify from 'src/components/iconify';
import FormProvider from 'src/components/hook-form/form-provider';
import { RHFCheckbox, RHFTextField, RHFDatePicker } from 'src/components/hook-form';

export default function PrescriptionUpload({ patient, refetch }) {
  const { t } = useTranslate();
  const { user } = useAuthContext();

  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const { enqueueSnackbar } = useSnackbar();

  const [medSerach, setMedSerach] = useState();
  const [loading, setloading] = useState(false);

  const debouncedQuery = useDebounce(medSerach);

  const { medicinesData } = useGetMedicines({
    select: 'trade_name concentration',
    search: debouncedQuery,
  });

  const employee = user?.employee?.employee_engagements?.[user.employee.selected_engagement];

  const defaultDrug = useMemo(
    () => ({
      unit_service: employee?.unit_service?._id,
      employee: user?.employee?._id,
      patient: patient?.patient?._id,
      unit_service_patient: patient?._id,
      medicines: null,
      Frequency_per_day: '',
      Start_time: null,
      End_time: null,
      Doctor_Comments: '',
    }),
    [employee?.unit_service, user?.employee, patient]
  );

  const methods = useForm({
    defaultValues: { drugs: [defaultDrug] },
    mode: 'all',
    resolver: yupResolver(
      yup.object().shape({
        drugs: yup.array().of(
          yup.object().shape({
            medicines: yup.string().required(t('required field')),
            Frequency_per_day: yup.string(),
            Start_time: yup.date().nullable(),
            End_time: yup.date().nullable(),
            Doctor_Comments: yup.string(),
          })
        ),
      })
    ),
  });

  const {
    control,
    watch,
    setValue,
    formState: { errors },
  } = methods;
  const values = watch();

  const { fields, append, remove } = useFieldArray({ control, name: 'drugs' });

  const appendDrug = () => {
    append(defaultDrug);
    setMedSerach();
  };

  const removeDrug = (index) => {
    remove(index);
    setloading(true);
    setTimeout(() => {
      setloading(false);
    }, 100);
  };

  const chronicChange = (index) => {
    if (!values.drugs[index].chronic) {
      setValue(`drugs[${index}].Start_time`, null);
      setValue(`drugs[${index}].End_time`, null);
    }
    setValue(`drugs[${index}].chronic`, !values.drugs[index].chronic);
  };

  const handleSubmit = methods.handleSubmit(async (data) => {
    try {
      if (!values.drugs?.length || values.drugs.some((one) => !one.medicines)) {
        enqueueSnackbar(t('please choose medicine'), { variant: 'error' });
        return;
      }
      setloading(true);
      await axiosInstance.post(endpoints.prescription.all, values.drugs);
      setValue('drugs', [defaultDrug]);
      setloading(false);
      refetch();
      enqueueSnackbar(t('prescription added successfully'));
    } catch (e) {
      enqueueSnackbar(curLangAr ? e.arabic_message || e.message : e.message, { variant: 'error' });
    }
  });

  useEffect(() => {
    setValue('drugs', [defaultDrug]);
  }, [defaultDrug, setValue]);
  return (
    <FormProvider methods={methods}>
      <Card sx={{ p: 2, mb: 4 }}>
        <Typography variant="subtitle1">{t('prescription')}</Typography>
        {!loading &&
          fields.map((one, index) => (
            <Stack direction="row" flexWrap="wrap" rowGap={2} columnGap={1} mt={2}>
              <Stack>
                <Autocomplete
                  sx={{
                    minWidth: 300,
                    flex: 1,
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: errors.drugs?.[index]?.medicines ? 'error.main' : '',
                      },
                    },
                  }}
                  options={medicinesData}
                  onChange={(event, newValue) =>
                    setValue(`drugs[${index}].medicines`, newValue?._id)
                  }
                  // eslint-disable-next-line
                  getOptionLabel={(option) => option.trade_name + ' ' + option.concentration || ''}
                  onBlur={() => setMedSerach()}
                  onInputChange={(event, newInputValue) => {
                    setMedSerach(newInputValue);
                  }}
                  renderInput={(params) => (
                    <TextField {...params} label={t('medicine')} variant="outlined" />
                  )}
                />
                <Typography variant="caption" sx={{ color: 'error.main' }}>
                  {errors.drugs?.[index]?.medicines?.message}
                </Typography>
              </Stack>
              <RHFTextField
                sx={{ minWidth: 350, flex: 1 }}
                name={`drugs[${index}].Frequency_per_day`}
                label={t('frequency')}
              />
              <RHFDatePicker
                sx={{ minWidth: 200, flex: 1 }}
                name={`drugs[${index}].Start_time`}
                label={t('start date')}
              />
              <RHFDatePicker
                sx={{ minWidth: 200, flex: 1 }}
                name={`drugs[${index}].End_time`}
                label={t('end date')}
                shouldDisableDate={(date) => date < new Date(watch(`drugs[${index}].Start_time`))}
              />
              <RHFTextField
                sx={{ minWidth: 350, flex: 1 }}
                name={`drugs[${index}].Doctor_Comments`}
                label={t('doctor comment')}
              />
              <RHFCheckbox
                onChange={() => chronicChange(index)}
                sx={{ minWidth: 300, flex: 1 }}
                name={`drugs[${index}].chronic`}
                label={t('chronic')}
              />
              <IconButton color="error" onClick={() => removeDrug(index)}>
                <Iconify width={25} icon="mi:delete" />
              </IconButton>
            </Stack>
          ))}
        <Divider sx={{ mt: 2 }} />
        <Button color="success" onClick={appendDrug}>
          <Iconify width={20} icon="ri:add-line" />
          {t('add')}
        </Button>
        <Stack alignItems="end">
          <Button variant="contained" onClick={() => handleSubmit('prescription')} sx={{ mt: 2 }}>
            {t('save')}
          </Button>
        </Stack>
      </Card>
    </FormProvider>
  );
}
PrescriptionUpload.propTypes = { patient: PropTypes.object, refetch: PropTypes.func };
