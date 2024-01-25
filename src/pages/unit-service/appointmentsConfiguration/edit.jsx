import { Helmet } from 'react-helmet-async';

import EditAppointmentConfigView from 'src/sections/unit-service/appointmentsConfiguration/view/edit';
import { useGetAppointmentConfig } from 'src/api/tables';
import { useParams } from 'src/routes/hooks';

// ----------------------------------------------------------------------

export default function AppointmentConfigEditPage() {
  const params = useParams();
  const { id } = params;
  const { data } = useGetAppointmentConfig(id);
  const name = data?.name_english;
  return (
    <>
      <Helmet>
        <title>Edit {name || ''} Appointment Configuration</title>
      </Helmet>

      {data && <EditAppointmentConfigView appointmentConfigData={data} />}
    </>
  );
}
