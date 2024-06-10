import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';
import { useParams } from 'src/routes/hooks';

import { useGetCheckList } from 'src/api';

// import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import TableNewEditForm from './table-new-edit-form';

// ----------------------------------------------------------------------

export default function TableEditView() {
  // const settings = useSettingsContext();
  const params = useParams();
  const { id } = params;
  const { data } = useGetCheckList(id);
  return (
    <Container maxWidth="xl">
      <CustomBreadcrumbs
        heading="Update checklist"
        links={[
          {
            name: 'dashboard',
            href: paths.employee.root,
          },
          {
            name: 'checklists',
            href: paths.employee.checklist.root,
          },
          { name: 'Update' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />
      {data && <TableNewEditForm currentRow={data} />}
    </Container>
  );
}
