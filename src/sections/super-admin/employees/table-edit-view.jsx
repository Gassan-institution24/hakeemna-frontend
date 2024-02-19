import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';
import { useParams } from 'src/routes/hooks';

import { useGetUser } from 'src/api';
import { useTranslate } from 'src/locales';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import TableNewEditForm from './table-new-edit-form';

// ----------------------------------------------------------------------

export default function CountryEditView() {
  const settings = useSettingsContext();

  const params = useParams();
  const { id } = params;
  const { data } = useGetUser(id);
  console.log(data);
  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Edit user"
        links={[
          {
            name: 'dashboard',
            href: paths.superadmin,
          },
          {
            name: 'users',
            href: paths.superadmin.users.root,
          },
          { name: 'edit' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />
      {data && <TableNewEditForm currentSelected={data} />}
    </Container>
  );
}
