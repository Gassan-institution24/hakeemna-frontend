import { Helmet } from 'react-helmet-async';

import PatientFeedback from 'src/sections/super-admin/patients/feedback/patient-feedback';
import { useGetPatient } from 'src/api/tables';
import { useParams } from 'src/routes/hooks';
import { LoadingScreen } from 'src/components/loading-screen';
// ----------------------------------------------------------------------

export default function TableCreatePage() {
  const params = useParams();
  const { id } = params;
  const { data, loading } = useGetPatient(id);
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
      {loading && <LoadingScreen />}
      {!loading && <PatientFeedback patientData={data} />}
    </>
  );
}
