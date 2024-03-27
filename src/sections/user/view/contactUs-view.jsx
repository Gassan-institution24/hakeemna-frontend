import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useTranslate } from 'src/locales';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import Contact from '../contactus';

// ----------------------------------------------------------------------

export default function ContactUsView() {
  const settings = useSettingsContext();
  const { t } = useTranslate();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading={t('contact us')}
        links={[
          {
            name: t('dashboard'),
            href: paths.dashboard.root,
          },
          {
            name: t('user'),
            href: paths.dashboard.user.root,
          },
          { name: t('How can we help') },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <Contact />
    </Container>
  );
}
