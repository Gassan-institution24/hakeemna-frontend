import { Helmet } from 'react-helmet-async';

import { useTranslate } from 'src/locales';

import SubscriptionEditView from 'src/sections/super-admin/subscriptions/table-edit-view';

// ----------------------------------------------------------------------

export default function SubscriptionEditPage() {
  const { t } = useTranslate();
  // const params = useParams();
  // const { id } = params;
  // const { data } = useGetSubscription(id);
  // const subscriptionName = data?.name_english || 'Subscription';
  return (
    <>
      <Helmet>
        <title> Edit Subscription </title>
      </Helmet>

      <SubscriptionEditView />
    </>
  );
}
