import { Helmet } from 'react-helmet-async';

import DepartmentAppointmentConfigView from 'src/sections/unit-service/departments/view/appointmentconfiguration';
import { useGetDepartment } from 'src/api/tables';
import { useParams } from 'src/routes/hooks';
import ACLGuard from 'src/auth/guard/acl-guard';
import { LoadingScreen } from 'src/components/loading-screen';

// ----------------------------------------------------------------------

export default function DepartmentAppointmentConfigPage() {
  const params = useParams();
  const { id } = params;
  const { data, loading } = useGetDepartment(id);
  const name = data?.name_english;
  return (
    <>
      <ACLGuard hasContent category="department" subcategory="appointment_configs" acl="read">
        <Helmet>
          <title>{name || ''} Department Appointment Configuration</title>
        </Helmet>
        {loading && <LoadingScreen />}
        {!loading && <DepartmentAppointmentConfigView departmentData={data} />}
      </ACLGuard>
    </>
  );
}
