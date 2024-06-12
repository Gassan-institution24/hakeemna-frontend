import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

// import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import TableNewEditForm from './table-new-edit-form';

// ----------------------------------------------------------------------

export default function CountryCreateView() {
  // const settings = useSettingsContext();
  return (
    <Container maxWidth="xl">
      <CustomBreadcrumbs
        heading="Create a new product category" /// edit
        links={[
          {
            name: 'dashboard',
            href: paths.superadmin.root,
          },
          {
            name: 'tables',
            href: paths.superadmin.tables.list,
          },
          {
            name: 'product categories', /// edit
            href: paths.superadmin.tables.productCat.root,
          },
          { name: 'New' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />
      <TableNewEditForm />
    </Container>
  );
}
