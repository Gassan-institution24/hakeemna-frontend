import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';
import { useParams } from 'src/routes/hooks';

import { useGetDiet } from 'src/api';
import { useTranslate } from 'src/locales';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import TableNewEditForm from './table-new-edit-form';

// ----------------------------------------------------------------------

export default function TableEditView() {
  const settings = useSettingsContext();

  const { t } = useTranslate();

  const params = useParams();
  const { id } = params;
  const { data } = useGetDiet(id);
  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Update Diet"
        links={[
          {
            name: 'dashboard',
            href: paths.superadmin,
          },
          {
            name: 'tables',
            href: paths.superadmin.tables.list,
          },
          {
            name: 'Diets',
            href: paths.superadmin.tables.diets.root,
          },
          { name: 'Update Diet' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />
      {data && <TableNewEditForm currentSelected={data} />}
    </Container>
  );
}
