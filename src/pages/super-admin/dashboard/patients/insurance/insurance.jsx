import { Helmet } from 'react-helmet-async';

import PatientInsurance from 'src/sections/patients/insurance/patient-insurance';
import { useGetPatient } from 'src/api/tables';
import { useParams } from 'src/routes/hooks';
// ----------------------------------------------------------------------

export default function TableCreatePage() {
  const params = useParams();
  const { id } = params;
  const { data } = useGetPatient(id);
  const patientName = `${data?.first_name} ${data?.last_name}` || 'Patient'
  return (
    <>
      <Helmet>
        <title> Patients: {patientName} Insurance </title>
      </Helmet>

      {data && <PatientInsurance patientData={data}/>}
    </>
  );
}
