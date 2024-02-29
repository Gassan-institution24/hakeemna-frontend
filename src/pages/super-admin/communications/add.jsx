import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { useTranslate } from 'src/locales';
import { useGetUnitservice } from 'src/api';

import AddUnitServiceAccounting from 'src/sections/super-admin/unitservices/accounting/accounting-create-view';

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
        <meta name="description" content="meta" />
      </Helmet>

      <AddUnitServiceAccounting unitServiceData={data} />
    </>
  );
}
