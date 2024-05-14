import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { useGetUnitservice } from 'src/api';

import { LoadingScreen } from 'src/components/loading-screen';

import UnitServiceInfo from 'src/sections/super-admin/unitservices/info/info-page';
// ----------------------------------------------------------------------

export default function UnitServiceInfoPage() {
  const params = useParams();
  const { id } = params;
  const { data, loading } = useGetUnitservice(id);
  const unitserviceName = data?.name_english || 'Stackeholder';
  return (
    <>
      <Helmet>
        <title> units of service: {unitserviceName} Info </title>
        <meta name="description" content="meta" />
      </Helmet>
      {loading && <LoadingScreen />}
      {!loading && <UnitServiceInfo unitServiceData={data} />}
    </>
  );
}
