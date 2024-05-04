import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useTranslate } from 'src/locales';

import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import HistoryHead from '../history';

// ----------------------------------------------------------------------

export default function History() {
  const { t } = useTranslate();
  return (
    <Container maxWidth="xl">
      <CustomBreadcrumbs
        heading={t('history')}
        links={[
          { name: t('dashboard'), href: paths.dashboard.root },
          { name: t('user'), href: paths.dashboard.user.root },
          { name: t('history') },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <HistoryHead />
    </Container>
  );
}
