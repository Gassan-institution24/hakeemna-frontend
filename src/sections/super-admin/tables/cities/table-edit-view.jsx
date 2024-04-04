import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';
import { useParams } from 'src/routes/hooks';

import { useGetCity } from 'src/api';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import TableNewEditForm from './cities-create-edit-one';

// ----------------------------------------------------------------------

export default function TableEditView() {
  const settings = useSettingsContext();

  const params = useParams();
  const { id } = params;
  const { data } = useGetCity(id);
  return (
    <Container maxWidth="xl">
      <CustomBreadcrumbs
        heading="Update city"
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
            name: 'cities',
            href: paths.superadmin.tables.cities.root,
          },
          { name: 'Update city' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />
      {data && <TableNewEditForm currentCity={data} />}
    </Container>
  );
}
