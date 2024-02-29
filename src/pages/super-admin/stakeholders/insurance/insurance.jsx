import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { useGetStakeholder } from 'src/api';

import { LoadingScreen } from 'src/components/loading-screen';

import StakeholderInsurance from 'src/sections/super-admin/stakeholders/insurance/stakeholder-insurance';
// ----------------------------------------------------------------------

export default function StakeholderInsuranceView() {
  const params = useParams();
  const { id } = params;
  const { data, loading, refetch } = useGetStakeholder(id);
  const stakeholderName = data?.name_english || 'Stackeholder';
  return (
    <>
      <Helmet>
        <title> stakeholders: {stakeholderName} Insurance </title>
        <meta name="description" content="meta" />
      </Helmet>
      {loading && <LoadingScreen />}
      {!loading && <StakeholderInsurance stakeholderData={data} refetch={refetch} />}
    </>
  );
}
