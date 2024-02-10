import { Helmet } from 'react-helmet-async';

import AppointmentConfigInfoView from 'src/sections/unit-service/appointmentsConfiguration/view/info';
import { useGetAppointmentConfig } from 'src/api';
import { useParams } from 'src/routes/hooks';
import ACLGuard from 'src/auth/guard/acl-guard';

// ----------------------------------------------------------------------

export default function AppointmentConfigInfoPage() {
  const params = useParams();
  const { id } = params;
  const { data } = useGetAppointmentConfig(id);
  const name = data?.name_english;
  return (
    <>
      <ACLGuard hasContent category="unit_service" subcategory="appointment_configs" acl="read">
        <Helmet>
          <title>{name || ''} Appointment Configuration Info</title>
        </Helmet>

        {data && <AppointmentConfigInfoView appointmentConfigData={data} />}
      </ACLGuard>
    </>
  );
}
