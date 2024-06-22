import { Helmet } from 'react-helmet-async';

import { Container } from '@mui/material';

import { paths } from 'src/routes/paths';

import { useTranslate } from 'src/locales';

import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import WatingRoom from 'src/sections/user/waitingRoom';

// ----------------------------------------------------------------------

export default function Watingroomstatus() {
  const { t } = useTranslate();

  return (
    <>
      <Helmet>
        <title>{t('watingroom')}</title>
        <meta name="description" content="meta" />
      </Helmet>
      <Container maxWidth="xl">
        <CustomBreadcrumbs
          heading={t('Wating room')}
          links={[
            { name: t('dashboard'), href: paths.dashboard.root },
            { name: t('user'), href: paths.dashboard.user.root },
            { name: t('Wating room') },
          ]}
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <WatingRoom />
      </Container>
    </>
  );
}
