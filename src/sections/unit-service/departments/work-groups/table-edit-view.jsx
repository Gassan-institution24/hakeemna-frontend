import PropTypes from 'prop-types';

import Container from '@mui/material/Container';

// import { useSettingsContext } from 'src/components/settings';

import TableNewEditForm from './table-new-edit-form';

// ----------------------------------------------------------------------

export default function TableEditView({ WorkGroupData, departmentData }) {
  // const settings = useSettingsContext();
  return (
    <Container maxWidth="xl">
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
