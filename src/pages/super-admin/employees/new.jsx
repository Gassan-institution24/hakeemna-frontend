import { Helmet } from 'react-helmet-async';

import NewEmployeePage from 'src/sections/super-admin/employees/table-create-view';

// ----------------------------------------------------------------------

export default function NewEmployeeHomePage() {
  return (
    <>
      <Helmet>
        <title>new employee</title>
      </Helmet>

      <NewEmployeePage />
    </>
  );
}
