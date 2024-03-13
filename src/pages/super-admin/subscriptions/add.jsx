import { Helmet } from 'react-helmet-async';

import SubscriptionNewView from 'src/sections/super-admin/subscriptions/table-create-view';

// ----------------------------------------------------------------------

export default function SubscriptionNewPage() {
  return (
    <>
      <Helmet>
        <title> New Subscription </title>
        <meta name="description" content="meta" />
      </Helmet>

      <SubscriptionNewView />
    </>
  );
}
