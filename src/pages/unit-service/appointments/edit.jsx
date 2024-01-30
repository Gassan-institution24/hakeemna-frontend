import { Helmet } from 'react-helmet-async';

import EditAppointmentView from 'src/sections/unit-service/appointments/view/edit';
import { useGetAppointment } from 'src/api/tables';
import { useParams } from 'src/routes/hooks';
import ACLGuard from 'src/auth/guard/acl-guard';
import { LoadingScreen } from 'src/components/loading-screen';

// ----------------------------------------------------------------------

export default function AppointmentEditPage() {
  const params = useParams();
  const { id } = params;
  const { data,loading } = useGetAppointment(id);
  const name = data?.name_english;
  return (
    <>
    <ACLGuard hasContent category='unit_service' subcategory='appointments' acl='update'>
      <Helmet>
        <title>Edit {name||''} Appointment</title>
      </Helmet>
      {loading&& <LoadingScreen/>}
      {!loading &&<EditAppointmentView appointmentData={data} />}
      </ACLGuard>
    </>
  );
}
