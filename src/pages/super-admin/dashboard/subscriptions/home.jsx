import { Helmet } from 'react-helmet-async';

import Subscriptions from 'src/sections/super-admin/subscriptions/home/homepage';
import { useGetUnitservice } from 'src/api/tables';
import { useParams } from 'src/routes/hooks';

// ----------------------------------------------------------------------

export default function SubscriptionsPage() {
  const params = useParams();
  const { id } = params;
  const { data } = useGetUnitservice(id);
  const unitServiceName = data?.name_english || 'unit service';
  return (
    <>
      <Helmet>
        <title> {unitServiceName} Accounting</title>
      </Helmet>

      <Subscriptions unitServiceData={data} />
    </>
  );
}
