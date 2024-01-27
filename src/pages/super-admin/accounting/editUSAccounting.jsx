import { Helmet } from 'react-helmet-async';

import EditUnitServiceAccounting from 'src/sections/super-admin/accounting/unit-service/unit-service-new-edit/accounting-edit-view';
import { useGetLicenseMovement, useGetUnitservice } from 'src/api/tables';
import { useParams } from 'src/routes/hooks';
import { useTranslate } from 'src/locales';
import { LoadingScreen } from 'src/components/loading-screen';

// ----------------------------------------------------------------------

export default function AccountingEditPage() {
  const { t } = useTranslate();
  const params = useParams();
  const { id, acid } = params;
  const { data } = useGetUnitservice(id);
  const { licenseMovementData, loading } = useGetLicenseMovement(acid);
  const unitServiceName = data?.name_english || 'unit service';
  return (
    <>
      <Helmet>
        <title> {t(unitServiceName)} Accounting</title>
      </Helmet>
      {loading&& <LoadingScreen/>}
      {!loading&&<EditUnitServiceAccounting unitServiceData={data} licenseMovementData={licenseMovementData} />}
    </>
  );
}
