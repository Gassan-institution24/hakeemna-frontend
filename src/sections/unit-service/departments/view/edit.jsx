import PropTypes from 'prop-types';
import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import TableNewEditForm from '../department-new-edit-form';

// ----------------------------------------------------------------------

export default function TableEditView({departmentData}) {
  const settings = useSettingsContext();
  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Update Department"
        links={[
          {
            name: 'Dashboard',
            href: paths.unitservice,
          },
          {
            name: 'Departments',
            href: paths.unitservice.departments.root,
          },
          { name: 'Update Department' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />
      {departmentData && <TableNewEditForm currentTable={departmentData} />}
    </Container>
  );
}
TableEditView.propTypes = {
  departmentData: PropTypes.object,
};