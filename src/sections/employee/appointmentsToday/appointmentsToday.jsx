import { useState, useCallback } from 'react';

import { Tab, Tabs } from '@mui/material';

import Iconify from 'src/components/iconify';

export default function AppointmentsToday() {
  const TABS = [
    {
      value: 'one',
      icon: <Iconify icon="solar:phone-bold" width={24} />,
      label: 'Item One',
    },
    {
      value: 'two',
      icon: <Iconify icon="solar:heart-bold" width={24} />,
      label: 'Item Two',
    },
    {
      value: 'three',
      icon: <Iconify icon="eva:headphones-fill" width={24} />,
      label: 'Item Three',
      disabled: true,
    },
    {
      value: 'four',
      icon: <Iconify icon="eva:headphones-fill" width={24} />,
      label: 'Item Four',
    },
    {
      value: 'five',
      icon: <Iconify icon="eva:headphones-fill" width={24} />,
      label: 'Item Five',
      disabled: true,
    },
    {
      value: 'six',
      icon: <Iconify icon="eva:headphones-fill" width={24} />,
      label: 'Item Six',
    },
    {
      value: 'seven',
      icon: <Iconify icon="eva:headphones-fill" width={24} />,
      label: 'Item Seven',
    },
  ];
  const [currentTab, setCurrentTab] = useState('one');

  const handleChangeTab = useCallback((event, newValue) => {
    setCurrentTab(newValue);
  }, []);

  return (
    // <Box
    //   sx={{
    //     py: 5,
    //     bgcolor: (theme) => (theme.palette.mode === 'light' ? 'grey.200' : 'grey.800'),
    //   }}
    // >
      <Tabs value={currentTab} onChange={handleChangeTab}>
        {TABS.slice(0, 3).map((tab) => (
          <Tab
            iconPosition="end"
            key={tab.value}
            icon={tab.icon}
            label={tab.label}
            value={tab.value}
            // disabled={tab.disabled}
          />
        ))}
      </Tabs>
    // </Box>
  );
}
