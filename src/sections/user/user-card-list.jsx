import { useAuthContext } from 'src/auth/hooks';

import { useState, useCallback } from 'react';

import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Tabs, { tabsClasses } from '@mui/material/Tabs';
import Box from '@mui/material/Box';



import { _userAbout, _userFeeds, _userFriends, _userGallery, _userFollowers } from 'src/_mock';

import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';

import UserCard from './user-card';

// ----------------------------------------------------------------------

export default function UserCardList() {
  const { user } = useAuthContext();
  const settings = useSettingsContext();
  const [currentTab, setCurrentTab] = useState('profile');

  const handleChangeTab = useCallback((event, newValue) => {
    setCurrentTab(newValue);
  }, []);

  const TABS = [
    {
      value: 'مواعيدي',
      label: 'مواعيدي',
      icon: <Iconify icon="solar:user-id-bold" width={24} />,
    },
    // {
    //   value: 'current medications',
    //   label: 'Current Medications',
    //   icon: <Iconify icon="icon-park-outline:medicine-chest" width={24} />,
    // },
    // {
    //   value: 'appointments',
    //   label: 'Appointments',
    //   icon: <Iconify icon="teenyicons:appointments-outline" width={24} />,
    // },
  ];

  return (
    <Container>
      <Card
        sx={{
          mb: 5,
          height: 50,
        }}
      >
        <Tabs
          value={currentTab}
          onChange={handleChangeTab}
          sx={{
            width: 1,
            bottom: 0,
            zIndex: 9,
            position: 'absolute',
            bgcolor: 'background.paper',
            [`& .${tabsClasses.flexContainer}`]: {
              pr: { md: 3 },
              justifyContent: {
                sm: 'center',
                md: 'flex-end',
              },
            },
          }}
        >
          {TABS.map((tab) => (
            <Tab key={tab.value} value={tab.value} icon={tab.icon} label={tab.label} />
          ))}
        </Tabs>
      </Card>

      {currentTab === 'مواعيدي' && (
        <Box
          gap={3}
          display="grid"
          gridTemplateColumns={{
            xs: 'repeat(1, 1fr)',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
          }}
        >
          <UserCard user={user.patient._id} />
        </Box>
      )}

      {/* {currentTab === 'current medications' && (
        <ProfileFollowers current medications={_userFollowers} />
      )} */}

      {/* {currentTab === 'appointments' && <ProfileFriends appointments={_userFriends}/>} */}
    </Container>
  );
}


// return(
// <Box
//   gap={3}
//   display="grid"
//   gridTemplateColumns={{
//     xs: 'repeat(1, 1fr)',
//     sm: 'repeat(2, 1fr)',
//     md: 'repeat(3, 1fr)',
//   }}
// >
//   <UserCard user={user.patient._id} />
// </Box>
// );
