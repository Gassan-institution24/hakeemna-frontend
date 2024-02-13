import PropTypes from 'prop-types';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import TableNewEditForm from './table-new-edit-form';

// ----------------------------------------------------------------------

export default function TableEditView({ employeeData, activityData }) {
  const settings = useSettingsContext();
  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading={`${t('edit')} ${activityData.name_english || ''} ${t('activity')}`}
        links={[
          {
            name: t('dashboard'),
            href: paths.unitservice.root,
          },
          {
            name: t('departments'),
            href: paths.unitservice.departments.root,
          },
          {
            name: `${employeeData.name_english || ''} Activities`,
            href: paths.unitservice.departments.activities.root(employeeData._id),
          },
          { name: t('edit') },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />
      {activityData && <TableNewEditForm employeeData={employeeData} currentTable={activityData} />}
    </Container>
  );
}
TableEditView.propTypes = {
  activityData: PropTypes.object,
  employeeData: PropTypes.object,
};
