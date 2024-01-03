import { useState, useCallback } from 'react';
import Container from '@mui/material/Container';
import { paths } from 'src/routes/paths';
import { useAuthContext } from 'src/auth/hooks';
import { _userAbout } from 'src/_mock';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import ProfileHome from '../profile-home';

// ----------------------------------------------------------------------

export default function UserProfileView() {
  const settings = useSettingsContext();
  const { user } = useAuthContext();
  const [currentTab, setCurrentTab] = useState('profile');
  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Profile"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'User', href: paths.dashboard.root },
          { name: user?.userName },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />
      {currentTab === 'profile' && <ProfileHome info={_userAbout} />}
    </Container>
  );
}
