import { m } from 'framer-motion';
import { useState, useCallback, useEffect } from 'react';

import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import List from '@mui/material/List';
import Stack from '@mui/material/Stack';
import Badge from '@mui/material/Badge';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { useRouter } from 'src/routes/hooks';
import axios, { endpoints } from 'src/utils/axios';
import { useBoolean } from 'src/hooks/use-boolean';
import { useGetMyNotifications, useGetMyUnreadNotificationCount } from 'src/api';
import { useResponsive } from 'src/hooks/use-responsive';

import { HOST_API } from 'src/config-global';
import { socket } from 'src/socket';
import { useAuthContext } from 'src/auth/hooks';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { varHover } from 'src/components/animate';

import NotificationItem from './notification-item';

// ----------------------------------------------------------------------

// const TABS = [
//   {
//     value: 'all',
//     label: 'All',
//     count: 22,
//   },
//   {
//     value: 'unread',
//     label: 'Unread',
//     count: 12,
//   },
//   {
//     value: 'archived',
//     label: 'Archived',
//     count: 10,
//   },
// ];

// ----------------------------------------------------------------------

export default function NotificationsPopover() {
  // console.log('socket',socket)

  const router = useRouter();

  const drawer = useBoolean();

  const { user } = useAuthContext();

  const smUp = useResponsive('up', 'sm');

  // const [currentTab, setCurrentTab] = useState('all');

  // const handleChangeTab = useCallback((event, newValue) => {
  //   setCurrentTab(newValue);
  // }, []);

  const { notifications, refetch, loading } = useGetMyNotifications(
    user._id,
    user?.employee?.employee_engagements?.[user?.employee?.selected_engagement]?._id
  );

  // console.log('notifications', notifications);
  const { notificationscount, recount } = useGetMyUnreadNotificationCount(
    user._id,
    user?.employee?.employee_engagements?.[user?.employee?.selected_engagement]?._id
  );

  const handleClick = async (id, link) => {
    await axios.patch(endpoints.tables.readNotification(id));
    drawer.onFalse();
    router.push(link);
    refetch();
    recount();
  };
  // const [notifications, setNotifications] = useState(_notifications);

  // const totalUnRead = notifications.filter((item) => item.isUnRead === true).length;

  const handleMarkAllAsRead = async () => {
    await axios.patch(`${endpoints.tables.notifications}/read`, { ids: notificationscount });
    recount();
    refetch();
  };

  const renderHead = (
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
  );

  // const renderTabs = (
  //   <Tabs value={currentTab} onChange={handleChangeTab}>
  //     {TABS.map((tab) => (
  //       <Tab
  //         key={tab.value}
  //         iconPosition="end"
  //         value={tab.value}
  //         label={tab.label}
  //         icon={
  //           <Label
  //             variant={((tab.value === 'all' || tab.value === currentTab) && 'filled') || 'soft'}
  //             color={
  //               (tab.value === 'unread' && 'info') ||
  //               (tab.value === 'archived' && 'success') ||
  //               'default'
  //             }
  //           >
  //             {tab.count}
  //           </Label>
  //         }
  //         sx={{
  //           '&:not(:last-of-type)': {
  //             mr: 3,
  //           },
  //         }}
  //       />
  //     ))}
  //   </Tabs>
  // );

  const renderList = (
    <Scrollbar>
      <List disablePadding>
        {!loading &&
          notifications?.map((notification) => (
            <NotificationItem
              handleClick={handleClick}
              key={notification.id}
              notification={notification}
            />
          ))}
      </List>
    </Scrollbar>
  );

  useEffect(() => {
    socket.on('error', (data) => {
      console.log('data', data);
      refetch();
      recount();
    });
    socket.on('created', (data) => {
      console.log('data', data);
      refetch();
      recount();
    });
    socket.on('updated', (data) => {
      console.log('data', data);
      refetch();
      recount();
    });
  }, [refetch, recount]);

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
        {renderHead}

        {/* <Divider />

        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ pl: 2.5, pr: 1 }}
        >
          {renderTabs}
          <IconButton onClick={handleMarkAllAsRead}>
            <Iconify icon="solar:settings-bold-duotone" />
          </IconButton>
        </Stack> */}

        <Divider />

        {renderList}

        <Box sx={{ p: 1 }}>
          <Button fullWidth size="large">
            View All
          </Button>
        </Box>
      </Drawer>
    </>
  );
}
