import { Helmet } from 'react-helmet-async';

import SubscriptionsHomeView from 'src/sections/unit-service/subscriptions/view/home';

// ----------------------------------------------------------------------

export default function SubscriptionsHomePage() {
  return (
    <>
      <Helmet>
        <title>Subscriptions</title>
      </Helmet>

      <SubscriptionsHomeView />
    </>
  );
}
