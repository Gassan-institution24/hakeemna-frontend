import { Helmet } from 'react-helmet-async';

import StakeholderFeedback from 'src/sections/super-admin/stakeholders/feedback/stakeholder-feedback';
import { useGetStakeholder } from 'src/api/tables';
import { useParams } from 'src/routes/hooks';
import { LoadingScreen } from 'src/components/loading-screen';
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
      </Helmet>
      {loading&& <LoadingScreen/>}
      {!loading && <StakeholderFeedback stakeholderData={data} />}
    </>
  );
}
