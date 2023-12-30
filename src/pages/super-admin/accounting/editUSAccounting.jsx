import { Helmet } from 'react-helmet-async';

import EditUnitServiceAccounting from 'src/sections/super-admin/accounting/unit-service/unit-service-new-edit/accounting-edit-view';
import { useGetLicenseMovement, useGetUnitservice } from 'src/api/tables';
import { useParams } from 'src/routes/hooks';
import { useTranslate } from 'src/locales';

// ----------------------------------------------------------------------

export default function AccountingEditPage() {
  const { t } = useTranslate();
  const params = useParams();
  const { id, acid } = params;
  const { data } = useGetUnitservice(id);
  const { licenseMovementData } = useGetLicenseMovement(acid);
  const unitServiceName = data?.name_english || 'unit service';
  return (
    <>
      <Helmet>
        <title> {t(unitServiceName)} Accounting</title>
      </Helmet>

      <EditUnitServiceAccounting unitServiceData={data} licenseMovementData={licenseMovementData} />
    </>
  );
}
