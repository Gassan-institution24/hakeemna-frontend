import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { useGetPatient } from 'src/api';

import { LoadingScreen } from 'src/components/loading-screen';

import BookAppointment from 'src/sections/super-admin/patients/history/book-appointment/book-appointment';
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
        <title> {patientName}: Book an appointment </title>
        <meta name="description" content="meta" />
      </Helmet>
      {loading && <LoadingScreen />}
      {!loading && <BookAppointment patientData={data} />}
    </>
  );
}
