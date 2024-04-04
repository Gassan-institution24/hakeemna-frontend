import PropTypes from 'prop-types';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useSettingsContext } from 'src/components/settings';

import PatientInfoContent from './patient-info-content';
import PatientInfoToolbar from './patient-info-toolbar';

// ----------------------------------------------------------------------

export default function PatientsInfoView({ patientData }) {
  const settings = useSettingsContext();

  return (
    <Container maxWidth="xl">
      <PatientInfoToolbar
        backLink={paths.superadmin.patients.root}
        // editLink={paths.superadmin.patients.edit(`${patientData?._id}`)}
        // liveLink="#"
      />

      <PatientInfoContent patientData={patientData} />
    </Container>
  );
}

PatientsInfoView.propTypes = {
  patientData: PropTypes.object,
};
