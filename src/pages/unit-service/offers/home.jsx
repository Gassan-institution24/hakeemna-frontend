import { Helmet } from 'react-helmet-async';

import ACLGuard from 'src/auth/guard/acl-guard';

import OffersHomeView from 'src/sections/unit-service/offers/view/home';

// ----------------------------------------------------------------------

export default function OffersHomePage() {
  return (
    <ACLGuard category="unit_service" subcategory="offers" acl="read">
      <Helmet>
        <title>Offers</title>
        <meta name="description" content="meta" />
      </Helmet>

      <OffersHomeView />
    </ACLGuard>
  );
}
