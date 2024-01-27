import { Helmet } from 'react-helmet-async';

import AddUnitServiceAccounting from 'src/sections/super-admin/unitservices/accounting/accounting-create-view';
import { useGetUnitservice } from 'src/api/tables';
import { useParams } from 'src/routes/hooks';
import { useTranslate } from 'src/locales';
import { LoadingScreen } from 'src/components/loading-screen';

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
      </Helmet>
      {loading&& <LoadingScreen/>}
      {!loading && <AddUnitServiceAccounting unitServiceData={data} />}
    </>
  );
}
