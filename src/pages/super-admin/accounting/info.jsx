import { Helmet } from 'react-helmet-async';

import AccountingInfo from 'src/sections/super-admin/accounting/unit-service/unit-service-accounting-show/accounting-details';
import { useGetLicenseMovement } from 'src/api/tables';
import { useParams } from 'src/routes/hooks';

// ----------------------------------------------------------------------

export default function AccountingInfoPage() {
  const params = useParams();
  const { id } = params;
  const { data } = useGetLicenseMovement(id);
  const unitServiceName = data?.name_english || 'unit service';
  return (
    <>
      <Helmet>
        <title> {unitServiceName} Accounting</title>
      </Helmet>

      {data &&<AccountingInfo unitServiceData={data} />}
    </>
  );
}
