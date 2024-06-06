import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';
import { useParams } from 'src/routes/hooks';

import { useGetFamilyType } from 'src/api';

// import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import TableNewEditForm from './table-new-edit-form';

// ----------------------------------------------------------------------

export default function TableEditView() {
  // const settings = useSettingsContext();
  const params = useParams();
  const { id } = params;
  const { Family } = useGetFamilyType(id);
  return (
    <Container maxWidth="xl">
      <CustomBreadcrumbs
        heading="Update family relation"
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
            name: 'family relations',
            href: paths.superadmin.tables.family_relation.root,
          },
          { name: 'Update' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />
      {Family && <TableNewEditForm currentTable={Family} />}
    </Container>
  );
}
