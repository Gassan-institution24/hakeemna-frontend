import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useSnackbar } from 'notistack';
import { useForm, useFieldArray } from 'react-hook-form';

import {
  Box,
  Card,
  Stack,
  Button,
  Divider,
  Container,
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
import {
  RHFEditor,
  RHFUpload,
  RHFCheckbox,
  RHFTextField,
  RHFDatePicker,
} from 'src/components/hook-form';

export default function PatientUpload({ patient }) {
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

  const defaultDrug = {
    unit_service: employee?.unit_service?._id,
    patient: patient?.patient?._id,
    unit_service_patient: patient?._id,
    medicines: null,
    Frequency_per_day: '',
    Start_time: '',
    End_time: '',
    Doctor_Comments: '',
  };

  const methods = useForm({
    defaultValues: {
      drugs: [defaultDrug],
    },
  });

  const { control, watch, setValue } = methods;
  const values = watch();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'drugs',
  });

  const appendDrug = () => {
    append(defaultDrug);
    setMedSerach()
  };

  const removeDrug = (index) => {
    remove(index);
    setloading(true)
    setTimeout(() => {
      setloading(false)
    }, 100)
  };

  const handleDrop = (acceptedFile, name) => {
    const newFile = acceptedFile;
    setValue(name, newFile);
  };

  const chronicChange = (index) => {
    if (!values.drugs[index].chronic) {
      setValue(`drugs[${index}].Start_time`, null);
      setValue(`drugs[${index}].End_time`, null);
    }
    setValue(`drugs[${index}].chronic`, !values.drugs[index].chronic);
  };

  const handleSubmit = async (table) => {
    try {
      if (table === 'medical_report') {
        if (!values.medical_report_description && !values.medical_report_file) {
          enqueueSnackbar(t('no data submitted'), { variant: 'error' });
          return;
        }
        const formData = new FormData();
        if (patient?.patient?._id) {
          formData.append('patient', patient?.patient?._id);
        }
        if (patient?._id) {
          formData.append('unit_service_patient', patient?._id);
        }
        formData.append('unit_service', employee?.unit_service?._id);
        formData.append('employee', employee?._id);
        formData.append('description', values.medical_report_description);
        values.medical_report_file?.forEach((one, idx) => {
          formData.append(`file[${idx}]`, one);
        });
        await axiosInstance.post(endpoints.medicalreports.all, formData);
        setValue('medical_report_file', null);
        setValue('medical_report_description', null);
      } else if (table === 'patient_record') {
        if (!values.patient_record_description && !values.patient_record_file) {
          enqueueSnackbar(t('no data submitted'), { variant: 'error' });
          return;
        }
        const formData = new FormData();
        if (patient?.patient?._id) {
          formData.append('patient', patient?.patient?._id);
        }
        if (patient?._id) {
          formData.append('unit_service_patient', patient?._id);
        }
        formData.append('unit_service', employee?.unit_service?._id);
        formData.append('employee', employee?._id);
        formData.append('description', values.patient_record_description);
        values.patient_record_file?.forEach((one, idx) => {
          formData.append(`file[${idx}]`, one);
        });
        await axiosInstance.post(endpoints.doctorreport.all, formData);
        setValue('patient_record_file', null);
        setValue('patient_record_description', null);
      } else if (table === 'sick_leave') {
        if (!values.start_date || !values.end_date) {
          enqueueSnackbar(t('no data submitted'), { variant: 'error' });
          return;
        }
        await axiosInstance.post(endpoints.sickleave.all, {
          patient: patient?.patient?._id,
          unit_service_patient: patient?._id,
          unit_service: employee?.unit_service?._id,
          employee: employee?._id,
          Medical_sick_leave_start: values.start_date,
          Medical_sick_leave_end: values.end_date,
          description: values.sick_leave_description,
        });
        setValue('start_date', null);
        setValue('end_date', null);
        setValue('sick_leave_description', null);
      } else if (table === 'prescription') {
        setloading(true)
        await axiosInstance.post(endpoints.prescription.all, values.drugs);
        setValue('drugs', [defaultDrug]);
        setloading(false)
      }
      // eslint-disable-next-line
      enqueueSnackbar(t(table.replace(/_/g, ' ')) + ' ' + t('added successfully'));
    } catch (e) {
      enqueueSnackbar(curLangAr ? e.arabic_message || e.message : e.message, {
        variant: 'error',
      });
    }
  };

  return (
    <Container maxWidth="xl">
      <FormProvider methods={methods}>
        <Card sx={{ p: 2, mb: 4 }}>
          <Typography variant="subtitle1">{t('prescription')}</Typography>
          {!loading && fields.map((one, index) => (
            <Stack
              direction="row"
              flexWrap="wrap"
              alignItems="center"
              rowGap={2}
              columnGap={1}
              mt={2}
            >
              <Autocomplete
                sx={{ minWidth: 300, flex: 1 }}
                options={medicinesData}
                onChange={(event, newValue) => setValue(`drugs[${index}].medicines`, newValue?._id)}
                getOptionLabel={(option) => option.trade_name || ''}
                onBlur={() => setMedSerach()}
                onInputChange={(event, newInputValue) => {
                  setMedSerach(newInputValue);
                }}
                renderInput={(params) => (
                  <TextField {...params} label={t('medicine')} variant="outlined" />
                )}
              />
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
        <Box
          rowGap={4}
          columnGap={4}
          display="grid"
          gridTemplateColumns={{
            xs: 'repeat(1, 1fr)',
            md: 'repeat(2, 1fr)',
          }}
        >
          <Card sx={{ p: 2 }}>
            <Typography variant="subtitle1">{t('patient record')}</Typography>
            <RHFEditor
              lang="en"
              name="patient_record_description"
              label={t('description')}
              sx={{ mb: 2, mt: 2, textTransform: 'lowercase' }}
            />
            <RHFUpload
              multiple
              fullWidth
              name="patient_record_file"
              margin="dense"
              sx={{ mb: 2 }}
              variant="outlined"
              onDrop={(file) => handleDrop(file, 'patient_record_file')}
            />
            <Stack direction="row" justifyContent="flex-end">
              <Button variant="contained" onClick={() => handleSubmit('patient_record')}>
                {t('save')}
              </Button>
            </Stack>
          </Card>
          <Card sx={{ p: 2 }}>
            <Typography variant="subtitle1">{t('medical report')}</Typography>
            <RHFEditor
              lang="en"
              name="medical_report_description"
              label={t('description')}
              sx={{ mb: 2, mt: 2, textTransform: 'lowercase' }}
            />
            <RHFUpload
              multiple
              fullWidth
              name="medical_report_file"
              margin="dense"
              sx={{ mb: 2 }}
              variant="outlined"
              onDrop={(file) => handleDrop(file, 'medical_report_file')}
            />
            <Stack direction="row" justifyContent="flex-end">
              <Button variant="contained" onClick={() => handleSubmit('medical_report')}>
                {t('save')}
              </Button>
            </Stack>
          </Card>

          <Card sx={{ p: 2 }}>
            <Stack gap={2}>
              <Typography variant="subtitle1">{t('sick leave')}</Typography>
              <RHFDatePicker name="start_date" label={t('start date')} />
              <RHFDatePicker name="end_date" label={t('end date')} />
              <RHFEditor
                lang="en"
                name="sick_leave_description"
                label={t('description')}
                sx={{ textTransform: 'lowercase' }}
              />
              <Stack direction="row" justifyContent="flex-end">
                <Button variant="contained" onClick={() => handleSubmit('sick_leave')}>
                  {t('save')}
                </Button>
              </Stack>
            </Stack>
          </Card>
        </Box>
      </FormProvider>
    </Container>
  );
}
PatientUpload.propTypes = {
  patient: PropTypes.object,
};
