import { Helmet } from 'react-helmet-async';

import NewUserPage from 'src/sections/super-admin/users/table-create-view';

// ----------------------------------------------------------------------

export default function NewUserHomePage() {
  return (
    <>
      <Helmet>
        <title>new user</title>
        <meta name="description" content="meta" />
      </Helmet>

      <NewUserPage />
    </>
  );
}
