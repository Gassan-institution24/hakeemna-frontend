import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import ACLGuard from 'src/auth/guard/acl-guard';
import { useGetDepartment, useGetDepartmentAppointments } from 'src/api';

import { LoadingScreen } from 'src/components/loading-screen';

import DepartmentAppointmentsView from 'src/sections/unit-service/departments/view/appointments';

// ----------------------------------------------------------------------

export default function DepartmentAppointmentsPage() {
  const params = useParams();
  const { id } = params;
  const { data } = useGetDepartment(id);
  const { appointmentsData, refetch, loading } = useGetDepartmentAppointments(id);
  const name = data?.name_english;
  return (
    <ACLGuard hasContent category="department" subcategory="appointments" acl="read">
      <Helmet>
        <title>{name || ''} Department Appointments</title>
      </Helmet>
      {loading && <LoadingScreen />}
      {!loading && (
        <DepartmentAppointmentsView
          departmentData={data}
          appointmentsData={appointmentsData}
          refetch={refetch}
        />
      )}
    </ACLGuard>
  );
}
