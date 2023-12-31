import { Helmet } from 'react-helmet-async';

import EmployeeTypeHomeView from 'src/sections/unit-service/tables/employee-types/view/home';

// ----------------------------------------------------------------------

export default function EmployeeTypeHomePage() {
  return (
    <>
      <Helmet>
        <title>Employee Types</title>
      </Helmet>

      <EmployeeTypeHomeView />
    </>
  );
}
