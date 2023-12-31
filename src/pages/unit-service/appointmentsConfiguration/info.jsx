import { Helmet } from 'react-helmet-async';

import AppointmentConfigInfoView from 'src/sections/unit-service/appointmentsConfiguration/view/info';
import { useGetAppointmentConfig } from 'src/api/tables';
import { useParams } from 'src/routes/hooks';

// ----------------------------------------------------------------------

export default function AppointmentConfigInfoPage() {
  const params = useParams();
  const { id } = params;
  const { data } = useGetAppointmentConfig(id);
  const name = data?.name_english
  return (
    <>
      <Helmet>
        <title>{name} Appointment Configuration Info</title>
      </Helmet>

      {data && <AppointmentConfigInfoView appointmentConfigData={data} />}
    </>
  );
}
