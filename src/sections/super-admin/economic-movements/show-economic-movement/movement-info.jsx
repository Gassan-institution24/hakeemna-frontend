import PropTypes from 'prop-types';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useSettingsContext } from 'src/components/settings';

import JobDetailsToolbar from './movement-info-toolbar';
import JobDetailsContent from './movement-info-content';

// ----------------------------------------------------------------------

export default function EconomicMovementInfoView({ patientData }) {
  const settings = useSettingsContext();

  return (
    <Container maxWidth="xl">
      <JobDetailsToolbar
        backLink={paths.superadmin.patients.root}
        editLink={paths.superadmin.patients.edit(`${patientData?._id}`)}
        liveLink="#"
      />

      <JobDetailsContent patientData={patientData} />
    </Container>
  );
}

EconomicMovementInfoView.propTypes = {
  patientData: PropTypes.object,
};
