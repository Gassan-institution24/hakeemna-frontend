import { Helmet } from 'react-helmet-async';

import AccountingInfo from 'src/sections/super-admin/accounting/unit-service/unit-service-accounting-show/accounting-details';
import { useGetLicenseMovement } from 'src/api/tables';
import { useParams } from 'src/routes/hooks';
import { LoadingScreen } from 'src/components/loading-screen';

// ----------------------------------------------------------------------

export default function AccountingInfoPage() {
  const params = useParams();
  const { id } = params;
  const { data, loading } = useGetLicenseMovement(id);
  const unitServiceName = data?.name_english || 'unit service';
  return (
    <>
      <Helmet>
        <title> {unitServiceName} Accounting</title>
      </Helmet>
      {loading && <LoadingScreen />}
      {!loading && <AccountingInfo unitServiceData={data} />}
    </>
  );
}
