import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { useGetDepartment } from 'src/api';
import ACLGuard from 'src/auth/guard/acl-guard';

import DepartmentAppointmentsView from 'src/sections/unit-service/departments/view/appointments';

// ----------------------------------------------------------------------

export default function DepartmentAppointmentsPage() {
  const params = useParams();
  const { id } = params;
  const { data } = useGetDepartment(id);
  const name = data?.name_english;
  return (
    <ACLGuard hasContent category="department" subcategory="appointments" acl="read">
      <Helmet>
        <title>{name || ''} Department Appointments</title>
        <meta name="description" content="meta" />
      </Helmet>
      <DepartmentAppointmentsView departmentData={data} />
    </ACLGuard>
  );
}
