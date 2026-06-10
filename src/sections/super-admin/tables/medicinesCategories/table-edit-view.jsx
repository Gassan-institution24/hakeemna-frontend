import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';
import { useParams } from 'src/routes/hooks';

import { useGetMedicinesCategory } from 'src/api';

import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import TableNewEditForm from './table-new-edit-form';

// ----------------------------------------------------------------------

export default function TableEditView() {
  const params = useParams();
  const { id } = params;
  const { data } = useGetMedicinesCategory(id);

  return (
    <Container maxWidth="xl">
      <CustomBreadcrumbs
        heading="Update Medicines Category"
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
            name: 'Medicines Categories',
            href: paths.superadmin.tables.medicinesCategories.root,
          },
          { name: 'Update Medicines Category' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />
      {data && <TableNewEditForm currentSelected={data} />}
    </Container>
  );
}
