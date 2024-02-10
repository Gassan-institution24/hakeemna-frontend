import { Helmet } from 'react-helmet-async';

import Subscriptions from 'src/sections/super-admin/subscriptions/subscription-table';
import { useGetUnitservice } from 'src/api';
import { useParams } from 'src/routes/hooks';
import { LoadingScreen } from 'src/components/loading-screen';

// ----------------------------------------------------------------------

export default function SubscriptionsPage() {
  const params = useParams();
  const { id } = params;
  const { data, loading } = useGetUnitservice(id);
  const unitServiceName = data?.name_english || 'unit service';
  return (
    <>
      <Helmet>
        <title> {unitServiceName} Accounting</title>
      </Helmet>
      {loading && <LoadingScreen />}
      {!loading && <Subscriptions unitServiceData={data} />}
    </>
  );
}
