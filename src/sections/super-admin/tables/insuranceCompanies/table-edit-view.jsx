import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';
import { useParams } from 'src/routes/hooks';

import { useTranslate } from 'src/locales';
import { useGetInsuranceCo } from 'src/api';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import TableNewEditForm from './table-new-edit-form';

// ----------------------------------------------------------------------

export default function TableEditView() {
  const settings = useSettingsContext();

  const { t } = useTranslate();

  const params = useParams();
  const { id } = params;
  const { isuranceData } = useGetInsuranceCo(id);
  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Update Insurance Company"
        links={[
          {
            name: t('dashboard'),
            href: paths.superadmin,
          },
          {
            name: 'tables',
            href: paths.superadmin.tables.list,
          },
          {
            name: 'Insurance Companies',
            href: paths.superadmin.tables.insurancecomapnies.root,
          },
          { name: 'Update Insurance Company' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />
      {isuranceData && <TableNewEditForm currentTable={isuranceData} />}
    </Container>
  );
}
