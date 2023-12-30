import { Helmet } from 'react-helmet-async';

import StakeholderInsurance from 'src/sections/super-admin/stakeholders/insurance/stakeholder-insurance';
import { useGetStakeholder } from 'src/api/tables';
import { useParams } from 'src/routes/hooks';
// ----------------------------------------------------------------------

export default function StakeholderInsuranceView() {
  const params = useParams();
  const { id } = params;
  const { data, refetch } = useGetStakeholder(id);
  const stakeholderName = data?.name_english || 'Stackeholder';
  return (
    <>
      <Helmet>
        <title> stakeholders: {stakeholderName} Insurance </title>
      </Helmet>

      {data && <StakeholderInsurance stakeholderData={data} refetch={refetch} />}
    </>
  );
}
