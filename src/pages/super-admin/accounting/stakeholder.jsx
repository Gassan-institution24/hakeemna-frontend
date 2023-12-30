import { Helmet } from 'react-helmet-async';

import AccountingStakeholder from 'src/sections/super-admin/accounting/stakeholder/accounting-table';
import { useGetStakeholder } from 'src/api/tables';
import { useParams } from 'src/routes/hooks';

// ----------------------------------------------------------------------

export default function AccountingStakeholderPage() {
  const params = useParams();
  const { id } = params;
  const { data } = useGetStakeholder(id);
  const stakeholderName = data?.name_english || 'Stakeholder';
  return (
    <>
      <Helmet>
        <title> {stakeholderName} Accounting</title>
      </Helmet>

      {data && <AccountingStakeholder stakeholderData={data} />}
    </>
  );
}
