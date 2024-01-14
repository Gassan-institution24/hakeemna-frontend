import { Helmet } from 'react-helmet-async';

import EmployeeAppointconfigView from 'src/sections/unit-service/employees/view/appoint-config-table';
import { useGetEmployee,useGetUSEmployeeAppointmentConfigs } from 'src/api/tables';
import { useParams } from 'src/routes/hooks';
import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

export default function EmployeeAppointconfigPage() {
  const params = useParams();
  const {user} = useAuthContext()
  const { id } = params;
  const employeeData = useGetEmployee(id).data;
  const {appointmentConfigData,loading, refetch} = useGetUSEmployeeAppointmentConfigs(user.unit_service._id,id)
  const name = employeeData?.first_name;

  return (
    <>
      <Helmet>
        <title> {name || ''} Employee Appointment Config</title>
      </Helmet>

      {!loading && (
        <EmployeeAppointconfigView appointmentConfigData={appointmentConfigData} employeeData={employeeData} refetch={refetch} loading={loading}/>
      )} 
    </>
  );
}
