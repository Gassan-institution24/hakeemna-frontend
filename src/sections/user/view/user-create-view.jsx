import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';
import { useTranslate } from 'src/locales';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import ContactUs from '../contactus';

// ----------------------------------------------------------------------

export default function ContactUsView() {
  const settings = useSettingsContext();
  const { t } = useTranslate();
  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading={t('create a new user')}
        links={[
          {
            name: t('dashboard'),
            href: paths.dashboard.root,
          },
          {
            name: t('user'),
            href: paths.dashboard.user.root,
          },
          { name: t('new user') },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <ContactUs />
    </Container>
  );
}
