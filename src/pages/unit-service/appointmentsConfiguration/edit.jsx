import { Helmet } from 'react-helmet-async';

import EditAppointmentConfigView from 'src/sections/unit-service/appointmentsConfiguration/view/edit';
import { useGetAppointmentConfig } from 'src/api/tables';
import { useParams } from 'src/routes/hooks';
import ACLGuard from 'src/auth/guard/acl-guard';
import { LoadingScreen } from 'src/components/loading-screen';

// ----------------------------------------------------------------------

export default function AppointmentConfigEditPage() {
  const params = useParams();
  const { id } = params;
  const { data, loading } = useGetAppointmentConfig(id);
  const name = data?.name_english;
  return (
    <>
    <ACLGuard hasContent category='unit_service' subcategory='appointment_configs' acl='update'>
      <Helmet>
        <title>Edit {name || ''} Appointment Configuration</title>
      </Helmet>
      {loading&& <LoadingScreen/>}
      {!loading && <EditAppointmentConfigView appointmentConfigData={data} />}
      </ACLGuard>
    </>
  );
}
