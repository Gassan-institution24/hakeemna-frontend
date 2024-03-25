import { Helmet } from 'react-helmet-async';

import Subscriptions from 'src/sections/super-admin/subscriptions/subscription-table';

// ----------------------------------------------------------------------

export default function SubscriptionsPage() {
  return (
    <>
      <Helmet>
        <title> Accounting</title>
        <meta name="description" content="meta" />
      </Helmet>
      <Subscriptions />
    </>
  );
}
