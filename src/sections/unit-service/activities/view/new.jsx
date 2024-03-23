import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useTranslate } from 'src/locales';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import TableNewEditForm from '../table-new-edit-form';

// ----------------------------------------------------------------------

export default function TableCreateView() {
  const settings = useSettingsContext();
  const { t } = useTranslate();
  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading={t('Create a new activity')}
        links={[
          {
            name: t('dashboard'),
            href: paths.unitservice.root,
          },
          {
            name: t('activities'),
            href: paths.unitservice.tables.activities.root,
          },
          { name: t('new') },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <TableNewEditForm />
    </Container>
  );
}
