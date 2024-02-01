import { Helmet } from 'react-helmet-async';

import UnitServiceInfo from 'src/sections/super-admin/unitservices/info/info-page';
import { useGetUnitservice } from 'src/api/tables';
import { useParams } from 'src/routes/hooks';
import { LoadingScreen } from 'src/components/loading-screen';
// ----------------------------------------------------------------------

export default function UnitServiceInfoPage() {
  const params = useParams();
  const { id } = params;
  const { data, loading } = useGetUnitservice(id);
  const unitserviceName = data?.name_english || 'Stackeholder';
  return (
    <>
      <Helmet>
        <title> Unit Services: {unitserviceName} Info </title>
      </Helmet>
      {loading && <LoadingScreen />}
      {!loading && <UnitServiceInfo unitServiceData={data} />}
    </>
  );
}
