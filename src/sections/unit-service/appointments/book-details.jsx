import PropTypes from 'prop-types';
import { isValid } from 'date-fns';
import { useState, useEffect } from 'react';

import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import { MenuItem, TextField } from '@mui/material';
import ListItemText from '@mui/material/ListItemText';
import { StaticDatePicker } from '@mui/x-date-pickers';

import { useResponsive } from 'src/hooks/use-responsive';

import axiosInstance, { endpoints } from 'src/utils/axios';

import { useLocales, useTranslate } from 'src/locales';
import { useGetAppointment, useGetAppointmentTypes } from 'src/api';

import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import TimeList from 'src/components/time-list/time-list';

// ----------------------------------------------------------------------

export default function BookDetails({
  selected,
  AppointDates,
  setSelected,
  selectedDate,
  setSelectedDate,
  list,
  loading,
}) {
  const { t } = useTranslate();
  const { data } = useGetAppointment(selected, {
    select: '_id work_group appointment_type unit_service start_time online_available',
    populate: [
      { path: 'work_group', select: 'name_english name_arabic' },
      { path: 'unit_service', select: 'name_english name_arabic' },
      { path: 'appointment_type', select: 'name_english name_arabic' },
    ],
  });

  const [timeListItem, setTimeListItem] = useState();
  const mdUp = useResponsive('up', 'md');

  useEffect(() => {
    if (!loading.value) {
      if (!selected) {
        setSelected(list?.[0]?._id);
        setTimeListItem(list?.[0]?._id);
      } else if (!list.some((one) => one._id === selected)) {
        setSelected(list?.[0]?._id);
        setTimeListItem(list?.[0]?._id);
      } else {
        list.forEach((one, index) => {
          if (one._id === selected) {
            setSelected(list?.[index]?._id);
            setTimeListItem(list?.[index]?._id);
          }
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [list, loading.value]);
  const timeListChangeHandler = (newValue) => {
    setSelected(newValue);
    setTimeListItem(newValue);
  };

  return (
    <>
      <Stack direction={mdUp ? 'row' : 'column'} justifyContent="space-around">
        <StaticDatePicker
          localeText={false}
          sx={{ width: '100%', flexGrow: 1, flexShrink: 0.4 }}
          orientation={mdUp ? 'landscape' : ''}
          shouldDisableDate={(day) =>
            !AppointDates.some((date) => {
              const appointDate = new Date(date);
              const currentDate = new Date(day);
              return (
                appointDate.getFullYear() === currentDate.getFullYear() &&
                appointDate.getMonth() === currentDate.getMonth() &&
                appointDate.getDate() === currentDate.getDate()
              );
            })
          }
          slots={{ toolbar: 'test' }}
          slotProps={{ actionBar: { actions: [] } }}
          value={new Date(selectedDate)}
          onChange={(newValue) =>
            setSelectedDate(
              new Date(newValue.getFullYear(), newValue.getMonth(), newValue.getDate(), 12, 0, 0)
            )
          }
        />
        <Stack
          sx={{
            width: '100%',
            height: '100%',
            flexGrow: 1,
            flexShrink: 0.6,
            // py: 8,
            px: 3,
          }}
        >
          <TimeList list={list} onChange={timeListChangeHandler} value={timeListItem} />
        </Stack>
      </Stack>
      <Divider sx={{ borderStyle: 'dashed' }} />
      {selected && (
        <CardHeader
          title={
            <Typography
              sx={{ py: 2, fontWeight: 700 }}
              variant="caption"
              color="text.secondary"
              textTransform="uppercase"
            >
              {t('Appointment details')}
            </Typography>
          }
        />
      )}

      {data && <ReviewItem item={data} />}
      <Divider sx={{ borderStyle: 'dashed', mb: 3 }} />
    </>
  );
}

BookDetails.propTypes = {
  selected: PropTypes.string,
  selectedDate: PropTypes.any,
  AppointDates: PropTypes.array,
  list: PropTypes.array,
  loading: PropTypes.bool,
  setSelected: PropTypes.func,
  setSelectedDate: PropTypes.func,
};

// ----------------------------------------------------------------------

function ReviewItem({ item }) {
  const { _id, work_group, appointment_type, unit_service, start_time, online_available } = item;

  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const { enqueueSnackbar } = useSnackbar();

  const { appointmenttypesData } = useGetAppointmentTypes();

  const [appointType, setAppointType] = useState(appointment_type?._id);

  const mdUp = useResponsive('up', 'md');

  const handleChangeAppointType = async (e) => {
    try {
      await axiosInstance.patch(endpoints.appointments.one(_id), {
        appointment_type: e.target.value,
      });
      setAppointType(e.target.value);
      enqueueSnackbar(t('updated successfully'));
    } catch (error) {
      enqueueSnackbar(
        curLangAr ? `${error.arabic_message}` || `${error.message}` : `${error.message}`,
        {
          variant: 'error',
        }
      );
    }
  };
  return (
    <Stack
      dir={curLangAr ? 'rtl' : 'ltr'}
      spacing={2}
      sx={{
        p: 3,
        position: 'relative',
      }}
    >
      <Stack direction={mdUp ? 'row' : 'column'} alignItems="center" spacing={2}>
        {/* <Avatar alt={start_time} src={avatarUrl} sx={{ width: 48, height: 48 }} /> */}

        <ListItemText
          primary={
            isValid(new Date(start_time)) &&
            new Date(start_time).toLocaleTimeString(t('en-US'), {
              timeZone: unit_service?.country?.time_zone || 'Asia/Amman',
              hour: '2-digit',
              minute: '2-digit',
            })
          }
          secondary={
            isValid(new Date(start_time)) &&
            new Date(start_time).toLocaleDateString(t('en-US'), {
              timeZone: unit_service?.country?.time_zone || 'Asia/Amman',
            })
          }
          primaryTypographyProps={{ typography: 'subtitle1', noWrap: true }}
          secondaryTypographyProps={{
            typography: 'body2',
            component: 'span',
            mt: 0.5,
            color: 'text.disabled',
          }}
        />

        {/* <Rating value={rating} size="small" readOnly precision={0.5} /> */}
        {[
          {
            // label: t('appointment type'),
            label: (
              <TextField
                variant="standard"
                select
                size="small"
                sx={{ width: '170px', mx: 2 }}
                value={appointType}
                onChange={handleChangeAppointType}
                placeholder={t('appointment type')}
              >
                {appointmenttypesData?.map((one, idx) => (
                  <MenuItem key={idx} selected={appointType === one._id} value={one._id}>
                    {curLangAr ? one?.name_arabic : one?.name_english}
                  </MenuItem>
                ))}
              </TextField>
            ),
            icon: <Iconify icon="streamline:waiting-appointments-calendar" />,
          },
          {
            // label: t('work group'),
            label: curLangAr ? work_group?.name_arabic : work_group?.name_english,
            icon: <Iconify icon="ri:group-line" />,
          },
          {
            label: t('available online'),
            // value:
            //   work_days.length === 7 ? t('All days') : work_days.map((day) => t(day)).join(', '),
            icon: (
              <Iconify
                icon={online_available ? 'typcn:tick-outline' : 'mdi:close-outline'}
                sx={{ color: online_available ? 'success.main' : 'error.main' }}
              />
            ),
          },
        ].map((one, idx) => (
          <Stack key={idx} spacing={0.5} direction="row">
            {one.icon}
            <ListItemText
              primary={one.label}
              secondary={<span dir={one.label === 'رقم الهاتف' ? 'ltr' : 'auto'}>{one.value}</span>}
              primaryTypographyProps={{
                typography: 'body2',
                color: 'text.secondary',
                mb: 0.5,
              }}
              secondaryTypographyProps={{
                typography: 'subtitle2',
                color: 'text.primary',
                component: 'span',
                textTransform: 'none',
              }}
            />
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
}

ReviewItem.propTypes = {
  item: PropTypes.object,
};
