import Button from '@mui/material/Button';
import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';
import { _userCards } from 'src/_mock';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import FinancilMovment from '../FinancilMovment';

// ----------------------------------------------------------------------

export default function Financilmovment() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Financil Movment"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'User', href: paths.dashboard.user.root },
          { name: 'Financil Movment' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <FinancilMovment />
    </Container>
  );
}
