import { Helmet } from 'react-helmet-async';

import StakeholderFeedback from 'src/sections/super-admin/stakeholders/feedback/stakeholder-feedback';
import { useGetStakeholder } from 'src/api/tables';
import { useParams } from 'src/routes/hooks';
// ----------------------------------------------------------------------

export default function StackholderFeedbackPage() {
  const params = useParams();
  const { id } = params;
  const { data } = useGetStakeholder(id);
  const stakeholderName = data?.name_english || 'Stackeholder';
  return (
    <>
      <Helmet>
        <title> stakeholders: {stakeholderName} Feedback </title>
      </Helmet>

      {data && <StakeholderFeedback stakeholderData={data} />}
    </>
  );
}
