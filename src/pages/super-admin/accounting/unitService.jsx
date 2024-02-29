import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { useGetUnitservice } from 'src/api';

import { LoadingScreen } from 'src/components/loading-screen';

import AccountingUS from 'src/sections/super-admin/accounting/unit-service/accounting-table';

// ----------------------------------------------------------------------

export default function AccountingUSPage() {
  const params = useParams();
  const { id } = params;
  const { data, loading } = useGetUnitservice(id);
  const unitServiceName = data?.name_english || 'unit service';
  return (
    <>
      <Helmet>
        <title> {unitServiceName} Accounting</title>
        <meta name="description" content="meta" />
      </Helmet>
      {loading && <LoadingScreen />}
      {!loading && <AccountingUS unitServiceData={data} />}
    </>
  );
}
