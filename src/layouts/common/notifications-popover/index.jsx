import { m } from 'framer-motion';
import { useEffect, useState } from 'react';

import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Stack from '@mui/material/Stack';
import Badge from '@mui/material/Badge';
import { LoadingButton } from '@mui/lab';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';
import { useResponsive } from 'src/hooks/use-responsive';

import axios, { endpoints } from 'src/utils/axios';

import socket from 'src/socket';
import { useAuthContext } from 'src/auth/hooks';
import { useGetMyNotifications, useGetMyUnreadNotificationCount } from 'src/api';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { varHover } from 'src/components/animate';

import NotificationItem from './notification-item';

// ----------------------------------------------------------------------

export default function NotificationsPopover() {
  const router = useRouter();

  const drawer = useBoolean();

  const { user } = useAuthContext();

  const smUp = useResponsive('up', 'sm');

  const [notifications, setNotifications] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  /* eslint-disable */
  const fetchData = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      // Update the URL to match your API endpoint structure
      const response = await axios.get(
        `${endpoints.tables.myNotifications(
          user?._id,
          user?.employee?.employee_engagements?.[user?.employee?.selected_engagement]?._id
        )}?page=${page}`
      );
      const { notifications: newNotifications, hasMore: hasMoreData } = response.data;
      setNotifications((prev) => [...prev, ...newNotifications]);
      setPage((prevPage) => prevPage + 1);
      setHasMore(hasMoreData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  /* eslint-enable */

  const { notificationscount, recount } = useGetMyUnreadNotificationCount(
    user?._id,
    user?.employee?.employee_engagements?.[user?.employee?.selected_engagement]?._id
  );

  const handleClick = async (id, link) => {
    drawer.onFalse();
    router.push(link);
    await axios.patch(endpoints.tables.readNotification(id));
    fetchData();
    recount();
  };

  const handleMarkAllAsRead = async () => {
    await axios.patch(`${endpoints.tables.notifications}/read`, { ids: notificationscount });
    recount();
    fetchData();
  };

  useEffect(() => {
    socket.on('error', (data) => {
      fetchData();
      recount();
    });
    socket.on('created', (data) => {
      fetchData();
      recount();
    });
    socket.on('updated', (data) => {
      fetchData();
      recount();
    });
  }, [fetchData, recount]);

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
        <Badge badgeContent={notificationscount.length} color="error">
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
            Notifications
          </Typography>

          {!!notificationscount.length && (
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
            {/* {!loading && */}
            {notifications?.map((notification, index) => (
              <NotificationItem handleClick={handleClick} key={index} notification={notification} />
            ))}
          </List>
          <Box sx={{ p: 1 }}>
            <LoadingButton
              fullWidth
              loading={loading}
              disabled={!hasMore}
              onClick={(e) => {
                e.preventDefault();
                fetchData();
              }}
              size="large"
            >
              {hasMore ? 'see more' : 'notifications end'}
            </LoadingButton>
          </Box>
        </Scrollbar>
      </Drawer>
    </>
  );
}
