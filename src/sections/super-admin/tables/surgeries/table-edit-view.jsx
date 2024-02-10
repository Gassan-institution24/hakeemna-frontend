import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import { useTranslate } from 'src/locales';
import { useParams } from 'src/routes/hooks';

import { useGetSurgery } from 'src/api';

import TableNewEditForm from './table-new-edit-form';

// ----------------------------------------------------------------------

export default function CountryEditView() {
  const settings = useSettingsContext();

  const { t } = useTranslate();

  const params = useParams();
  const { id } = params;
  const { data } = useGetSurgery(id);
  // console.log(data);
  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Update Surgery" /// edit
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
            name: 'Surgeries',
            href: paths.superadmin.tables.surgeries.root, /// edit
          },
          { name: 'Update Surgery' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />
      {data && <TableNewEditForm currentSelected={data} />}
    </Container>
  );
}
