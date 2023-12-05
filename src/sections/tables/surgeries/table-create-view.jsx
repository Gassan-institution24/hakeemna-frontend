import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import TableNewEditForm from './table-new-edit-form';

// ----------------------------------------------------------------------

export default function CountryCreateView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Create a new Surgery" /// edit
        links={[
          {
            name: 'Dashboard',
            href: paths.superadmin,
          },
          {
            name: 'tables',
            href: paths.superadmin.tables.list,
          },
          {
            name: 'Surgeries',                   /// edit
            href: paths.superadmin.tables.surgeries.root,
          },  
          { name: 'New surgery' },        /// edit
        ]} 
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <TableNewEditForm />
    </Container>
  );
}
