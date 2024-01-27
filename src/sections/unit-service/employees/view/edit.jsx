import PropTypes from 'prop-types';
import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import TableNewEditForm from '../new/create-edit-employee';

// ----------------------------------------------------------------------

export default function TableCreateView({ employeeData }) {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Edit Employee Account"
        links={[
          {
            name: 'Dashboard',
            href: paths.unitservice.root,
          },
          {
            name: 'Employees',
            href: paths.unitservice.employees.root,
          },
          { name: `Edit ${employeeData.first_name || ''} Employee` },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <TableNewEditForm currentTable={employeeData} />
    </Container>
  );
}
TableCreateView.propTypes = {
  employeeData: PropTypes.object,
};
