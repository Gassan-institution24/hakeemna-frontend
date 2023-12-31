import { Helmet } from 'react-helmet-async';

import EmployeeProfileView from 'src/sections/employee/profile/view/home';

// ----------------------------------------------------------------------

export default function EmployeeProfilePage() {
  return (
    <>
      <Helmet>
        <title>My Profile</title>
      </Helmet>

     <EmployeeProfileView />
    </>
  );
}
