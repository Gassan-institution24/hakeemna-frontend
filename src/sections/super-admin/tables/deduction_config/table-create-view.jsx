import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useTranslate } from 'src/locales';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import TableNewEditForm from './table-new-edit-form';

// ----------------------------------------------------------------------

export default function TableCreateView() {
  const settings = useSettingsContext();
  const { t } = useTranslate();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Create a new Deduction"
        links={[
          {
            name: 'dashboard',
            href: paths.superadmin,
          },
          {
            name: 'Tables',
            href: paths.superadmin.tables.list,
          },
          {
            name: 'Deductions',
            href: paths.superadmin.tables.deductionconfig.root,
          },
          { name: 'New Deduction' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <TableNewEditForm />
    </Container>
  );
}
