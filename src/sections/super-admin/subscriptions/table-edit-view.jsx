import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';
import { useParams } from 'src/routes/hooks';

import { useTranslate } from 'src/locales';
import { useGetSubscription } from 'src/api';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import TableNewEditForm from './table-new-edit-form';

// ----------------------------------------------------------------------

export default function TableEditView() {
  const settings = useSettingsContext();

  const { t } = useTranslate();

  const params = useParams();
  const { id } = params;
  const { data } = useGetSubscription(id);
  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading={t('Update Subscription')}
        links={[
          {
            name: 'dashboard',
            href: paths.superadmin,
          },
          {
            name: t('Subscriptions'),
            href: paths.superadmin.subscriptions.root,
          },
          { name: t('Update Subscription') },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />
      {data && <TableNewEditForm currentTable={data} />}
    </Container>
  );
}
