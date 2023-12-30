import { Helmet } from 'react-helmet-async';

import PatientFeedback from 'src/sections/super-admin/patients/feedback/patient-feedback';
import { useGetPatient } from 'src/api/tables';
import { useParams } from 'src/routes/hooks';
// ----------------------------------------------------------------------

export default function TableCreatePage() {
  const params = useParams();
  const { id } = params;
  const { data } = useGetPatient(id);
  const patientName =
    (data?.first_name && data?.last_name && `${data?.first_name} ${data?.last_name}`) ||
    (data?.first_name && data?.first_name) ||
    (data?.last_name && data?.last_name) ||
    'Patient';
  return (
    <>
      <Helmet>
        <title> Patients: {patientName} Feedback </title>
      </Helmet>

      {data && <PatientFeedback patientData={data} />}
    </>
  );
}
