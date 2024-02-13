import PropTypes from 'prop-types';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useSettingsContext } from 'src/components/settings';

import JobDetailsContent from './patient-info-content';
import JobDetailsToolbar from './patient-info-toolbar';

// ----------------------------------------------------------------------

export default function JobDetailsView({ patientData }) {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <JobDetailsToolbar
        backLink={paths.superadmin.patients.root}
        // editLink={paths.superadmin.patients.edit(`${patientData?._id}`)}
        // liveLink="#"
      />

      <JobDetailsContent patientData={patientData} />
    </Container>
  );
}

JobDetailsView.propTypes = {
  patientData: PropTypes.object,
};
