import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { useGetUnitservice } from 'src/api';

import { LoadingScreen } from 'src/components/loading-screen';

import UnitServiceAccounting from 'src/sections/super-admin/unitservices/accounting/accounting';

// ----------------------------------------------------------------------

export default function UnitServiceAccountingPage() {
  const params = useParams();
  const { id } = params;
  const { data, loading } = useGetUnitservice(id);
  const unitServiceName = data?.name_english || 'unit of service';
  return (
    <>
      <Helmet>
        <title> {unitServiceName} Accounting</title>
        <meta name="description" content="meta" />
      </Helmet>
      {loading && <LoadingScreen />}
      {!loading && <UnitServiceAccounting unitServiceData={data} />}
    </>
  );
}
