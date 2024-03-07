import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { useGetAppointment } from 'src/api';
import ACLGuard from 'src/auth/guard/acl-guard';

import { LoadingScreen } from 'src/components/loading-screen';

import EditAppointmentView from 'src/sections/unit-service/appointments/view/edit';

// ----------------------------------------------------------------------

export default function AppointmentEditPage() {
  const params = useParams();
  const { id } = params;
  const { data, loading } = useGetAppointment(id);
  const name = data?.name_english;
  return (
    <ACLGuard category="unit_service" subcategory="appointments" acl="update">
      <Helmet>
        <title>Edit {name || ''} Appointment</title>
        <meta name="description" content="meta" />
      </Helmet>
      {loading && <LoadingScreen />}
      {!loading && <EditAppointmentView appointmentData={data} />}
    </ACLGuard>
  );
}
