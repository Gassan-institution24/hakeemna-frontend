import { Helmet } from 'react-helmet-async';

import ACLGuard from 'src/auth/guard/acl-guard';
import { useAuthContext } from 'src/auth/hooks';

import OfferNewView from 'src/sections/user/offers/view/new';

// ----------------------------------------------------------------------

export default function OfferNewPage() {
  const { user } = useAuthContext();
  const serviceUnitName =
    user?.employee?.employee_engagements?.[user?.employee?.selected_engagement]?.unit_service
      ?.name_english;
  return (
    <ACLGuard category="unit_service" subcategory="offers" acl="create">
      <Helmet>
        <title>{serviceUnitName || 'unit of service'} : New Offer</title>
        <meta name="description" content="meta" />
      </Helmet>

      <OfferNewView />
    </ACLGuard>
  );
}
