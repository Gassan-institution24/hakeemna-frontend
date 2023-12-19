import PropTypes from 'prop-types';
import { useState, useCallback } from 'react';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { _jobs, JOB_DETAILS_TABS, JOB_PUBLISH_OPTIONS } from 'src/_mock';

import Label from 'src/components/label';
import { useSettingsContext } from 'src/components/settings';

import MovementToolbar from 'src/sections/economic-movements/show-economic-movement/movement-info-toolbar';
import EconomicMovementContent from 'src/sections/economic-movements/show-economic-movement/movement-info-content';

// ----------------------------------------------------------------------

export default function EconomicMovementInfoView({ economicMovementData }) {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <MovementToolbar
        backLink={paths.superadmin.patients.root}
        editLink={paths.superadmin.patients.edit(`${economicMovementData?._id}`)}
        liveLink="#"
      />

      <EconomicMovementContent economicMovementData={economicMovementData} />
    </Container>
  );
}

EconomicMovementInfoView.propTypes = {
  economicMovementData: PropTypes.object,
};
