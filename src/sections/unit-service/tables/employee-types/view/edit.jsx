import PropTypes from 'prop-types';
import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import TableNewEditForm from '../table-new-edit-form';

// ----------------------------------------------------------------------

export default function TableEditView({employeeTypeData}) {
  const settings = useSettingsContext();
  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Edit employee type"
        links={[
          {
            name: 'Dashboard',
            href: paths.unitservice.root,
          },
          {
            name: 'Employee types',
            href: paths.unitservice.tables.employeetypes.root,
          },
          { name: 'Edit employee type' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />
      {employeeTypeData && <TableNewEditForm currentTable={employeeTypeData} />}
    </Container>
  );
}
TableEditView.propTypes = {
  employeeTypeData: PropTypes.object,
};
