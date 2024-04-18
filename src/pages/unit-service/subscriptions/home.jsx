import { Helmet } from 'react-helmet-async';

import ACLGuard from 'src/auth/guard/acl-guard';
import { useAuthContext } from 'src/auth/hooks';

import SubscriptionsHomeView from 'src/sections/unit-service/subscriptions/view/home';

// ----------------------------------------------------------------------

export default function SubscriptionsHomePage() {
  const { user } = useAuthContext();
  const serviceUnitName =
    user?.employee?.employee_engagements?.[user?.employee?.selected_engagement]?.unit_service?.nam;
  return (
    <ACLGuard category="unit_service" subcategory="unit_service_info" acl="read">
      <Helmet>
        <title>{serviceUnitName || 'unit of service'} : Subscriptions</title>
        <meta name="description" content="meta" />
      </Helmet>

      <SubscriptionsHomeView />
    </ACLGuard>
  );
}
