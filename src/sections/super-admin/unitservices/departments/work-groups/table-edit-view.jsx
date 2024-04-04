import PropTypes from 'prop-types';

import Container from '@mui/material/Container';

// import { useSettingsContext } from 'src/components/settings';

import TableNewEditForm from './table-new-edit-form';

// ----------------------------------------------------------------------

export default function TableEditView({ WorkGroupData, departmentData }) {
  // const settings = useSettingsContext();
  return (
    <Container maxWidth="xl">
      {/* <CustomBreadcrumbs
        heading={t('Edit work group')}
        links={[
          {
            name: t('dashboard'),
            href: paths.superadmin.unitservices.root,
          },
          {
            name: t('departments'),
            href: paths.superadmin.unitservices.departments.root(id),
          },
          {
            name: `${
              curLangAr
                ? departmentData.name_arabic
                : departmentData.name_english || t('department')
            } ${t('work groups')}`,
            href: paths.superadmin.unitservices.departments.workGroups.root(departmentData._id),
          },
          { name: t('edit') },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      /> */}
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
