import React, { useState } from 'react';
import { useSnackbar } from 'notistack';

import { LoadingButton } from '@mui/lab';
import { Stack, Typography } from '@mui/material';

import { fTime } from 'src/utils/format-time';
import axiosInstance, { endpoints } from 'src/utils/axios';

import { useGetMyLastAttendence } from 'src/api';
import { useLocales, useTranslate } from 'src/locales';

import CustomPopover, { usePopover } from 'src/components/custom-popover';

function EmployeeAttendence() {
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';
  const { enqueueSnackbar } = useSnackbar();

  const [loading, setLoading] = useState(false);

  const { attendence, refetch } = useGetMyLastAttendence();
  const hasAttendenceToday =
    attendence?.date &&
    new Date(attendence?.date).getFullYear() === new Date().getFullYear() &&
    new Date(attendence?.date).getMonth() === new Date().getMonth() &&
    new Date(attendence?.date).getDay() === new Date().getDay();
  const changingAttendence = usePopover();

  const getCoordinates = () =>
    new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const coordinates = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
            resolve(coordinates);
          },
          (error) => {
            console.error('Error getting location:', error);
            resolve({ lat: 0, lng: 0 });
          }
        );
      } else {
        resolve({ lat: 0, lng: 0 });
        console.log('Geolocation is not supported by this browser.');
      }
    });

  const handleAttendence = async () => {
    try {
      setLoading(true);
      const coordinates = await getCoordinates();
      await axiosInstance.post(endpoints.attendence.all, { coordinates });
      changingAttendence.onClose();
      refetch();
      setLoading(false);
    } catch (error) {
      setLoading(false);
      enqueueSnackbar(curLangAr ? error.arabic_message || error.message : error.message, {
        variant: 'error',
      });
    }
  };
  const handleLeave = async () => {
    try {
      setLoading(true);
      await axiosInstance.post(endpoints.attendence.leave);
      changingAttendence.onClose();
      refetch();
      setLoading(false);
    } catch (e) {
      setLoading(false);
      console.log(e);
    }
  };
  return (
    <>
      {!attendence || attendence?.check_out_time || attendence?.leave ? (
        !hasAttendenceToday && (
          <LoadingButton
            loading={loading}
            variant="contained"
            color="primary"
            onClick={changingAttendence.onOpen}
            sx={{ m: 2 }}
          >
            {t('check in')}
          </LoadingButton>
        )
      ) : (
        <LoadingButton
          loading={loading}
          variant="contained"
          color="warning"
          onClick={changingAttendence.onOpen}
          sx={{ m: 2 }}
        >
          {t('check out')}
        </LoadingButton>
      )}
      <CustomPopover open={changingAttendence.open} onClose={changingAttendence.onClose}>
        <Stack alignItems="center" p={1}>
          <Typography variant="h6">{fTime(new Date())}</Typography>
          {!attendence || attendence?.check_out_time ? (
            <LoadingButton
              loading={loading}
              variant="contained"
              color="primary"
              onClick={handleAttendence}
              sx={{ mt: 2 }}
            >
              {t('check in')}
            </LoadingButton>
          ) : (
            <>
              {!attendence?.leave_end &&
                (attendence?.leave_start ? (
                  <LoadingButton
                    loading={loading}
                    variant="contained"
                    color="error"
                    onClick={handleLeave}
                    sx={{ mt: 2 }}
                  >
                    {t('end leave')}
                  </LoadingButton>
                ) : (
                  <LoadingButton
                    loading={loading}
                    variant="contained"
                    color="primary"
                    onClick={handleLeave}
                    sx={{ mt: 2 }}
                  >
                    {t('start leave')}
                  </LoadingButton>
                ))}
              <LoadingButton
                loading={loading}
                variant="contained"
                color="warning"
                onClick={handleAttendence}
                sx={{ mt: 2 }}
              >
                {t('check out')}
              </LoadingButton>
            </>
          )}
        </Stack>
      </CustomPopover>
    </>
  );
}

export default EmployeeAttendence;
