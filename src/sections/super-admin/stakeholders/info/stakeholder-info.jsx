import PropTypes from 'prop-types';
import { useState, useCallback } from 'react';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { _jobs, JOB_DETAILS_TABS, JOB_PUBLISH_OPTIONS } from 'src/_mock';

import Label from 'src/components/label';
import { useSettingsContext } from 'src/components/settings';

import StakeholderDetailsToolbar from './stakeholder-info-toolbar';
import StakeholderDetailsContent from './stakeholder-info-content';

// ----------------------------------------------------------------------

export default function StakeholderDetailsView({ stakeholderData }) {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <StakeholderDetailsToolbar
        backLink={paths.superadmin.stakeholders.root}
        // editLink={paths.superadmin.stakeholders.edit(`${stakeholderData?._id}`)}
        liveLink="#"
      />

      <StakeholderDetailsContent stakeholderData={stakeholderData} />
    </Container>
  );
}

StakeholderDetailsView.propTypes = {
  stakeholderData: PropTypes.object,
};
