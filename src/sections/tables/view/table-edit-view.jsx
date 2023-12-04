import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import { useParams } from 'src/routes/hooks';

import { useGetCity } from 'src/api/tables';

import TableNewEditForm from '../cities/cities-table-new-edit-form';

// ----------------------------------------------------------------------

export default function TableEditView() {
  const settings = useSettingsContext();
  const params = useParams();
  const { id } = params;
  const { data } = useGetCity(id);
  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Update city"
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
            name: 'cities',
            href: paths.superadmin.tables.cities,
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
