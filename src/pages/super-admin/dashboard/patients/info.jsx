import { Helmet } from 'react-helmet-async';

import PatientInfo from 'src/sections/super-admin/patients/info/patient-info';
import { useGetPatient } from 'src/api/tables';
import { useParams } from 'src/routes/hooks';
// ----------------------------------------------------------------------

export default function TableCreatePage() {
  const params = useParams();
  const { id } = params;
  console.log('iddd', id);
  const { data } = useGetPatient(id);
  console.log('patient dataa', data);
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

      {data && <PatientInfo patientData={data} />}
    </>
  );
}
