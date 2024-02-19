import { Helmet } from 'react-helmet-async';

import EmployeesPage from 'src/sections/super-admin/employees/view/index';

// ----------------------------------------------------------------------

export default function EmployeesHomePage() {
  return (
    <>
      <Helmet>
        <title>employees</title>
      </Helmet>

      <EmployeesPage />
    </>
  );
}
