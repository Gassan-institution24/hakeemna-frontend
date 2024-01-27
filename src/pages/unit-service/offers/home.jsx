import { Helmet } from 'react-helmet-async';
import ACLGuard from 'src/auth/guard/acl-guard';

import OffersHomeView from 'src/sections/unit-service/offers/view/home';

// ----------------------------------------------------------------------

export default function OffersHomePage() {
  return (
    <>
      <ACLGuard hasContent category="appointment_config" acl="read">
        <Helmet>
          <title>Offers</title>
        </Helmet>

        <OffersHomeView />
      </ACLGuard>
    </>
  );
}
