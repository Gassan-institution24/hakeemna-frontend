import PropTypes from 'prop-types';
import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import TableNewEditForm from '../create-edit-employee';

// ----------------------------------------------------------------------

export default function TableCreateView({departmentData}) {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Create a new Employee Account"
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
            name: `${departmentData.name_english||'Department'} Employees`,
            href: paths.unitservice.departments.employees.root,
          },
          { name: 'New Employee' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <TableNewEditForm departmentData={departmentData} />
    </Container>
  );
}
TableCreateView.propTypes = {
  departmentData: PropTypes.object,
};
