import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { useGetAppointment } from 'src/api';
import ACLGuard from 'src/auth/guard/acl-guard';

import { LoadingScreen } from 'src/components/loading-screen';

import ApointmentInfoView from 'src/sections/employee/appointments/view/info';

// ----------------------------------------------------------------------

export default function EditPage() {
  const params = useParams();
  const { id } = params;
  const { data, loading } = useGetAppointment(id);
  const name = data?.name_english;
  return (
    <ACLGuard hasContent category="employee" subcategory="appointments" acl="read">
        <Helmet>
          <title> {name || ''} Appointment Accounting</title>
        </Helmet>
        {loading && <LoadingScreen />}
        {data && <ApointmentInfoView appointmentData={data} />}
      </ACLGuard>
  );
}
