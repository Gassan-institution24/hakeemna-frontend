import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { useGetEmployee } from 'src/api';
import ACLGuard from 'src/auth/guard/acl-guard';

import AppointconfigDetailView from 'src/sections/unit-service/employees/view/appoint-config-detail';

// ----------------------------------------------------------------------

export default function NewEmployeeAppointconfigPage() {
  const params = useParams();
  const { id, coid } = params;
  const employeeData = useGetEmployee(id).data;
  const name = employeeData?.first_name;

  return (
    <ACLGuard hasContent category="unit_service" subcategory="appointment_configs" acl="create">
        <Helmet>
          <title> {name || ''} Employee Appointment Config</title>
        </Helmet>

        <AppointconfigDetailView />
      </ACLGuard>
  );
}
