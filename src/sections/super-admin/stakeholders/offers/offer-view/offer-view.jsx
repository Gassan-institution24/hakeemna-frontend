import PropTypes from 'prop-types';
import { useState, useCallback } from 'react';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { _jobs, JOB_DETAILS_TABS, JOB_PUBLISH_OPTIONS } from 'src/_mock';

import Label from 'src/components/label';
import { useSettingsContext } from 'src/components/settings';

import StakeholderOfferToolbar from './offer-view-toolbar';
import StakeholderOfferContent from './offer-view-content';

// ----------------------------------------------------------------------

export default function StakeholderOfferView({ stakeholderData, offerData }) {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <StakeholderOfferToolbar
        backLink={paths.superadmin.stakeholders.offers(stakeholderData._id)}
        // editLink={paths.superadmin.stakeholders.edit(`${stakeholderData?._id}`)}
      />

      <StakeholderOfferContent offerData={offerData} stakeholderData={stakeholderData} />
    </Container>
  );
}

StakeholderOfferView.propTypes = {
  stakeholderData: PropTypes.object,
  offerData: PropTypes.object,
};
