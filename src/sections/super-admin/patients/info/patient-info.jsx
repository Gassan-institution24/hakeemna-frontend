import PropTypes from 'prop-types';
import { useState, useCallback } from 'react';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import Label from 'src/components/label';
import { useSettingsContext } from 'src/components/settings';

import JobDetailsToolbar from './patient-info-toolbar';
import JobDetailsContent from './patient-info-content';

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
