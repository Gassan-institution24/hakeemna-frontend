import { useState, useCallback } from 'react';
import Container from '@mui/material/Container';
import { paths } from 'src/routes/paths';
import { useTranslate } from 'src/locales';
import { useAuthContext } from 'src/auth/hooks';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import ProfileHome from '../profile-home';

// ----------------------------------------------------------------------

export default function UserProfileView() {
  const settings = useSettingsContext();
  const { t } = useTranslate();
  const { user } = useAuthContext();
  const [currentTab, setCurrentTab] = useState('profile');
  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Profile"
        links={[
          { name: t('dashboard'), href: paths.dashboard.root },
          { name: t('user'), href: paths.dashboard.root },
          { name: user?.userName },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />
      {currentTab === 'profile' && <ProfileHome />}
    </Container>
  );
}
