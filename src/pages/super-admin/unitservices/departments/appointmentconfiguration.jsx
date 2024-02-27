import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { useGetDepartment } from 'src/api';
import ACLGuard from 'src/auth/guard/acl-guard';

import { LoadingScreen } from 'src/components/loading-screen';

import DepartmentAppointmentConfigView from 'src/sections/super-admin/unitservices/departments/view/appointmentconfiguration';

// ----------------------------------------------------------------------

export default function DepartmentAppointmentConfigPage() {
  const params = useParams();
  const { depid } = params;
  const { data, loading } = useGetDepartment(depid);
  const name = data?.name_english;
  return (
    <ACLGuard hasContent category="department" subcategory="appointment_configs" acl="read">
      <Helmet>
        <title>{name || ''} Department Appointment Configuration</title>
      </Helmet>
      {loading && <LoadingScreen />}
      {!loading && <DepartmentAppointmentConfigView departmentData={data} />}
    </ACLGuard>
  );
}
