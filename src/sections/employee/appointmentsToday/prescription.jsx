import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { enqueueSnackbar } from 'notistack';
import React, { useState, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller } from 'react-hook-form';

import { DatePicker } from '@mui/x-date-pickers';
import {
  Button,
  Dialog,
  Divider,
  Checkbox,
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
import { useDebounce } from 'src/hooks/use-debounce';

import axiosInstance, { endpoints } from 'src/utils/axios';

import { useAuthContext } from 'src/auth/hooks';
import { useLocales, useTranslate } from 'src/locales';
import { useGetMedicines, useGeEntrancePrescription } from 'src/api';

import Iconify from 'src/components/iconify';
import FormProvider, { RHFTextField } from 'src/components/hook-form';

export default function Prescription({ Entrance }) {
  const { user } = useAuthContext();
  const router = useRouter();
  const { prescriptionData, refetch } = useGeEntrancePrescription(Entrance?._id);
  const prescriptionDialog = useBoolean();

  const [medSerach, setMedSerach] = useState();
  const debouncedQuery = useDebounce(medSerach);
  const { medicinesData } = useGetMedicines({
    select: 'trade_name concentration',
    search: debouncedQuery,
  });

  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';
  const [hoveredButtonId, setHoveredButtonId] = useState(null);
  const [prescriptions, setPrescriptions] = useState([{ id: 0 }]);

  const handleHover = (hoveredId) => {
    setHoveredButtonId(hoveredId);
  };
  const handleMouseOut = () => {
    setHoveredButtonId(null);
  };
  const handleViewClick = (idd) => {
    router.push(paths.employee.prescription(idd));
  };

  const addPrescriptionField = () => {
    const newPrescription = {
      id: prescriptions.length,
      employee: user?.employee?._id || '',
      work_group: Entrance?.work_group,
      patient: Entrance?.patient?._id || '',
      unit_service_patient: Entrance?.unit_service_patient,
      entrance_mangament: Entrance?._id || '',
      Start_time: new Date(),
      End_time: new Date(),
      Frequency_per_day: '',
      Num_days: 0,
      Doctor_Comments: '',
    };

    setPrescriptions((prevPrescriptions) => [...prevPrescriptions, newPrescription]);

    // Update form values directly
    setValue(`prescriptions[${prescriptions.length}]`, newPrescription);
  };

  const removePrescriptionField = (id) => {
    setPrescriptions((prevPrescriptions) =>
      prevPrescriptions.filter((prescription) => prescription.id !== id)
    );

    // Remove the field from the form state
    setValue(
      `prescriptions`,
      prescriptions.filter((prescription) => prescription.id !== id)
    );
  };

  const PrescriptionsSchema = Yup.object().shape({
    employee: Yup.string(),
    patient: Yup.string(),
    medicines: Yup.string(),
    Start_time: Yup.mixed(),
    End_time: Yup.mixed(),
    Frequency_per_day: Yup.string(),
    entrance_mangament: Yup.string(),
    Doctor_Comments: Yup.string(),
    chronic: Yup.boolean(),
    Drugs_report: Yup.string(),
    medical_report: Yup.string(),
  });

  const defaultValues = {
    prescriptions: [
      {
        employee: user?.employee?._id || '',
        patient: Entrance?.patient?._id || '',
        unit_service:
          user?.employee?.employee_engagements?.[user.employee.selected_engagement]?.unit_service
            ?._id,
        unit_service_patient: Entrance?.unit_service_patient,
        entrance_mangament: Entrance?._id || '',
        Start_time: new Date(),
        End_time: new Date(),
        Frequency_per_day: '',
        Num_days: 0,
        medicines: null,
        Doctor_Comments: '',
      },
    ],
  };

  const methods = useForm({
    mode: 'all',
    resolver: yupResolver(PrescriptionsSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { isSubmitting },
  } = methods;

  const removePrescription = async (IdToremove) => {
    await axiosInstance.delete(endpoints.prescription.one(IdToremove));
    const historyId = localStorage.getItem('historyId');
    await axiosInstance.patch(endpoints.history.remove_id(historyId), {
      type: 'prescription',
      id: IdToremove,
    });

    enqueueSnackbar(t('Field removed successfully'), { variant: 'success' });
    refetch();
    reset();
  };

  const watchStartTimes = watch('prescriptions')?.map((_, index) =>
    watch(`prescriptions[${index}].Start_time`)
  );
  const watchEndTimes = watch('prescriptions')?.map((_, index) =>
    watch(`prescriptions[${index}].End_time`)
  );

  useEffect(() => {
    watchStartTimes.forEach((startTime, index) => {
      const endTime = watchEndTimes[index];
      if (startTime && endTime) {
        const start = new Date(startTime);
        const end = new Date(endTime);
        const difference = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
        setValue(`prescriptions[${index}].Num_days`, difference > 0 ? difference : 0);
      }
    });
  }, [watchStartTimes, watchEndTimes, setValue]);

  const onSubmit = async (submitData) => {
    try {
      const prescriptionsToSubmit = submitData.prescriptions.map((prescription) => ({
        ...prescription,
      }));

      if (prescriptionDialog.value) {
        const historyId = localStorage.getItem('historyId');
        const prescription = await axiosInstance.post('/api/drugs', prescriptionsToSubmit);
        await axiosInstance.patch(`/api/entrance/${Entrance?._id}`, {
          Drugs_report_status: true,
        });
        axiosInstance.patch(endpoints.history.one(historyId), {
          prescription: true,
          prescriptionId: prescription?.data?._id,
        });
        enqueueSnackbar(t('Prescription uploaded successfully'), { variant: 'success' });
        prescriptionDialog.onFalse();
        refetch();
        reset();
        setPrescriptions([{ id: 0 }]); // Reset prescriptions to initial state
      }
    } catch (error) {
      console.error(error.message);
      enqueueSnackbar('Error uploading data', { variant: 'error' });
    }
  };

  useEffect(() => {
    reset({
      prescriptions: [
        {
          employee: user?.employee?._id || '',
          patient: Entrance?.patient?._id || '',
          unit_service:
            user?.employee?.employee_engagements?.[user.employee.selected_engagement]?.unit_service
              ?._id,
          unit_service_patient: Entrance?.unit_service_patient,
          entrance_mangament: Entrance?._id || '',
          Start_time: new Date(),
          End_time: new Date(),
          Frequency_per_day: '',
          Num_days: 0,
          medicines: null,
          Doctor_Comments: '',
        },
      ],
    });
  }, [user, Entrance, reset]);

  return (
    <>
      <Button variant="outlined" color="success" onClick={prescriptionDialog.onTrue} sx={{ m: 2 }}>
        {t('Add prescription')}
        <Iconify icon="mingcute:add-line" />
      </Button>
      {prescriptionData?.map((info, i) => (
        <Typography
          variant="h6"
          sx={{
            bgcolor: '#fff',
            m: 2,
            border: 2,
            borderRadius: 2,
            borderColor: '#EDEFF2',
            p: 2,
          }}
          key={i}
        >
          {info?.medicines?.map((medicineName, index) => (
            <ul
              style={{
                listStyleType: 'none',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <li key={index}>{medicineName?.medicines?.trade_name}</li>
            </ul>
          ))}

          <br />
          <Button
            onMouseOver={() => handleHover(info?._id)}
            onMouseOut={handleMouseOut}
            onClick={() => handleViewClick(info?._id)}
            sx={{ m: 1 }}
          >
            {t('View')} &nbsp;{' '}
            <Iconify icon={hoveredButtonId === info?._id ? 'emojione:eye' : 'tabler:eye-closed'} />
          </Button>

          <Button onClick={() => removePrescription(info?._id)}>
            {t('Remove')} &nbsp; <Iconify icon="flat-color-icons:delete-database" />
          </Button>
        </Typography>
      ))}
      <Dialog open={prescriptionDialog.value} onClose={prescriptionDialog.onFalse}>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle sx={{ color: 'success.main', position: 'relative', top: '10px' }}>
            {curLangAr ? 'اضافة وصفة طبية' : 'add prescription'}
          </DialogTitle>
          <DialogContent>
            {prescriptions?.map((prescription, index) => (
              <div key={prescription.id}>
                <Autocomplete
                  sx={{ minWidth: 300, flex: 1, my: 2 }}
                  options={medicinesData}
                  onBlur={() => setMedSerach()}
                  onChange={(event, newValue) =>
                    setValue(`prescriptions[${index}].medicines`, newValue?._id)
                  }
                  // eslint-disable-next-line
                  getOptionLabel={(option) => option.trade_name + ' ' + option.concentration || ''}
                  onInputChange={(event, newInputValue) => {
                    setMedSerach(newInputValue);
                  }}
                  renderInput={(params) => (
                    <TextField {...params} label={t('medicine')} variant="outlined" />
                  )}
                />
                <RHFTextField
                  name={`prescriptions[${index}].Frequency_per_day`}
                  label={t('Frequency per day')}
                  sx={{ mb: 2 }}
                />
                <RHFTextField
                  name={`prescriptions[${index}].Num_days`}
                  label={t('Number of days')}
                  sx={{ mb: 2 }}
                />

                <Controller
                  name={`prescriptions[${index}].Start_time`}
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <DatePicker
                      {...field}
                      label={t('Start time')}
                      sx={{ mb: 2 }}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error: !!error,
                          helperText: error?.message,
                        },
                      }}
                    />
                  )}
                />
                <Controller
                  name={`prescriptions[${index}].End_time`}
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <DatePicker
                      {...field}
                      label={t('End time')}
                      sx={{ mb: 2 }}
                      shouldDisableDate={(date) => {
                        const startTime = watch(`prescriptions[${index}].Start_time`);
                        return startTime && date < new Date(startTime);
                      }}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error: !!error,
                          helperText: error?.message,
                        },
                      }}
                    />
                  )}
                />

                <Controller
                  name={`prescriptions[${index}].Doctor_Comments`}
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

                <Controller
                  name={`prescriptions[${index}].chronic`}
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      {...field}
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                    />
                  )}
                />
                <Typography
                  sx={{
                    color: 'text.secondary',
                    mt: { md: -3, xs: -2.3 },
                    ml: { md: 8, xs: 4 },
                    typography: 'caption',
                    fontSize: { md: 15, xs: 10 },
                  }}
                >
                  {t('chronic')}
                </Typography>

                <Button
                  onClick={() => removePrescriptionField(prescription.id)}
                  sx={{ mt: 2, mb: 2 }}
                  variant="outlined"
                  disabled={prescriptions.length === 1} // Disable if only one prescription
                >
                  {t('Remove Prescription')}
                </Button>

                {index === prescriptions.length - 1 && (
                  <Button
                    onClick={addPrescriptionField}
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
            <Button variant="outlined" color="inherit" onClick={prescriptionDialog.onFalse}>
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

Prescription.propTypes = {
  Entrance: PropTypes.object,
};
