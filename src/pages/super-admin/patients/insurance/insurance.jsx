import { Helmet } from 'react-helmet-async';

import PatientInsurance from 'src/sections/super-admin/patients/insurance/patient-insurance';
import { useGetPatient } from 'src/api/tables';
import { useParams } from 'src/routes/hooks';
import { LoadingScreen } from 'src/components/loading-screen';
// ----------------------------------------------------------------------

export default function TableCreatePage() {
  const params = useParams();
  const { id } = params;
  const { data, loading, refetch } = useGetPatient(id);
  console.log(data);
  const patientName =
    (data?.first_name && data?.last_name && `${data?.first_name} ${data?.last_name}`) ||
    (data?.first_name && data?.first_name) ||
    (data?.last_name && data?.last_name) ||
    'Patient';
  return (
    <>
      <Helmet>
        <title> Patients: {patientName} Insurance </title>
      </Helmet>
      {loading && <LoadingScreen />}
      {!loading && <PatientInsurance patientData={data} refetch={refetch} />}
    </>
  );
}
