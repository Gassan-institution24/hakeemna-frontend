import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';
import { useParams } from 'src/routes/hooks';

import { useGetQuestionnaireTemplate } from 'src/api';

// import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import TableNewEditForm from './table-new-edit-form';

// ----------------------------------------------------------------------

export default function TableEditView() {
  // const settings = useSettingsContext();
  const params = useParams();
  const { id } = params;
  const { template: data } = useGetQuestionnaireTemplate(id);
  return (
    <Container maxWidth="xl">
      <CustomBreadcrumbs
        heading="Update questionnaire"
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
            name: 'questionnaires',
            href: paths.superadmin.tables.checklist.root,
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
