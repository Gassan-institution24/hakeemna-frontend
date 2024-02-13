import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { useTranslate } from 'src/locales';
import { useGetUnitservice, useGetLicenseMovement } from 'src/api';

import { LoadingScreen } from 'src/components/loading-screen';

import EditUnitServiceAccounting from 'src/sections/super-admin/unitservices/accounting/accounting-edit-view';

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
      {loading && <LoadingScreen />}
      {!loading && (
        <EditUnitServiceAccounting
          unitServiceData={data}
          licenseMovementData={licenseMovementData}
        />
      )}
    </>
  );
}
