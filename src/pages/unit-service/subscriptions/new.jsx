import { Helmet } from 'react-helmet-async';

import ACLGuard from 'src/auth/guard/acl-guard';
import { useAuthContext } from 'src/auth/hooks';

import SubscriptionNewView from 'src/sections/unit-service/subscriptions/view/new';

// ----------------------------------------------------------------------

export default function SubscriptionNewPage() {
  const { user } = useAuthContext();
  const serviceUnitName =
    user?.employee?.employee_engagements?.[user?.employee?.selected_engagement]?.unit_service
      ?.name_english;
  return (
    <ACLGuard category="unit_service" subcategory="unit_service_info" acl="create">
      <Helmet>
        <title>{serviceUnitName || 'Service unit'} : New Subscription</title>
        <meta name="description" content="meta" />
      </Helmet>

      <SubscriptionNewView />
    </ACLGuard>
  );
}
