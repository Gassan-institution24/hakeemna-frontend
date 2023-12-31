import { Helmet } from 'react-helmet-async';

import ProfileView from 'src/sections/unit-service/profile/view/home';

// ----------------------------------------------------------------------

export default function ProfilePage() {
  return (
    <>
      <Helmet>
        <title>My Profile</title>
      </Helmet>

     <ProfileView />
    </>
  );
}
