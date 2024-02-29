import { Helmet } from 'react-helmet-async';

import ACLGuard from 'src/auth/guard/acl-guard';

import OfferNewView from 'src/sections/unit-service/offers/view/new';

// ----------------------------------------------------------------------

export default function OfferNewPage() {
  return (
    <ACLGuard hasContent category="unit_service" subcategory="offers" acl="create">
      <Helmet>
        <title>New Offer</title>
        <meta name="description" content="meta" />
      </Helmet>

      <OfferNewView />
    </ACLGuard>
  );
}
