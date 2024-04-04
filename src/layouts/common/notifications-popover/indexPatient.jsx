import { m } from 'framer-motion';
import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Stack from '@mui/material/Stack';
import Badge from '@mui/material/Badge';
import { LoadingButton } from '@mui/lab';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';
import { useResponsive } from 'src/hooks/use-responsive';

import axios, { endpoints } from 'src/utils/axios';

import socket from 'src/socket';
import { useTranslate } from 'src/locales';
import { useAuthContext } from 'src/auth/hooks';
import { useGetPatientNotifications } from 'src/api';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { varHover } from 'src/components/animate';

import NotificationPatient from './notificationPatient';

// ----------------------------------------------------------------------

export default function NotificationsPopoverPatient() {
  const router = useRouter();

  const drawer = useBoolean();
  const { t } = useTranslate();
  const { user } = useAuthContext();
  const { patientNotifications, hasMore, unread, refetch, loading } = useGetPatientNotifications(
    user?.patient?._id
  );

  const smUp = useResponsive('up', 'sm');

  // const [page, setPage] = useState(1);
  const [allNotifications, setAllNotifications] = useState([]);

  const handleClick = async (id, link) => {
    drawer.onFalse();
    router.push(link);
    await axios.patch(endpoints.notifications.readOne(id));
    setAllNotifications([]);
    // setPage(1);
    refetch();
  };

  const handleMarkAllAsRead = async () => {
    await axios.patch(`${endpoints.notifications.all}/read`, { ids: unread });
    setAllNotifications([]);
    // setPage(1);
    refetch();
  };
  /* eslint-disable */
  useEffect(() => {
    socket.on('request', (data) => {
      console.log(data);
      setAllNotifications([]);
      // setPage(1);
      refetch();
    });
  }, []);
  useEffect(() => {
    socket.on('invite', (data) => {
      console.log(data);
      setAllNotifications([]);
      // setPage(1);
      refetch();
    });
  }, []);
  useEffect(() => {
    socket.on('accept', (data) => {
      console.log(data);
      setAllNotifications([]);
      // setPage(1);
      refetch();
    });
  }, []);
  useEffect(() => {
    socket.on('patientbooking', (data) => {
      console.log(data);
      setAllNotifications([]);
      // setPage(1);
      refetch();
    });
  }, []);

  useEffect(() => {
    socket.on('appointmentcancel', (data) => {
      setAllNotifications([]);
      // setPage(1);
      refetch();
    });
  }, []);

  useEffect(() => {
    socket.on('upcoming', (data) => {
      setAllNotifications([]);
      // setPage(1);
      refetch();
    });
  }, []);
  /* eslint-enable */

  useEffect(() => {
    setAllNotifications((prevNotifications) => [...prevNotifications, ...patientNotifications]);
  }, [patientNotifications]);

  return (
    <>
      <IconButton
        component={m.button}
        whileTap="tap"
        whileHover="hover"
        variants={varHover(1.05)}
        color={drawer.value ? 'primary' : 'default'}
        onClick={drawer.onTrue}
      >
        <Badge badgeContent={unread.length} color="error">
          <Iconify icon="solar:bell-bing-bold-duotone" width={24} />
        </Badge>
      </IconButton>

      <Drawer
        open={drawer.value}
        onClose={drawer.onFalse}
        anchor="right"
        slotProps={{
          backdrop: { invisible: true },
        }}
        PaperProps={{
          sx: { width: 1, maxWidth: 420 },
        }}
      >
        <Stack direction="row" alignItems="center" sx={{ py: 2, pl: 2.5, pr: 1, minHeight: 68 }}>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            {t('Notifications')}
          </Typography>
          {!!unread.length && (
            <Tooltip title="Mark all as read">
              <IconButton color="primary" onClick={handleMarkAllAsRead}>
                <Iconify icon="eva:done-all-fill" />
              </IconButton>
            </Tooltip>
          )}

          {!smUp && (
            <IconButton onClick={drawer.onFalse}>
              <Iconify icon="mingcute:close-line" />
            </IconButton>
          )}
        </Stack>

        <Divider />
        <Scrollbar>
          <List disablePadding>
            {!loading &&
              allNotifications.map((notification, idx) => (
                <NotificationPatient
                  handleClick={handleClick}
                  key={idx}
                  notification={notification}
                  unread={unread}
                />
              ))}
          </List>

          {hasMore && (
            <Box sx={{ p: 1 }}>
              <LoadingButton
                fullWidth
                loading={loading}
                onClick={(e) => {
                  e.preventDefault();
                  // setPage((prev) => prev + 1);
                }}
                size="large"
              >
                {t('see more')}
              </LoadingButton>
            </Box>
          )}
        </Scrollbar>
      </Drawer>
    </>
  );
}
