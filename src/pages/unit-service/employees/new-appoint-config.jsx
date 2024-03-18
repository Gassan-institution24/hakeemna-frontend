import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { useGetEmployee } from 'src/api';
import ACLGuard from 'src/auth/guard/acl-guard';

import AppointconfigDetailView from 'src/sections/unit-service/employees/view/appoint-config-detail';

// ----------------------------------------------------------------------

export default function NewEmployeeAppointconfigPage() {
  const params = useParams();
  const { id } = params;
  const employeeData = useGetEmployee(id).data;
  const name = employeeData?.name_english;

  return (
    <ACLGuard category="unit_service" subcategory="appointment_configs" acl="create">
      <Helmet>
        <title> {name} : Appointment Config</title>
        <meta name="description" content="meta" />
      </Helmet>

      <AppointconfigDetailView />
    </ACLGuard>
  );
}
