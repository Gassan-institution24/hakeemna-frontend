import { Helmet } from 'react-helmet-async';
import ACLGuard from 'src/auth/guard/acl-guard';

import InsuranceHomeView from 'src/sections/unit-service/insurance/view/home';

// ----------------------------------------------------------------------

export default function InsuranceHomePage() {
  return (
    <>
      <ACLGuard hasContent category="accounting" acl="read">
        <Helmet>
          <title>Insurances</title>
        </Helmet>

        <InsuranceHomeView />
      </ACLGuard>
    </>
  );
}
