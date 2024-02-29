import { Helmet } from 'react-helmet-async';

import ACLGuard from 'src/auth/guard/acl-guard';

import InsuranceHomeView from 'src/sections/unit-service/insurance/view/home';

// ----------------------------------------------------------------------

export default function InsuranceHomePage() {
  return (
    <ACLGuard hasContent category="unit_service" subcategory="insurance" acl="read">
      <Helmet>
        <title>Insurances</title>
        <meta name="description" content="meta" />
      </Helmet>

      <InsuranceHomeView />
    </ACLGuard>
  );
}
