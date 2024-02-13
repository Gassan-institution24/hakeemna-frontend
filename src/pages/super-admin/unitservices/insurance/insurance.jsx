import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { useGetUnitservice } from 'src/api';

import { LoadingScreen } from 'src/components/loading-screen';

import UnitServiceInsurance from 'src/sections/super-admin/unitservices/insurance/insurance';

// ----------------------------------------------------------------------

export default function TableEditPage() {
  const params = useParams();
  const { id } = params;
  const { data, loading, refetch } = useGetUnitservice(id);
  const unitServiceName = data?.name_english || 'unit service';
  return (
    <>
      <Helmet>
        <title> {unitServiceName} Accounting</title>
      </Helmet>
      {loading && <LoadingScreen />}
      {!loading && <UnitServiceInsurance unitServiceData={data} refetch={refetch} />}
    </>
  );
}
