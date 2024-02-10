import { Helmet } from 'react-helmet-async';

import AccountingStakeholder from 'src/sections/super-admin/accounting/stakeholder/accounting-table';
import { useGetStakeholder } from 'src/api';
import { useParams } from 'src/routes/hooks';
import { LoadingScreen } from 'src/components/loading-screen';

// ----------------------------------------------------------------------

export default function AccountingStakeholderPage() {
  const params = useParams();
  const { id } = params;
  const { data, loading } = useGetStakeholder(id);
  const stakeholderName = data?.name_english || 'Stakeholder';
  return (
    <>
      <Helmet>
        <title> {stakeholderName} Accounting</title>
      </Helmet>
      {loading && <LoadingScreen />}
      {!loading && <AccountingStakeholder stakeholderData={data} />}
    </>
  );
}
