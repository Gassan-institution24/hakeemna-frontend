import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';
import { useParams } from 'src/routes/hooks';

import { useGetTax } from 'src/api';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import TableNewEditForm from './table-new-edit-form';

// ----------------------------------------------------------------------

export default function TableEditView() {
  const settings = useSettingsContext();

  const params = useParams();
  const { id } = params;
  const { data } = useGetTax(id);
  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Update Tax"
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
            name: 'Taxes',
            href: paths.superadmin.tables.taxes.root,
          },
          { name: 'Update Tax' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />
      {data && <TableNewEditForm currentTable={data} />}
    </Container>
  );
}
