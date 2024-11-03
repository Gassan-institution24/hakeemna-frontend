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

export default function NotificationItem({ notification, handleClick }) {
  const { t } = useTranslate();
  const { currentLang } = useLocales();

  const curLangAr = currentLang.value === 'ar';
  const { user } = useAuthContext();
  const { enqueueSnackbar } = useSnackbar();
  const defaultValues = {
    sender: notification?.patient,
    patient: notification?.sender,
    title: `${user?.patient?.name_english} accept your invitation`,
    title_arabic: `${user?.patient?.name_arabic} وافق على الانظمام`,
    photo_URL: 'https://cdn-icons-png.flaticon.com/512/6193/6193226.png',
    category: 'accept',
    type: 'accept',
  };

  const handleAddFamily = async () => {
    try {
      await axios.patch(endpoints.patients.one(user?.patient?._id), {
        family_members: [
          { patient: notification?.sender },
          { RelativeRelation: notification?.members },
          { isendit: 'no' },
        ],
      });
      await axios.patch(endpoints.patients.one(notification?.sender), {
        family_members: [
          { patient: notification?.patient },
          { RelativeRelation: notification?.members },
          { isendit: 'yes' },
        ],
      });
      await axios.post(`${endpoints.notifications.all}/accept`, defaultValues);
      enqueueSnackbar(t('Invitation Accepted'));
    } catch (error) {
      // error emitted in backend
      enqueueSnackbar(
        curLangAr ? `${error.arabic_message}` || `${error.message}` : `${error.message}`,
        {
          variant: 'error',
        }
      );
      console.error(error);
    }
  };

  const handleConfirmation = async (id) => {
    await axios.patch(`${endpoints.appointments.one(id)}/coming`, {
      coming: 'true',
    });
  };
  const handleUnConfirmation = async (id) => {
    await axios.patch(`${endpoints.appointments.one(id)}/coming`, {
      coming: 'false',
    });
  };

  const renderAvatar = (
    <ListItemAvatar>
      {notification.photo_URL ? (
        <Avatar src={notification.photo_URL} sx={{ bgcolor: 'background.neutral' }} />
      ) : (
        <Stack
          alignItems="center"
          justifyContent="center"
          sx={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            bgcolor: 'background.neutral',
          }}
        >
          <Box
            component="img"
            src={`/assets/icons/notification/${notification.type === 'request' && 'request'}.svg`}
            sx={{ width: 24, height: 24 }}
          />
        </Stack>
      )}
    </ListItemAvatar>
  );
  const beAmember = (
    <Stack spacing={1} direction="row" sx={{ mt: 1.5 }}>
      <Button
        size="small"
        variant="contained"
        onClick={() => {
          handleAddFamily();
        }}
      >
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
            await axios.post(endpoints.drugs.taken, notification?.onAccept?.body)
          } catch (e) {
            console.log(e)
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
      {notification?.content?.map((info, i) => (
        <Button
          key={i}
          size="small"
          variant="contained"
          onClick={() => {
            handleConfirmation(info?._id);
          }}
        >
          {t('yes')}
        </Button>
      ))}

      {notification?.content?.map((info, i) => (
        <Button
          key={i}
          size="small"
          variant="contained"
          onClick={() => {
            handleUnConfirmation(info?._id);
          }}
        >
          {t('no')}
        </Button>
      ))}
    </Stack>
  );
  const renderText = (
    <ListItemText
      disableTypography
      primary={reader(curLangAr ? notification.title_arabic : notification.title)}
      secondary={
        <Stack
          direction="row"
          alignItems="center"
          sx={{
            typography: 'caption',
            color: 'text.disabled',
            flexWrap: 'wrap',
            wordWrap: 'break-word',
          }}
          divider={
            <Box
              sx={{
                width: 2,
                height: 2,
                bgcolor: 'currentColor',
                mx: 0.5,
                borderRadius: '50%',
              }}
            />
          }
        >
          {fToNow(notification.created_at, curLangAr)}
          {/* {t(notification.category)} */}
        </Stack>
      }
      primaryTypographyProps={{
        flexWrap: 'wrap',
        wordWrap: 'break-word',
        whiteSpace: 'wrap',
      }}
    />
  );

  const renderUnReadBadge = notification.isUnRead && (
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
      key={notification._id}
      disableRipple
      onClick={() => handleClick(notification._id, notification.link)}
      sx={{
        p: 2.5,
        alignItems: 'flex-start',
        overflow: 'hidden',
        borderBottom: (theme) => `dashed 1px ${theme.palette.divider}`,
      }}
    >
      {renderUnReadBadge}

      {renderAvatar}
      {/* eslint-disable-next-line */}
      {notification.type === 'invite' ? (
        <Stack sx={{ flexWrap: 'wrap', wordWrap: 'break-word' }}>
          {renderText}
          {notification?.isUnRead === true ? beAmember : ''}
        </Stack>
      ) : notification.type === 'took' ? (
        <Stack sx={{ flexWrap: 'wrap', wordWrap: 'break-word' }}>
          {renderText}
          {notification?.isUnRead === true ? medicineTaken : ''}
        </Stack>
      ) : (
        <Stack sx={{ flexWrap: 'wrap', wordWrap: 'break-word' }}>{renderText}</Stack>
      )}

      {notification.type === 'upcoming' ? (
        <Stack sx={{ flexWrap: 'wrap', wordWrap: 'break-word' }}>
          {notification?.isUnRead === true ? confirmation : ''}
        </Stack>
      ) : (
        ''
      )}
    </ListItemButton>
  );
}

NotificationItem.propTypes = {
  notification: PropTypes.object,
  handleClick: PropTypes.func,
};

// ----------------------------------------------------------------------

function reader(data) {
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
