import PropTypes from 'prop-types';
import { useState, useCallback } from 'react';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Container from '@mui/material/Container';

// import { _tours, TOUR_DETAILS_TABS, TOUR_PUBLISH_OPTIONS } from 'src/_mock';

import { useGetUnitservice, useGetUSAvailableAppointments } from 'src/api';

import Label from 'src/components/label';
// import { useSettingsContext } from 'src/components/settings';

import TourDetailsContent from '../tour-details-content';

// ----------------------------------------------------------------------

const TOUR_DETAILS_TABS = [
  { value: 'content', label: 'Tour Content' },
  { value: 'bookers', label: 'Booker' },
];

export default function TourDetailsView({ id }) {
  // const settings = useSettingsContext();

  const { data } = useGetUnitservice(id);
  const { appointmentsData } = useGetUSAvailableAppointments(id);

  // const [publish, setPublish] = useState(currentTour?.publish);

  const [currentTab, setCurrentTab] = useState('content');

  const handleChangeTab = useCallback((event, newValue) => {
    setCurrentTab(newValue);
  }, []);

  // const handleChangePublish = useCallback((newValue) => {
  //   setPublish(newValue);
  // }, []);

  const renderTabs = (
    <Tabs
      value={currentTab}
      onChange={handleChangeTab}
      sx={{
        mb: { xs: 3, md: 5 },
      }}
    >
      {TOUR_DETAILS_TABS.map((tab) => (
        <Tab
          key={tab.value}
          iconPosition="end"
          value={tab.value}
          label={tab.label}
          icon={
            tab.value === 'bookers' ? <Label variant="filled">{data?.bookers?.length}</Label> : ''
          }
        />
      ))}
    </Tabs>
  );

  return (
    <Container sx={{ mt: 7 }} maxWidth="xl">
      {/* <TourDetailsToolbar
        // backLink={paths.dashboard.tour.root}
        // editLink={paths.dashboard.tour.edit(`${currentTour?.id}`)}
        liveLink="#"
        // publish={publish || ''}
        // onChangePublish={handleChangePublish}
        // publishOptions={TOUR_PUBLISH_OPTIONS}
      /> */}
      {/* {renderTabs} */}
      {currentTab === 'content' && data && <TourDetailsContent tour={data} />}
      {/* {currentTab === 'bookers' && appointmentsData && (
        <TourDetailsBookers bookers={appointmentsData} />
      )} */}
    </Container>
  );
}

TourDetailsView.propTypes = {
  id: PropTypes.string,
};
