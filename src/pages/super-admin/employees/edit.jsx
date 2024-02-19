import { Helmet } from 'react-helmet-async';

import EditUserPage from 'src/sections/super-admin/employees/table-edit-view';

// ----------------------------------------------------------------------

export default function EditEmployeeViewPage() {
  return (
    <>
      <Helmet>
        <title>edit employee</title>
      </Helmet>

      <EditUserPage />
    </>
  );
}
