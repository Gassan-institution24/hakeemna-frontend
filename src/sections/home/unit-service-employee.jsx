import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import { alpha } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useLocales, useTranslate } from 'src/locales';

import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function UnitServiceEmployees({ employees }) {
  const { t } = useTranslate();
  const router = useRouter();
  const handleClick = (employee) => {
    router.push(
      paths.pages.doctor(
        `${employee?._id}_${employee.employee?.[t('name_english')]?.replace(/ /g, '-')}`
      )
    );
  };
  return (
    <Box
      gap={3}
      sx={{ mt: 2 }}
      display="grid"
      gridTemplateColumns={{
        xs: 'repeat(1, 1fr)',
        md: 'repeat(2, 1fr)',
        xl: 'repeat(3, 1fr)',
      }}
    >
      {employees
        .filter((employee) => employee.visibility_US_page)
        .map((employee) => (
          <EmployeeCard
            key={employee._id}
            employee={employee}
            // selected={approved.includes(employee._id)}
            onSelected={() => handleClick(employee)}
          />
        ))}
    </Box>
  );
}

UnitServiceEmployees.propTypes = {
  employees: PropTypes.array,
};

// ----------------------------------------------------------------------

function EmployeeCard({ employee, selected, onSelected }) {
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const phoneNumber = employee?.employee?.phone;
  const senderEmail = employee?.employee?.email;

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
    <Stack component={Card} direction="row" spacing={2} key={employee.id} sx={{ p: 3 }}>
      <Avatar
        alt={employee?.employee?.name_english}
        src={employee?.employee?.picture}
        sx={{ width: 48, height: 48 }}
      />

      <Stack spacing={{ md: 2, xs: 1 }} flexGrow={1}>
        <ListItemText
          component="h2"
          primary={curLangAr ? employee?.employee?.name_arabic : employee?.employee?.name_english}
          secondary={
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <Iconify icon="solar:users-group-rounded-bold" width={16} />
              {curLangAr
                ? employee.employee?.speciality?.name_arabic
                : employee?.employee?.speciality?.name_english}
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

      <Button
        sx={{ width: 100 }}
        size="small"
        variant="outlined"
        color="inherit"
        onClick={onSelected}
      >
        {t('visit profile')}
      </Button>
    </Stack>
  );
}

EmployeeCard.propTypes = {
  employee: PropTypes.object,
  onSelected: PropTypes.func,
  selected: PropTypes.bool,
};
