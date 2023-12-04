import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import { useParams } from 'src/routes/hooks';

import { useGetCountry } from 'src/api/tables';

import TableNewEditForm from './table-new-edit-form';

// ----------------------------------------------------------------------

export default function CountryEditView() {
  const settings = useSettingsContext();
  const params = useParams();
  const { id } = params;
  const { data } = useGetCountry(id);
  console.log(data)
  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Update Country"
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
            name: 'countries',
            href: paths.superadmin.tables.countries.root,
          },
          { name: 'Update country' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />
      {data && <TableNewEditForm currentSelected={data} />}
    </Container>
  );
}
