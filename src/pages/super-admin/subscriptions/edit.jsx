import { Helmet } from 'react-helmet-async';

import SubscriptionEditView from 'src/sections/super-admin/subscriptions/table-edit-view';
import { useGetSubscription } from 'src/api';
import { useParams } from 'src/routes/hooks';
import { useTranslate } from 'src/locales';

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
