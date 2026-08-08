import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useTranslate } from 'src/locales';

import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import DemoAccountNewForm from './demo-account-new-form';

// ----------------------------------------------------------------------

export default function DemoAccountCreateView() {
  const { t } = useTranslate();

  return (
    <Container maxWidth="xl">
      <CustomBreadcrumbs
        heading={t('New demo account')}
        links={[
          {
            name: 'dashboard',
            href: paths.superadmin.root,
          },
          {
            name: 'users',
            href: paths.superadmin.users.root,
          },
          { name: t('demo account') },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <DemoAccountNewForm />
    </Container>
  );
}
