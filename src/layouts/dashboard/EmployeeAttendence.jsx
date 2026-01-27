import { useSnackbar } from 'notistack';
import React, { useRef, useState } from 'react';

import { LoadingButton } from '@mui/lab';
import {
  Box,
  Stack,
  Dialog,
  Button,
  TextField,
  Typography,
  IconButton,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';

import { fTime } from 'src/utils/format-time';
import axiosInstance, { endpoints } from 'src/utils/axios';

import { useTranslate } from 'src/locales';
import { useGetMyLastAttendence } from 'src/api';

import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

function EmployeeAttendence() {
  const { t } = useTranslate();
  const lastTaskRef = useRef(null);
  const { enqueueSnackbar } = useSnackbar();
  const { attendence, refetch } = useGetMyLastAttendence();
  const changingAttendence = usePopover();
  const [loading, setLoading] = useState(false);
  const [openCheckoutDialog, setOpenCheckoutDialog] = useState(false);
  // tasks state for check out
  const [tasks, setTasks] = useState([{ activity: '', hours: '' }]);
  // handle task change
  const handleTaskChange = (index, field, value) => {
    const updatedTasks = [...tasks];
    updatedTasks[index][field] = value;
    setTasks(updatedTasks);
  };
  // add new task
  const addNewTask = () => {
    setTasks([...tasks, { activity: '', hours: '' }]);
  };
  // remove task
  const removeTask = (index) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const getCoordinates = () =>
    new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error(t('Geolocation is not supported by your browser.')));
        return;
      }

      navigator.permissions
        .query({ name: 'geolocation' })
        .then((result) => {
          if (result.state === 'denied') {
            reject(
              new Error(
                t('Location permission is blocked. Please enable it from your browser settings')
              )
            );
          } else {
            navigator.geolocation.getCurrentPosition(
              (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
              (err) => reject(new Error(t('Please allow location access to proceed.')))
            );
          }
        })
        .catch(() => {
          navigator.geolocation.getCurrentPosition(
            (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
            (err) => reject(new Error(t('Please allow location access to proceed.')))
          );
        });
    });

  const handleAction = async (type) => {
    try {
      setLoading(true);

      // يطلب الموقع أولاً
      const coordinates = await getCoordinates();

      // إذا تم الحصول على الموقع
      switch (type) {
        case 'checkin':
          await axiosInstance.post(endpoints.attendence.checkin, { coordinates });
          break;
        case 'checkout':
          await axiosInstance.post('/api/attendence/checkout', {
            coordinates,
            // tasks data
            tasks: tasks.map((task) => ({
              activity: task.activity,
              hours: Number(task.hours),
            })),
          });
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
      enqueueSnackbar(t('done'), { variant: 'success' });
    } catch (error) {
      enqueueSnackbar(error.message || t('something went wrong'), { variant: 'error' });
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
              onClick={() => {
                if (mainBtn.label === t('check out')) {
                  setOpenCheckoutDialog(true);
                } else {
                  mainBtn.action(); // check in
                }
              }}
              sx={{ mt: 1, minWidth: 150 }}
            >
              {mainBtn.label}
            </LoadingButton>
          )}
        </Stack>
      </CustomPopover>
      <Dialog
        open={openCheckoutDialog}
        onClose={() => {
          setOpenCheckoutDialog(false);
          setTasks([{ activity: '', hours: '' }]);
        }}
        fullWidth
      >
        <DialogTitle>{t('check out')}</DialogTitle>

        <DialogContent
          sx={{
            mt: 1,
            maxHeight: '60vh',
            overflowY: 'auto',
          }}
        >
          <Stack spacing={2}>
            {tasks.map((item, index) => (
              <Box
                key={index}
                ref={index === tasks.length - 1 ? lastTaskRef : null}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                  position: 'relative',
                  bgcolor: 'background.paper',
                }}
              >
                {/* Header */}
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1}>
                  {/*  Delete only for added activities */}
                  {index > 0 && (
                    <IconButton size="small" color="error" onClick={() => removeTask(index)}>
                      <Iconify icon="mdi:trash-outline" />
                    </IconButton>
                  )}
                </Stack>

                {/* Activity text */}
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  label={t('Activity')}
                  value={item.activity}
                  onChange={(e) => handleTaskChange(index, 'activity', e.target.value)}
                  margin="dense"
                />

                {/* Hours */}
                <TextField
                  fullWidth
                  type="number"
                  label={t('Time Spent (hours)')}
                  value={item.hours}
                  onChange={(e) => handleTaskChange(index, 'hours', e.target.value)}
                  margin="dense"
                />
              </Box>
            ))}

            {/* ➕ Add new activity */}
            <Button
              variant="outlined"
              startIcon={<Iconify icon="mdi:plus" />}
              sx={{ alignSelf: 'flex-start' }}
              onClick={() => {
                addNewTask();

                setTimeout(() => {
                  lastTaskRef.current?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                  });
                }, 100);
              }}
            >
              {t('Add another activity')}
            </Button>
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() => {
              setOpenCheckoutDialog(false);
              setTasks([{ activity: '', hours: '' }]);
            }}
          >
            {t('cancel')}
          </Button>

          <LoadingButton
            loading={loading}
            variant="contained"
            color="warning"
            onClick={async () => {
              await handleAction('checkout');
              setOpenCheckoutDialog(false);
              setOpenCheckoutDialog(false);
              setTasks([{ activity: '', hours: '' }]);
            }}
          >
            {t('Save')}
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default EmployeeAttendence;
