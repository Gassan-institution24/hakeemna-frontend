import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { useGetStakeholder } from 'src/api';

import PatientCommunication from 'src/sections/super-admin/stakeholders/communication/patient-communication';
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
        <meta name="description" content="meta" />
      </Helmet>

      {data && <PatientCommunication stakeholderData={data} />}
    </>
  );
}
