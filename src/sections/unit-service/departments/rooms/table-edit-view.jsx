import PropTypes from 'prop-types';

import Container from '@mui/material/Container';

import { useSettingsContext } from 'src/components/settings';

import TableNewEditForm from './table-new-edit-form';

// ----------------------------------------------------------------------

export default function TableEditView({ roomData, departmentData }) {
  const settings = useSettingsContext();
  return (
    <Container maxWidth="xl">
      {/* <CustomBreadcrumbs
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
            name: `${departmentData.name_english || 'Department'} Rooms`,
            href: paths.unitservice.departments.rooms.root(departmentData._id),
          },
          { name: 'Edit Room' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      /> */}
      {roomData && departmentData && (
        <TableNewEditForm departmentData={departmentData} currentTable={roomData} />
      )}
    </Container>
  );
}
TableEditView.propTypes = {
  departmentData: PropTypes.object,
  roomData: PropTypes.object,
};
