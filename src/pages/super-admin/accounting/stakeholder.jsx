import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { useGetStakeholder } from 'src/api';

import { LoadingScreen } from 'src/components/loading-screen';

import AccountingStakeholder from 'src/sections/super-admin/accounting/stakeholder/accounting-table';

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
