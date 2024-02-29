import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { useGetStakeholder } from 'src/api';

import { LoadingScreen } from 'src/components/loading-screen';

import StakeholderFeedback from 'src/sections/super-admin/stakeholders/feedback/stakeholder-feedback';
// ----------------------------------------------------------------------

export default function StackholderFeedbackPage() {
  const params = useParams();
  const { id } = params;
  const { data, loading } = useGetStakeholder(id);
  const stakeholderName = data?.name_english || 'Stackeholder';
  return (
    <>
      <Helmet>
        <title> stakeholders: {stakeholderName} Feedback </title>
        <meta name="description" content="meta" />
      </Helmet>
      {loading && <LoadingScreen />}
      {!loading && <StakeholderFeedback stakeholderData={data} />}
    </>
  );
}
