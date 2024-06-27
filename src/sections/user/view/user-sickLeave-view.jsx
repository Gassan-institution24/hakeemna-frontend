import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useTranslate } from 'src/locales';
import { useAuthContext } from 'src/auth/hooks';

import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import SickLeaves from '../sickLeave';
// ----------------------------------------------------------------------

export default function SickLeave() {
  const { user } = useAuthContext();
  const { t } = useTranslate();

  return (
    <Container>
      <CustomBreadcrumbs
        heading={t('sick Leave')}
        links={[
          { name: t('dashboard'), href: paths.dashboard.root },
          { name: t('user'), href: paths.dashboard.user.root },
          { name: t('sick Leave') },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <SickLeaves user={user?.patient._id} />
    </Container>
  );
}
