import PropTypes from 'prop-types';
import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import TableNewEditForm from './table-new-edit-form';

// ----------------------------------------------------------------------

export default function TableEditView({ WorkGroupData, departmentData }) {
  const settings = useSettingsContext();
  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Edit Room"
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
            name: `${departmentData.name_english || 'Department'} Work group`,
            href: paths.unitservice.departments.workGroups.root(departmentData._id),
          },
          { name: 'Edit Room' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />
      {WorkGroupData && departmentData && (
        <TableNewEditForm departmentData={departmentData} currentTable={WorkGroupData} />
      )}
    </Container>
  );
}
TableEditView.propTypes = {
  departmentData: PropTypes.object,
  WorkGroupData: PropTypes.object,
};
