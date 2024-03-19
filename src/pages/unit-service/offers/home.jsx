import { Helmet } from 'react-helmet-async';

import ACLGuard from 'src/auth/guard/acl-guard';
import { useAuthContext } from 'src/auth/hooks';

import OffersHomeView from 'src/sections/unit-service/offers/view/home';

// ----------------------------------------------------------------------

export default function OffersHomePage() {
  const { user } = useAuthContext();
  const serviceUnitName =
    user?.employee?.employee_engagements?.[user?.employee?.selected_engagement]?.unit_service
      ?.name_english;
  return (
    <ACLGuard category="unit_service" subcategory="offers" acl="read">
      <Helmet>
        <title>{serviceUnitName || 'Service unit'} : Offers</title>
        <meta name="description" content="meta" />
      </Helmet>

      <OffersHomeView />
    </ACLGuard>
  );
}
