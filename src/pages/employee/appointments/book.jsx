import { Helmet } from 'react-helmet-async';

// import { useParams } from 'src/routes/hooks';

// import { useGetAppointment } from 'src/api';
import ACLGuard from 'src/auth/guard/acl-guard';

// import { LoadingScreen } from 'src/components/loading-screen';

import AppointmentBookView from 'src/sections/employee/appointments/view/book';

// ----------------------------------------------------------------------

export default function BookAppointmentPage() {
  // const params = useParams();
  // const { id } = params;
  // const { data, loading } = useGetAppointment(id);
  // const name = data?.name_english;
  return (
    <ACLGuard category="work_group" subcategory="appointments" acl="read">
      <Helmet>
        <title> Book Appointment </title>
        <meta name="description" content="meta" />
      </Helmet>
      {/* {loading && <LoadingScreen />} */}
      <AppointmentBookView />
    </ACLGuard>
  );
}
