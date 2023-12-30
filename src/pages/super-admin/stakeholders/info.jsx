import { Helmet } from 'react-helmet-async';

import StakeholderInfo from 'src/sections/super-admin/stakeholders/info/stakeholder-info';
import { useGetStakeholder } from 'src/api/tables';
import { useParams } from 'src/routes/hooks';
// ----------------------------------------------------------------------

export default function StakeholderInfoPage() {
  const params = useParams();
  const { id } = params;
  const { data } = useGetStakeholder(id);
  const stakeholderName = data?.name_english || 'Stackeholder';
  return (
    <>
      <Helmet>
        <title> stakeholders: {stakeholderName} Info </title>
      </Helmet>

      {data && <StakeholderInfo stakeholderData={data} />}
    </>
  );
}
