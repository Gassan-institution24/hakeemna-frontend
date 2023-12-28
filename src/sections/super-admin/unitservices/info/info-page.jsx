import PropTypes from 'prop-types';
import { useState, useCallback } from 'react';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { _jobs, JOB_DETAILS_TABS, JOB_PUBLISH_OPTIONS } from 'src/_mock';

import Label from 'src/components/label';
import { useSettingsContext } from 'src/components/settings';

import UnitServiceDetailsToolbar from './info-toolbar';
import UnitServiceDetailsContent from './info-content';

// ----------------------------------------------------------------------

export default function UnitServiceDetailsView({ unitServiceData }) {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <UnitServiceDetailsToolbar
        backLink={paths.superadmin.unitservices.root}
        // editLink={paths.superadmin.UnitServices.edit(`${unitServiceData?._id}`)}
        liveLink="#"
      />

      <UnitServiceDetailsContent unitServiceData={unitServiceData} />
    </Container>
  );
}

UnitServiceDetailsView.propTypes = {
  unitServiceData: PropTypes.object,
};
