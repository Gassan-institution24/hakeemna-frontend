import { Helmet } from 'react-helmet-async';

import AppointmentInfoView from 'src/sections/unit-service/appointments/view/info';
import { useGetAppointment } from 'src/api/tables';
import { useParams } from 'src/routes/hooks';

// ----------------------------------------------------------------------

export default function AppointmentEditPage() {
  const params = useParams();
  const { id } = params;
  const { data } = useGetAppointment(id);
  const name = data?.name_english || 'Appointment';
  return (
    <>
      <Helmet>
        <title>{name} Appointment Info</title>
      </Helmet>

      {data &&<AppointmentInfoView appointmentData={data} />}
    </>
  );
}
