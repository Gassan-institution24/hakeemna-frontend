import { Helmet } from 'react-helmet-async';

import UnitServiceInsurance from 'src/sections/unitservices/insurance/insurance';
import { useGetUnitservice } from 'src/api/tables';
import { useParams } from 'src/routes/hooks';

// ----------------------------------------------------------------------

export default function TableEditPage() {
  const params = useParams();
  const { id } = params;
  const { data,refetch } = useGetUnitservice(id);
  const unitServiceName = data?.name_english || 'unit service'
  return (
    <>
      <Helmet>
        <title> {unitServiceName} Accounting</title>
      </Helmet>

      <UnitServiceInsurance  unitServiceData={data} refetch={refetch} />
    </>
  );
}
