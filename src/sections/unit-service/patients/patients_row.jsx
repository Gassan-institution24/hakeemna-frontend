import * as Yup from 'yup';
import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import {
  Box,
  Button,
  Dialog,
  Divider,
  MenuItem,
  Typography,
  DialogTitle,
  DialogActions,
  DialogContent,
} from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';
import { useNewScreen } from 'src/hooks/use-new-screen';

import { addToCalendar } from 'src/utils/calender';
import axiosInstance, { endpoints } from 'src/utils/axios';

import { useAuthContext } from 'src/auth/hooks';
import { useLocales, useTranslate } from 'src/locales';
import {
  useGetAppointmentTypes,
  useGetUSActiveWorkGroups,
  useGetUSActiveWorkShifts,
  useGetUSActiveServiceTypes,
} from 'src/api';

import Iconify from 'src/components/iconify';
import FormProvider from 'src/components/hook-form/form-provider';
import { RHFSelect, RHFMultiSelect } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export default function CountriesTableRow({ row, selected }) {
  const { _id, sequence_number, nationality, name_english, name_arabic } = row;
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const router = useRouter();
  const newVisit = useBoolean();
  const { user } = useAuthContext();

  const { enqueueSnackbar } = useSnackbar();
  const { handleAddNew } = useNewScreen();

  const { appointmenttypesData } = useGetAppointmentTypes();
  const { serviceTypesData } = useGetUSActiveServiceTypes(
    user?.employee?.employee_engagements[user?.employee.selected_engagement]?.unit_service._id
  );
  const { workGroupsData } = useGetUSActiveWorkGroups(
    user?.employee?.employee_engagements[user?.employee.selected_engagement]?.unit_service?._id
  );
  const { workShiftsData } = useGetUSActiveWorkShifts(
    user?.employee?.employee_engagements[user?.employee.selected_engagement]?.unit_service._id
  );

  const renderPrimary = (
    <TableRow hover selected={selected}>
      <TableCell align="center">
        {String(nationality?.code).padStart(3, '0')}-{sequence_number}
      </TableCell>
      <TableCell
        sx={{
          cursor: 'pointer',
          color: '#3F54EB',
        }}
        onClick={() => router.push(paths.unitservice.patients.info(_id))}
        align="center"
      >
        {name_english}
      </TableCell>
      <TableCell
        sx={{
          cursor: 'pointer',
          color: '#3F54EB',
        }}
        onClick={() => router.push(paths.unitservice.patients.info(_id))}
        align="center"
      >
        {name_arabic}
      </TableCell>
      <TableCell align="center">
        <Button
          variant="contained"
          onClick={newVisit.onTrue}
          color="secondary"
          sx={{ fontSize: 13, borderRadius: 0, p: 0.2 }}
        >
          {t('new appointment')}
        </Button>
      </TableCell>
    </TableRow>
  );
  const NewUserSchema = Yup.object().shape({
    note: Yup.string(),
    work_shift: Yup.string().required(t('required field')),
    work_group: Yup.string().required(t('required field')),
    service_types: Yup.array(),
    appointment_type: Yup.string().required(t('required field')),
    start_time: Yup.date().required(t('required field')),
  });
  const defaultValues = {
    note: '',
    appointment_type: appointmenttypesData?.[0]?._id,
    start_time: new Date(),
    work_group: workGroupsData?.[0]?._id,
    work_shift: workShiftsData.filter((one) => {
      const currentDate = new Date();

      const startTime = new Date(currentDate);
      startTime.setHours(
        new Date(one.start_time).getHours(),
        new Date(one.start_time).getMinutes(),
        0,
        0
      );

      const endTime = new Date(currentDate);
      endTime.setHours(
        new Date(one.end_time).getHours(),
        new Date(one.end_time).getMinutes(),
        0,
        0
      );
      if (startTime.getTime() <= endTime.getTime()) {
        return (
          currentDate.getTime() >= startTime.getTime() && currentDate.getTime() < endTime.getTime()
        );
      }
      // If the shift crosses midnight
      const endTimeNextDay = new Date(endTime.getTime() + 24 * 60 * 60 * 1000);
      return (
        currentDate.getTime() >= startTime.getTime() ||
        currentDate.getTime() < endTimeNextDay.getTime()
      );
    })?.[0]?._id,
    service_types: [],
  };
  const methods = useForm({
    mode: 'onTouched',
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const { reset, handleSubmit } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      const { data: appointment } = await axiosInstance.post(endpoints.appointments.all, {
        appointment_type: data.appointment_type,
        start_time: new Date(),
        work_group: data.work_group,
        work_shift: data.work_shift,
        service_types: data.service_types,
        emergency: true,
        unit_service:
          user?.employee?.employee_engagements[user?.employee.selected_engagement]?.unit_service
            ?._id,
        department: workGroupsData.filter((item) => item._id === data.work_group)?.[0]?.department
          ?._id,
      });
      await axiosInstance.patch(endpoints.appointments.book(appointment?._id), {
        patient: _id,
        note: data.note,
        lang: curLangAr,
      });
      await addToCalendar(appointment);
      enqueueSnackbar(t('created successfully!'));
      newVisit.onFalse();

      reset();
    } catch (error) {
      enqueueSnackbar(
        curLangAr ? `${error.arabic_message}` || `${error.message}` : `${error.message}`,
        {
          variant: 'error',
        }
      );
      // refetch();
      console.error(error);
    }
  });

  useEffect(() => {
    reset({
      note: '',
      appointment_type: appointmenttypesData?.[0]?._id,
      start_time: new Date(),
      work_group: workGroupsData?.[0]?._id,
      work_shift: workShiftsData.filter((one) => {
        const currentDate = new Date();

        const startTime = new Date(currentDate);
        startTime.setHours(
          new Date(one.start_time).getHours(),
          new Date(one.start_time).getMinutes(),
          0,
          0
        );

        const endTime = new Date(currentDate);
        endTime.setHours(
          new Date(one.end_time).getHours(),
          new Date(one.end_time).getMinutes(),
          0,
          0
        );
        if (startTime.getTime() <= endTime.getTime()) {
          return (
            currentDate.getTime() >= startTime.getTime() &&
            currentDate.getTime() < endTime.getTime()
          );
        }
        // If the shift crosses midnight
        const endTimeNextDay = new Date(endTime.getTime() + 24 * 60 * 60 * 1000);
        return (
          currentDate.getTime() >= startTime.getTime() ||
          currentDate.getTime() < endTimeNextDay.getTime()
        );
      })?.[0]?._id,
      service_types: [],
    });
    // eslint-disable-next-line
  }, [workGroupsData, appointmenttypesData, user?.employee, workShiftsData]);

  return (
    <>
      {renderPrimary}
      <Dialog open={newVisit.value} onClose={newVisit.onFalse}>
        <FormProvider methods={methods} onSubmit={onSubmit}>
          <DialogTitle sx={{ mb: 2, textTransform: 'capitalize' }}>
            {t('new appointment')}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ p: 2, width: { md: 540, sm: 1 } }}>
              <Box
                sx={{ mb: 3 }}
                rowGap={3}
                columnGap={2}
                display="grid"
                gridTemplateColumns={{
                  xs: 'repeat(1, 1fr)',
                  sm: 'repeat(2, 1fr)',
                }}
              >
                <RHFSelect name="appointment_type" label={t('appointment type')}>
                  {appointmenttypesData.map((option, index, idx) => (
                    <MenuItem lang="ar" key={idx} value={option._id}>
                      {curLangAr ? option?.name_arabic : option?.name_english}
                    </MenuItem>
                  ))}
                </RHFSelect>
                <RHFSelect
                  name="work_shift"
                  label={t('work shift')}
                  PaperPropsSx={{ textTransform: 'capitalize' }}
                >
                  {workShiftsData &&
                    workShiftsData.map((option, index, idx) => (
                      <MenuItem lang="ar" key={idx} value={option._id}>
                        {curLangAr ? option?.name_arabic : option?.name_english}
                      </MenuItem>
                    ))}
                  <Divider />
                  <MenuItem
                    lang="ar"
                    sx={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                      gap: 1,
                      fontWeight: 600,
                      // color: 'error.main',
                    }}
                    onClick={() => handleAddNew(paths.unitservice.tables.workshifts.new)}
                  >
                    <Typography variant="body2" sx={{ color: 'info.main' }}>
                      {t('Add new')}
                    </Typography>
                    <Iconify icon="material-symbols:new-window-sharp" />
                  </MenuItem>
                </RHFSelect>
                <RHFSelect name="work_group" label={t('work group')}>
                  {workGroupsData.map((option, index, idx) => (
                    <MenuItem lang="ar" key={idx} value={option._id}>
                      {curLangAr ? option?.name_arabic : option?.name_english}
                    </MenuItem>
                  ))}
                  <Divider />
                  <MenuItem
                    lang="ar"
                    sx={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                      gap: 1,
                      fontWeight: 600,
                      // color: 'error.main',
                    }}
                    onClick={() => handleAddNew(paths.unitservice.tables.workgroups.new)}
                  >
                    <Typography variant="body2" sx={{ color: 'info.main' }}>
                      {t('Add new')}
                    </Typography>
                    <Iconify icon="material-symbols:new-window-sharp" />
                  </MenuItem>
                </RHFSelect>
              </Box>
              <RHFMultiSelect
                sx={{ width: 1 }}
                checkbox
                name="service_types"
                label={t('service types')}
                options={serviceTypesData}
                path={paths.unitservice.tables.services.new}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={newVisit.onFalse} variant="outlined" color="inherit">
              {t('Cancel')}
            </Button>
            <Button type="submit" variant="contained" sx={{ textTransform: 'capitalize' }}>
              {t('add')}
            </Button>
          </DialogActions>
        </FormProvider>
      </Dialog>
    </>
  );
}

CountriesTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
};
