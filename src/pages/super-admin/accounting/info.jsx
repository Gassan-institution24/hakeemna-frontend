import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { useGetLicenseMovement } from 'src/api';

import { LoadingScreen } from 'src/components/loading-screen';

import AccountingInfo from 'src/sections/super-admin/accounting/unit-service/unit-service-accounting-show/accounting-details';

// ----------------------------------------------------------------------

export default function AccountingInfoPage() {
  const params = useParams();
  const { id } = params;
  const { data, loading } = useGetLicenseMovement(id);
  const unitServiceName = data?.name_english || 'unit of service';
  return (
    <>
      <Helmet>
        <title> {unitServiceName} Accounting</title>
        <meta name="description" content="meta" />
      </Helmet>
      {loading && <LoadingScreen />}
      {!loading && <AccountingInfo unitServiceData={data} />}
    </>
  );
}
