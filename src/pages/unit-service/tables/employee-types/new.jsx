import { Helmet } from 'react-helmet-async';

import EmployeeTypeNewView from 'src/sections/unit-service/tables/employee-types/view/new';

// ----------------------------------------------------------------------

export default function EmployeeTypeNewPage() {
  return (
    <>
      <Helmet>
        <title>New Employee Type</title>
      </Helmet>

      <EmployeeTypeNewView />
    </>
  );
}
