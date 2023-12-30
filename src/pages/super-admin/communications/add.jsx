import { Helmet } from 'react-helmet-async';

import AddUnitServiceAccounting from 'src/sections/super-admin/unitservices/accounting/accounting-create-view';
import { useGetUnitservice } from 'src/api/tables';
import { useParams } from 'src/routes/hooks';
import { useTranslate } from 'src/locales';

// ----------------------------------------------------------------------

export default function AccountingAddPage() {
  const { t } = useTranslate();
  const params = useParams();
  const { id } = params;
  const { data } = useGetUnitservice(id);
  const unitServiceName = data?.name_english || 'unit service';
  return (
    <>
      <Helmet>
        <title> {t(unitServiceName)} Accounting</title>
      </Helmet>

      <AddUnitServiceAccounting unitServiceData={data} />
    </>
  );
}
