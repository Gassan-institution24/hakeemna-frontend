import { useState, useCallback } from 'react';

import { Tab, Tabs } from '@mui/material';
import Container from '@mui/material/Container';

import AllOffers from '../all-offers';
import AllProducts from '../all-products';

// ----------------------------------------------------------------------

export default function TableCreateView() {
  const [currentTab, setCurrentTab] = useState('products');
  const handleChangeTab = useCallback((event, newValue) => {
    setCurrentTab(newValue);
  }, []);
  const TABS = [
    {
      value: 'products',
      label: 'products',
    },
    {
      value: 'offers',
      label: 'offers',
    },
  ];
  return (
    <Container maxWidth="xl">
      <Tabs
        value={currentTab}
        onChange={handleChangeTab}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      >
        {TABS.map((tab, idx) => (
          <Tab key={idx} sx={{ fontSize: 16 }} label={tab.label} value={tab.value} />
        ))}
      </Tabs>
      {currentTab === 'products' && <AllProducts />}
      {currentTab === 'offers' && <AllOffers />}
    </Container>
  );
}
