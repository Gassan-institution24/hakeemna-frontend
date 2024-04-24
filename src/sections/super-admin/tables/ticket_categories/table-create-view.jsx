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
        heading="Create ticket category"
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
            name: 'ticket categories',
            href: paths.superadmin.tables.ticketCategories.root,
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
