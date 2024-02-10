import { Helmet } from 'react-helmet-async';

import AdjustableService from 'src/sections/super-admin/adjustableSeervicesControl/home/homepage';
import { useGetUnitservice } from 'src/api';
import { useParams } from 'src/routes/hooks';
import { LoadingScreen } from 'src/components/loading-screen';

// ----------------------------------------------------------------------

export default function AdjustableServicePage() {
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
      {!loading && <AdjustableService unitServiceData={data} />}
    </>
  );
}
