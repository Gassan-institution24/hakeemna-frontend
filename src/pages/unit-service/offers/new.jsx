import { Helmet } from 'react-helmet-async';
import ACLGuard from 'src/auth/guard/acl-guard';

import OfferNewView from 'src/sections/unit-service/offers/view/new';

// ----------------------------------------------------------------------

export default function OfferNewPage() {
  return (
    <>
      <ACLGuard hasContent category="appointment_config" acl="create">
        <Helmet>
          <title>New Offer</title>
        </Helmet>

        <OfferNewView />
      </ACLGuard>
    </>
  );
}
