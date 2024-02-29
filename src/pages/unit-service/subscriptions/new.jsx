import { Helmet } from 'react-helmet-async';

import ACLGuard from 'src/auth/guard/acl-guard';

import SubscriptionNewView from 'src/sections/unit-service/subscriptions/view/new';

// ----------------------------------------------------------------------

export default function SubscriptionNewPage() {
  return (
    <ACLGuard hasContent category="unit_service" subcategory="subscriptions" acl="create">
      <Helmet>
        <title>New Subscription</title>
        <meta name="description" content="meta" />
      </Helmet>

      <SubscriptionNewView />
    </ACLGuard>
  );
}
