import { Helmet } from 'react-helmet-async';

import SubscriptionEditView from 'src/sections/super-admin/subscriptions/table-edit-view';

// ----------------------------------------------------------------------

export default function SubscriptionEditPage() {
  // const params = useParams();
  // const { id } = params;
  // const { data } = useGetSubscription(id);
  // const subscriptionName = data?.name_english || 'Subscription';
  return (
    <>
      <Helmet>
        <title> Edit Subscription </title>
        <meta name="description" content="meta" />
      </Helmet>

      <SubscriptionEditView />
    </>
  );
}
