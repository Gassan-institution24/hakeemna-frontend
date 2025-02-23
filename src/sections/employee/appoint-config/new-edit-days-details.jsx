import PropTypes from 'prop-types';
import { useState, useEffect, useCallback } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { useBoolean } from 'src/hooks/use-boolean';

import { useGetAppointmentTypes } from 'src/api';
import { useLocales, useTranslate } from 'src/locales';

import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
// import { LoadingScreen } from 'src/components/loading-screen';
import { RHFSelect, RHFCheckbox, RHFTextField, RHFTimePicker } from 'src/components/hook-form';

import NewEditDayAppointmentsDetails from './new-edit-days-appointments-details';

// ----------------------------------------------------------------------
export default function NewEditDayDetails({ setErrorMsg, appointTime }) {
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const proccessing = useBoolean();
  const [showField, setShowField] = useState(true);
  const [show, setShow] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const { enqueueSnackbar } = useSnackbar();

  const weekDays = [
    { value: 'saturday', label: t('Saturday') },
    { value: 'sunday', label: t('Sunday') },
    { value: 'monday', label: t('Monday') },
    { value: 'tuesday', label: t('Tuesday') },
    { value: 'wednesday', label: t('Wednesday') },
    { value: 'thursday', label: t('Thursday') },
    { value: 'friday', label: t('Friday') },
  ];

  const { control, setValue, watch, clearErrors } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'days_details',
  });

  const values = watch();

  const [showAppointments, setShowAppointments] = useState({});
  const [appointmentsNum, setAppointmentsNum] = useState({});
  const { appointmenttypesData } = useGetAppointmentTypes();

  const processDayDetails = useCallback(
    (index) => {
      try {
        setShowAppointments({});
        proccessing.onTrue();
        clearErrors();
        if (!values.appointment_time) {
          setValue(`days_details[${index}].appointments`, []);
          // setError('appointment_time');
          proccessing.onFalse();
          return;
        }
        if (!values.days_details[index]?.work_start_time) {
          setValue(`days_details[${index}].appointments`, []);
          // setError(`days_details[${index}].work_start_time`);
          proccessing.onFalse();
          return;
        }
        if (!values.days_details[index]?.work_end_time) {
          setValue(`days_details[${index}].appointments`, []);
          // setError(`days_details[${index}].work_end_time`);
          proccessing.onFalse();
          return;
        }
        const results = [];
        const now = new Date();
        const appointment_time = values.appointment_time * 60 * 1000;
        const currentDay = values.days_details[index];
        const work_start = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
          new Date(currentDay?.work_start_time).getHours(),
          new Date(currentDay?.work_start_time).getMinutes()
        ).getTime();
        let work_end = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
          new Date(currentDay?.work_end_time).getHours(),
          new Date(currentDay?.work_end_time).getMinutes()
        ).getTime();
        let break_start = currentDay.break_start_time
          ? new Date(
              now.getFullYear(),
              now.getMonth(),
              now.getDate(),
              new Date(currentDay.break_start_time).getHours(),
              new Date(currentDay.break_start_time).getMinutes()
            ).getTime()
          : null;
        let break_end = currentDay.break_end_time
          ? new Date(
              now.getFullYear(),
              now.getMonth(),
              now.getDate(),
              new Date(currentDay.break_end_time).getHours(),
              new Date(currentDay.break_end_time).getMinutes()
            ).getTime()
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
              online_available: currentDay.online_available,
              service_types: currentDay.service_types,
            });
            curr_start += appointment_time;
          } else {
            curr_start = break_end;
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
        // setErrorMsg(e.message);
        enqueueSnackbar(e.message, { variant: 'error' });
        // window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [values.appointment_time, values.days_details]
  );

  const appointEstimatedNum = useCallback(
    (index) => {
      const currentDay = values.days_details[index];
      if (currentDay?.appointments.length) {
        return currentDay?.appointments.length;
      }
      const appointment_time = values.appointment_time * 60 * 1000;
      const work_start = new Date(currentDay?.work_start_time).getTime();
      let work_end = new Date(currentDay?.work_end_time).getTime();
      let break_start = new Date(currentDay?.break_start_time).getTime();
      let break_end = new Date(currentDay?.break_end_time).getTime();
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
      {show && (
        <Box sx={{ p: 3 }}>
          <Typography
            variant="p"
            sx={{
              color: 'text.secondary',
              mb: 3,
              px: 3,
              fontWeight: '700',
              textTransform: 'capitalize',
            }}
          >
            {curLangAr ? 'تفاصيل اليوم' : 'Days Details'}:
          </Typography>

          <Stack
            direction="row"
            sx={{ mt: 3, flex: 1 }}
            spacing={2}
            divider={<div style={{ width: '1px', backgroundColor: '#ccc' }} />}
          >
            <Stack spacing={1.5} px={1}>
              {fields.map((item, index) => (
                <Button
                  key={index}
                  onClick={() => {
                    setShowField(false);
                    setSelectedIndex(index);
                    setTimeout(() => {
                      setShowField(true);
                    }, 100);
                  }}
                  variant="text"
                  sx={{
                    p: 1,
                    cursor: 'pointer',
                    borderBottom: index === selectedIndex ? 2 : 0,
                    borderColor: 'primary.main',
                  }}
                >
                  {t(item.day)}
                  {'  '}
                  {watch(`days_details[${index}].work_start_time`) &&
                    watch(`days_details[${index}].work_end_time`) && (
                      <Iconify
                        sx={{ color: 'success.main', ml: 1 }}
                        icon="material-symbols:check-circle-outline"
                      />
                    )}
                </Button>
              ))}
            </Stack>
            <Stack direction="column" spacing={1.5} sx={{ width: '100%', flex: 1 }}>
              {showField && (
                <Stack
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
                        disabled={
                          !values?.weekend?.includes(values.days_details[selectedIndex]?.day)
                        }
                        InputLabelProps={{ shrink: true }}
                        size="small"
                        name={`days_details[${selectedIndex}].day`}
                        label={t('day')}
                      >
                        {weekDays
                          .filter((option) => !values.weekend.includes(option.value))
                          .map((option, idx) => (
                            <MenuItem lang="ar" key={idx} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                      </RHFSelect>
                      <RHFSelect
                        size="small"
                        InputLabelProps={{ shrink: true }}
                        name={`days_details[${selectedIndex}].appointment_type`}
                        data-test={`select-appointment-type-${selectedIndex}`}
                        onChange={(e) => {
                          setValue(
                            `days_details[${selectedIndex}].appointment_type`,
                            e.target.value
                          );
                          processDayDetails(selectedIndex);
                        }}
                        label={t('appointment type')}
                      >
                        {appointmenttypesData?.map((option, idx) => (
                          <MenuItem lang="ar" key={idx} value={option._id}>
                            {curLangAr ? option?.name_arabic : option?.name_english}
                          </MenuItem>
                        ))}
                      </RHFSelect>
                      <RHFTextField
                        disabled
                        size="small"
                        name={`days_details[${selectedIndex}].appointment_number`}
                        label={t('appointments number')}
                        InputLabelProps={{ shrink: true }}
                        value={appointmentsNum[selectedIndex] || appointEstimatedNum(selectedIndex)}
                      />
                    </Stack>
                    <Stack
                      direction={{ xs: 'column', md: 'row' }}
                      spacing={2}
                      data-test={`work-inputs-${selectedIndex}`}
                      sx={{ width: '100%', mt: 2 }}
                    >
                      <RHFTimePicker
                        name={`days_details[${selectedIndex}].work_start_time`}
                        data-test={`work-start-input-${selectedIndex}`}
                        label={t('work start time')}
                        slotProps={{
                          textField: {
                            size: 'small',
                            fullWidth: true,
                          },
                        }}
                        onChange={() => {
                          setValue(`days_details[${selectedIndex}].work_end_time`, null);
                          processDayDetails(selectedIndex);
                        }}
                      />
                      <RHFTimePicker
                        name={`days_details[${selectedIndex}].work_end_time`}
                        data-test={`work-end-input-${selectedIndex}`}
                        label={t('work end time')}
                        slotProps={{
                          textField: {
                            size: 'small',
                            fullWidth: true,
                          },
                        }}
                        onChange={() => {
                          processDayDetails(selectedIndex);
                        }}
                      />
                      <RHFTimePicker
                        name={`days_details[${selectedIndex}].break_start_time`}
                        label={t('break start time')}
                        slotProps={{
                          textField: {
                            size: 'small',
                            fullWidth: true,
                          },
                        }}
                        onChange={() => {
                          setValue(`days_details[${selectedIndex}].break_end_time`, null);
                          processDayDetails(selectedIndex);
                        }}
                      />
                      <RHFTimePicker
                        name={`days_details[${selectedIndex}].break_end_time`}
                        label={t('break end time')}
                        slotProps={{
                          textField: {
                            size: 'small',
                            fullWidth: true,
                          },
                        }}
                        onChange={() => {
                          processDayDetails(selectedIndex);
                        }}
                      />
                    </Stack>
                    <Stack display="flex" alignItems="flex-end">
                      <RHFCheckbox
                        size="small"
                        InputLabelProps={{ shrink: true }}
                        name={`days_details[${selectedIndex}].online_available`}
                        onChange={(e) => {
                          setValue(
                            `days_details[${selectedIndex}].online_available`,
                            !values.days_details[selectedIndex].online_available
                          );
                          processDayDetails(selectedIndex);
                        }}
                        label={
                          <Typography sx={{ fontSize: 12 }}>{t('online avaliable')}</Typography>
                        }
                      />
                    </Stack>
                    <Stack
                      direction={{ xs: 'column', md: 'row' }}
                      spacing={0.2}
                      sx={{ justifySelf: { xs: 'flex-end' }, alignSelf: { xs: 'flex-end' } }}
                    >
                      <IconButton size="small" onClick={() => processDayDetails(selectedIndex)}>
                        <Iconify icon="zondicons:refresh" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() =>
                          setShowAppointments({
                            [selectedIndex]: !showAppointments[selectedIndex],
                          })
                        }
                      >
                        <Iconify
                          icon={
                            showAppointments[selectedIndex]
                              ? 'eva:arrow-ios-upward-fill'
                              : 'eva:arrow-ios-downward-fill'
                          }
                        />
                      </IconButton>
                    </Stack>
                  </Stack>
                  {showAppointments[selectedIndex] && (
                    <NewEditDayAppointmentsDetails
                      setAppointmentsNum={setAppointmentsNum}
                      appointmenttypesData={appointmenttypesData}
                      open={showAppointments[selectedIndex]}
                      ParentIndex={selectedIndex}
                      unmountOnExit
                    />
                  )}
                </Stack>
              )}
            </Stack>
          </Stack>
        </Box>
      )}
    </>
  );
}
NewEditDayDetails.propTypes = {
  appointTime: PropTypes.number,
  setErrorMsg: PropTypes.func,
};
