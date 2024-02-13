import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { useTranslate } from 'src/locales';
import { useGetStakeholder, useGetLicenseMovement } from 'src/api';

import { LoadingScreen } from 'src/components/loading-screen';

import EditStakeholderAccounting from 'src/sections/super-admin/accounting/stakeholder/stakeholder-new-edit/accounting-edit-view';

// ----------------------------------------------------------------------

export default function AccountingEditPage() {
  const { t } = useTranslate();
  const params = useParams();
  const { id, acid } = params;
  const { data } = useGetStakeholder(id);
  const { licenseMovementData, loading } = useGetLicenseMovement(acid);
  const stakeholderName = data?.name_english || 'Stakeholder';
  return (
    <>
      <Helmet>
        <title> {t(stakeholderName)} Accounting</title>
      </Helmet>
      {loading && <LoadingScreen />}
      {!loading && (
        <EditStakeholderAccounting
          stakeholderData={data}
          licenseMovementData={licenseMovementData}
        />
      )}
    </>
  );
}
