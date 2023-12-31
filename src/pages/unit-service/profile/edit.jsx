import { Helmet } from 'react-helmet-async';

import EditProfileView from 'src/sections/unit-service/profile/view/edit';

// ----------------------------------------------------------------------

export default function EditPage() {
  return (
    <>
      <Helmet>
        <title>Edit Profile</title>
      </Helmet>

     <EditProfileView />
    </>
  );
}
