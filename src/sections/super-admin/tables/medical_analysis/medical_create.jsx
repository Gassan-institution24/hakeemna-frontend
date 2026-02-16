import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useTranslate } from 'src/locales';

// import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import TableNewEditForm from './table-new-edit-form';

// ----------------------------------------------------------------------

export default function TableCreateView() {
  // const settings = useSettingsContext();
  const { t } = useTranslate();
  return (
    <Container maxWidth="xl">
      <CustomBreadcrumbs
        heading={t('Create a new Medical Analysis')}
        links={[
          {
            name: 'dashboard',
            href: paths.superadmin.root,
          },
          {
            name: 'Tables',
            href: paths.superadmin.tables.list,
          },
          {
            name: 'medical analysis',
            href: paths.superadmin.tables.medicalAnalysis.root,
          },
          { name: 'New Medical Analysis' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <TableNewEditForm />
    </Container>
  );
}
