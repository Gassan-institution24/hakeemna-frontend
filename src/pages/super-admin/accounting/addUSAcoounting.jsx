import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { useTranslate } from 'src/locales';
import { useGetUnitservice } from 'src/api';

import { LoadingScreen } from 'src/components/loading-screen';

import AddUnitServiceAccounting from 'src/sections/super-admin/accounting/unit-service/unit-service-new-edit/accounting-create-view';

// ----------------------------------------------------------------------

export default function AccountingAddPage() {
  const { t } = useTranslate();
  const params = useParams();
  const { id } = params;
  const { data, loading } = useGetUnitservice(id);
  const unitServiceName = data?.name_english || 'unit service';
  return (
    <>
      <Helmet>
        <title> {t(unitServiceName)} Accounting</title>
        <meta name="description" content="meta" />
      </Helmet>
      {loading && <LoadingScreen />}
      {!loading && <AddUnitServiceAccounting unitServiceData={data} />}
    </>
  );
}
