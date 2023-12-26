import { Helmet } from 'react-helmet-async';

import UnitServiceAccounting from 'src/sections/super-admin/unitservices/accounting/accounting';
import { useGetUnitservice } from 'src/api/tables';
import { useParams } from 'src/routes/hooks';

// ----------------------------------------------------------------------

export default function UnitServiceAccountingPage() {
  const params = useParams();
  const { id } = params;
  const { data } = useGetUnitservice(id);
  const unitServiceName = data?.name_english || 'unit service';
  return (
    <>
      <Helmet>
        <title> {unitServiceName} Accounting</title>
      </Helmet>

      <UnitServiceAccounting unitServiceData={data} />
    </>
  );
}
