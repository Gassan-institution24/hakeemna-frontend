import Container from '@mui/material/Container';
import { paths } from 'src/routes/paths';
import { _userCards } from 'src/_mock';
import { useTranslate } from 'src/locales';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import AppointmentBooking from '../appointments-booking';

// ----------------------------------------------------------------------

export default function BookingAppointment() {
  const settings = useSettingsContext();
  const { t } = useTranslate();
  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Book Appointment"
        links={[
          { name: t('dashboard'), href: paths.dashboard.root },
          { name: t('user'), href: paths.dashboard.user.root },
          { name: 'Book Appointment' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <AppointmentBooking users={_userCards} />
    </Container>
  );
}
