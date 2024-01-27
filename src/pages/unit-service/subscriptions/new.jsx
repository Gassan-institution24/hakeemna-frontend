import { Helmet } from 'react-helmet-async';
import ACLGuard from 'src/auth/guard/acl-guard';

import SubscriptionNewView from 'src/sections/unit-service/subscriptions/view/new';

// ----------------------------------------------------------------------

export default function SubscriptionNewPage() {
  return (
    <>
      <ACLGuard hasContent category="appointment_config" acl="create">
        <Helmet>
          <title>New Subscription</title>
        </Helmet>

        <SubscriptionNewView />
      </ACLGuard>
    </>
  );
}
