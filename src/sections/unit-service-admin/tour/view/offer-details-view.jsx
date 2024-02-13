import PropTypes from 'prop-types';
import { useState, useCallback } from 'react';

import Tabs from '@mui/material/Tabs';
import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useGetOffer } from 'src/api/user';

import { useSettingsContext } from 'src/components/settings';

import TourDetailsToolbar from '../offer-details-toolbar';
import TourDetailsContent from '../offer-details-content';

// ----------------------------------------------------------------------

export default function TourDetailsView({ id }) {
  const settings = useSettingsContext();
  const { data } = useGetOffer(id);
  const [publish, setPublish] = useState(data?.publish);

  const [currentTab, setCurrentTab] = useState('content');

  const handleChangeTab = useCallback((event, newValue) => {
    setCurrentTab(newValue);
  }, []);

  const handleChangePublish = useCallback((newValue) => {
    setPublish(newValue);
  }, []);

  const renderTabs = (
    <Tabs
      value={currentTab}
      onChange={handleChangeTab}
      sx={{
        mb: { xs: 3, md: 5 },
      }}
    >
      {/* {TOUR_DETAILS_TABS.map((tab) => (
        <Tab
          key={tab.value}
          iconPosition="end"
          value={tab.value}
          label={tab.label}
          icon={
            tab.value === 'bookers' ? (
              <Label variant="filled">{data?.bookers?.length}</Label>
            ) : (
              ''
            )
          }
        />
      ))} */}
    </Tabs>
  );

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <TourDetailsToolbar
        backLink={paths.dashboard.tour.root}
        editLink={paths.dashboard.tour.edit(id)}
        liveLink="#"
        publish={publish || ''}
        onChangePublish={handleChangePublish}
      />
      {renderTabs}

      {currentTab === 'content' && <TourDetailsContent tour={data} />}

      {/* {currentTab === 'bookers' && <TourDetailsBookers bookers={data?.bookers} />} */}
    </Container>
  );
}

TourDetailsView.propTypes = {
  id: PropTypes.string,
};
