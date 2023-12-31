import { Helmet } from 'react-helmet-async';

import EmployeeNewView from 'src/sections/unit-service/employees/view/new';

// ----------------------------------------------------------------------

export default function EmployeeNewPage() {
  return (
    <>
      <Helmet>
        <title>New Employee</title>
      </Helmet>

      <EmployeeNewView />
    </>
  );
}
