import { Helmet } from 'react-helmet-async';

import AppointconfigDetailView from 'src/sections/unit-service/departments/employees/view/appoint-config-detail';
import { useGetDepartment, useGetEmployee,useGetAppointmentConfig } from 'src/api/tables';
import { useParams } from 'src/routes/hooks';

// ----------------------------------------------------------------------

export default function DepartmentEmployeeAppointconfigPage() {
  const params = useParams();
  const { id, emid,coid } = params;
  const employeeData = useGetEmployee(emid).data;
  const {data,loading, refetch} = useGetAppointmentConfig(coid)
  const name = employeeData?.first_name;

  return (
    <>
      <Helmet>
        <title> {name || ''} Employee Appointment Config</title>
      </Helmet>

      {!loading && (
        <AppointconfigDetailView appointmentConfigData={data} refetch={refetch} loading={loading}/>
      )} 
    </>
  );
}
