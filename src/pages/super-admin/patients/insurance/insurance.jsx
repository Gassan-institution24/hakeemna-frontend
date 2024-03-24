import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { useGetPatient } from 'src/api';

import { LoadingScreen } from 'src/components/loading-screen';

import PatientInsurance from 'src/sections/super-admin/patients/insurance/patient-insurance';
// ----------------------------------------------------------------------

export default function TableCreatePage() {
  const params = useParams();
  const { id } = params;
  const { data, loading, refetch } = useGetPatient(id);
  const patientName =
    (data?.first_name && data?.last_name && `${data?.first_name} ${data?.last_name}`) ||
    (data?.first_name && data?.first_name) ||
    (data?.last_name && data?.last_name) ||
    'Patient';
  return (
    <>
      <Helmet>
        <title> Patients: {patientName} Insurance </title>
        <meta name="description" content="meta" />
      </Helmet>
      {loading && <LoadingScreen />}
      {!loading && <PatientInsurance patientData={data} refetch={refetch} />}
    </>
  );
}
