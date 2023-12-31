import { Helmet } from 'react-helmet-async';

import EmployeeHomeView from 'src/sections/unit-service/employees/view/home';

// ----------------------------------------------------------------------

export default function EmployeeHomePage() {
  return (
    <>
      <Helmet>
        <title>Employees</title>
      </Helmet>

      <EmployeeHomeView />
    </>
  );
}
