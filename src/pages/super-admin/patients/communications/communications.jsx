import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { useGetPatient } from 'src/api';

import PatientCommunication from 'src/sections/super-admin/patients/communication/patient-communication';
// ----------------------------------------------------------------------

export default function TableCreatePage() {
  const params = useParams();
  const { id } = params;
  const { data } = useGetPatient(id);
  const patientName = (data?.name_english && `${data?.name_english}`) || 'Patient';
  return (
    <>
      <Helmet>
        <title> Patients: {patientName} Communication </title>
        <meta name="description" content="meta" />
      </Helmet>

      {data && <PatientCommunication patientData={data} />}
    </>
  );
}
