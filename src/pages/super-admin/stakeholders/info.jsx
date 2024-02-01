import { Helmet } from 'react-helmet-async';

import StakeholderInfo from 'src/sections/super-admin/stakeholders/info/stakeholder-info';
import { useGetStakeholder } from 'src/api/tables';
import { useParams } from 'src/routes/hooks';
import { LoadingScreen } from 'src/components/loading-screen';
// ----------------------------------------------------------------------

export default function StakeholderInfoPage() {
  const params = useParams();
  const { id } = params;
  const { data, loading } = useGetStakeholder(id);
  const stakeholderName = data?.name_english || 'Stackeholder';
  return (
    <>
      <Helmet>
        <title> stakeholders: {stakeholderName} Info </title>
      </Helmet>
      {loading && <LoadingScreen />}
      {!loading && <StakeholderInfo stakeholderData={data} />}
    </>
  );
}
