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
import { useGetMyNotifications } from 'src/api';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { varHover } from 'src/components/animate';

import NotificationItem from './notification-item';

// ----------------------------------------------------------------------

export default function NotificationsPopover() {
  const router = useRouter();
  const drawer = useBoolean();
  const { t } = useTranslate();
  const { user } = useAuthContext();
  const smUp = useResponsive('up', 'sm');

  const [page, setPage] = useState(1);
  const [allNotifications, setAllNotifications] = useState([]);

  const { notifications, hasMore, unread, refetch, loading } = useGetMyNotifications({
    id: user?._id,
    emid: user?.employee?.employee_engagements?.[user?.employee?.selected_engagement]?._id,
    shid: user?.stakeholder?._id,
    page,
  });

  const handleClick = async (id, link) => {
    drawer.onFalse();
    if (link) router.push(link);
    await axios.patch(endpoints.notifications.readOne(id));
    setAllNotifications([]);
    setPage(1);
    refetch();
  };

  const handleMarkAllAsRead = async () => {
    await axios.patch(`${endpoints.notifications.all}/read`, { ids: unread });
    setAllNotifications([]);
    setPage(1);
    refetch();
  };

  // Register user in socket rooms and listen for targeted notifications
  useEffect(() => {
    const onConnect = () => socket.emit('sendUser', user);
    const onCheckUsers = () => socket.emit('sendUser', user);
    const onNewNotification = () => {
      setAllNotifications([]);
      setPage(1);
      refetch();
    };

    socket.on('connect', onConnect);
    socket.on('checkUsers', onCheckUsers);
    socket.on('notification:new', onNewNotification);

    return () => {
      socket.off('connect', onConnect);
      socket.off('checkUsers', onCheckUsers);
      socket.off('notification:new', onNewNotification);
      socket.emit('disconnected');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    setAllNotifications((prev) => [...prev, ...notifications]);
  }, [notifications]);

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
        slotProps={{ backdrop: { invisible: true } }}
        PaperProps={{ sx: { width: 1, maxWidth: 420 } }}
      >
        <Stack direction="row" alignItems="center" sx={{ py: 2, pl: 2.5, pr: 1, minHeight: 68 }}>
          <Typography lang="ar" variant="h6" sx={{ flexGrow: 1 }}>
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
            {allNotifications.map((notification) => (
              <NotificationItem
                key={notification._id}
                notification={notification}
                handleClick={handleClick}
              />
            ))}
          </List>

          {hasMore && (
            <Box sx={{ p: 1 }}>
              <LoadingButton
                fullWidth
                loading={loading}
                onClick={() => setPage((prev) => prev + 1)}
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
