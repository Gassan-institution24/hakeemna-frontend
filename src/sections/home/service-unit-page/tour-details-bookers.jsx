import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import { alpha } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';

import { useLocales, useTranslate } from 'src/locales';

import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function TourDetailsBookers({ bookers }) {
  return (
    <Box
      gap={3}
      sx={{ mt: 2 }}
      display="grid"
      gridTemplateColumns={{
        xs: 'repeat(1, 1fr)',
        sm: 'repeat(2, 1fr)',
        md: 'repeat(3, 1fr)',
      }}
    >
      {bookers
        .filter((employee) => employee.visibility_US_page)
        .map((booker) => (
          <BookerItem
            key={booker._id}
            booker={booker}
          // selected={approved.includes(booker._id)}
          // onSelected={() => handleClick(booker._id)}
          />
        ))}
    </Box>
  );
}

TourDetailsBookers.propTypes = {
  bookers: PropTypes.array,
};

// ----------------------------------------------------------------------

function BookerItem({ booker, selected, onSelected }) {
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const phoneNumber = booker?.employee?.phone;
  const senderEmail = booker?.employee?.email;

  const makePhoneCall = () => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) {
      window.location.href = `tel:${phoneNumber}`;
    } else {
      window.open(`https://web.whatsapp.com/send?phone=${phoneNumber}`);
    }
  };
  const sendMessage = () => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) {
      window.location.href = `whatsapp://send?phone=${phoneNumber}`;
    } else {
      window.open(`https://web.whatsapp.com/send?phone=${phoneNumber}`);
    }
  };
  const sendEmail = () => {
    const mailtoLink = `mailto:?to=&subject=&body=&to=${senderEmail}`;
    window.location.href = mailtoLink;
  };

  return (
    <Stack component={Card} direction="row" spacing={2} key={booker.id} sx={{ p: 3 }}>
      <Avatar
        alt={booker?.employee?.name_english}
        src={booker?.employee?.picture}
        sx={{ width: 48, height: 48 }}
      />

      <Stack spacing={2} flexGrow={1}>
        <ListItemText
          primary={curLangAr ? booker?.employee?.name_arabic : booker?.employee?.name_english}
          secondary={
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <Iconify icon="solar:users-group-rounded-bold" width={16} />
              {curLangAr
                ? booker.employee?.speciality?.name_arabic
                : booker?.employee?.speciality?.name_english}
            </Stack>
          }
          secondaryTypographyProps={{
            mt: 0.5,
            component: 'span',
            typography: 'caption',
            color: 'text.disabled',
          }}
        />

        <Stack spacing={1} direction="row">
          <IconButton
            size="small"
            color="error"
            disabled={!phoneNumber}
            sx={{
              borderRadius: 1,
              bgcolor: (theme) => alpha(theme.palette.error.main, 0.08),
              '&:hover': {
                bgcolor: (theme) => alpha(theme.palette.error.main, 0.16),
              },
            }}
            onClick={makePhoneCall}
          >
            <Iconify width={18} icon="solar:phone-bold" />
          </IconButton>

          <IconButton
            size="small"
            color="info"
            disabled={!phoneNumber}
            sx={{
              borderRadius: 1,
              bgcolor: (theme) => alpha(theme.palette.info.main, 0.08),
              '&:hover': {
                bgcolor: (theme) => alpha(theme.palette.info.main, 0.16),
              },
            }}
            onClick={sendMessage}
          >
            <Iconify width={18} icon="solar:chat-round-dots-bold" />
          </IconButton>

          <IconButton
            size="small"
            color="primary"
            disabled={!senderEmail}
            sx={{
              borderRadius: 1,
              bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
              '&:hover': {
                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.16),
              },
            }}
            onClick={sendEmail}
          >
            <Iconify width={18} icon="fluent:mail-24-filled" />
          </IconButton>
        </Stack>
      </Stack>

      <Button lang="en" size="small" variant="outlined" color="inherit" onClick={onSelected}>
        {t('visit profile')}
      </Button>
    </Stack>
  );
}

BookerItem.propTypes = {
  booker: PropTypes.object,
  onSelected: PropTypes.func,
  selected: PropTypes.bool,
};
