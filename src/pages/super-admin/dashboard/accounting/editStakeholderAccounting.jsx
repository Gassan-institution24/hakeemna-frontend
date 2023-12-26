import { Helmet } from 'react-helmet-async';

import EditStakeholderAccounting from 'src/sections/super-admin/accounting/stakeholder/stakeholder-new-edit/accounting-edit-view';
import { useGetLicenseMovement, useGetStakeholder } from 'src/api/tables';
import { useParams } from 'src/routes/hooks';
import { useTranslate } from 'src/locales';

// ----------------------------------------------------------------------

export default function AccountingEditPage() {
  const { t } = useTranslate();
  const params = useParams();
  const { id, acid } = params;
  const { data } = useGetStakeholder(id);
  const { licenseMovementData } = useGetLicenseMovement(acid);
  const stakeholderName = data?.name_english || 'Stakeholder';
  return (
    <>
      <Helmet>
        <title> {t(stakeholderName)} Accounting</title>
      </Helmet>

      <EditStakeholderAccounting stakeholderData={data} licenseMovementData={licenseMovementData} />
    </>
  );
}
