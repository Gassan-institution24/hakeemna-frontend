import { Helmet } from 'react-helmet-async';
import ACLGuard from 'src/auth/guard/acl-guard';

import SubscriptionsHomeView from 'src/sections/unit-service/subscriptions/view/home';

// ----------------------------------------------------------------------

export default function SubscriptionsHomePage() {
  return (
    <>
      <ACLGuard hasContent category="unit_service" subcategory='subscriptions' acl="read">
        <Helmet>
          <title>Subscriptions</title>
        </Helmet>

        <SubscriptionsHomeView />
      </ACLGuard>
    </>
  );
}
