import { Helmet } from 'react-helmet-async';

import SubscriptionNewView from 'src/sections/unit-service/subscriptions/view/new';

// ----------------------------------------------------------------------

export default function SubscriptionNewPage() {
  return (
    <>
      <Helmet>
        <title>New Subscription</title>
      </Helmet>

      <SubscriptionNewView />
    </>
  );
}
