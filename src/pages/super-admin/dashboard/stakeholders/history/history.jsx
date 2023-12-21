import { Helmet } from 'react-helmet-async';

import PatientHistory from 'src/sections/stakeholders/history/stakeholder-history';
import { useGetStakeholder } from 'src/api/tables';
import { useParams } from 'src/routes/hooks';
// ----------------------------------------------------------------------

export default function StakeholderHistoryPage() {
  const params = useParams();
  const { id } = params;
  const { data } = useGetStakeholder(id);
  const stakeholderName = data.name_english || 'Stackeholder';
  return (
    <>
      <Helmet>
        <title> stakeholders: {stakeholderName} History </title>
      </Helmet>

      {data && <PatientHistory stakeholderData={data} />}
    </>
  );
}
