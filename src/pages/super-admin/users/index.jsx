import { Helmet } from 'react-helmet-async';

import UsersPage from 'src/sections/super-admin/users/view/index';

// ----------------------------------------------------------------------

export default function UsersHomePage() {
  return (
    <>
      <Helmet>
        <title>users</title>
        <meta name="description" content="meta" />
      </Helmet>

      <UsersPage />
    </>
  );
}
