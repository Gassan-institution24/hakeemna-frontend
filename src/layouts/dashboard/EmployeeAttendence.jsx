import React from 'react';

import { Stack, Button, Typography } from '@mui/material';

import { fTime } from 'src/utils/format-time';
import axiosInstance, { endpoints } from 'src/utils/axios';

import { useTranslate } from 'src/locales';
import { useGetMyLastAttendence } from 'src/api';

import CustomPopover, { usePopover } from 'src/components/custom-popover';

function EmployeeAttendence() {
  const { t } = useTranslate();
  const { attendence, refetch } = useGetMyLastAttendence();
  const hasAttendenceToday = attendence?.date &&
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
            resolve({ lat: 0, lng: 0 })
          }
        );
      } else {
        resolve({ lat: 0, lng: 0 })
        console.log('Geolocation is not supported by this browser.');
      }
    });

  const handleAttendence = async () => {
    try {
      const coordinates = await getCoordinates();
      await axiosInstance.post(endpoints.attendence.all, { coordinates });
      changingAttendence.onClose();
      refetch();
    } catch (e) {
      console.log(e);
    }
  };
  const handleLeave = async () => {
    try {
      await axiosInstance.post(endpoints.attendence.leave);
      changingAttendence.onClose();
      refetch();
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <>
      {!attendence || attendence?.check_out_time ? (
        !hasAttendenceToday && (
          <Button
            variant="contained"
            color="primary"
            onClick={changingAttendence.onOpen}
            sx={{ m: 2 }}
          >
            {t('check in')}
          </Button>
        )
      ) : (
        <Button
          variant="contained"
          color="warning"
          onClick={changingAttendence.onOpen}
          sx={{ m: 2 }}
        >
          {t('check out')}
        </Button>
      )}
      <CustomPopover open={changingAttendence.open} onClose={changingAttendence.onClose}>
        <Stack alignItems="center" p={1}>
          <Typography variant="h6">{fTime(new Date())}</Typography>
          {!attendence || attendence?.check_out_time ? (
            <Button variant="contained" color="primary" onClick={handleAttendence} sx={{ mt: 2 }}>
              {t('check in')}
            </Button>
          ) : (
            <>
              {!attendence?.leave_end &&
                (attendence?.leave_start ? (
                  <Button variant="contained" color="error" onClick={handleLeave} sx={{ mt: 2 }}>
                    {t('end leave')}
                  </Button>
                ) : (
                  <Button variant="contained" color="primary" onClick={handleLeave} sx={{ mt: 2 }}>
                    {t('start leave')}
                  </Button>
                ))}
              <Button variant="contained" color="warning" onClick={handleAttendence} sx={{ mt: 2 }}>
                {t('check out')}
              </Button>
            </>
          )}
        </Stack>
      </CustomPopover>
    </>
  );
}

export default EmployeeAttendence;
