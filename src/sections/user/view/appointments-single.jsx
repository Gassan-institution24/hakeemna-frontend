import { Helmet } from 'react-helmet-async';
import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';
import { useTranslate } from 'src/locales';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import PatientsAppointment from '../availableappointments';
// ----------------------------------------------------------------------

export default function UserAppointmentsBook() {
  const settings = useSettingsContext();
  const { t } = useTranslate();
  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading={t('Book appointment')}
        links={[
          { name: t('dashboard'), href: paths.dashboard.root },
          { name: t('user'), href: paths.dashboard.user.root },
          { name: t('book appointment') },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <PatientsAppointment />
    </Container>
  );
}
