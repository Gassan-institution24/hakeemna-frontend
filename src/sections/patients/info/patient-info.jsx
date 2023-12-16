import PropTypes from 'prop-types';
import { useState, useCallback } from 'react';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { _jobs, JOB_DETAILS_TABS, JOB_PUBLISH_OPTIONS } from 'src/_mock';

import Label from 'src/components/label';
import { useSettingsContext } from 'src/components/settings';

import JobDetailsToolbar from './patient-info-toolbar';
import JobDetailsContent from './patient-info-content';
import JobDetailsCandidates from './patient-info-bookers';

// ----------------------------------------------------------------------

export default function JobDetailsView({ patientData }) {
  const settings = useSettingsContext();

  const [currentTab, setCurrentTab] = useState('content');

  const handleChangeTab = useCallback((event, newValue) => {
    setCurrentTab(newValue);
  }, []);

  // const renderTabs = (
  //   <Tabs
  //     value={currentTab}
  //     onChange={handleChangeTab}
  //     sx={{
  //       mb: { xs: 3, md: 5 },
  //     }}
  //   >
  //     {JOB_DETAILS_TABS.map((tab) => (
  //       <Tab
  //         key={tab.value}
  //         iconPosition="end"
  //         value={tab.value}
  //         label={tab.label}
  //         icon={
  //           tab.value === 'candidates' ? (
  //             ''
  //           ) : (
  //             ''
  //           )
  //         }
  //       />
  //     ))}
  //   </Tabs>
  // );

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <JobDetailsToolbar
        backLink={paths.superadmin.patients.root}
        editLink={paths.superadmin.patients.edit(`${patientData?._id}`)}
        liveLink="#"
      />
      {/* {renderTabs} */}

      {currentTab === 'content' && <JobDetailsContent patientData={patientData} />}

      {currentTab === 'candidates' && <JobDetailsCandidates candidates={patientData?.candidates} />}
    </Container>
  );
}

JobDetailsView.propTypes = {
  patientData: PropTypes.object,
};
