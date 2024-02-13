import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useTranslate } from 'src/locales';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import FinancilMovment from '../FinancilMovment';

// ----------------------------------------------------------------------

export default function Financilmovment() {
  const settings = useSettingsContext();
  const { t } = useTranslate();
  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading={t('financil movment')}
        links={[
          { name: t('dashboard'), href: paths.dashboard.root },
          { name: t('user'), href: paths.dashboard.user.root },
          { name: t('financil movment') },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <FinancilMovment />
    </Container>
  );
}
