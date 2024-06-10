import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import TableNewEditForm from './table-new-edit-form';

// ----------------------------------------------------------------------

export default function TableCreateView() {
  return (
    <Container maxWidth="xl">
      <CustomBreadcrumbs
        heading="Create a new checklist"
        links={[
          {
            name: 'dashboard',
            href: paths.employee.root,
          },
          {
            name: 'checklists',
            href: paths.employee.checklist.root,
          },
          { name: 'New checklist' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <TableNewEditForm />
    </Container>
  );
}
