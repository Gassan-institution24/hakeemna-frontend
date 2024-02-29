import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { useGetDepartment } from 'src/api';
import ACLGuard from 'src/auth/guard/acl-guard';

import { LoadingScreen } from 'src/components/loading-screen';

import DepartmentAppointmentConfigView from 'src/sections/unit-service/departments/view/appointmentconfiguration';

// ----------------------------------------------------------------------

export default function DepartmentAppointmentConfigPage() {
  const params = useParams();
  const { id } = params;
  const { data, loading } = useGetDepartment(id);
  const name = data?.name_english;
  return (
    <ACLGuard hasContent category="department" subcategory="appointment_configs" acl="read">
      <Helmet>
        <title>{name || ''} Department Appointment Configuration</title>
        <meta name="description" content="meta" />
      </Helmet>
      {loading && <LoadingScreen />}
      {!loading && <DepartmentAppointmentConfigView departmentData={data} />}
    </ACLGuard>
  );
}
