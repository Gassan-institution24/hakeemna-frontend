import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { useGetAppointment } from 'src/api';
import ACLGuard from 'src/auth/guard/acl-guard';

import { LoadingScreen } from 'src/components/loading-screen';

import AppointmentInfoView from 'src/sections/unit-service/appointments/view/info';

// ----------------------------------------------------------------------

export default function AppointmentEditPage() {
  const params = useParams();
  const { id } = params;
  const { data, loading } = useGetAppointment(id);
  const name = data?.name_english;
  return (
    <ACLGuard category="unit_service" subcategory="appointments" acl="read">
      <Helmet>
        <title>{name || ''} Appointment Info</title>
        <meta name="description" content="meta" />
      </Helmet>
      {loading && <LoadingScreen />}
      {!loading && <AppointmentInfoView appointmentData={data} />}
    </ACLGuard>
  );
}
