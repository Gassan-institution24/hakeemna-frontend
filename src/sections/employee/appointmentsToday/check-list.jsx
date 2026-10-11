import { useParams } from 'react-router';

import { useGetOneEntranceManagement } from 'src/api';

import PatientQuestionnaires from 'src/sections/shared/questionnaires/patient-questionnaires';

// ----------------------------------------------------------------------

// Questionnaires during a visit: the same forms as the patient profile, with answers linked to
// this entrance.
export default function CheckList() {
  const { id } = useParams();
  const { Entrance } = useGetOneEntranceManagement(id, { populate: 'all' });

  const uspId = Entrance?.unit_service_patient?._id || Entrance?.unit_service_patient;
  if (!uspId) return null;

  return <PatientQuestionnaires uspId={uspId} entranceId={id} showHeader={false} />;
}
