import { Helmet } from 'react-helmet-async';

import UnitServiceInfo from 'src/sections/super-admin/unitservices/info/info-page';
import { useGetUnitservice } from 'src/api/tables';
import { useParams } from 'src/routes/hooks';
// ----------------------------------------------------------------------

export default function UnitServiceInfoPage() {
  const params = useParams();
  const { id } = params;
  const { data } = useGetUnitservice(id);
  const unitserviceName = data?.name_english || 'Stackeholder';
  return (
    <>
      <Helmet>
        <title> Unit Services: {unitserviceName} Info </title>
      </Helmet>

      {data && <UnitServiceInfo unitServiceData={data} />}
    </>
  );
}
