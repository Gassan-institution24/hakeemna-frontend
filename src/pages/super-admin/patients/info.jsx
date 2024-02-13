import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { useGetPatient } from 'src/api';

import { LoadingScreen } from 'src/components/loading-screen';

import PatientInfo from 'src/sections/super-admin/patients/info/patient-info';
// ----------------------------------------------------------------------

export default function TableCreatePage() {
  const params = useParams();
  const { id } = params;
  // console.log('iddd', id);
  const { data, loading } = useGetPatient(id);
  // console.log('patient dataa', data);
  const patientName =
    (data?.first_name && data?.last_name && `${data?.first_name} ${data?.last_name}`) ||
    (data?.first_name && data?.first_name) ||
    (data?.last_name && data?.last_name) ||
    'Patient';
  return (
    <>
      <Helmet>
        <title> Patients: {patientName} Info </title>
      </Helmet>
      {loading && <LoadingScreen />}
      {!loading && <PatientInfo patientData={data} />}
    </>
  );
}
