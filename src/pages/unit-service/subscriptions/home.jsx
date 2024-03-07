import { Helmet } from 'react-helmet-async';

import ACLGuard from 'src/auth/guard/acl-guard';

import SubscriptionsHomeView from 'src/sections/unit-service/subscriptions/view/home';

// ----------------------------------------------------------------------

export default function SubscriptionsHomePage() {
  return (
    <ACLGuard category="unit_service" subcategory="unit_service_info" acl="read">
      <Helmet>
        <title>Subscriptions</title>
        <meta name="description" content="meta" />
      </Helmet>

      <SubscriptionsHomeView />
    </ACLGuard>
  );
}
