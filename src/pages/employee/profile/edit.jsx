import { Helmet } from 'react-helmet-async';

import EmployeeEditProfileView from 'src/sections/employee/profile/view/edit';

// ----------------------------------------------------------------------

export default function EditPage() {
  return (
    <>
      <Helmet>
        <title>Edit Profile</title>
      </Helmet>

     <EmployeeEditProfileView />
    </>
  );
}
