import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import { Button } from '@mui/material';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';

import { fToNow } from 'src/utils/format-time';
import axios, { endpoints } from 'src/utils/axios';

import { useAuthContext } from 'src/auth/hooks';
import { useLocales, useTranslate } from 'src/locales';
import { useSnackbar } from 'src/components/snackbar';

// ----------------------------------------------------------------------

export default function NotificationPatient({ notification, handleClick }) {
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';
  const { user } = useAuthContext();
  const { enqueueSnackbar } = useSnackbar();

  const isUnread = notification.status === 'UNREAD';

  // recipient = the patient who received the invite (current user)
  // sender    = the patient who sent the invite
  const handleAddFamily = async () => {
    try {
      const relation = notification?.metadata?.RelativeRelation;

      await axios.patch(endpoints.patients.one(user?.patient?._id), {
        family_members: [
          { patient: notification?.sender },
          { RelativeRelation: relation },
          { isendit: 'no' },
        ],
      });
      await axios.patch(endpoints.patients.one(notification?.sender), {
        family_members: [
          { patient: notification?.recipient },
          { RelativeRelation: relation },
          { isendit: 'yes' },
        ],
      });

      await axios.post(`${endpoints.notifications.all}/accept`, {
        sender: notification?.recipient,
        sender_model: 'patients',
        recipient: notification?.sender,
        recipient_model: 'patients',
        title: `${user?.patient?.name_english} accepted your invitation`,
        title_ar: `${user?.patient?.name_arabic} وافق على الانظمام`,
        image: 'https://cdn-icons-png.flaticon.com/512/6193/6193226.png',
        category: 'SYSTEM',
        type: 'FAMILY_ACCEPTED',
      });

      enqueueSnackbar(t('Invitation Accepted'));
    } catch (error) {
      enqueueSnackbar(
        curLangAr ? `${error.arabic_message || error.message}` : `${error.message}`,
        { variant: 'error' }
      );
      console.error(error);
    }
  };

  const handleConfirmation = async (id) => {
    await axios.patch(`${endpoints.appointments.one(id)}/coming`, { coming: 'true' });
  };

  const handleUnConfirmation = async (id) => {
    await axios.patch(`${endpoints.appointments.one(id)}/coming`, { coming: 'false' });
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
            src={`/assets/icons/notification/${notification.type === 'FAMILY_INVITE' ? 'request' : 'created'}.svg`}
            sx={{ width: 24, height: 24 }}
          />
        </Stack>
      )}
    </ListItemAvatar>
  );

  const appointments = notification?.metadata?.appointments || [];

  const beAmember = (
    <Stack spacing={1} direction="row" sx={{ mt: 1.5 }}>
      <Button size="small" variant="contained" onClick={handleAddFamily}>
        {t('Accept')}
      </Button>
      <Button size="small" variant="outlined">
        {t('Decline')}
      </Button>
    </Stack>
  );

  const medicineTaken = (
    <Stack spacing={1} direction="row" sx={{ mt: 1.5 }}>
      <Button
        size="small"
        variant="contained"
        onClick={async () => {
          try {
            await axios.post(endpoints.drugs.taken, notification?.action?.payload);
          } catch (e) {
            console.error(e);
          }
        }}
      >
        {t('took')}
      </Button>
      <Button size="small" variant="outlined">
        {t('skip')}
      </Button>
    </Stack>
  );

  const confirmation = (
    <Stack spacing={1} direction="row" sx={{ mt: 1.5 }}>
      {appointments.map((info, i) => (
        <Button key={i} size="small" variant="contained" onClick={() => handleConfirmation(info?._id)}>
          {t('yes')}
        </Button>
      ))}
      {appointments.map((info, i) => (
        <Button key={`no-${i}`} size="small" variant="outlined" onClick={() => handleUnConfirmation(info?._id)}>
          {t('no')}
        </Button>
      ))}
    </Stack>
  );

  const renderText = (
    <ListItemText
      disableTypography
      primary={renderHtml(curLangAr ? notification.title_ar : notification.title)}
      secondary={
        <Stack
          direction="row"
          alignItems="center"
          sx={{ typography: 'caption', color: 'text.disabled', flexWrap: 'wrap', wordWrap: 'break-word' }}
          divider={
            <Box sx={{ width: 2, height: 2, bgcolor: 'currentColor', mx: 0.5, borderRadius: '50%' }} />
          }
        >
          {fToNow(notification.createdAt, curLangAr)}
        </Stack>
      }
      primaryTypographyProps={{ flexWrap: 'wrap', wordWrap: 'break-word', whiteSpace: 'wrap' }}
    />
  );

  const renderUnreadBadge = isUnread && (
    <Box
      sx={{
        top: 15,
        width: 8,
        height: 8,
        right: 20,
        borderRadius: '50%',
        bgcolor: 'info.main',
        position: 'absolute',
      }}
    />
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

      {(() => {
        if (notification.type === 'FAMILY_INVITE') {
          return (
            <Stack sx={{ flexWrap: 'wrap', wordWrap: 'break-word' }}>
              {renderText}
              {isUnread && beAmember}
            </Stack>
          );
        }
        if (notification.type === 'MEDICINE_REMINDER') {
          return (
            <Stack sx={{ flexWrap: 'wrap', wordWrap: 'break-word' }}>
              {renderText}
              {isUnread && medicineTaken}
            </Stack>
          );
        }
        return (
          <Stack sx={{ flexWrap: 'wrap', wordWrap: 'break-word' }}>
            {renderText}
            {notification.type === 'APPOINTMENT_REMINDER' && isUnread && confirmation}
          </Stack>
        );
      })()}
    </ListItemButton>
  );
}

NotificationPatient.propTypes = {
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
