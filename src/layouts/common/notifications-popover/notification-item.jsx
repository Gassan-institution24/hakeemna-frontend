import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import { Button } from '@mui/material';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';

import axios from 'src/utils/axios';
import { fToNow } from 'src/utils/format-time';
import { useLocales, useTranslate } from 'src/locales';

// ----------------------------------------------------------------------

export default function NotificationItem({ notification, handleClick }) {
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const isUnread = notification.status === 'UNREAD';

  // Handle employee-invite accept (API action)
  const handleAccept = async () => {
    try {
      const { method, url, payload } = notification.action || {};
      if (!method || !url) return;
      if (!['get', 'post', 'put', 'delete'].includes(method.toLowerCase())) {
        throw new Error('Invalid method in notification action');
      }
      await axios[method.toLowerCase()](url, payload);
      window.location.reload();
    } catch (error) {
      console.error('[NotificationItem] handleAccept:', error);
    }
  };

  const renderAvatar = (
    <ListItemAvatar>
      {notification.image ? (
        <Avatar src={notification.image} sx={{ bgcolor: 'background.neutral' }} />
      ) : (
        <Stack
          alignItems="center"
          justifyContent="center"
          sx={{ width: 40, height: 40, borderRadius: '50%', bgcolor: 'background.neutral' }}
        >
          <Box
            component="img"
            src={`/assets/icons/notification/${
              (notification.type === 'error' && 'error') ||
              (notification.type === 'RECORD_CREATED' && 'created') ||
              (notification.type === 'RECORD_UPDATED' && 'updated') ||
              (notification.type === 'FAMILY_INVITE' && 'request') ||
              'created'
            }.svg`}
            sx={{ width: 24, height: 24 }}
          />
        </Stack>
      )}
    </ListItemAvatar>
  );

  const renderText = (
    <ListItemText
      lang="ar"
      disableTypography
      primary={renderHtml(curLangAr ? notification.title_ar : notification.title)}
      secondary={
        <Stack
          direction="row"
          alignItems="center"
          sx={{ typography: 'caption', color: 'text.disabled', flexWrap: 'wrap' }}
          divider={
            <Box
              sx={{ width: 2, height: 2, bgcolor: 'currentColor', mx: 0.5, borderRadius: '50%' }}
            />
          }
        >
          {fToNow(notification.createdAt, curLangAr)}
          {t(notification.category)}
        </Stack>
      }
    />
  );

  const renderUnreadBadge = isUnread && (
    <Box
      sx={{
        top: 26,
        width: 8,
        height: 8,
        right: 20,
        borderRadius: '50%',
        bgcolor: 'info.main',
        position: 'absolute',
      }}
    />
  );

  const friendAction = (
    <Stack spacing={1} direction="row" sx={{ mt: 1.5 }}>
      <Button onClick={handleAccept} size="small" variant="contained">
        {t('accept')}
      </Button>
      <Button size="small" variant="outlined">
        {t('decline')}
      </Button>
    </Stack>
  );

  return (
    <ListItemButton
      disableRipple
      onClick={() => handleClick(notification._id, notification.action?.url)}
      sx={{
        p: 2.5,
        alignItems: 'flex-start',
        overflow: 'hidden',
        borderBottom: (theme) => `dashed 1px ${theme.palette.divider}`,
      }}
    >
      {renderUnreadBadge}
      {renderAvatar}
      <Stack sx={{ flexWrap: 'wrap', wordWrap: 'break-word' }}>
        {renderText}
        {notification.type === 'FAMILY_INVITE' && isUnread && friendAction}
      </Stack>
    </ListItemButton>
  );
}

NotificationItem.propTypes = {
  notification: PropTypes.object,
  handleClick: PropTypes.func,
};

// ----------------------------------------------------------------------

function renderHtml(data) {
  return (
    <Box
      dangerouslySetInnerHTML={{ __html: data }}
      sx={{
        mb: 0.5,
        '& p': { typography: 'body2', m: 0 },
        '& a': { color: 'inherit', textDecoration: 'none' },
        '& strong': { typography: 'subtitle2' },
      }}
    />
  );
}
