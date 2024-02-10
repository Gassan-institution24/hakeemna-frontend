import { Helmet } from 'react-helmet-async';

import AppointmentInfoView from 'src/sections/unit-service/appointments/view/info';
import { useGetAppointment } from 'src/api';
import { useParams } from 'src/routes/hooks';
import ACLGuard from 'src/auth/guard/acl-guard';
import { LoadingScreen } from 'src/components/loading-screen';

// ----------------------------------------------------------------------

export default function AppointmentEditPage() {
  const params = useParams();
  const { id } = params;
  const { data, loading } = useGetAppointment(id);
  const name = data?.name_english;
  return (
    <>
      <ACLGuard hasContent category="unit_service" subcategory="appointments" acl="read">
        <Helmet>
          <title>{name || ''} Appointment Info</title>
        </Helmet>
        {loading && <LoadingScreen />}
        {!loading && <AppointmentInfoView appointmentData={data} />}
      </ACLGuard>
    </>
  );
}
