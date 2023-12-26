import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import { useParams } from 'src/routes/hooks';

import { useGetSubscription } from 'src/api/tables';

import TableNewEditForm from './table-new-edit-form';

// ----------------------------------------------------------------------

export default function TableEditView() {
  const settings = useSettingsContext();
  const params = useParams();
  const { id } = params;
  const { data } = useGetSubscription(id);
  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Update Subscription"
        links={[
          {
            name: 'Dashboard',
            href: paths.superadmin,
          },
          {
            name: 'Subscriptions',
            href: paths.superadmin.subscriptions.root,
          },
          { name: 'Update Subscription' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />
      {data && <TableNewEditForm currentTable={data} />}
    </Container>
  );
}
