import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { useGetUnitservice } from 'src/api';

import { LoadingScreen } from 'src/components/loading-screen';

import Subscriptions from 'src/sections/super-admin/subscriptions/subscription-table';

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
        <meta name="description" content="meta" />
      </Helmet>
      {loading && <LoadingScreen />}
      {!loading && <Subscriptions unitServiceData={data} />}
    </>
  );
}
