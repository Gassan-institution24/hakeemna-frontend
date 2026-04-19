import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';
import { useParams } from 'src/routes/hooks';

import { useGetMedicalAnalysisById } from 'src/api/medical_analysis';

// import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import TableNewEditForm from './table-new-edit-form';

// ----------------------------------------------------------------------

export default function TableEditView() {
  // const settings = useSettingsContext();

  const params = useParams();
  const { id } = params;
  const { medicalAnalysis } = useGetMedicalAnalysisById(id);
  return (
    <Container maxWidth="xl">
      <CustomBreadcrumbs
        heading="Update Medical Analysis"
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
            name: 'medical analysis',
            href: paths.superadmin.tables.medicalAnalysis.root,
          },
          { name: 'Update Medical Analysis' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />
      {medicalAnalysis && <TableNewEditForm currentTable={medicalAnalysis} />}
    </Container>
  );
}
