import { Helmet } from 'react-helmet-async';

import ApointmentInfoView from 'src/sections/employee/appointments/view/info';
import { useGetAppointment } from 'src/api/tables';
import { useParams } from 'src/routes/hooks';

// ----------------------------------------------------------------------

export default function EditPage() {
  const params = useParams();
  const { id } = params;
  const { data } = useGetAppointment(id);
  const name = data?.name_english;
  return (
    <>
      <Helmet>
        <title> {name||''} Appointment Accounting</title>
      </Helmet>

      {data &&<ApointmentInfoView appointmentData={data} />}
    </>
  );
}
