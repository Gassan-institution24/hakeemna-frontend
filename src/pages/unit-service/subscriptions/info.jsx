import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { useGetSubscription } from 'src/api';
import ACLGuard from 'src/auth/guard/acl-guard';

import { LoadingScreen } from 'src/components/loading-screen';

import SubscriptionsInfoView from 'src/sections/unit-service/subscriptions/view/info';

// ----------------------------------------------------------------------

export default function SubscriptionsInfoPage() {
  const params = useParams();
  const { id } = params;
  const { data, loading } = useGetSubscription(id);
  const name = data?.name_english;
  return (
    <ACLGuard category="unit_service" subcategory="unit_service_info" acl="read">
      <Helmet>
        <title>{name || ''} Subscription Info</title>
        <meta name="description" content="meta" />
      </Helmet>
      {loading && <LoadingScreen />}
      {!loading && <SubscriptionsInfoView subscriptionData={data} />}
    </ACLGuard>
  );
}
