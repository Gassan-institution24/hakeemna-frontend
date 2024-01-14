import PropTypes from 'prop-types';
import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import TableNewEditForm from './table-new-edit-form';

// ----------------------------------------------------------------------

export default function TableEditView({employeeData,activityData}) {
  const settings = useSettingsContext();
  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading={`Edit ${activityData.name_english||''} Activity`}
        links={[
          {
            name: 'Dashboard',
            href: paths.unitservice.root,
          },
          {
            name: 'Departments',
            href: paths.unitservice.departments.root,
          },
          {
            name: `${employeeData.name_english || ''} Activities`,
            href: paths.unitservice.departments.activities.root(employeeData._id),
          },
          { name: `Edit ${activityData.name_english||''} Activity` },
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
