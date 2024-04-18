import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { useGetPatient } from 'src/api';

import { LoadingScreen } from 'src/components/loading-screen';

import EditPatient from 'src/sections/super-admin/patients/edit/edit-patient';
// ----------------------------------------------------------------------

export default function TableCreatePage() {
  const params = useParams();
  const { id } = params;
  const { data, loading } = useGetPatient(id);
  const patientName = (data?.name_english && `${data?.name_english}`) || 'Patient';
  return (
    <>
      <Helmet>
        <title> Patients: Edit {patientName} </title>
        <meta name="description" content="meta" />
      </Helmet>
      {loading && <LoadingScreen />}
      {!loading && <EditPatient patientData={data} />}
    </>
  );
}
