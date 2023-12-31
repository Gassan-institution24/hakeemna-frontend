import { Helmet } from 'react-helmet-async';

import SubscriptionsInfoView from 'src/sections/unit-service/subscriptions/view/info';
import { useGetSubscription } from 'src/api/tables';
import { useParams } from 'src/routes/hooks';

// ----------------------------------------------------------------------

export default function SubscriptionsInfoPage() {
  const params = useParams();
  const { id } = params;
  const { data } = useGetSubscription(id);
  const name = data?.name_english
  return (
    <>
      <Helmet>
        <title>{name} Subscription Info</title>
      </Helmet>

      {data && <SubscriptionsInfoView subscriptionData={data} />}
    </>
  );
}
