import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useTranslate } from 'src/locales';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import { useParams } from 'src/routes/hooks';

import { useGetDepartment } from 'src/api';

import TableNewEditForm from './table-new-edit-form';

// ----------------------------------------------------------------------

export default function TableEditView() {
  const settings = useSettingsContext();
  const params = useParams();
  const { t } = useTranslate();
  const { id } = params;
  const { data } = useGetDepartment(id);
  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Update Department"
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
            name: t('departments'),
            href: paths.superadmin.tables.departments.root,
          },
          { name: 'Update Department' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />
      {data && <TableNewEditForm currentTable={data} />}
    </Container>
  );
}
