import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';
import { useParams } from 'src/routes/hooks';

import { useGetSurgery } from 'src/api';

// import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import TableNewEditForm from './table-new-edit-form';

// ----------------------------------------------------------------------

export default function CountryEditView() {
  // const settings = useSettingsContext();

  const params = useParams();
  const { id } = params;
  const { data } = useGetSurgery(id);

  return (
    <Container maxWidth="xl">
      <CustomBreadcrumbs
        heading="Update Surgery" /// edit
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
            name: 'Surgeries',
            href: paths.superadmin.tables.surgeries.root, /// edit
          },
          { name: 'Update Surgery' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />
      {data && <TableNewEditForm currentSelected={data} />}
    </Container>
  );
}
