import PropTypes from 'prop-types';
import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import TableNewEditForm from '../employees/activities/table-new-edit-form';

// ----------------------------------------------------------------------

export default function TableCreateView({ employeeData }) {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Create a new Activity"
        links={[
          {
            name: t('dashboard'),
            href: paths.unitservice.root,
          },
          {
            name: t('employees'),
            href: paths.unitservice.employees.root,
          },
          {
            name: `${employeeData.name_english || ''} Activities`,
            href: paths.unitservice.departments.activities.root(employeeData._id),
          },
          { name: 'New Activity' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <TableNewEditForm employeeData={employeeData} />
    </Container>
  );
}
TableCreateView.propTypes = {
  employeeData: PropTypes.object,
};
