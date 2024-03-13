import { Helmet } from 'react-helmet-async';

import ACLGuard from 'src/auth/guard/acl-guard';

import Communication from 'src/sections/employee/communication/view/home';
// ----------------------------------------------------------------------

export default function HomePage() {
  return (
    <ACLGuard category="employee" subcategory="communication" acl="read">
      <Helmet>
        <title>Communication</title>
        <meta name="description" content="meta" />
      </Helmet>

      <Communication />
    </ACLGuard>
  );
}
