import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

// import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import TableNewEditForm from './table-new-edit-form';

// ----------------------------------------------------------------------

export default function TableCreateView() {
  // const settings = useSettingsContext();

  return (
    <Container maxWidth="xl">
      <CustomBreadcrumbs
        heading="Create a new family relation"
        links={[
          {
            name: 'dashboard',
            href: paths.superadmin.root,
          },
          {
            name: 'Tables',
            href: paths.superadmin.tables.list,
          },
          {
            name: 'family relations',
            href: paths.superadmin.tables.family_relation.root,
          },
          { name: 'New family relation' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <TableNewEditForm />
    </Container>
  );
}
