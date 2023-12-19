import PropTypes from 'prop-types';
import { useState, useCallback } from 'react';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { _jobs, JOB_DETAILS_TABS, JOB_PUBLISH_OPTIONS } from 'src/_mock';

import Label from 'src/components/label';
import { useSettingsContext } from 'src/components/settings';

import JobDetailsToolbar from './movement-info-toolbar';
import JobDetailsContent from './movement-info-content';

// ----------------------------------------------------------------------

export default function EconomicMovementInfoView({ patientData }) {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
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
