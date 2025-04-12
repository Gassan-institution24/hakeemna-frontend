import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';
import { useParams } from 'src/routes/hooks';

import { useGetCompany } from 'src/api';

// import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import TableNewEditForm from './table-new-edit-form';

// ----------------------------------------------------------------------

export default function TableEditView() {
  // const settings = useSettingsContext();

  const params = useParams();
  const { id } = params;
  const { data } = useGetCompany(id);
  return (
    <Container maxWidth="xl">
      <CustomBreadcrumbs
        heading="Update doctor"
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
            name: 'doctors',
            href: paths.superadmin.tables.doctors.root,
          },
          { name: 'Update doctor' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />
      {data && <TableNewEditForm currentSelected={data} />}
    </Container>
  );
}
