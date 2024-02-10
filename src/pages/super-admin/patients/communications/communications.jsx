import { Helmet } from 'react-helmet-async';

import PatientCommunication from 'src/sections/super-admin/patients/communication/patient-communication';
import { useGetPatient } from 'src/api';
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
        <title> Patients: {patientName} Communication </title>
      </Helmet>

      {data && <PatientCommunication patientData={data} />}
    </>
  );
}
