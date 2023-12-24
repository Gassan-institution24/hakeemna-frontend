import { Helmet } from 'react-helmet-async';

import AccountingUS from 'src/sections/super-admin/accounting/unit-service/accounting-table';
import { useGetUnitservice } from 'src/api/tables';
import { useParams } from 'src/routes/hooks';

// ----------------------------------------------------------------------

export default function AccountingUSPage() {
  const params = useParams();
  const { id } = params;
  const { data } = useGetUnitservice(id);
  const unitServiceName = data?.name_english || 'unit service';
  return (
    <>
      <Helmet>
        <title> {unitServiceName} Accounting</title>
      </Helmet>

      <AccountingUS unitServiceData={data} />
    </>
  );
}
