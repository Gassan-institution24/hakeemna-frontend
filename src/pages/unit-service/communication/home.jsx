import { Helmet } from 'react-helmet-async';

import ACLGuard from 'src/auth/guard/acl-guard';

import Communication from 'src/sections/unit-service/communication/view/home';
// ----------------------------------------------------------------------

export default function HomePage() {
  return (
    <ACLGuard hasContent category="unit_service" subcategory="communication" acl="read">
      <Helmet>
        <title>Communication</title>
      </Helmet>

      <Communication />
    </ACLGuard>
  );
}
