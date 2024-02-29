import { Helmet } from 'react-helmet-async';

import AccessControlList from 'src/sections/super-admin/accessControlList/home';

// ----------------------------------------------------------------------

export default function AccessControlListPage() {
  return (
    <>
      <Helmet>
        <title> Access control list </title>
        <meta name="description" content="meta" />
      </Helmet>

      <AccessControlList />
    </>
  );
}
