import { Helmet } from 'react-helmet-async';

import PatientCommunication from 'src/sections/stakeholders/communication/patient-communication';
import { useGetStakeholder } from 'src/api/tables';
import { useParams } from 'src/routes/hooks';
// ----------------------------------------------------------------------

export default function StakeholderCommunicationPage() {
  const params = useParams();
  const { id } = params;
  const { data } = useGetStakeholder(id);
  const stakeholderName = data.name_english || 'Stackeholder';
  return (
    <>
      <Helmet>
        <title> stakeholders: {stakeholderName} Communication </title>
      </Helmet>

      {data && <PatientCommunication stakeholderData={data} />}
    </>
  );
}
