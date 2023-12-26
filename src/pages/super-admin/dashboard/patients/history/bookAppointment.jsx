import { Helmet } from 'react-helmet-async';

import BookAppointment from 'src/sections/super-admin/patients/history/book-appointment/book-appointment';
import { useGetPatient } from 'src/api/tables';
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
        <title> {patientName}: Book an appointment </title>
      </Helmet>

      {data && <BookAppointment patientData={data} />}
    </>
  );
}
