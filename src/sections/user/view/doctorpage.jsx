import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useTranslate } from 'src/locales';

// import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import Doctorpage from '../appointments/doctorpage';

// ----------------------------------------------------------------------

export default function Doctorpageinfo() {
  const { t } = useTranslate();
  return (
    <Container maxWidth="xl">
      <CustomBreadcrumbs
        heading={t('Doctorpage')}
        links={[
          { name: t('dashboard'), href: paths.dashboard.root },
          { name: t('user'), href: paths.dashboard.user.root },
          { name: t('doctorpage') },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Doctorpage />
    </Container>
  );
}
