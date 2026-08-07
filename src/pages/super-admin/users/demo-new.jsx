import { Helmet } from 'react-helmet-async';

import DemoAccountCreatePage from 'src/sections/super-admin/users/demo-account-create-view';

// ----------------------------------------------------------------------

export default function NewDemoAccountHomePage() {
  return (
    <>
      <Helmet>
        <title>new demo account</title>
        <meta name="description" content="meta" />
      </Helmet>

      <DemoAccountCreatePage />
    </>
  );
}
