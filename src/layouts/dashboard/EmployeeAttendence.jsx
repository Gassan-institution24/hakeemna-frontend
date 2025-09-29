import React, { useState } from 'react';
import { useSnackbar } from 'notistack';

import { LoadingButton } from '@mui/lab';
import { Box, Stack, Typography } from '@mui/material';

import { fTime } from 'src/utils/format-time';
import axiosInstance, { endpoints } from 'src/utils/axios';

import { useTranslate } from 'src/locales';
import { useGetMyLastAttendence } from 'src/api';

import CustomPopover, { usePopover } from 'src/components/custom-popover';

function EmployeeAttendence() {
  const { t } = useTranslate();
  const { enqueueSnackbar } = useSnackbar();
  const { attendence, refetch } = useGetMyLastAttendence();
  const changingAttendence = usePopover();
  const [loading, setLoading] = useState(false);

  const getCoordinates = () =>
    new Promise((resolve) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
          () => resolve({ lat: 0, lng: 0 })
        );
      } else resolve({ lat: 0, lng: 0 });
    });

  const handleAction = async (type) => {
    try {
      setLoading(true);
      const coordinates = await getCoordinates();

      switch (type) {
        case 'checkin':
          await axiosInstance.post(endpoints.attendence.checkin, { coordinates });
          break;
        case 'checkout':
          await axiosInstance.post('/api/attendence/checkout', { coordinates });
          break;
        case 'startLeave':
          await axiosInstance.post('/api/attendence/leave/start', { coordinates });
          break;
        case 'endLeave':
          await axiosInstance.post('/api/attendence/leave/end', { coordinates });
          break;
        default:
          break;
      }

      refetch();
      changingAttendence.onClose();
    } catch (error) {
      enqueueSnackbar(error.message, { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const getMainButton = () => {
    if (!attendence || attendence.check_out_time) {
      // eslint-disable-next-line no-constant-condition
      if (!attendence || attendence.check_out_time || true) {
        return {
          label: t('check in'),
          action: () => handleAction('checkin'),
          color: 'primary',
        };
      }
    } else {
      return { label: t('check out'), action: () => handleAction('checkout'), color: 'warning' };
    }
    return null;
  };

  const getLeaveButton = () => {
    if (!attendence || attendence.check_out_time) return null;
    if (attendence.leave_start && !attendence.leave_end)
      return { label: t('end leave'), action: () => handleAction('endLeave'), color: 'error' };
    if (!attendence.leave_start)
      return {
        label: t('start leave'),
        action: () => handleAction('startLeave'),
        color: 'primary',
      };
    return null;
  };

  const mainBtn = getMainButton();
  const leaveBtn = getLeaveButton();

  const getStatusText = () => {
    if (!attendence || attendence.check_out_time) return t('Not checked in');
    if (attendence.leave_start && !attendence.leave_end) return t('On Leave');
    return t('At Work');
  };

  return (
    <>
      {mainBtn && (
        <LoadingButton
          loading={loading}
          variant="contained"
          color={mainBtn.color}
          onClick={changingAttendence.onOpen}
          sx={{ m: 2, minWidth: 150 }}
        >
          {mainBtn.label}
        </LoadingButton>
      )}

      <CustomPopover open={changingAttendence.open} onClose={changingAttendence.onClose}>
        <Stack alignItems="center" p={2} spacing={2}>
          <Box textAlign="center">
            <Typography variant="subtitle2">{t('Current Time')}</Typography>
            <Typography variant="h6">{fTime(new Date())}</Typography>
            <Typography variant="body1" sx={{ mt: 1, fontWeight: 'bold' }}>
              {getStatusText()}
            </Typography>
          </Box>

          {leaveBtn && (
            <LoadingButton
              loading={loading}
              variant="contained"
              color={leaveBtn.color}
              onClick={leaveBtn.action}
              sx={{ mt: 1, minWidth: 150 }}
            >
              {leaveBtn.label}
            </LoadingButton>
          )}

          {mainBtn && (
            <LoadingButton
              loading={loading}
              variant="contained"
              color={mainBtn.color}
              onClick={mainBtn.action}
              sx={{ mt: 1, minWidth: 150 }}
            >
              {mainBtn.label}
            </LoadingButton>
          )}
        </Stack>
      </CustomPopover>
    </>
  );
}

export default EmployeeAttendence;
