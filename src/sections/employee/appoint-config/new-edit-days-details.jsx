import PropTypes from 'prop-types';
import { zonedTimeToUtc } from 'date-fns-tz';
import { useMemo, useState, useEffect, useCallback } from 'react';
import { Controller, useFieldArray, useFormContext } from 'react-hook-form';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import InputLabel from '@mui/material/InputLabel';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker';

import { paths } from 'src/routes/paths';

import { useBoolean } from 'src/hooks/use-boolean';
import { useNewScreen } from 'src/hooks/use-new-screen';

import { useUnitTime } from 'src/utils/format-time';

import { useAuthContext } from 'src/auth/hooks';
import { useLocales, useTranslate } from 'src/locales';
import { useGetAppointmentTypes, useGetUSActiveServiceTypes } from 'src/api';

import Iconify from 'src/components/iconify';
// import { LoadingScreen } from 'src/components/loading-screen';
import { RHFSelect, RHFTextField } from 'src/components/hook-form';

import NewEditDayAppointmentsDetails from './new-edit-days-appointments-details';

// ----------------------------------------------------------------------
export default function NewEditDayDetails({ setErrorMsg, appointTime }) {
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';
  const { myunitTime } = useUnitTime();

  const proccessing = useBoolean();

  const { handleAddNew } = useNewScreen();

  const weekDays = [
    { value: 'saturday', label: t('Saturday') },
    { value: 'sunday', label: t('Sunday') },
    { value: 'monday', label: t('Monday') },
    { value: 'tuesday', label: t('Tuesday') },
    { value: 'wednesday', label: t('Wednesday') },
    { value: 'thursday', label: t('Thursday') },
    { value: 'friday', label: t('Friday') },
  ];

  const { control, setValue, watch, setError, clearErrors } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'days_details',
  });

  const values = watch();

  const { user } = useAuthContext();

  const [showAppointments, setShowAppointments] = useState({});
  const [appointmentsNum, setAppointmentsNum] = useState({});
  const { appointmenttypesData } = useGetAppointmentTypes();
  const { serviceTypesData } = useGetUSActiveServiceTypes(
    user?.employee?.employee_engagements[user?.employee.selected_engagement]?.unit_service._id
  );

  const dayToCreate = useMemo(
    () =>
      weekDays.filter(
        (option) =>
          !values.weekend.includes(option.value) &&
          !values.days_details.some((detail) => detail.day === option.value)
      )[0]?.value,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [values.days_details, values.weekend]
  );

  const handleAdd = useCallback(() => {
    try {
      if (!dayToCreate) {
        throw Error('No valid date to create');
      }
      const defaultItem = {
        day: '',
        work_start_time: null,
        work_end_time: null,
        break_start_time: null,
        break_end_time: null,
        appointments: [],
        service_types: [],
        appointment_type: null,
      };
      const existingData = values.days_details
        ? values.days_details[values.days_details.length - 1]
        : [];
      const newItem = {
        ...defaultItem,
        ...existingData,
        day: dayToCreate,
      };
      append(newItem);
    } catch (e) {
      console.error(e);
      setErrorMsg(e.message);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.days_details, dayToCreate]);

  const handleRemove = (index) => {
    remove(index);
  };

  const processDayDetails = useCallback(
    (index) => {
      try {
        proccessing.onTrue();
        clearErrors();
        if (!values.appointment_time) {
          setValue(`days_details[${index}].appointments`, []);
          setError('appointment_time');
          proccessing.onFalse();
          return;
        }
        if (!values.days_details[index].work_start_time) {
          setValue(`days_details[${index}].appointments`, []);
          setError(`days_details[${index}].work_start_time`);
          proccessing.onFalse();
          return;
        }
        if (!values.days_details[index].work_end_time) {
          setValue(`days_details[${index}].appointments`, []);
          setError(`days_details[${index}].work_end_time`);
          proccessing.onFalse();
          return;
        }
        const results = [];
        const appointment_time = values.appointment_time * 60 * 1000;
        const currentDay = values.days_details[index];
        const work_start = new Date(currentDay.work_start_time).getTime();
        let work_end = new Date(currentDay.work_end_time).getTime();
        let break_start = currentDay.break_start_time
          ? new Date(currentDay.break_start_time).getTime()
          : null;
        let break_end = currentDay.break_end_time
          ? new Date(currentDay.break_end_time).getTime()
          : null;

        if (work_start >= work_end) {
          work_end += 24 * 60 * 60 * 1000;
        }
        if (break_start && work_start > break_start) {
          break_start += 24 * 60 * 60 * 1000;
        }
        if (break_start && break_end && break_start > break_end) {
          break_end += 24 * 60 * 60 * 1000;
        }
        let curr_start = work_start;
        while (curr_start + appointment_time <= work_end) {
          if (
            !break_start ||
            !break_end ||
            curr_start + appointment_time <= break_start ||
            curr_start >= break_end
          ) {
            results.push({
              appointment_type: currentDay.appointment_type,
              start_time: curr_start,
              online_available: true,
              service_types: currentDay.service_types,
            });
            curr_start += appointment_time;
          } else {
            curr_start += appointment_time;
          }
        }
        setValue(`days_details[${index}].appointments`, results);
        // setShowAppointments({
        //   ...showAppointments,
        //   [index]: true,
        // });
        proccessing.onFalse();
      } catch (e) {
        console.error(e);
        proccessing.onFalse();
        setErrorMsg(e.message);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [values.appointment_time, values.days_details]
  );

  const renderValues = useCallback(
    (selectedIds) => {
      const selectedItems = serviceTypesData?.filter((item) => selectedIds?.includes(item?._id));
      return selectedItems
        ?.map(
          (item) => (curLangAr ? item?.name_arabic : item?.name_english)
          // price += item?.Price_per_unit || 0
        )
        .join(', ');
      // setOverAllPrice(price)
      // return results.join(', ')
    },
    [serviceTypesData, curLangAr]
  );

  const appointEstimatedNum = useCallback(
    (index) => {
      const currentDay = values.days_details[index];
      if (currentDay?.appointments.length) {
        return currentDay?.appointments.length;
      }
      const appointment_time = values.appointment_time * 60 * 1000;
      const work_start = new Date(currentDay.work_start_time).getTime();
      let work_end = new Date(currentDay.work_end_time).getTime();
      let break_start = new Date(currentDay.break_start_time).getTime();
      let break_end = new Date(currentDay.break_end_time).getTime();
      if (work_start > work_end) {
        work_end += 24 * 60 * 60 * 1000;
      }
      if (work_start > break_start) {
        break_start += 24 * 60 * 60 * 1000;
      }
      if (work_start > break_end) {
        break_end += 24 * 60 * 60 * 1000;
      }
      if (
        work_start < break_end &&
        work_start <= break_start &&
        work_end >= break_end &&
        work_end > break_start
      ) {
        return (
          Math.floor((work_end - work_start - (break_end - break_start)) / appointment_time) || 0
        );
      }
      if (
        work_start < break_end &&
        work_start <= break_start &&
        work_end <= break_end &&
        work_end > break_start
      ) {
        return (
          Math.floor((work_end - work_start - (work_end - break_start)) / appointment_time) || 0
        );
      }
      return Math.floor((work_end - work_start) / appointment_time) || 0;
    },
    [values.appointment_time, values.days_details]
  );

  useEffect(() => {
    if (appointTime) {
      for (let index = 0; index < values.days_details.length; index += 1) {
        processDayDetails(index);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appointTime]);

  // if (proccessing.value) {
  //   return <LoadingScreen />;
  // }
  return (
    <>
      <Divider flexItem sx={{ borderStyle: 'solid' }} />
      <Box sx={{ p: 3 }}>
        <Typography
          variant="p"
          sx={{ color: 'text.secondary', mb: 3, fontWeight: '700', textTransform: 'capitalize' }}
        >
          {curLangAr ? 'تفاصيل اليوم' : 'Days Details'}:
        </Typography>

        <Stack
          sx={{ mt: 3 }}
          divider={<Divider flexItem sx={{ borderStyle: 'dashed' }} />}
          spacing={3}
        >
          {fields.map((item, index) => (
            <Stack
              key={index}
              // alignItems="flex-start"
              // flexWrap="wrap"
              spacing={1.5}
              sx={{ width: '100%' }}
            >
              <Stack
                direction={{ xs: 'column', md: 'column' }}
                spacing={2}
                sx={{ width: '100%', mt: 2 }}
              >
                <Stack
                  direction={{ xs: 'column', md: 'row' }}
                  spacing={2}
                  sx={{ width: '100%', mt: 2 }}
                >
                  <RHFSelect
                    disabled={!values?.weekend?.includes(values.days_details[index]?.day)}
                    InputLabelProps={{ shrink: true }}
                    size="small"
                    name={`days_details[${index}].day`}
                    label={t('day')}
                  >
                    {weekDays
                      .filter(
                        (option) =>
                          !values.weekend.includes(option.value) &&
                          !values.days_details.some(
                            (detail) =>
                              detail.day === option.value &&
                              values.days_details[index]?.day !== option.value
                          )
                      )
                      .map((option, idx) => (
                        <MenuItem lang="ar" key={idx} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                  </RHFSelect>
                  <RHFSelect
                    size="small"
                    InputLabelProps={{ shrink: true }}
                    name={`days_details[${index}].appointment_type`}
                    onChange={(e) => {
                      setValue(`days_details[${index}].appointment_type`, e.target.value);
                      processDayDetails(index);
                    }}
                    label={`${t('appointment type')} *`}
                  >
                    {appointmenttypesData?.map((option, idx) => (
                      <MenuItem lang="ar" key={idx} value={option._id}>
                        {curLangAr ? option?.name_arabic : option?.name_english}
                      </MenuItem>
                    ))}
                  </RHFSelect>
                  <Controller
                    name={`days_details[${index}].service_types`}
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <FormControl
                        error={!!error}
                        size="small"
                        sx={{ width: '100%', shrink: true }}
                      >
                        <InputLabel shrink> {t('service types')} </InputLabel>

                        <Select
                          {...field}
                          multiple
                          id={`multiple-days_details[${index}].service_types`}
                          label={t('service types')}
                          onChange={(e) => {
                            setValue(`days_details[${index}].service_types`, e.target.value);
                            processDayDetails(index);
                          }}
                          renderValue={renderValues}
                        >
                          {serviceTypesData?.map((option, idx) => {
                            const selected = field?.value?.includes(option._id);

                            return (
                              <MenuItem lang="ar" key={idx} value={option._id}>
                                <Checkbox size="small" disableRipple checked={selected} />

                                {curLangAr ? option?.name_arabic : option?.name_english}
                              </MenuItem>
                            );
                          })}
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
                            onClick={() => handleAddNew(paths.unitservice.tables.services.new)}
                          >
                            <Typography variant="body2" sx={{ color: 'info.main' }}>
                              {t('Add new')}
                            </Typography>
                            <Iconify icon="material-symbols:new-window-sharp" />
                          </MenuItem>
                        </Select>

                        {!!error && (
                          <FormHelperText error={!!error}>{error?.message}</FormHelperText>
                        )}
                      </FormControl>
                    )}
                  />
                  <RHFTextField
                    disabled
                    size="small"
                    name={`days_details[${index}].appointment_number`}
                    label={t('appointments number')}
                    InputLabelProps={{ shrink: true }}
                    value={appointmentsNum[index] || appointEstimatedNum(index)}
                  />
                </Stack>
                <Stack
                  direction={{ xs: 'column', md: 'row' }}
                  spacing={2}
                  sx={{ width: '100%', mt: 2 }}
                >
                  <Controller
                    name={`days_details[${index}].work_start_time`}
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <MobileTimePicker
                        minutesStep="5"
                        label={t('work start time')}
                        value={myunitTime(values.days_details[index]?.work_start_time)}
                        onChange={(newValue) => {
                          const selectedTime = zonedTimeToUtc(
                            newValue,
                            user?.employee?.employee_engagements[user?.employee.selected_engagement]
                              ?.unit_service?.country?.time_zone ||
                              Intl.DateTimeFormat().resolvedOptions().timeZone
                          );
                          field.onChange(selectedTime);
                          setValue(`days_details[${index}].work_end_time`, null);
                          processDayDetails(index);
                        }}
                        slotProps={{
                          textField: {
                            size: 'small',
                            fullWidth: true,
                            error: !!error,
                            helperText: error?.message,
                          },
                        }}
                      />
                    )}
                  />
                  <Controller
                    name={`days_details[${index}].work_end_time`}
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <MobileTimePicker
                        minutesStep="5"
                        label={t('work end time')}
                        value={myunitTime(values.days_details[index]?.work_end_time)}
                        onChange={(newValue) => {
                          const selectedTime = zonedTimeToUtc(
                            newValue,
                            user?.employee?.employee_engagements[user?.employee.selected_engagement]
                              ?.unit_service?.country?.time_zone ||
                              Intl.DateTimeFormat().resolvedOptions().timeZone
                          );
                          field.onChange(selectedTime);
                          processDayDetails(index);
                        }}
                        slotProps={{
                          textField: {
                            size: 'small',
                            fullWidth: true,
                            error: !!error,
                            helperText: error?.message,
                          },
                        }}
                      />
                    )}
                  />
                  <Controller
                    name={`days_details[${index}].break_start_time`}
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <MobileTimePicker
                        minutesStep="5"
                        label={t('break start time')}
                        value={myunitTime(values.days_details[index]?.break_start_time)}
                        onChange={(newValue) => {
                          const selectedTime = zonedTimeToUtc(
                            newValue,
                            user?.employee?.employee_engagements[user?.employee.selected_engagement]
                              ?.unit_service?.country?.time_zone ||
                              Intl.DateTimeFormat().resolvedOptions().timeZone
                          );
                          setValue(`days_details[${index}].break_end_time`, null);
                          field.onChange(selectedTime);
                          processDayDetails(index);
                        }}
                        slotProps={{
                          textField: {
                            size: 'small',
                            fullWidth: true,
                            error: !!error,
                            helperText: error?.message,
                          },
                        }}
                      />
                    )}
                  />
                  <Controller
                    name={`days_details[${index}].break_end_time`}
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <MobileTimePicker
                        minutesStep="5"
                        label={t('break end time')}
                        value={myunitTime(values.days_details[index]?.break_end_time)}
                        onChange={(newValue) => {
                          const selectedTime = zonedTimeToUtc(
                            newValue,
                            user?.employee?.employee_engagements[user?.employee.selected_engagement]
                              ?.unit_service?.country?.time_zone ||
                              Intl.DateTimeFormat().resolvedOptions().timeZone
                          );
                          field.onChange(selectedTime);
                          processDayDetails(index);
                        }}
                        slotProps={{
                          textField: {
                            size: 'small',
                            fullWidth: true,
                            error: !!error,
                            helperText: error?.message,
                          },
                        }}
                      />
                    )}
                  />
                </Stack>
                <Stack
                  direction={{ xs: 'column', md: 'row' }}
                  spacing={0.2}
                  sx={{ justifySelf: { xs: 'flex-end' }, alignSelf: { xs: 'flex-end' } }}
                >
                  <IconButton size="small" color="error" onClick={() => handleRemove(index)}>
                    <Iconify icon="solar:trash-bin-trash-bold" />
                  </IconButton>
                  <IconButton size="small" onClick={() => processDayDetails(index)}>
                    <Iconify icon="zondicons:refresh" />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() =>
                      setShowAppointments({
                        [index]: !showAppointments[index],
                      })
                    }
                  >
                    <Iconify
                      icon={
                        showAppointments[index]
                          ? 'eva:arrow-ios-upward-fill'
                          : 'eva:arrow-ios-downward-fill'
                      }
                    />
                  </IconButton>
                </Stack>
              </Stack>
              <NewEditDayAppointmentsDetails
                setAppointmentsNum={setAppointmentsNum}
                serviceTypesData={serviceTypesData}
                appointmenttypesData={appointmenttypesData}
                open={showAppointments[index]}
                ParentIndex={index}
                unmountOnExit
              />
            </Stack>
          ))}
        </Stack>

        <Divider sx={{ mt: 3, mb: 1, borderStyle: 'dashed' }} />

        <Stack
          spacing={3}
          direction={{ xs: 'column', md: 'row' }}
          alignItems={{ xs: 'flex-end', md: 'center' }}
        >
          <Button
            size="small"
            color="primary"
            startIcon={<Iconify icon="tdesign:plus" />}
            sx={{ padding: 1 }}
            onClick={handleAdd}
            // sx={{ flexShrink: 0 }}
          >
            {curLangAr ? 'إضافة يوم جديد' : 'add new day'}
          </Button>
        </Stack>
      </Box>
    </>
  );
}
NewEditDayDetails.propTypes = {
  appointTime: PropTypes.number,
  setErrorMsg: PropTypes.func,
};
