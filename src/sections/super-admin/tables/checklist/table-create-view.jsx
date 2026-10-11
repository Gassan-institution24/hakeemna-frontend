import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import TableNewEditForm from './table-new-edit-form';

// ----------------------------------------------------------------------

export default function TableCreateView() {
  return (
    <Container maxWidth="xl">
      <CustomBreadcrumbs
        heading="New speciality questionnaire"
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
            name: 'questionnaires',
            href: paths.superadmin.tables.checklist.root,
          },
          { name: 'New questionnaire' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <TableNewEditForm />
    </Container>
  );
}
