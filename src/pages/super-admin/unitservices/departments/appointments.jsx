import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import ACLGuard from 'src/auth/guard/acl-guard';
import { useGetDepartment, useGetUnitservice, useGetDepartmentAppointments } from 'src/api';

import { LoadingScreen } from 'src/components/loading-screen';

import DepartmentAppointmentsView from 'src/sections/super-admin/unitservices/departments/view/appointments';

// ----------------------------------------------------------------------

export default function DepartmentAppointmentsPage() {
  const params = useParams();
  const { id, depid } = params;
  const { data } = useGetDepartment(depid);
  const unitServiceData = useGetUnitservice(id).data;
  const { appointmentsData, refetch, loading } = useGetDepartmentAppointments(depid);
  const name = data?.name_english;
  return (
    <ACLGuard category="department" subcategory="appointments" acl="read">
      <Helmet>
        <title>{name || ''} Department Appointments</title>
        <meta name="description" content="meta" />
      </Helmet>
      {loading && <LoadingScreen />}
      {!loading && (
        <DepartmentAppointmentsView
          unitServiceData={unitServiceData}
          departmentData={data}
          appointmentsData={appointmentsData}
          refetch={refetch}
        />
      )}
    </ACLGuard>
  );
}
