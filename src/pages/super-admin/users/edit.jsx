import { Helmet } from 'react-helmet-async';

import EditUserPage from 'src/sections/super-admin/users/table-edit-view';

// ----------------------------------------------------------------------

export default function EditUserViewPage() {
  return (
    <>
      <Helmet>
        <title>edit user</title>
      </Helmet>

      <EditUserPage />
    </>
  );
}
