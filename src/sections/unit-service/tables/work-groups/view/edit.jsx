import PropTypes from 'prop-types';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useTranslate } from 'src/locales';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import TableNewEditForm from '../table-new-edit-form';

// ----------------------------------------------------------------------

export default function TableEditView({ WorkGroupData }) {
  const settings = useSettingsContext();
  const { t } = useTranslate();
  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading={t('edit room')}
        links={[
          {
            name: t('dashboard'),
            href: paths.unitservice.root,
          },
          {
            name: t('work groups'),
            href: paths.unitservice.tables.workgroups.root,
          },
          { name: t('edit') },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />
      {WorkGroupData && <TableNewEditForm currentTable={WorkGroupData} />}
    </Container>
  );
}
TableEditView.propTypes = {
  WorkGroupData: PropTypes.object,
};
