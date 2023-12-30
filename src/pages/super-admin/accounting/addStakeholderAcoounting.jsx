import { Helmet } from 'react-helmet-async';

import AddStakeholderAccounting from 'src/sections/super-admin/accounting/stakeholder/stakeholder-new-edit/accounting-create-view';
import { useGetStakeholder } from 'src/api/tables';
import { useParams } from 'src/routes/hooks';
import { useTranslate } from 'src/locales';

// ----------------------------------------------------------------------

export default function AccountingAddPage() {
  const { t } = useTranslate();
  const params = useParams();
  const { id } = params;
  const { data } = useGetStakeholder(id);
  const stakeholderName = data?.name_english || 'Stakeholder';
  return (
    <>
      <Helmet>
        <title> {t(stakeholderName)} Accounting</title>
      </Helmet>

      <AddStakeholderAccounting stakeholderData={data} />
    </>
  );
}
